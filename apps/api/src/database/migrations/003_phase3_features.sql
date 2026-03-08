-- Phase 3 Migration: Response Memory, Gap Detection, Questionnaire Classification
-- Run in Supabase SQL Editor

-- ── 1. Approved Answers (Response Memory Engine) ────────────────────────────

CREATE TABLE IF NOT EXISTS approved_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  normalized_question TEXT NOT NULL,
  question_embedding vector(768),
  answer_text TEXT NOT NULL,
  citations JSONB DEFAULT '[]',
  created_at TIMESTAMP(3) DEFAULT NOW()
);

-- Index for fast similarity search on approved answers
CREATE INDEX IF NOT EXISTS idx_approved_answers_embedding
  ON approved_answers
  USING ivfflat (question_embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS idx_approved_answers_org
  ON approved_answers (organization_id);

-- ── 2. RPC function to search approved answers by similarity ────────────────

CREATE OR REPLACE FUNCTION match_approved_answers(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  filter_org_id UUID DEFAULT NULL,
  similarity_threshold FLOAT DEFAULT 0.9
)
RETURNS TABLE (
  id UUID,
  organization_id UUID,
  question_text TEXT,
  normalized_question TEXT,
  answer_text TEXT,
  citations JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aa.id,
    aa.organization_id,
    aa.question_text,
    aa.normalized_question,
    aa.answer_text,
    aa.citations,
    (1 - (aa.question_embedding <=> query_embedding))::FLOAT AS similarity
  FROM approved_answers aa
  WHERE
    aa.question_embedding IS NOT NULL
    AND (filter_org_id IS NULL OR aa.organization_id = filter_org_id)
    AND (1 - (aa.question_embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY aa.question_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ── 3. Add metadata column to questionnaires for type detection ─────────────

ALTER TABLE questionnaires
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- ── 4. Add confidence_level to answer_metadata (no schema change needed,
--       it's already JSONB — we write confidence_level into answer_metadata)

-- ── 5. Chat sessions table (lightweight in-memory-first, DB for persistence)

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  title TEXT DEFAULT 'New Chat',
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP(3) DEFAULT NOW(),
  updated_at TIMESTAMP(3) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user
  ON chat_sessions (user_id, created_at DESC);

-- Auto-update updated_at trigger for chat_sessions
CREATE OR REPLACE TRIGGER trigger_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
