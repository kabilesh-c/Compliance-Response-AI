import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { answerService } from '../services/rag';
import { supabase } from '../config/supabase';
import { exportService, ExportFormat } from '../services/document/export.service';
import { createLogger } from '../utils/logger';

const log = createLogger('AnswerController');

/**
 * Handles all questionnaire answer engine API endpoints.
 */
export class AnswerController {

  /**
   * POST /api/questionnaires/:id/generate
   * Triggers answer generation for all questions in a questionnaire.
   * Processing runs asynchronously in the background.
   */
  generateAnswers = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;

      // Verify questionnaire exists and belongs to user
      const { data: questionnaire, error } = await supabase
        .from('questionnaires')
        .select('id, status, total_questions')
        .eq('id', id)
        .eq('user_id', user.userId)
        .single();

      if (error || !questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
      }

      if (questionnaire.status === 'processing') {
        return res.status(409).json({ error: 'Answer generation already in progress' });
      }

      // Queue background processing
      answerService.queueQuestionnaireProcessing(id, user.userId, user.organizationId);

      return res.status(202).json({
        message: 'Answer generation started',
        questionnaireId: id,
        totalQuestions: questionnaire.total_questions,
        status: 'processing',
      });

    } catch (err: any) {
      log.error('Generate answers failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to start answer generation' });
    }
  };

  /**
   * POST /api/questions/:id/regenerate
   * Regenerates the answer for a single question.
   */
  regenerateAnswer = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;

      const result = await answerService.regenerateAnswer(
        id, user.userId, user.organizationId,
      );

      return res.json({
        questionId: id,
        answerText: result.answerText,
        citations: result.citations,
        evidenceSnippets: result.evidenceSnippets,
        confidence: result.confidence,
        retrievalCount: result.retrievalCount,
        generationTimeMs: result.generationTimeMs,
        status: 'draft',
      });

    } catch (err: any) {
      log.error('Regenerate answer failed', { error: err.message });
      const status = err.message?.includes('not found') ? 404 : 500;
      return res.status(status).json({ error: err.message });
    }
  };

  /**
   * PATCH /api/questions/:id/approve
   * Approves a question's answer (draft → approved).
   */
  approveAnswer = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;

      await answerService.approveAnswer(id, user.organizationId);

      return res.json({ questionId: id, status: 'approved' });

    } catch (err: any) {
      log.error('Approve answer failed', { error: err.message });
      const status = err.message?.includes('not found') ? 404
        : err.message?.includes('already') ? 409
        : err.message?.includes('No answer') ? 400
        : 500;
      return res.status(status).json({ error: err.message });
    }
  };

  /**
   * GET /api/questionnaires/:id/coverage
   * Returns coverage statistics for a questionnaire.
   */
  getCoverage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const coverage = await answerService.getCoverage(id);

      return res.json(coverage);

    } catch (err: any) {
      log.error('Get coverage failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to fetch coverage' });
    }
  };

  /**
   * GET /api/questions/:id/answer-stream
   * Server-Sent Events streaming endpoint for real-time answer generation.
   */
  streamAnswer = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;

      // Set SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      const result = await answerService.streamAndStoreAnswer(
        id,
        user.userId,
        user.organizationId,
        (text: string) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
        },
      );

      // Send the final complete result
      res.write(`data: ${JSON.stringify({
        type: 'complete',
        answerText: result.answerText,
        citations: result.citations,
        evidenceSnippets: result.evidenceSnippets,
        confidence: result.confidence,
      })}\n\n`);

      res.end();

    } catch (err: any) {
      log.error('Stream answer failed', { error: err.message });
      if (!res.headersSent) {
        return res.status(err.message?.includes('not found') ? 404 : 500)
          .json({ error: err.message });
      }
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
  };

  /**
   * GET /api/questionnaires/:id/questions
   * Returns all questions for a questionnaire with their answer status.
   */
  getQuestions = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;

      // Verify questionnaire ownership
      const { data: questionnaire, error: qErr } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.userId)
        .single();

      if (qErr || !questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
      }

      const { data: questions, error } = await supabase
        .from('questions')
        .select('id, question_text, question_index, section, answer_text, answer_status, confidence, citations, evidence_snippets, source_chunks, answer_metadata, created_at, updated_at')
        .eq('questionnaire_id', id)
        .order('question_index', { ascending: true });

      if (error) throw new Error(error.message);

      return res.json({ questionnaireId: id, questions: questions || [] });

    } catch (err: any) {
      log.error('Get questions failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }
  };

  /**
   * GET /api/questionnaires/:id/export?format=xlsx|pdf|docx|md
   * Exports questionnaire results in the specified format.
   */
  exportQuestionnaire = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;
      const format = (req.query.format as string || 'xlsx').toLowerCase() as ExportFormat;

      const validFormats: ExportFormat[] = ['xlsx', 'pdf', 'docx', 'md'];
      if (!validFormats.includes(format)) {
        return res.status(400).json({ error: `Invalid format. Supported: ${validFormats.join(', ')}` });
      }

      // Verify questionnaire ownership
      const { data: questionnaire, error: qErr } = await supabase
        .from('questionnaires')
        .select('id, document_id')
        .eq('id', id)
        .eq('user_id', user.userId)
        .single();

      if (qErr || !questionnaire) {
        return res.status(404).json({ error: 'Questionnaire not found' });
      }

      // Get document name for export filename
      const { data: doc } = await supabase
        .from('documents')
        .select('document_name')
        .eq('id', questionnaire.document_id)
        .single();

      const baseName = doc?.document_name?.replace(/\.[^.]+$/, '') || 'questionnaire-results';

      // Fetch questions with answers
      const { data: questions, error } = await supabase
        .from('questions')
        .select('question_text, question_index, section, answer_text, answer_status, confidence')
        .eq('questionnaire_id', id)
        .order('question_index', { ascending: true });

      if (error) throw new Error(error.message);

      const result = await exportService.exportQuestionnaire(questions || [], format, baseName);

      const fileName = `${baseName}.${result.extension}`;
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', result.buffer.length);
      return res.send(result.buffer);

    } catch (err: any) {
      log.error('Export questionnaire failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to export questionnaire' });
    }
  };
}

export const answerController = new AnswerController();
