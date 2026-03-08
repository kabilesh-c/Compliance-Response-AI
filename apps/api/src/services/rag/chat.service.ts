import { supabase } from '../../config/supabase';
import { ragService, RagResult } from './rag.service';
import { createLogger } from '../../utils/logger';

/** Patterns that indicate the user wants all questionnaire questions answered */
const QUESTIONNAIRE_INTENT_PATTERNS = [
  /answer\s+(all|every|each|the)\s+(questions?|this|these)/i,
  /answer\s+.*questionnaire/i,
  /uploaded\s+questionnaire/i,
  /answer\s+all/i,
  /fill\s+(this|the|out|in)/i,
  /respond\s+to\s+(this|the)\s+(questionnaire|document|questions?)/i,
  /complete\s+(this|the)\s+(questionnaire|document|survey|form)/i,
  /go\s+through\s+(all|the|each|every)/i,
  /analyze\s+(this|the)\s+(questionnaire|document)/i,
  /process\s+(this|the)\s+(questionnaire|document)/i,
  /answer\s+(it|them)/i,
  /provide\s+answers?\s+(for|to)/i,
  /generate\s+answers?/i,
];

const log = createLogger('ChatService');

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  citations?: any[];
  confidence?: number;
  timestamp: string;
  /** Full structured data for questionnaire answers — used to reconstruct cards on reload */
  structuredData?: any;
}

interface ChatSession {
  id: string;
  userId: string;
  organizationId: string;
  title: string;
  messages: ChatMessage[];
}

// In-memory session cache for fast access
const sessionCache = new Map<string, ChatSession>();

export interface StructuredAnswer {
  questionNumber: number;
  questionText: string;
  answerText: string;
  citations: { document: string; page: number | null }[];
  evidenceSnippet: string;
  confidence: number;
  status: 'answered' | 'not_found';
}

export interface StructuredResponse {
  summary: string;
  totalQuestions: number;
  answeredQuestions: number;
  answers: StructuredAnswer[];
}

/**
 * Robust JSON parser that attempts to fix common LLM JSON errors.
 */
function robustJsonParse(jsonString: string): any {
  let cleaned = jsonString.trim();
  // Remove markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  // Extract JSON object if wrapped in other text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try fixing trailing commas
    cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      // Last resort: simple regex extraction for essential fields if full parse fails
      // (This is a simplified fallback)
      throw new Error('Failed to parse JSON response');
    }
  }
}

/**
 * Conversational Chat Service — manages chat sessions and
 * generates context-aware responses using the RAG pipeline.
 */
export class ChatService {

  /**
   * Create a new chat session.
   */
  async createSession(userId: string, organizationId: string): Promise<string> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        title: 'New Chat',
        messages: [],
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create chat session: ${error.message}`);

    const sessionId = data.id;
    sessionCache.set(sessionId, {
      id: sessionId,
      userId,
      organizationId,
      title: 'New Chat',
      messages: [],
    });

    return sessionId;
  }

  /**
   * Get a chat session with messages.
   */
  async getSession(sessionId: string, userId: string): Promise<ChatSession | null> {
    // Check cache first
    const cached = sessionCache.get(sessionId);
    if (cached && cached.userId === userId) return cached;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    const session: ChatSession = {
      id: data.id,
      userId: data.user_id,
      organizationId: data.organization_id,
      title: data.title,
      messages: data.messages || [],
    };

    sessionCache.set(sessionId, session);
    return session;
  }

  /**
   * List all sessions for a user.
   */
  async listSessions(userId: string): Promise<{ id: string; title: string; createdAt: string }[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(`Failed to list sessions: ${error.message}`);

    return (data || []).map(s => ({
      id: s.id,
      title: s.title,
      createdAt: s.created_at,
    }));
  }

  /**
   * Detect if the user message is asking to answer all questions from an uploaded questionnaire.
   */
  private isQuestionnaireIntent(message: string): boolean {
    return QUESTIONNAIRE_INTENT_PATTERNS.some(p => p.test(message));
  }

  /**
   * Build conversation context string from recent session messages for Gemini.
   */
  private buildConversationContext(messages: ChatMessage[], maxMessages: number = 6): string {
    const recent = messages.slice(-maxMessages);
    if (recent.length === 0) return '';
    return recent.map(m => {
      const role = m.role === 'user' ? 'User' : 'Assistant';
      // Truncate very long messages in context
      const content = m.content.length > 500 ? m.content.substring(0, 500) + '...' : m.content;
      return `${role}: ${content}`;
    }).join('\n\n');
  }

  /**
   * Fetch the most recent questionnaire's questions for the user.
   * Returns both the questions and the questionnaireId.
   * When questionnaireDocumentId is provided it is used directly (most reliable path).
   * Falls back to extracting questions from document chunks if the
   * questionnaires/questions tables don't have the data yet.
   */
  private async fetchQuestionnaireQuestions(
    userId: string,
    questionnaireDocumentId?: string,
  ): Promise<{ questions: string[]; questionnaireId: string } | null> {
    let docId: string | null = null;

    if (questionnaireDocumentId) {
      // Direct path — caller already knows which document to use
      docId = questionnaireDocumentId;
      log.info('Using supplied questionnaireDocumentId', { docId });
    } else {
      // Fallback: find the latest processed questionnaire document for this user
      const { data: docs } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', userId)
        .eq('document_type', 'questionnaire')
        .eq('upload_status', 'processed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!docs || docs.length === 0) return null;
      docId = docs[0].id;
    }

    // Preferred: read from the questionnaires/questions tables
    // Use maybeSingle() to safely handle 0 or multiple records without throwing
    const { data: questionnaire } = await supabase
      .from('questionnaires')
      .select('id')
      .eq('document_id', docId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (questionnaire) {
      const { data: questions } = await supabase
        .from('questions')
        .select('question_text, question_index')
        .eq('questionnaire_id', questionnaire.id)
        .order('question_index', { ascending: true });

      if (questions && questions.length > 0) {
        // Merge split questions: join consecutive short fragments
        const merged: string[] = [];
        for (const q of questions) {
          const text = q.question_text.trim();
          if (merged.length > 0 && !/^[A-Z0-9]/.test(text)) {
            merged[merged.length - 1] += ' ' + text;
          } else {
            merged.push(text);
          }
        }
        return { questions: merged, questionnaireId: questionnaire.id };
      }
    }

    // Fallback: extract questions directly from the stored document chunks
    log.info('Questionnaire not in questionnaires table — extracting from document chunks', { docId });
    const { data: chunks } = await supabase
      .from('document_chunks')
      .select('chunk_text, chunk_index')
      .eq('document_id', docId)
      .order('chunk_index', { ascending: true });

    if (!chunks || chunks.length === 0) return null;

    const fullText = chunks.map(c => c.chunk_text).join('\n');
    const extractedQuestions = this.extractQuestionsFromText(fullText);

    if (extractedQuestions.length === 0) {
      log.warn('Could not extract any questions from document chunks', { docId });
      return null;
    }

    log.info('Extracted questions from chunks', { docId, count: extractedQuestions.length });
    // Use the document ID as the questionnaireId (no questionnaire record exists)
    return { questions: extractedQuestions, questionnaireId: docId! };
  }

  /**
   * Extract numbered and question-mark questions from raw text.
   */
  private extractQuestionsFromText(text: string): string[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const questions: string[] = [];

    for (const line of lines) {
      // Numbered questions: "1.", "1)", "Q1.", "Q1)", etc.
      const numberedMatch = line.match(/^(?:Q\.?\s*)?(\d+)[.):\-]\s+(.+)/i);
      if (numberedMatch) {
        const q = numberedMatch[2].trim();
        if (q.length > 5) {
          questions.push(q);
          continue;
        }
      }

      // Lines ending with '?'
      if (line.endsWith('?') && line.length > 10) {
        const cleaned = line.replace(/^[-•*\d.)Q:\s]+/, '').trim();
        if (cleaned.length > 5 && !questions.includes(cleaned)) {
          questions.push(cleaned);
        }
      }
    }

    return questions;
  }

  /**
   * Send a message and get an AI response using the RAG pipeline.
   */
  async sendMessage(params: {
    sessionId: string;
    userId: string;
    organizationId: string;
    message: string;
    questionnaireDocumentId?: string;
  }): Promise<{ answer: string; citations: any[]; confidence: number; evidenceSnippets?: any[]; questionnaireId?: string; structuredAnswers?: StructuredResponse }> {
    const { sessionId, userId, organizationId, message, questionnaireDocumentId } = params;

    // Build conversation context from recent messages
    let session = await this.getSession(sessionId, userId);
    if (!session) throw new Error('Session not found');

    // Build conversation context for Gemini (prior messages only, not the current one)
    const conversationContext = this.buildConversationContext(session.messages);

    // Add user message
    const userMsg: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(userMsg);

    // Check if user wants to answer all questionnaire questions
    let questionText = message;
    let questionnaireId: string | undefined;
    let isStructured = false;
    if (this.isQuestionnaireIntent(message)) {
      const result = await this.fetchQuestionnaireQuestions(userId, questionnaireDocumentId);
      if (result && result.questions.length > 0) {
        questionText = result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
        questionnaireId = result.questionnaireId;
        isStructured = true;
        log.info('Expanded questionnaire intent', { originalMessage: message, questionCount: result.questions.length, questionnaireId });
      }
    }

    // Run RAG pipeline
    const ragResult = await ragService.answerQuestion({
      questionId: sessionId,
      questionText,
      userId,
      organizationId,
      conversationContext: conversationContext || undefined,
      isStructured,
    });

    // Try to parse structured response if we requested it
    let structuredAnswers: StructuredResponse | undefined;
    if (isStructured) {
      try {
        const parsed = robustJsonParse(ragResult.answerText);
        
        if (parsed && typeof parsed === 'object') {
          // Validate structure and map fields
          structuredAnswers = {
            summary: parsed.summary || 'Summary not provided.',
            totalQuestions: typeof parsed.totalQuestions === 'number' ? parsed.totalQuestions : (parsed.answers?.length || 0),
            answeredQuestions: typeof parsed.answeredQuestions === 'number' ? parsed.answeredQuestions : 0,
            answers: (parsed.answers || []).map((a: any) => ({
              questionNumber: typeof a.questionNumber === 'number' ? a.questionNumber : 0,
              questionText: a.questionText || '',
              answerText: a.answerText || 'No answer generated.',
              citations: (a.citations || a.sources || []).map((s: any) => ({ 
                document: s.document || '', 
                page: typeof s.page === 'number' ? s.page : null 
              })),
              evidenceSnippet: a.evidenceSnippet || a.referenceExcerpt || '',
              confidence: typeof a.confidence === 'number' ? Math.min(Math.max(a.confidence, 0), 1) : 0,
              status: ['answered', 'not_found'].includes(a.status) ? a.status : 'answered',
            })),
          };
          
          // Re-calculate answered count for accuracy
          structuredAnswers.answeredQuestions = structuredAnswers.answers.filter(a => a.status === 'answered').length;

          // Relevance check: force not_found if answer doesn't reference chunks (implementation detail: check citations/snippets if available)
          // However, for now we trust the LLM's own status determination unless it's obviously empty.
          
          log.info('Parsed structured questionnaire response', { questionCount: structuredAnswers.answers.length, answeredCount: structuredAnswers.answeredQuestions });
        }
      } catch (parseErr: any) {
        log.warn('Failed to parse structured response, falling back to raw text', { error: parseErr.message, rawText: ragResult.answerText.substring(0, 100) });
        // Generate a fallback structured response for graceful degradation?
        // For now, allow fallback to raw text which the UI handles, but ideally retry.
        // Given constraints, we'll mark structuredAnswers as undefined so UI shows raw text (as per existing logic), 
        // OR we could wrap the raw text in a single "General Answer" card.
      }
    }

    // Add AI response
    const aiMsg: ChatMessage = {
      role: 'ai',
      content: structuredAnswers ? structuredAnswers.summary : ragResult.answerText,
      citations: ragResult.citations,
      confidence: ragResult.confidence,
      timestamp: new Date().toISOString(),
      structuredData: structuredAnswers || undefined,
    };
    session.messages.push(aiMsg);

    // Update title from first message
    if (session.messages.filter(m => m.role === 'user').length === 1) {
      session.title = message.substring(0, 60) + (message.length > 60 ? '...' : '');
    }

    // Persist to DB
    await supabase
      .from('chat_sessions')
      .update({
        title: session.title,
        messages: session.messages,
      })
      .eq('id', sessionId);

    // Update cache
    sessionCache.set(sessionId, session);

    return {
      answer: ragResult.answerText,
      citations: ragResult.citations,
      confidence: ragResult.confidence,
      evidenceSnippets: ragResult.evidenceSnippets,
      questionnaireId,
      structuredAnswers,
    };
  }

  /**
   * Regenerate the answer for a single question using the RAG pipeline.
   */
  async regenerateSingleQuestion(params: {
    sessionId?: string;
    userId: string;
    organizationId: string;
    questionText: string;
  }): Promise<StructuredAnswer> {
    const { userId, organizationId, questionText, sessionId } = params;

    // Build conversation context if session exists
    let conversationContext: string | undefined;
    if (sessionId) {
      const session = await this.getSession(sessionId, userId);
      if (session) {
        conversationContext = this.buildConversationContext(session.messages) || undefined;
      }
    }

    const ragResult = await ragService.answerQuestion({
      questionId: sessionId || 'regenerate',
      questionText: `1. ${questionText}`,
      userId,
      organizationId,
      conversationContext,
      isStructured: true,
    });

    // Try to parse a structured single-answer response
    try {
      const parsed = robustJsonParse(ragResult.answerText);
      if (parsed && parsed.answers && Array.isArray(parsed.answers) && parsed.answers.length > 0) {
        const a = parsed.answers[0];
        return {
          questionNumber: typeof a.questionNumber === 'number' ? a.questionNumber : 1,
          questionText: a.questionText || questionText,
          answerText: a.answerText || 'No answer generated.',
          citations: (a.citations || a.sources || []).map((s: any) => ({ 
            document: s.document || '', 
            page: typeof s.page === 'number' ? s.page : null 
          })),
          evidenceSnippet: a.evidenceSnippet || a.referenceExcerpt || '',
          confidence: typeof a.confidence === 'number' ? Math.min(Math.max(a.confidence, 0), 1) : 0,
          status: ['answered', 'not_found'].includes(a.status) ? a.status : 'answered',
        };
      }
    } catch (e: any) {
      log.warn('Failed to parse regenerated answer JSON', { error: e.message });
    }

    // Fallback: return raw text as answer
    return {
      questionNumber: 1,
      questionText,
      answerText: ragResult.answerText,
      citations: (ragResult.citations || []).map((c: any) => ({ document: c.document || '', page: c.page ?? null })),
      evidenceSnippet: '',
      confidence: ragResult.confidence || 0,
      status: 'answered',
    };
  }

  /**
   * Send a message with streaming RAG response.
   */
  async sendMessageStream(params: {
    sessionId: string;
    userId: string;
    organizationId: string;
    message: string;
    onChunk: (text: string) => void;
  }): Promise<{ answer: string; citations: any[]; confidence: number }> {
    const { sessionId, userId, organizationId, message, onChunk } = params;

    let session = await this.getSession(sessionId, userId);
    if (!session) throw new Error('Session not found');

    const userMsg: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(userMsg);

    const ragResult = await ragService.answerQuestionStream({
      questionId: sessionId,
      questionText: message,
      userId,
      organizationId,
      onChunk,
    });

    const aiMsg: ChatMessage = {
      role: 'ai',
      content: ragResult.answerText,
      citations: ragResult.citations,
      confidence: ragResult.confidence,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(aiMsg);

    if (session.messages.filter(m => m.role === 'user').length === 1) {
      session.title = message.substring(0, 60) + (message.length > 60 ? '...' : '');
    }

    await supabase
      .from('chat_sessions')
      .update({
        title: session.title,
        messages: session.messages,
      })
      .eq('id', sessionId);

    sessionCache.set(sessionId, session);

    return {
      answer: ragResult.answerText,
      citations: ragResult.citations,
      confidence: ragResult.confidence,
    };
  }

  /**
   * Delete a chat session.
   */
  async deleteSession(sessionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to delete session: ${error.message}`);
    sessionCache.delete(sessionId);
  }
}

export const chatService = new ChatService();
