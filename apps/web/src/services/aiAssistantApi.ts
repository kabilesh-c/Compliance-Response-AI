import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://compliance-response-ai.onrender.com/api';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DocumentInfo {
  id: string;
  document_name: string;
  document_type: 'questionnaire' | 'reference';
  upload_status: string;
  total_chunks: number;
  created_at: string;
}

export interface QuestionAnswer {
  id: string;
  question_text: string;
  question_index: number;
  section?: string;
  answer_text: string | null;
  answer_status: 'unanswered' | 'draft' | 'approved';
  confidence: number;
  citations: { document: string; page: number | null; chunkId: string }[];
  evidence_snippets: { chunkText: string; documentName: string; pageNumber: number | null }[];
  source_chunks: string[];
  answer_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CoverageSummary {
  totalQuestions: number;
  answeredQuestions: number;
  notFoundCount: number;
  averageConfidence: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  citations?: any[];
  confidence?: number;
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type ChatSessionSummary = ChatSession;

// ── Document APIs ──────────────────────────────────────────────────────────

export async function uploadReferenceDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/documents/upload-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return res.data;
}

export async function uploadQuestionnaire(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/documents/upload-questionnaire', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return res.data;
}

export async function getDocuments(): Promise<DocumentInfo[]> {
  const res = await api.get('/documents');
  return (res.data.documents || res.data) as DocumentInfo[];
}

export async function getDocumentStatus(id: string) {
  const res = await api.get(`/documents/status/${id}`);
  return res.data as { id: string; status: string; totalChunks: number };
}

// ── Questionnaire APIs ─────────────────────────────────────────────────────

export async function generateAnswers(questionnaireId: string) {
  const res = await api.post(`/questionnaires/${questionnaireId}/generate`);
  return res.data;
}

export async function getQuestions(questionnaireId: string) {
  const res = await api.get(`/questionnaires/${questionnaireId}/questions`);
  return res.data as { questionnaireId: string; questions: QuestionAnswer[] };
}

export async function getCoverage(questionnaireId: string) {
  const res = await api.get(`/questionnaires/${questionnaireId}/coverage`);
  return res.data as CoverageSummary;
}

// ── Question APIs ──────────────────────────────────────────────────────────

export async function regenerateAnswer(questionId: string) {
  const res = await api.post(`/questions/${questionId}/regenerate`);
  return res.data;
}

export async function approveAnswer(questionId: string) {
  const res = await api.patch(`/questions/${questionId}/approve`);
  return res.data;
}

/**
 * Export questionnaire results in the specified format.
 * Triggers a file download.
 */
export async function exportQuestionnaire(questionnaireId: string, format: 'xlsx' | 'pdf' | 'docx' | 'md') {
  const res = await api.get(`/questionnaires/${questionnaireId}/export`, {
    params: { format },
    responseType: 'blob',
  });

  // Extract filename from Content-Disposition header or generate one
  const disposition = res.headers['content-disposition'];
  let fileName = `questionnaire-results.${format}`;
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match) fileName = match[1];
  }

  // Trigger browser download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Connect to SSE streaming endpoint for real-time answer generation.
 * Returns an EventSource instance. Caller must close it.
 */
export function streamAnswer(
  questionId: string,
  callbacks: {
    onChunk: (text: string) => void;
    onComplete: (data: { answerText: string; citations: any[]; evidenceSnippets: any[]; confidence: number }) => void;
    onError: (error: string) => void;
  },
): EventSource {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const url = `${API_URL}/questions/${questionId}/answer-stream?token=${encodeURIComponent(token || '')}`;

  const es = new EventSource(url);

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chunk') {
        callbacks.onChunk(data.text);
      } else if (data.type === 'complete') {
        callbacks.onComplete(data);
        es.close();
      } else if (data.type === 'error') {
        callbacks.onError(data.error);
        es.close();
      }
    } catch {
      // ignore parse errors
    }
  };

  es.onerror = () => {
    callbacks.onError('Connection lost');
    es.close();
  };

  return es;
}

export interface StructuredAnswerItem {
  questionNumber: number;
  questionText: string;
  answerText: string;
  citations: { document: string; page: number | null }[];
  evidenceSnippet: string;
  confidence: number;
  status: 'answered' | 'not_found';
  sources?: { document: string; page: number | null }[]; // Backwards compatibility
  referenceExcerpt?: string; // Backwards compatibility
}

export interface StructuredAnswersResponse {
  summary: string;
  totalQuestions: number;
  answeredQuestions: number;
  overallConfidence: number;
  totalCitations: number;
  answers: StructuredAnswerItem[];
}

function normalizeStructuredAnswers(payload: unknown): StructuredAnswersResponse | null {
  if (!payload || typeof payload !== 'object') return null;

  const source = payload as Record<string, unknown>;
  const rawAnswers = Array.isArray(source.answers) ? source.answers : null;
  if (!rawAnswers || rawAnswers.length === 0) return null;

  const answers: StructuredAnswerItem[] = rawAnswers.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const answerText = typeof row.answerText === 'string'
      ? row.answerText
      : typeof row.answer === 'string'
        ? row.answer
        : '';

    const citationsSource = Array.isArray(row.citations)
      ? row.citations
      : Array.isArray(row.sources)
        ? row.sources
        : [];

    const citations = citationsSource
      .map((citation): { document: string; page: number | null } | null => {
        if (!citation || typeof citation !== 'object') return null;
        const entry = citation as Record<string, unknown>;
        const document = typeof entry.document === 'string' ? entry.document : 'Unknown';
        const page = typeof entry.page === 'number' ? entry.page : null;
        return { document, page };
      })
      .filter((citation): citation is { document: string; page: number | null } => citation !== null);

    const statusRaw = row.status;
    const normalizedStatus: 'answered' | 'not_found' =
      statusRaw === 'not_found' || (!answerText && statusRaw !== 'answered')
        ? 'not_found'
        : 'answered';

    return {
      questionNumber: typeof row.questionNumber === 'number' ? row.questionNumber : index + 1,
      questionText: typeof row.questionText === 'string' ? row.questionText : `Question ${index + 1}`,
      answerText,
      citations,
      evidenceSnippet: typeof row.evidenceSnippet === 'string'
        ? row.evidenceSnippet
        : typeof row.referenceExcerpt === 'string'
          ? row.referenceExcerpt
          : '',
      confidence: typeof row.confidence === 'number' ? row.confidence : 0,
      status: normalizedStatus,
      sources: citations,
      referenceExcerpt: typeof row.referenceExcerpt === 'string' ? row.referenceExcerpt : undefined,
    };
  });

  const answeredQuestions = answers.filter(a => a.status === 'answered').length;
  const totalCitations = answers.reduce((sum, answer) => sum + answer.citations.length, 0);
  const avgConfidence = answers.length
    ? answers.reduce((sum, answer) => sum + answer.confidence, 0) / answers.length
    : 0;

  return {
    summary: typeof source.summary === 'string' ? source.summary : '',
    totalQuestions: typeof source.totalQuestions === 'number' ? source.totalQuestions : answers.length,
    answeredQuestions: typeof source.answeredQuestions === 'number' ? source.answeredQuestions : answeredQuestions,
    overallConfidence: typeof source.overallConfidence === 'number' ? source.overallConfidence : avgConfidence,
    totalCitations: typeof source.totalCitations === 'number' ? source.totalCitations : totalCitations,
    answers,
  };
}

// ── Chat APIs ──────────────────────────────────────────────────────────────

export async function sendChatMessage(message: string, sessionId?: string, questionnaireDocumentId?: string) {
  const res = await api.post('/chat', { message, sessionId, questionnaireDocumentId });
  const data = res.data as {
    sessionId: string;
    answer: string;
    citations: any[];
    confidence: number;
    evidenceSnippets: { chunkText: string; documentName: string; pageNumber: number | null }[];
    questionnaireId: string | null;
    structuredAnswers: StructuredAnswersResponse | null | string;
  };

  let structuredAnswers = normalizeStructuredAnswers(data.structuredAnswers);

  if (!structuredAnswers && typeof data.answer === 'string') {
    try {
      const parsed = JSON.parse(data.answer);
      structuredAnswers = normalizeStructuredAnswers(parsed);
    } catch {
      // Non-JSON answer text is expected in standard chat flows.
    }
  }

  return {
    ...data,
    structuredAnswers,
  };
}

export async function regenerateSingleQuestion(questionText: string, sessionId?: string) {
  const res = await api.post('/chat/regenerate-question', { questionText, sessionId });
  return res.data as StructuredAnswerItem;
}

export function streamChatMessage(
  message: string,
  sessionId: string | undefined,
  callbacks: {
    onSession: (sessionId: string) => void;
    onChunk: (text: string) => void;
    onComplete: (data: { answer: string; citations: any[]; confidence: number }) => void;
    onError: (error: string) => void;
  },
): EventSource {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const params = new URLSearchParams({
    message,
    ...(sessionId && { sessionId }),
    ...(token && { token }),
  });

  const url = `${API_URL}/chat/stream?${params.toString()}`;
  const es = new EventSource(url);

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'session') {
        callbacks.onSession(data.sessionId);
      } else if (data.type === 'chunk') {
        callbacks.onChunk(data.text);
      } else if (data.type === 'complete') {
        callbacks.onComplete(data);
        es.close();
      } else if (data.type === 'error') {
        callbacks.onError(data.error);
        es.close();
      }
    } catch {
      // ignore parse errors
    }
  };

  es.onerror = () => {
    callbacks.onError('Connection lost');
    es.close();
  };

  return es;
}

export async function listChatSessions() {
  const res = await api.get('/chat/sessions');
  return res.data.sessions as ChatSession[];
}

export async function getChatSession(sessionId: string) {
  const res = await api.get(`/chat/sessions/${sessionId}`);
  return res.data as {
    id: string;
    title: string;
    messages: ChatMessage[];
  };
}

export async function deleteChatSession(sessionId: string) {
  await api.delete(`/chat/sessions/${sessionId}`);
}
