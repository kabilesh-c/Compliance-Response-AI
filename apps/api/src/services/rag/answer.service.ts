import { supabase } from '../../config/supabase';
import { ragService, RagResult } from './rag.service';
import { memoryService } from './memory.service';
import { gapDetectorService } from './gap-detector.service';
import { classifierService } from './classifier.service';
import { ingestionQueue } from '../document/ingestion-queue';
import { RAG_CONSTANTS } from '../../config/constants';
import { createLogger } from '../../utils/logger';

const log = createLogger('AnswerService');

export interface CoverageSummary {
  totalQuestions: number;
  answeredQuestions: number;
  notFoundCount: number;
  averageConfidence: number;
}

/**
 * Orchestrates answer generation, storage, regeneration, and approval.
 * Uses the RAG service for the actual retrieval + generation pipeline.
 */
export class AnswerService {

  /**
   * Queue answer generation for all questions in a questionnaire.
   * Processing runs in the background via ingestionQueue.
   */
  queueQuestionnaireProcessing(
    questionnaireId: string,
    userId: string,
    organizationId: string,
  ): void {
    ingestionQueue.enqueue(
      `answer-gen-${questionnaireId}`,
      () => this.processQuestionnaire(questionnaireId, userId, organizationId),
    );
  }

  /**
   * Process all questions in a questionnaire through the RAG pipeline.
   * Questions are processed in batches of BATCH_CONCURRENCY.
   */
  async processQuestionnaire(
    questionnaireId: string,
    userId: string,
    organizationId: string,
  ): Promise<void> {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, question_text')
      .eq('questionnaire_id', questionnaireId)
      .order('question_index', { ascending: true });

    if (error) throw new Error(`Failed to fetch questions: ${error.message}`);
    if (!questions || questions.length === 0) throw new Error('No questions found');

    log.info('Starting batch answer generation', {
      questionnaireId,
      totalQuestions: questions.length,
    });

    await supabase
      .from('questionnaires')
      .update({ status: 'processing' })
      .eq('id', questionnaireId);

    const batchSize = RAG_CONSTANTS.BATCH_CONCURRENCY;
    let answeredCount = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map(q =>
          this.answerAndStore(q.id, q.question_text, userId, organizationId)
        ),
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          answeredCount++;
        } else {
          log.error('Question answer failed in batch', { error: result.reason?.message });
        }
      }

      // Update progress
      await supabase
        .from('questionnaires')
        .update({ answered_questions: answeredCount })
        .eq('id', questionnaireId);

      // Delay between batches to avoid rate limits
      if (i + batchSize < questions.length) {
        await this.sleep(RAG_CONSTANTS.INTER_QUESTION_DELAY_MS);
      }
    }

    await supabase
      .from('questionnaires')
      .update({ status: 'completed', answered_questions: answeredCount })
      .eq('id', questionnaireId);

    // Auto-classify questionnaire type
    classifierService.classify(questionnaireId).catch(err => {
      log.warn('Questionnaire classification failed', { error: err.message });
    });

    log.info('Batch answer generation complete', {
      questionnaireId,
      answeredCount,
      totalQuestions: questions.length,
    });
  }

  /**
   * Run RAG pipeline for a single question and persist the result.
   */
  private async answerAndStore(
    questionId: string,
    questionText: string,
    userId: string,
    organizationId: string,
  ): Promise<RagResult> {
    // Check response memory first
    const memoryMatch = await memoryService.findSimilarAnswer(
      questionText, organizationId,
    ).catch(() => null);

    if (memoryMatch) {
      log.info('Memory hit — reusing approved answer', {
        questionId,
        similarity: memoryMatch.similarity,
      });
      const memoryResult: RagResult = {
        answerText: memoryMatch.answerText,
        citations: memoryMatch.citations,
        evidenceSnippets: [],
        confidence: memoryMatch.similarity,
        chunkIds: [],
        retrievalCount: 0,
        generationTimeMs: 0,
      };
      await this.storeAnswer(questionId, memoryResult, 'memory');
      return memoryResult;
    }

    // No memory match — run full RAG
    const result = await ragService.answerQuestion({
      questionId,
      questionText,
      userId,
      organizationId,
    });

    // If not found, run gap detection
    const isNotFound = result.answerText.toLowerCase().includes('not found in references');
    if (isNotFound) {
      const chunks = await ragService.retrieveChunks(questionText, userId, organizationId);
      const gap = await gapDetectorService.analyseGap(questionText, chunks).catch(() => ({
        missingDocumentName: 'Unknown Document',
        reason: 'Gap analysis unavailable.',
      }));
      await this.storeAnswer(questionId, result, 'rag', gap);
    } else {
      await this.storeAnswer(questionId, result);
    }

    return result;
  }

  /**
   * Persist a RagResult into the questions table.
   */
  private async storeAnswer(
    questionId: string,
    result: RagResult,
    source: 'rag' | 'memory' = 'rag',
    gapAnalysis?: { missingDocumentName: string; reason: string },
  ): Promise<void> {
    const isNotFound = result.answerText.toLowerCase().includes('not found in references');

    // Compute confidence_level for citation strength visualization
    const confidenceLevel = result.confidence > 0.75 ? 'High'
      : result.confidence >= 0.4 ? 'Medium'
      : 'Low';

    const metadata: Record<string, any> = {
      retrieval_count: result.retrievalCount,
      generation_time_ms: result.generationTimeMs,
      generated_at: new Date().toISOString(),
      source,
      confidence_level: confidenceLevel,
    };

    if (gapAnalysis) {
      metadata.gap_analysis = gapAnalysis;
    }

    const { error } = await supabase
      .from('questions')
      .update({
        answer_text: result.answerText,
        answer_status: isNotFound ? 'unanswered' : 'draft',
        source_chunks: result.chunkIds,
        confidence: result.confidence,
        citations: result.citations,
        evidence_snippets: result.evidenceSnippets,
        answer_metadata: metadata,
      })
      .eq('id', questionId);

    if (error) {
      log.error('Failed to store answer', { questionId, error: error.message });
      throw new Error(`Failed to store answer: ${error.message}`);
    }

    log.info('Answer stored', {
      questionId,
      confidence: result.confidence.toFixed(3),
      generationTimeMs: result.generationTimeMs,
    });
  }

  /**
   * Regenerate answer for a single question.
   */
  async regenerateAnswer(
    questionId: string,
    userId: string,
    organizationId: string,
  ): Promise<RagResult> {
    const { data: question, error } = await supabase
      .from('questions')
      .select('id, question_text, questionnaire_id')
      .eq('id', questionId)
      .single();

    if (error || !question) throw new Error('Question not found');

    log.info('Regenerating answer', { questionId });

    const result = await ragService.answerQuestion({
      questionId,
      questionText: question.question_text,
      userId,
      organizationId,
    });

    await this.storeAnswer(questionId, result);
    await this.refreshAnsweredCount(question.questionnaire_id);

    return result;
  }

  /**
   * Stream-generate an answer for a single question and persist.
   */
  async streamAndStoreAnswer(
    questionId: string,
    userId: string,
    organizationId: string,
    onChunk: (text: string) => void,
  ): Promise<RagResult> {
    const { data: question, error } = await supabase
      .from('questions')
      .select('id, question_text, questionnaire_id')
      .eq('id', questionId)
      .single();

    if (error || !question) throw new Error('Question not found');

    const result = await ragService.answerQuestionStream({
      questionId,
      questionText: question.question_text,
      userId,
      organizationId,
      onChunk,
    });

    await this.storeAnswer(questionId, result);
    await this.refreshAnsweredCount(question.questionnaire_id);

    return result;
  }

  /**
   * Approve a question's answer (draft → approved).
   */
  async approveAnswer(questionId: string, organizationId: string): Promise<void> {
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('answer_status, answer_text, question_text, citations')
      .eq('id', questionId)
      .single();

    if (fetchError || !question) throw new Error('Question not found');
    if (!question.answer_text) throw new Error('No answer to approve');
    if (question.answer_status === 'approved') throw new Error('Answer already approved');

    const { error } = await supabase
      .from('questions')
      .update({ answer_status: 'approved' })
      .eq('id', questionId);

    if (error) throw new Error(`Failed to approve answer: ${error.message}`);

    // Store in response memory for future reuse
    memoryService.storeApprovedAnswer({
      organizationId,
      questionText: question.question_text,
      answerText: question.answer_text,
      citations: question.citations || [],
    }).catch(err => {
      log.warn('Failed to store in response memory', { questionId, error: err.message });
    });

    log.info('Answer approved', { questionId });
  }

  /**
   * Get coverage summary for a questionnaire.
   */
  async getCoverage(questionnaireId: string): Promise<CoverageSummary> {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('answer_status, confidence, answer_text')
      .eq('questionnaire_id', questionnaireId);

    if (error) throw new Error(`Failed to fetch questions: ${error.message}`);

    if (!questions || questions.length === 0) {
      return { totalQuestions: 0, answeredQuestions: 0, notFoundCount: 0, averageConfidence: 0 };
    }

    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter(q => q.answer_status !== 'unanswered').length;
    const notFoundCount = questions.filter(q =>
      q.answer_text?.toLowerCase().includes('not found in references')
    ).length;

    const withConfidence = questions.filter(q => q.confidence != null && q.confidence > 0);
    const averageConfidence = withConfidence.length > 0
      ? withConfidence.reduce((sum: number, q: any) => sum + (q.confidence || 0), 0) / withConfidence.length
      : 0;

    return {
      totalQuestions,
      answeredQuestions,
      notFoundCount,
      averageConfidence: Math.round(averageConfidence * 1000) / 1000,
    };
  }

  /**
   * Refresh the answered_questions count on a questionnaire.
   */
  private async refreshAnsweredCount(questionnaireId: string): Promise<void> {
    const { data: questions } = await supabase
      .from('questions')
      .select('answer_status')
      .eq('questionnaire_id', questionnaireId);

    const answeredCount = (questions || []).filter(
      (q: any) => q.answer_status !== 'unanswered'
    ).length;

    await supabase
      .from('questionnaires')
      .update({ answered_questions: answeredCount })
      .eq('id', questionnaireId);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const answerService = new AnswerService();
