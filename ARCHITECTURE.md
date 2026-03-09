# System Architecture

Detailed architecture documentation for PharmaOS Compliance Response AI.

## Overview

The system follows a modern three-tier architecture with separate frontend, backend, and data layers deployed across cloud providers optimized for their specific roles.

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│                     (Vercel Edge Network)                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              Next.js 15 + React 18                      │     │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐ │     │
│  │  │  Auth   │  │   AI    │  │Question │  │  Export  │ │     │
│  │  │  Pages  │  │ Assistant│  │  Review │  │  Manager │ │     │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────┘ │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
                              │
                       HTTPS/TLS 1.3
                              │
┌──────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                           │
│                      (Render - Oregon)                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │            Express.js + TypeScript API                  │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │              Controllers Layer                   │   │     │
│  │  │  [Auth] [Chat] [Documents] [Questions] [Export]│   │     │
│  │  └─────────────────────────────────────────────────┘   │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │              Services Layer                      │   │     │
│  │  │  ┌──────────┐  ┌────────────┐  ┌────────────┐ │   │     │
│  │  │  │   RAG    │  │  Embedding │  │   Chat     │ │   │     │
│  │  │  │ Pipeline │  │  Service   │  │  Service   │ │   │     │
│  │  │  └──────────┘  └────────────┘  └────────────┘ │   │     │
│  │  └─────────────────────────────────────────────────┘   │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │              Middleware Layer                    │   │     │
│  │  │  [Auth] [CORS] [Error Handler] [Rate Limiter] │   │     │
│  │  └─────────────────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
                              │
                    PostgreSQL Protocol
                              │
┌──────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                               │
│                   (Supabase - Multi-region)                       │
│                                                                   │
│  ┌────────────────────┐         ┌─────────────────────┐          │
│  │  PostgreSQL 14+    │         │  Supabase Storage   │          │
│  │  + pgvector        │         │  (Document Files)   │          │
│  │                    │         │                     │          │
│  │  • organizations   │         │  documents/         │          │
│  │  • users           │         │    - PDFs           │          │
│  │  • sessions        │         │    - DOCX           │          │
│  │  • questions       │         │    - TXT/MD         │          │
│  │  • answers         │         │    - XLSX           │          │
│  │  • documents       │         │                     │          │
│  │  • document_chunks │         └─────────────────────┘          │
│  │  • embeddings (🔸)│                                           │
│  └────────────────────┘                                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                         API Calls
                              │
┌──────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                            │
│                                                                   │
│  ┌──────────────────┐       ┌───────────────────┐               │
│  │  Google Gemini   │       │  Firebase Auth    │               │
│  │  API             │       │                   │               │
│  │                  │       │  - OAuth 2.0      │               │
│  │  - Embeddings    │       │  - JWT Tokens     │               │
│  │  - Generation    │       │  - User Auth      │               │
│  └──────────────────┘       └───────────────────┘               │
└──────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.0 | React framework with SSR |
| React | 18.3 | UI component library |
| TypeScript | 5.3 | Type-safe development |
| TailwindCSS | 3.4 | Utility-first styling |
| Turbopack | Latest | Fast bundler (dev mode) |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime |
| Express | 4.18 | Web application framework |
| TypeScript | 5.3 | Type-safe development |
| Prisma | 5.7 | ORM for database access |
| Winston | 3.11 | Structured logging |

### Database & Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 14+ | Relational database |
| pgvector | 0.5 | Vector similarity search |
| Supabase | Latest | Database platform |
| Supabase Storage | Latest | Object storage |

### AI Services

| Service | Model | Purpose |
|---------|-------|---------|
| Google Gemini | 1.5 Pro | Answer generation |
| Google Embeddings | text-embedding-004 | Text embeddings |

## Data Flow

### Document Upload Flow

```
1. User uploads files via frontend
   │
   ├─→ Questionnaire (XLSX)
   │   └─→ Parse questions
   │       └─→ Store in questions table
   │
   └─→ Reference Documents (PDF/DOCX/TXT/MD)
       │
       ├─→ Upload to Supabase Storage
       │   └─→ Generate signed URLs
       │
       ├─→ Extract text content
       │   ├─→ PDF: pdf-parse library
       │   ├─→ DOCX: mammoth library
       │   └─→ TXT/MD: direct read
       │
       ├─→ Split into semantic chunks
       │   └─→ 500-1000 tokens per chunk
       │       └─→ Store in document_chunks table
       │
       └─→ Generate embeddings
           └─→ Call Gemini embedding API
               └─→ Store vectors in embeddings column
```

### Answer Generation Flow

```
1. User requests answer generation
   │
   ├─→ For each question:
   │   │
   │   ├─→ Generate question embedding
   │   │
   │   ├─→ Vector similarity search
   │   │   └─→ pgvector cosine similarity
   │   │       └─→ Retrieve top 5 chunks
   │   │
   │   ├─→ Build context from chunks
   │   │   └─→ Extract text, document name, page
   │   │       └─→ Generate evidence snippets (200 chars)
   │   │
   │   ├─→ Call Gemini 1.5 Pro
   │   │   └─→ Structured JSON prompt
   │   │       └─→ Request answer + citations + evidence
   │   │
   │   ├─→ Parse LLM response
   │   │   └─→ Extract answer text
   │   │       └─→ Extract citations with snippets
   │   │           └─→ Extract evidence points
   │   │
   │   └─→ Store in answers table
   │       └─→ Link to question
   │           └─→ Save version history
   │
   └─→ Return all answers to frontend
```

### Regeneration Flow

```
1. User clicks "Regenerate" on specific question
   │
   ├─→ Retrieve question context
   │   └─→ Get previous answer for reference
   │
   ├─→ Perform new vector search
   │   └─→ May return different chunks
   │
   ├─→ Generate new answer
   │   └─→ Same process as initial generation
   │
   ├─→ Create new answer version
   │   └─→ Increment version number
   │       └─→ Store as separate record
   │
   └─→ Return new answer
       └─→ Frontend shows version navigation
```

## Database Schema

### Core Tables

#### organizations
```sql
id              UUID PRIMARY KEY
name            TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

#### users
```sql
id              UUID PRIMARY KEY
organization_id UUID REFERENCES organizations(id)
email           TEXT UNIQUE NOT NULL
firebase_uid    TEXT UNIQUE
created_at      TIMESTAMP DEFAULT NOW()
```

#### sessions
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
questionnaire_id    UUID REFERENCES documents(id)
status              TEXT DEFAULT 'in_progress'
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()
```

#### documents
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
filename        TEXT NOT NULL
file_type       TEXT NOT NULL
file_path       TEXT NOT NULL
file_size       BIGINT NOT NULL
upload_date     TIMESTAMP DEFAULT NOW()
```

#### document_chunks
```sql
id              UUID PRIMARY KEY
document_id     UUID REFERENCES documents(id)
chunk_text      TEXT NOT NULL
chunk_index     INTEGER NOT NULL
page_number     INTEGER
embedding       vector(768)  -- pgvector type
created_at      TIMESTAMP DEFAULT NOW()
```

#### questions
```sql
id              UUID PRIMARY KEY
session_id      UUID REFERENCES sessions(id)
question_text   TEXT NOT NULL
section_name    TEXT
row_number      INTEGER
created_at      TIMESTAMP DEFAULT NOW()
```

#### answers
```sql
id              UUID PRIMARY KEY
question_id     UUID REFERENCES questions(id)
answer_text     TEXT NOT NULL
citations       JSONB NOT NULL  -- [{documentName, pageNumber, snippet}]
evidence        JSONB NOT NULL  -- [string, string, ...]
confidence      INTEGER NOT NULL  -- 0-100
version         INTEGER NOT NULL DEFAULT 1
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### Indexes

```sql
-- Vector similarity search
CREATE INDEX document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops);

-- Foreign key lookups
CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_questions_session_id ON questions(session_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- Frequently queried fields
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
```

## API Architecture

### RESTful Endpoints

```
POST   /api/auth/login              - Authenticate user
POST   /api/auth/demo               - Demo mode authentication

POST   /api/documents/upload        - Upload files
GET    /api/documents/:id           - Get document details
DELETE /api/documents/:id           - Delete document

GET    /api/sessions/:id            - Get session details
POST   /api/sessions                - Create new session
PUT    /api/sessions/:id            - Update session

GET    /api/questions?sessionId=X   - Get questions for session
POST   /api/questions               - Create question
PUT    /api/questions/:id           - Update question

POST   /api/chat/generate-answers   - Generate all answers
POST   /api/chat/regenerate         - Regenerate single answer
POST   /api/chat/message            - Send chat message

PUT    /api/answers/:id             - Update answer
GET    /api/answers/:id/versions    - Get answer version history

GET    /api/export/:sessionId/:fmt  - Export questionnaire
```

### Request/Response Flow

```
Client Request
     │
     ├─→ CORS Middleware
     │   └─→ Verify origin
     │
     ├─→ Auth Middleware
     │   ├─→ Extract JWT token
     │   ├─→ Validate with Firebase
     │   └─→ Attach user to request
     │
     ├─→ Rate Limiter
     │   └─→ Check request count
     │
     ├─→ Controller
     │   ├─→ Validate request body
     │   └─→ Call service layer
     │
     ├─→ Service
     │   ├─→ Business logic
     │   ├─→ Database operations
     │   └─→ External API calls
     │
     ├─→ Error Handler
     │   └─→ Format error response
     │
     └─→ Response
```

## RAG Pipeline Architecture

### Embedding Generation

```typescript
class EmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    // 1. Preprocess text
    const cleaned = this.preprocessText(text);
    
    // 2. Call Gemini embedding API
    const response = await this.geminiClient.embed({
      model: 'text-embedding-004',
      content: cleaned
    });
    
    // 3. Return 768-dimensional vector
    return response.embedding.values;
  }
}
```

### Retrieval

```typescript
class RetrievalService {
  async retrieve(query: string, topK: number = 5): Promise<Chunk[]> {
    // 1. Embed query
    const queryEmbedding = await this.embeddingService.generate(query);
    
    // 2. Vector similarity search
    const results = await this.db.query(`
      SELECT 
        chunk_text,
        document_name,
        page_number,
        1 - (embedding <=> $1) as similarity
      FROM document_chunks
      WHERE 1 - (embedding <=> $1) > 0.3
      ORDER BY embedding <=> $1
      LIMIT $2
    `, [queryEmbedding, topK]);
    
    // 3. Return ranked chunks
    return results.rows;
  }
}
```

### Generation

```typescript
class GenerationService {
  async generate(question: string, chunks: Chunk[]): Promise<Answer> {
    // 1. Build context from chunks
    const context = this.buildContext(chunks);
    
    // 2. Create structured prompt
    const prompt = this.createPrompt(question, context);
    
    // 3. Call Gemini 1.5 Pro
    const response = await this.geminiClient.generate({
      model: 'gemini-1.5-pro-002',
      prompt: prompt,
      response_mime_type: 'application/json',
      response_schema: AnswerSchema
    });
    
    // 4. Parse and return
    return JSON.parse(response.text);
  }
}
```

## Deployment Architecture

### Vercel (Frontend)

```
GitHub Push (main branch)
     │
     ├─→ Vercel Webhook
     │
     ├─→ Build Process
     │   ├─→ npm install
     │   ├─→ npm run build
     │   └─→ Generate static pages
     │
     ├─→ Deploy to Edge Network
     │   └─→ 70+ global locations
     │
     └─→ DNS Update
         └─→ pharmaos.vercel.app
```

### Render (Backend)

```
GitHub Push (main branch)
     │
     ├─→ Render Webhook
     │
     ├─→ Build Process
     │   ├─→ npm install
     │   ├─→ npm run build
     │   └─→ Compile TypeScript
     │
     ├─→ Deploy to Oregon Region
     │   └─→ Single instance (free tier)
     │
     └─→ Health Check
         └─→ GET /api/health
```

### Supabase (Database)

```
Always Available
     │
     ├─→ PostgreSQL Instance
     │   └─→ Multi-region replication
     │
     ├─→ Connection Pooler
     │   └─→ PgBouncer
     │
     └─→ Storage CDN
         └─→ Global distribution
```

## Performance Considerations

### Frontend Optimization
- Static page generation where possible
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Code splitting by route
- Service worker for offline capability (future)

### Backend Optimization
- Connection pooling for database
- Caching frequent queries (Redis future)
- Batch embedding generation
- Async processing for large documents
- Rate limiting to prevent abuse

### Database Optimization
- Indexes on frequently queried columns
- Vector index for similarity search (IVFFlat)
- Query optimization with EXPLAIN ANALYZE
- Connection pooling
- Read replicas for heavy read workloads (future)

## Scalability Strategy

### Current (MVP)
- Single backend instance
- Single database instance
- No caching layer
- Handles ~100 concurrent users

### Future (Production)
- Multiple backend instances with load balancer
- Database read replicas
- Redis caching layer
- CDN for static assets
- Handles ~10,000 concurrent users

## Security Architecture

See [SECURITY.md](SECURITY.md) for detailed security information.

## Monitoring & Observability

### Logging
- Winston structured logging
- Log levels: error, warn, info, debug
- Logs stored in platform (Render logs)

### Metrics (Future)
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Database query time
- Vector search performance

### Alerting (Future)
- Error rate threshold
- Response time degradation
- Database connection issues
- API quota exhaustion

---

For additional documentation:
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
