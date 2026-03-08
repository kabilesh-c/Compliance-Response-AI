// Centralized constants for the document intelligence layer

export const DOCUMENT_CONSTANTS = {
  // Chunking
  CHUNK_SIZE_TOKENS: 600,       // Target chunk size (500-700 range)
  CHUNK_OVERLAP_TOKENS: 100,    // Overlap between consecutive chunks
  APPROX_CHARS_PER_TOKEN: 4,   // Rough estimate for tokenization

  // File limits
  MAX_FILE_SIZE_MB: 50,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,

  // Supported MIME types
  SUPPORTED_MIME_TYPES: new Map<string, string>([
    ['application/pdf', 'pdf'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'],
    ['text/plain', 'txt'],
    ['text/markdown', 'md'],
  ]),

  SUPPORTED_EXTENSIONS: ['.pdf', '.docx', '.xlsx', '.txt', '.md'],

  // Embedding
  EMBEDDING_BATCH_SIZE: 20,      // Process 20 chunks per API call
  EMBEDDING_RETRY_ATTEMPTS: 3,
  EMBEDDING_RETRY_DELAY_MS: 1000,
  EMBEDDING_RATE_LIMIT_DELAY_MS: 200, // Delay between batches

  // Search
  DEFAULT_TOP_K: 10,
  MAX_TOP_K: 50,
  DEFAULT_SIMILARITY_THRESHOLD: 0.3,

  // Storage paths
  STORAGE_PATH_PREFIX: 'documents',
  KNOWLEDGE_BASE_PATH: '../../ml/knowledge_base',
} as const;

// Phase 2: RAG Answer Engine constants
export const RAG_CONSTANTS = {
  // Gemini generation model
  GENERATION_MODEL: 'gemini-2.5-flash',
  TEMPERATURE: 0.2,
  MAX_OUTPUT_TOKENS: 8192,

  // Retrieval
  RETRIEVAL_TOP_K: 20,
  SIMILARITY_THRESHOLD: 0.3,
  RETRY_LOWER_THRESHOLD: 0.15,

  // Evidence
  MAX_EVIDENCE_SNIPPETS: 5,

  // Generation retries
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,

  // Batch processing
  BATCH_CONCURRENCY: 3,

  // Rate limiting between questions (ms)
  INTER_QUESTION_DELAY_MS: 500,
} as const;
