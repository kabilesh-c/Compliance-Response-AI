import { genAI } from '../../config/gemini';
import { RAG_CONSTANTS } from '../../config/constants';
import { SearchResult } from '../document/search.service';
import { createLogger } from '../../utils/logger';

const log = createLogger('GapDetectorService');

export interface GapAnalysis {
  missingDocumentName: string;
  reason: string;
}

/**
 * Compliance Gap Detector — when a question cannot be answered,
 * analyses what documentation would be required.
 */
export class GapDetectorService {

  private getModel() {
    return genAI.getGenerativeModel({
      model: RAG_CONSTANTS.GENERATION_MODEL,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      },
    });
  }

  /**
   * Analyse a not-found question to determine what documentation is missing.
   */
  async analyseGap(
    questionText: string,
    retrievedChunks: SearchResult[],
  ): Promise<GapAnalysis> {
    const chunkContext = retrievedChunks.length > 0
      ? retrievedChunks.slice(0, 3).map((c, i) =>
          `[Partial Source ${i + 1}: ${c.documentName}]\n${c.chunkText.substring(0, 300)}`
        ).join('\n---\n')
      : 'No relevant document excerpts were found.';

    const prompt = [
      'You are a compliance documentation analyst.',
      '',
      'A compliance questionnaire question could NOT be answered from the available reference documents.',
      '',
      `QUESTION: ${questionText}`,
      '',
      `AVAILABLE PARTIAL CONTEXT:\n${chunkContext}`,
      '',
      'Based on the question topic, determine:',
      '1. What specific document or policy would be needed to answer this question?',
      '2. Why is the current documentation insufficient?',
      '',
      'Respond in EXACTLY this JSON format (no markdown, no code fences):',
      '{"missing_document_name": "Document Name Here", "reason": "Brief explanation here"}',
    ].join('\n');

    try {
      const model = this.getModel();
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Parse JSON response - strip code fences if present
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        missingDocumentName: parsed.missing_document_name || 'Unknown Document',
        reason: parsed.reason || 'Unable to determine reason.',
      };
    } catch (err: any) {
      log.error('Gap analysis failed', { error: err.message });
      return {
        missingDocumentName: 'Unknown Document',
        reason: 'Gap analysis could not be completed.',
      };
    }
  }
}

export const gapDetectorService = new GapDetectorService();
