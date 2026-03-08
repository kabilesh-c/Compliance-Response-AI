# Document Intelligence Layer — Phase 1

## Overview

This module adds document ingestion, embedding, and semantic search capabilities to the Pharmacy API backend, forming the foundation for the Compliance Response AI.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Endpoints                           │
│  POST /upload-document  POST /upload-questionnaire              │
│  GET  /documents        GET  /document-status/:id               │
│  POST /search                                                   │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
     ┌─────────▼─────────┐             ┌─────────▼─────────┐
     │  Ingestion Queue   │             │  Search Service    │
     │  (async, serial)   │             │  (pgvector cosine) │
     └────────┬───────────┘             └───────────────────┘
              │
    ┌─────────▼─────────────────────────────────────┐
    │              Ingestion Pipeline                │
    │                                                │
    │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
    │  │  Parser   │→ │ Chunker  │→ │  Embedder    │ │
    │  │ PDF/DOCX/ │  │ 600-tok  │  │ Gemini       │ │
    │  │ TXT/MD/XL │  │ windows  │  │ text-emb-004 │ │
    │  └──────────┘  └──────────┘  └──────────────┘ │
    └───────────────────┬───────────────────────────┘
                        │
          ┌─────────────▼──────────────┐
          │     Supabase (Postgres)     │
          │  documents | document_chunks│
          │  questionnaires | questions │
          │       pgvector index        │
          │                             │
          │     Supabase Storage        │
          │  (file blobs)               │
          └────────────────────────────┘
```

## Setup

### 1. Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (from Supabase dashboard → Settings → API)
- `GEMINI_API_KEY` — Google AI API key (from https://aistudio.google.com/app/apikey)
- `SUPABASE_STORAGE_BUCKET` — Storage bucket name (default: `compliance-documents`)

### 2. Database Migration

Run the SQL migration in your Supabase SQL Editor:

```
File: src/database/migrations/001_document_intelligence.sql
```

This creates:
- `pgvector` extension
- `documents` table (file metadata, processing status)
- `document_chunks` table (text chunks + 768-dim embeddings)
- `questionnaires` table (parsed questionnaire files)
- `questions` table (individual questions with embeddings)
- `match_document_chunks()` RPC function for similarity search
- IVFFlat indexes for fast vector search
- Auto-updating `updated_at` triggers

### 3. Supabase Storage Bucket

Create a storage bucket named `compliance-documents` in your Supabase dashboard:
1. Go to Storage → New Bucket
2. Name: `compliance-documents`
3. Public: Yes (or configure RLS as needed)

### 4. Install Dependencies

```bash
cd apps/api
npm install
```

### 5. Start the Server

```bash
npm run dev
```

On startup, the server will automatically scan `apps/ml/knowledge_base/` and ingest any new markdown documents.

## API Reference

All endpoints require `Authorization: Bearer <token>` header.

### Upload Document
```http
POST /api/documents/upload-document
Content-Type: multipart/form-data

file: <PDF|DOCX|TXT|MD file>
```

Response:
```json
{
  "message": "Document uploaded and queued for processing",
  "documentId": "uuid",
  "fileName": "policy.pdf",
  "status": "uploading",
  "fileUrl": "https://..."
}
```

### Upload Questionnaire
```http
POST /api/documents/upload-questionnaire
Content-Type: multipart/form-data

file: <XLSX file>
```

### List Documents
```http
GET /api/documents
```

### Check Document Status
```http
GET /api/documents/status/:documentId
```

Response:
```json
{
  "id": "uuid",
  "documentName": "policy.pdf",
  "documentType": "reference",
  "status": "processed",
  "totalChunks": 24,
  "errorMessage": null,
  "createdAt": "2026-03-07T..."
}
```

Status progression: `uploading → parsing → chunking → embedding → processed`

### Semantic Search
```http
POST /api/documents/search
Content-Type: application/json

{
  "query": "What is the data retention policy?",
  "top_k": 5,
  "similarity_threshold": 0.3
}
```

Response:
```json
{
  "query": "What is the data retention policy?",
  "results": [
    {
      "id": "uuid",
      "documentId": "uuid",
      "chunkText": "...",
      "chunkIndex": 3,
      "pageNumber": 2,
      "documentName": "data_privacy_policy.md",
      "documentType": "reference",
      "sourceType": "system",
      "similarity": 0.89
    }
  ],
  "totalResults": 5
}
```

## File Structure

```
src/
├── config/
│   ├── supabase.ts          # Supabase client initialization
│   ├── gemini.ts            # Gemini AI client initialization
│   └── constants.ts         # Shared constants (chunk size, limits, etc.)
├── database/
│   └── migrations/
│       └── 001_document_intelligence.sql
├── services/
│   └── document/
│       ├── index.ts                    # Barrel exports
│       ├── storage.service.ts          # File storage + DB record CRUD
│       ├── parser.service.ts           # PDF/DOCX/TXT/MD/XLSX parsing
│       ├── chunker.service.ts          # Text chunking with overlap
│       ├── embedding.service.ts        # Gemini embedding generation
│       ├── search.service.ts           # pgvector semantic search
│       ├── ingestion.service.ts        # Pipeline orchestrator
│       ├── ingestion-queue.ts          # Async job queue with retry
│       └── system-ingestion.service.ts # Auto-ingest knowledge base
├── controllers/
│   └── document.controller.ts
├── routes/
│   └── document.routes.ts
├── middleware/
│   ├── upload.middleware.ts
│   └── validation.middleware.ts
└── utils/
    └── logger.ts
```

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| File too large (>50MB) | Rejected at upload with 400 error |
| Unsupported format | Rejected at multer middleware |
| Empty document | Detected during parsing, marked as `failed` |
| Corrupt PDF | Caught by pdf-parse, status set to `failed` |
| Gemini API rate limit | Exponential backoff with 3 retries |
| Embedding batch failure | Retry with increasing delay |
| Duplicate system doc | Checksum comparison, skip if unchanged |
| Partial processing | Status reflects last completed stage |
| User data isolation | All queries filtered by `user_id` |
| System docs visibility | All users can search system docs |

## Design Decisions

1. **Gemini text-embedding-004**: 768-dimensional vectors, good quality/performance tradeoff
2. **IVFFlat index**: Better insert performance than HNSW for our write-heavy ingestion pattern; good enough recall for <100K vectors
3. **Sequential queue**: Avoids overwhelming the Gemini API; production upgrade path → BullMQ + Redis
4. **Checksum dedup**: SHA-256 hash prevents re-ingesting unchanged system documents
5. **Cosine similarity**: Standard for text embeddings, implemented via pgvector `<=>` operator
6. **Chunk size 600 tokens with 100 overlap**: Balances context preservation with embedding quality
