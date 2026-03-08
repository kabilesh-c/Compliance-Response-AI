import { genAI } from '../../config/gemini';
import { searchService, SearchResult } from '../document/search.service';
import { RAG_CONSTANTS } from '../../config/constants';
import { createLogger } from '../../utils/logger';

const log = createLogger('RagService');

export interface Citation {
  document: string;
  page: number | null;
  chunkId: string;
}

export interface EvidenceSnippet {
  chunkText: string;
  documentName: string;
  pageNumber: number | null;
}

export interface RagResult {
  answerText: string;
  citations: Citation[];
  evidenceSnippets: EvidenceSnippet[];
  confidence: number;
  chunkIds: string[];
  retrievalCount: number;
  generationTimeMs: number;
}

/**
 * Core RAG (Retrieval-Augmented Generation) service.
 * Retrieves relevant chunks, generates grounded answers via Gemini,
 * extracts citations, and computes confidence scores.
 */
export class RagService {

  private getModel() {
    return genAI.getGenerativeModel({
      model: RAG_CONSTANTS.GENERATION_MODEL,
      generationConfig: {
        temperature: RAG_CONSTANTS.TEMPERATURE,
        maxOutputTokens: RAG_CONSTANTS.MAX_OUTPUT_TOKENS,
      },
    });
  }

  /**
   * Retrieve relevant document chunks for a question.
   */
  async retrieveChunks(
    questionText: string,
    userId?: string,
    organizationId?: string,
    topK: number = RAG_CONSTANTS.RETRIEVAL_TOP_K,
    threshold: number = RAG_CONSTANTS.SIMILARITY_THRESHOLD,
  ): Promise<SearchResult[]> {
    const results = await searchService.search({
      query: questionText,
      userId,
      organizationId,
      topK,
      similarityThreshold: threshold,
    });

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Build the RAG prompt from question text and retrieved chunks.
   * When isStructured=true, instructs Gemini to return JSON with per-question answers.
   */
  private buildPrompt(questionText: string, chunks: SearchResult[], conversationContext?: string, isStructured?: boolean): string {
    const chunkTexts = chunks.length > 0
      ? chunks.map((c, i) => {
          const source = c.documentName || 'Unknown';
          const page = c.pageNumber ? `, Page ${c.pageNumber}` : '';
          return `[Source ${i + 1}: ${source}${page}]\n${c.chunkText}`;
        }).join('\n\n---\n\n')
      : '(No reference documents matched. Use conversation context if available.)';

    if (isStructured) {
      // Structured JSON output for questionnaire answering
      return [
        'You are an expert pharmaceutical compliance AI assistant. Answer each compliance questionnaire question using the provided reference documents.',
        '',
        conversationContext ? `CONVERSATION CONTEXT (prior messages):\n${conversationContext}\n` : '',
        'OUTPUT FORMAT — return ONLY a raw JSON object. No markdown fences, no extra text before or after the JSON.',
        'Required structure:',
        '{',
        '  "summary": "Short explanation of what the questionnaire covers and which areas of the platform are evaluated",',
        '  "totalQuestions": <integer>,',
        '  "answeredQuestions": <integer — count of questions where status is answered>,',
        '  "answers": [',
        '    {',
        '      "questionNumber": 1,',
        '      "questionText": "exact question text",',
        '      "answerText": "generated grounded answer in Markdown — use **bold**, bullet lists, headings",',
        '      "citations": [{"document": "document_name", "page": number}],',
        '      "evidenceSnippet": "short excerpt from source (max 250 chars)",',
        '      "confidence": 0.85,',
        '      "status": "answered" | "not_found"',
        '    }',
        '  ]',
        '}',
        '',
        'STRICT RULES:',
        '- Only answer questions present in the questionnaire.',
        '- Read ALL reference excerpts carefully before answering. Many answers span multiple sources.',
        '- "confidence" must be 0.0–1.0 based on how thoroughly the references address the question.',
        '- "evidenceSnippet" must be a verbatim quote from the provided sources — not paraphrased.',
        '- "citations" must list only documents where you found the answer.',
        '- answerText must be detailed and well-structured. Use ## headings, **bold**, bullet points.',
        '- If a question cannot be answered using references, return: status = "not_found", answerText = "Not found in references."',
        '- Do NOT return free-form responses or text outside the JSON object.',
        '- Always follow the JSON schema exactly.',
        '',
        `QUESTIONS TO ANSWER:\n${questionText}`,
        '',
        `REFERENCE DOCUMENT EXCERPTS (read carefully — these contain the answers):\n${chunkTexts}`,
      ].filter(Boolean).join('\n');
    }

    // Standard markdown prompt for regular conversational chat
    const hasContext = !!conversationContext;
    return [
      'You are an expert pharmaceutical compliance AI assistant. Answer the user\'s question helpfully and accurately.',
      '',
      hasContext ? `CONVERSATION HISTORY (use this to understand follow-up questions and references to prior answers):\n${conversationContext}\n` : '',
      'RESPONSE RULES:',
      '- Answer the SPECIFIC question asked — do not give a generic overview.',
      '- If the question is a follow-up or refers to something from the conversation history, ANSWER IT DIRECTLY using the conversation context.',
      '- Use the reference documents below as your primary source of facts.',
      '- If the user asks to "explain", "clarify", "expand", or asks about something already discussed, use both the conversation history AND the reference documents.',
      '- Format your response with **Markdown**: use **bold** for key terms, bullet points, code blocks where needed.',
      '- Be concise and focused — answer only what was asked.',
      '- Only say the information is not available if it is genuinely absent from BOTH the references AND the conversation history.',
      '',
      `USER QUESTION: ${questionText}`,
      '',
      chunks.length > 0 ? `REFERENCE DOCUMENT EXCERPTS:\n${chunkTexts}` : '',
    ].filter(Boolean).join('\n');
  }

  /**
   * Generate an answer using Gemini with retry logic.
   */
  async generateAnswer(questionText: string, chunks: SearchResult[], conversationContext?: string, isStructured?: boolean): Promise<string> {
    const prompt = this.buildPrompt(questionText, chunks, conversationContext, isStructured);
    const model = this.getModel();

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= RAG_CONSTANTS.MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message || '';
        
        // Check for quota/rate limit errors - don't retry these, fail fast with clear message
        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests') || errMsg.includes('rate limit')) {
          log.error('Gemini API quota exceeded', { error: errMsg });
          throw new Error('QUOTA_EXCEEDED: Gemini API rate limit reached. Please wait a minute and try again, or use a different API key.');
        }
        
        log.warn(`Generation attempt ${attempt} failed`, { error: err.message });
        if (attempt < RAG_CONSTANTS.MAX_RETRIES) {
          await this.sleep(RAG_CONSTANTS.RETRY_DELAY_MS * attempt);
        }
      }
    }

    throw new Error(
      `Answer generation failed after ${RAG_CONSTANTS.MAX_RETRIES} attempts: ${lastError?.message}`
    );
  }

  /**
   * Generate answer with streaming support.
   * Calls onChunk for each text fragment as it arrives.
   */
  async generateAnswerStream(
    questionText: string,
    chunks: SearchResult[],
    onChunk: (text: string) => void,
  ): Promise<string> {
    const prompt = this.buildPrompt(questionText, chunks);
    const model = this.getModel();

    const result = await model.generateContentStream(prompt);
    let fullText = '';

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }

    return fullText.trim();
  }

  /**
   * Extract deduplicated citations from retrieved chunks.
   */
  extractCitations(chunks: SearchResult[]): Citation[] {
    const seen = new Set<string>();
    const citations: Citation[] = [];

    for (const chunk of chunks) {
      const key = `${chunk.documentName}:${chunk.pageNumber ?? 'null'}`;
      if (!seen.has(key)) {
        seen.add(key);
        citations.push({
          document: chunk.documentName,
          page: chunk.pageNumber,
          chunkId: chunk.id,
        });
      }
    }

    return citations;
  }

  /**
   * Build evidence snippets from the top chunks.
   */
  buildEvidence(
    chunks: SearchResult[],
    maxSnippets: number = RAG_CONSTANTS.MAX_EVIDENCE_SNIPPETS,
  ): EvidenceSnippet[] {
    return chunks.slice(0, maxSnippets).map(c => ({
      chunkText: c.chunkText,
      documentName: c.documentName,
      pageNumber: c.pageNumber,
    }));
  }

  /**
   * Compute confidence using a hybrid heuristic:
   *   confidence = (avg_similarity * 0.6) + (citation_factor * 0.1) + (coverage * 0.3)
   * Normalized to [0, 1].
   */
  computeConfidence(chunks: SearchResult[], citations: Citation[]): number {
    if (chunks.length === 0) return 0;

    const avgSimilarity = chunks.reduce((sum, c) => sum + c.similarity, 0) / chunks.length;
    const citationFactor = Math.min(citations.length / 3, 1);
    const coverageFactor = Math.min(chunks.length / 5, 1);

    const raw = (avgSimilarity * 0.6) + (citationFactor * 0.1) + (coverageFactor * 0.3);
    return Math.min(Math.max(raw, 0), 1);
  }

  /**
   * For structured (questionnaire) mode: search each question individually,
   * then merge results. This gives much more targeted retrieval than embedding
   * all questions as a single vector.
   */
  private async retrieveChunksForAllQuestions(
    allQuestionsText: string,
    userId?: string,
    organizationId?: string,
  ): Promise<SearchResult[]> {
    // Parse numbered questions from the combined text
    const questions: string[] = [];
    let current = '';
    for (const line of allQuestionsText.split('\n')) {
      const trimmed = line.trim();
      if (/^\d+\.\s/.test(trimmed)) {
        if (current.trim()) questions.push(current.trim());
        current = trimmed.replace(/^\d+\.\s*/, '');
      } else if (trimmed) {
        current += ' ' + trimmed;
      }
    }
    if (current.trim()) questions.push(current.trim());

    if (questions.length === 0) {
      // Fallback: single broad search
      return this.retrieveChunks(allQuestionsText, userId, organizationId);
    }

    log.info('Per-question retrieval', { questionCount: questions.length });

    // Search each question individually (up to 8 chunks each), merge unique results
    const chunkMap = new Map<string, SearchResult>();
    const PER_Q_TOP_K = 8;

    await Promise.all(
      questions.map(async (q) => {
        let results = await this.retrieveChunks(q, userId, organizationId, PER_Q_TOP_K);
        if (results.length === 0) {
          results = await this.retrieveChunks(q, userId, organizationId, PER_Q_TOP_K, RAG_CONSTANTS.RETRY_LOWER_THRESHOLD);
        }
        for (const r of results) {
          if (!chunkMap.has(r.id)) chunkMap.set(r.id, r);
        }
      })
    );

    const merged = Array.from(chunkMap.values()).sort((a, b) => b.similarity - a.similarity);
    log.info('Per-question retrieval complete', { uniqueChunks: merged.length });
    return merged.slice(0, 50); // cap at 50 unique chunks to stay within token limits
  }

  /**
   * Full RAG pipeline for a single question (non-streaming).
   */
  async answerQuestion(params: {
    questionId: string;
    questionText: string;
    userId?: string;
    organizationId?: string;
    conversationContext?: string;
    isStructured?: boolean;
  }): Promise<RagResult> {
    const startTime = Date.now();
    const { questionId, questionText, userId, organizationId, conversationContext, isStructured } = params;

    log.info('Starting RAG pipeline', { questionId, isStructured });

    // 1. Retrieve chunks
    // For structured (questionnaire) mode: search each question individually for targeted retrieval
    // For regular chat: augment short/follow-up queries with conversation context keywords
    let chunks: SearchResult[];

    if (isStructured) {
      chunks = await this.retrieveChunksForAllQuestions(questionText, userId, organizationId);
    } else {
      // For follow-up / short messages, enrich the search query with recent assistant context
      let searchQuery = questionText;
      if (conversationContext && questionText.trim().split(/\s+/).length < 20) {
        // Extract the last assistant reply topic to augment short follow-ups
        const lines = conversationContext.split('\n').filter(l => l.startsWith('Assistant:'));
        if (lines.length > 0) {
          const lastReply = lines[lines.length - 1].replace('Assistant:', '').trim().substring(0, 200);
          searchQuery = `${questionText} ${lastReply}`;
        }
      }
      chunks = await this.retrieveChunks(searchQuery, userId, organizationId);
      if (chunks.length === 0) {
        chunks = await this.retrieveChunks(searchQuery, userId, organizationId, RAG_CONSTANTS.RETRIEVAL_TOP_K, RAG_CONSTANTS.RETRY_LOWER_THRESHOLD);
      }
    }

    // For regular chat with conversation context, we can still attempt generation even with no chunks
    // (Gemini can answer from conversation history)
    if (chunks.length === 0 && !conversationContext) {
      log.info('No relevant chunks found and no conversation context', { questionId });
      return {
        answerText: isStructured
          ? '{"summary":"No reference documents found.","totalQuestions":0,"answeredQuestions":0,"answers":[]}'
          : 'I could not find relevant information in the reference documents to answer your question.',
        citations: [],
        evidenceSnippets: [],
        confidence: 0,
        chunkIds: [],
        retrievalCount: 0,
        generationTimeMs: Date.now() - startTime,
      };
    }

    log.info('Retrieval complete', { questionId, chunkCount: chunks.length });

    // 2. Generate answer
    const answerText = await this.generateAnswer(questionText, chunks, conversationContext, isStructured);

    // 3. Check if model itself said "not found"
    const isNotFound = answerText.toLowerCase().includes('not found in references');

    // 4. Extract citations & evidence
    const citations = isNotFound ? [] : this.extractCitations(chunks);
    const evidenceSnippets = isNotFound ? [] : this.buildEvidence(chunks);

    // 5. Compute confidence
    const confidence = isNotFound ? 0 : this.computeConfidence(chunks, citations);

    const generationTimeMs = Date.now() - startTime;

    log.info('RAG pipeline complete', {
      questionId,
      retrievalCount: chunks.length,
      confidence: confidence.toFixed(3),
      generationTimeMs,
      isNotFound,
    });

    return {
      answerText,
      citations,
      evidenceSnippets,
      confidence,
      chunkIds: chunks.map(c => c.id),
      retrievalCount: chunks.length,
      generationTimeMs,
    };
  }

  /**
   * Streaming RAG pipeline for a single question.
   */
  async answerQuestionStream(params: {
    questionId: string;
    questionText: string;
    userId?: string;
    organizationId?: string;
    onChunk: (text: string) => void;
  }): Promise<RagResult> {
    const startTime = Date.now();
    const { questionId, questionText, userId, organizationId, onChunk } = params;

    log.info('Starting RAG stream pipeline', { questionId });

    let chunks = await this.retrieveChunks(questionText, userId, organizationId);

    if (chunks.length === 0) {
      chunks = await this.retrieveChunks(
        questionText, userId, organizationId,
        RAG_CONSTANTS.RETRIEVAL_TOP_K,
        RAG_CONSTANTS.RETRY_LOWER_THRESHOLD,
      );
    }

    if (chunks.length === 0) {
      const notFound = 'Not found in references.';
      onChunk(notFound);
      return {
        answerText: notFound,
        citations: [],
        evidenceSnippets: [],
        confidence: 0,
        chunkIds: [],
        retrievalCount: 0,
        generationTimeMs: Date.now() - startTime,
      };
    }

    const answerText = await this.generateAnswerStream(questionText, chunks, onChunk);

    const isNotFound = answerText.toLowerCase().includes('not found in references');
    const citations = isNotFound ? [] : this.extractCitations(chunks);
    const evidenceSnippets = isNotFound ? [] : this.buildEvidence(chunks);
    const confidence = isNotFound ? 0 : this.computeConfidence(chunks, citations);

    return {
      answerText,
      citations,
      evidenceSnippets,
      confidence,
      chunkIds: chunks.map(c => c.id),
      retrievalCount: chunks.length,
      generationTimeMs: Date.now() - startTime,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const ragService = new RagService();
