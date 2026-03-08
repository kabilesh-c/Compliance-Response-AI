import { supabase } from '../../config/supabase';
import { embeddingService } from '../document/embedding.service';
import { createLogger } from '../../utils/logger';

const log = createLogger('MemoryService');

const MEMORY_SIMILARITY_THRESHOLD = 0.9;

export interface MemoryMatch {
  id: string;
  questionText: string;
  answerText: string;
  citations: any[];
  similarity: number;
}

/**
 * Response Memory Engine — stores approved answers and retrieves
 * them for semantically similar future questions.
 */
export class MemoryService {

  /**
   * Normalize question text for consistent matching.
   */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Store an approved answer in the response memory.
   */
  async storeApprovedAnswer(params: {
    organizationId: string;
    questionText: string;
    answerText: string;
    citations: any[];
  }): Promise<void> {
    const { organizationId, questionText, answerText, citations } = params;

    const normalized = this.normalize(questionText);
    const embedding = await embeddingService.embedText(questionText);

    const { error } = await supabase
      .from('approved_answers')
      .insert({
        organization_id: organizationId,
        question_text: questionText,
        normalized_question: normalized,
        question_embedding: JSON.stringify(embedding),
        answer_text: answerText,
        citations,
      });

    if (error) {
      log.error('Failed to store approved answer', { error: error.message });
      throw new Error(`Failed to store approved answer: ${error.message}`);
    }

    log.info('Approved answer stored in memory', {
      organizationId,
      normalizedLength: normalized.length,
    });
  }

  /**
   * Search response memory for a similar previously-approved answer.
   * Returns the best match if similarity >= threshold, else null.
   */
  async findSimilarAnswer(
    questionText: string,
    organizationId: string,
    threshold: number = MEMORY_SIMILARITY_THRESHOLD,
  ): Promise<MemoryMatch | null> {
    const embedding = await embeddingService.embedText(questionText);

    const { data, error } = await supabase.rpc('match_approved_answers', {
      query_embedding: JSON.stringify(embedding),
      match_count: 1,
      filter_org_id: organizationId,
      similarity_threshold: threshold,
    });

    if (error) {
      log.error('Memory search failed', { error: error.message });
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const match = data[0];
    log.info('Memory match found', {
      similarity: match.similarity,
      questionPreview: questionText.substring(0, 80),
    });

    return {
      id: match.id,
      questionText: match.question_text,
      answerText: match.answer_text,
      citations: match.citations || [],
      similarity: match.similarity,
    };
  }
}

export const memoryService = new MemoryService();
