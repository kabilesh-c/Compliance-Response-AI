-- ============================================================================
-- Migration: Document Intelligence Layer (Phase 1)
-- Description: Adds pgvector extension and tables for document ingestion,
--              chunking, embedding, and semantic search.
-- ============================================================================

-- Enable pgvector extension (must be enabled by Supabase project owner)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE "DocumentType" AS ENUM ('questionnaire', 'reference');
CREATE TYPE "SourceType" AS ENUM ('user', 'system');
CREATE TYPE "DocumentStatus" AS ENUM (
  'uploading',
  'parsing',
  'chunking',
  'embedding',
  'processed',
  'failed'
);
CREATE TYPE "QuestionnaireStatus" AS ENUM (
  'pending',
  'processing',
  'ready',
  'completed'
);
CREATE TYPE "AnswerStatus" AS ENUM (
  'unanswered',
  'draft',
  'approved'
);

-- ============================================================================
-- DOCUMENTS TABLE
-- Stores metadata about uploaded files (both user-uploaded and system docs)
-- ============================================================================
CREATE TABLE "documents" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"         UUID,
  "organization_id" UUID,
  "document_name"   TEXT NOT NULL,
  "document_type"   "DocumentType" NOT NULL,
  "source_type"     "SourceType" NOT NULL DEFAULT 'user',
  "file_url"        TEXT,
  "file_size"       BIGINT,
  "mime_type"       TEXT,
  "upload_status"   "DocumentStatus" NOT NULL DEFAULT 'uploading',
  "error_message"   TEXT,
  "total_chunks"    INTEGER DEFAULT 0,
  "checksum"        TEXT,  -- SHA-256 hash to detect duplicate/changed files
  "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_documents_user" ON "documents"("user_id");
CREATE INDEX "idx_documents_org" ON "documents"("organization_id");
CREATE INDEX "idx_documents_source" ON "documents"("source_type");
CREATE INDEX "idx_documents_status" ON "documents"("upload_status");
CREATE UNIQUE INDEX "idx_documents_checksum_source" ON "documents"("checksum", "source_type")
  WHERE "checksum" IS NOT NULL;

-- ============================================================================
-- DOCUMENT CHUNKS TABLE
-- Stores text chunks with their vector embeddings for similarity search
-- Gemini text-embedding-004 produces 768-dimensional vectors
-- ============================================================================
CREATE TABLE "document_chunks" (
  "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "document_id"   UUID NOT NULL REFERENCES "documents"("id") ON DELETE CASCADE,
  "chunk_text"    TEXT NOT NULL,
  "chunk_index"   INTEGER NOT NULL,
  "embedding"     vector(768),
  "page_number"   INTEGER,
  "token_count"   INTEGER,
  "metadata"      JSONB DEFAULT '{}',
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_chunks_document" ON "document_chunks"("document_id");
CREATE INDEX "idx_chunks_embedding" ON "document_chunks"
  USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- QUESTIONNAIRES TABLE
-- Represents an uploaded questionnaire document (parsed into questions)
-- ============================================================================
CREATE TABLE "questionnaires" (
  "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"             UUID NOT NULL,
  "organization_id"     UUID NOT NULL,
  "document_id"         UUID NOT NULL REFERENCES "documents"("id") ON DELETE CASCADE,
  "title"               TEXT,
  "total_questions"     INTEGER DEFAULT 0,
  "answered_questions"  INTEGER DEFAULT 0,
  "status"              "QuestionnaireStatus" NOT NULL DEFAULT 'pending',
  "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_questionnaires_user" ON "questionnaires"("user_id");
CREATE INDEX "idx_questionnaires_org" ON "questionnaires"("organization_id");

-- ============================================================================
-- QUESTIONS TABLE
-- Individual questions extracted from a questionnaire
-- ============================================================================
CREATE TABLE "questions" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "questionnaire_id"  UUID NOT NULL REFERENCES "questionnaires"("id") ON DELETE CASCADE,
  "question_text"     TEXT NOT NULL,
  "question_index"    INTEGER NOT NULL,
  "section"           TEXT,
  "embedding"         vector(768),
  "answer_text"       TEXT,
  "answer_status"     "AnswerStatus" NOT NULL DEFAULT 'unanswered',
  "source_chunks"     UUID[],  -- References to document_chunks used for answer
  "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_questions_questionnaire" ON "questions"("questionnaire_id");
CREATE INDEX "idx_questions_embedding" ON "questions"
  USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- SEMANTIC SEARCH FUNCTION
-- Performs cosine similarity search over document chunks
-- ============================================================================
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(768),
  match_count INT DEFAULT 10,
  filter_user_id UUID DEFAULT NULL,
  filter_org_id UUID DEFAULT NULL,
  similarity_threshold FLOAT DEFAULT 0.0
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_text TEXT,
  chunk_index INTEGER,
  page_number INTEGER,
  metadata JSONB,
  document_name TEXT,
  document_type "DocumentType",
  source_type "SourceType",
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_index,
    dc.page_number,
    dc.metadata,
    d.document_name,
    d.document_type,
    d.source_type,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE d.upload_status = 'processed'
    AND (filter_user_id IS NULL OR d.user_id = filter_user_id OR d.source_type = 'system')
    AND (filter_org_id IS NULL OR d.organization_id = filter_org_id OR d.source_type = 'system')
    AND 1 - (dc.embedding <=> query_embedding) > similarity_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_documents_updated_at
  BEFORE UPDATE ON "documents"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_questionnaires_updated_at
  BEFORE UPDATE ON "questionnaires"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
