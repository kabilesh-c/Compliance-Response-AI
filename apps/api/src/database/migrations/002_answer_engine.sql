-- ============================================================================
-- Migration: Questionnaire Answer Engine (Phase 2)
-- Description: Adds columns to questions table for RAG answer storage,
--              confidence scores, citations, and evidence snippets.
-- ============================================================================

-- ── New columns on questions table ──────────────────────────────────────────
ALTER TABLE "questions"
  ADD COLUMN IF NOT EXISTS "confidence"        DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "citations"         JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "evidence_snippets" JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "answer_metadata"   JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "updated_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ── Updated_at trigger for questions ────────────────────────────────────────
CREATE TRIGGER trigger_questions_updated_at
  BEFORE UPDATE ON "questions"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
