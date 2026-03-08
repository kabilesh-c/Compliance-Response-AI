import { genAI } from '../../config/gemini';
import { RAG_CONSTANTS } from '../../config/constants';
import { supabase } from '../../config/supabase';
import { createLogger } from '../../utils/logger';

const log = createLogger('ClassifierService');

export type QuestionnaireType =
  | 'Vendor Security Assessment'
  | 'Compliance Audit'
  | 'Operational Review'
  | 'Privacy Assessment'
  | 'Unknown';

/**
 * Questionnaire Type Detection — classifies uploaded questionnaires
 * based on their question content using Gemini.
 */
export class ClassifierService {

  private getModel() {
    return genAI.getGenerativeModel({
      model: RAG_CONSTANTS.GENERATION_MODEL,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 256,
      },
    });
  }

  /**
   * Classify a questionnaire based on its questions.
   */
  async classify(questionnaireId: string): Promise<QuestionnaireType> {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('question_text')
      .eq('questionnaire_id', questionnaireId)
      .order('question_index', { ascending: true })
      .limit(20);

    if (error || !questions || questions.length === 0) {
      log.warn('No questions found for classification', { questionnaireId });
      return 'Unknown';
    }

    const sampleQuestions = questions
      .map((q, i) => `${i + 1}. ${q.question_text}`)
      .join('\n');

    const prompt = [
      'You are an expert at classifying compliance questionnaires.',
      '',
      'Based on the sample questions below, classify this questionnaire into EXACTLY ONE of these categories:',
      '- Vendor Security Assessment',
      '- Compliance Audit',
      '- Operational Review',
      '- Privacy Assessment',
      '',
      `SAMPLE QUESTIONS:\n${sampleQuestions}`,
      '',
      'Respond with ONLY the category name, nothing else.',
    ].join('\n');

    try {
      const model = this.getModel();
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const validTypes: QuestionnaireType[] = [
        'Vendor Security Assessment',
        'Compliance Audit',
        'Operational Review',
        'Privacy Assessment',
      ];

      const matched = validTypes.find(t =>
        text.toLowerCase().includes(t.toLowerCase())
      );

      const detectedType = matched || 'Unknown';

      // Store in questionnaire metadata
      await supabase
        .from('questionnaires')
        .update({
          metadata: { type: detectedType, classified_at: new Date().toISOString() },
        })
        .eq('id', questionnaireId);

      log.info('Questionnaire classified', { questionnaireId, type: detectedType });

      return detectedType;
    } catch (err: any) {
      log.error('Classification failed', { error: err.message });
      return 'Unknown';
    }
  }
}

export const classifierService = new ClassifierService();
