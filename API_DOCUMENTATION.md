# API Documentation

## Base URLs

- **Production**: `https://compliance-response-ai.onrender.com/api`
- **Development**: `http://localhost:3001/api`

## Authentication

### Demo Mode

For testing without authentication:

```http
Authorization: Bearer demo-token-12345
```

### Firebase Authentication (Production)

```http
Authorization: Bearer <firebase_id_token>
```

Get the ID token from Firebase Auth after user login.

## Endpoints

### Health Check

```http
GET /health
```

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-09T12:34:56.789Z",
  "database": "connected",
  "supabase": "connected"
}
```

---

### Upload Documents

```http
POST /documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

Upload reference documents and questionnaire.

**Form Data:**
- `questionnaire`: XLSX file containing questions
- `documents`: One or more files (PDF, DOCX, TXT, MD)

**Response:**
```json
{
  "sessionId": "uuid-v4",
  "questionnaireId": "uuid-v4",
  "documentsUploaded": 3,
  "questionsExtracted": 25
}
```

---

### Get Session

```http
GET /sessions/:sessionId
Authorization: Bearer <token>
```

Retrieve session details including questions and answers.

**Response:**
```json
{
  "id": "uuid-v4",
  "userId": "uuid-v4",
  "questionnaireId": "uuid-v4",
  "questionnaireName": "Vendor Security Assessment.xlsx",
  "status": "in_progress",
  "createdAt": "2026-03-09T10:00:00Z",
  "questions": [...]
}
```

---

### Generate Answers

```http
POST /chat/generate-answers
Content-Type: application/json
Authorization: Bearer <token>
```

Generate AI answers for all questions in a session.

**Request Body:**
```json
{
  "sessionId": "uuid-v4",
  "questionnaireId": "uuid-v4"
}
```

**Response:**
```json
{
  "success": true,
  "answersGenerated": 25,
  "sessionId": "uuid-v4"
}
```

---

### Regenerate Single Answer

```http
POST /chat/regenerate
Content-Type: application/json
Authorization: Bearer <token>
```

Regenerate answer for a specific question.

**Request Body:**
```json
{
  "sessionId": "uuid-v4",
  "questionId": "uuid-v4"
}
```

**Response:**
```json
{
  "questionId": "uuid-v4",
  "answerText": "Generated answer text...",
  "citations": [
    {
      "documentName": "Security Policy.pdf",
      "pageNumber": 5,
      "snippet": "Supporting text from the document..."
    }
  ],
  "evidence": ["Evidence point 1", "Evidence point 2"],
  "confidence": 85,
  "version": 2
}
```

---

### Update Answer

```http
PUT /answers/:answerId
Content-Type: application/json
Authorization: Bearer <token>
```

Update an answer's text, citations, or evidence.

**Request Body:**
```json
{
  "answerText": "Updated answer text",
  "citations": [
    {
      "documentName": "Updated document.pdf",
      "pageNumber": 10,
      "snippet": "Updated snippet text"
    }
  ],
  "evidence": ["Updated evidence"]
}
```

**Response:**
```json
{
  "id": "uuid-v4",
  "answerText": "Updated answer text",
  "citations": [...],
  "evidence": [...],
  "confidence": 85,
  "updatedAt": "2026-03-09T12:45:00Z"
}
```

---

### Get Questions

```http
GET /questions?sessionId=<sessionId>
Authorization: Bearer <token>
```

Get all questions for a session.

**Query Parameters:**
- `sessionId`: UUID of the session

**Response:**
```json
{
  "questions": [
    {
      "id": "uuid-v4",
      "questionText": "What encryption standards do you use?",
      "sectionName": "Security",
      "rowNumber": 1,
      "answer": {
        "answerText": "We use AES-256 encryption...",
        "citations": [...],
        "evidence": [...],
        "confidence": 90,
        "version": 1
      }
    }
  ]
}
```

---

### Export Questionnaire

```http
GET /export/:sessionId/:format
Authorization: Bearer <token>
```

Export completed questionnaire in specified format.

**Path Parameters:**
- `sessionId`: UUID of the session
- `format`: One of `word`, `pdf`, `markdown`

**Response:**
- For `word`: RTF file download
- For `pdf`: HTML for print dialog
- For `markdown`: Markdown file download

---

## Data Models

### Citation

```typescript
{
  documentName: string;
  pageNumber?: number;
  snippet: string;  // 200-character evidence text
}
```

### Answer

```typescript
{
  id: string;
  questionId: string;
  answerText: string;
  citations: Citation[];
  evidence: string[];
  confidence: number;  // 0-100
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

### Question

```typescript
{
  id: string;
  sessionId: string;
  questionText: string;
  sectionName?: string;
  rowNumber: number;
  answer?: Answer;
}
```

### Session

```typescript
{
  id: string;
  userId: string;
  questionnaireId: string;
  questionnaireName: string;
  status: 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": {}
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Demo Mode**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user

---

## CORS

Allowed origins:
- `https://pharmaos.vercel.app` (production)
- `http://localhost:3000` (development)

---

## Examples

### Complete Workflow

1. **Upload Documents**
```bash
curl -X POST https://compliance-response-ai.onrender.com/api/documents/upload \
  -H "Authorization: Bearer demo-token-12345" \
  -F "questionnaire=@questionnaire.xlsx" \
  -F "documents=@policy1.pdf" \
  -F "documents=@policy2.pdf"
```

2. **Generate Answers**
```bash
curl -X POST https://compliance-response-ai.onrender.com/api/chat/generate-answers \
  -H "Authorization: Bearer demo-token-12345" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session-uuid", "questionnaireId": "questionnaire-uuid"}'
```

3. **Get Results**
```bash
curl -X GET https://compliance-response-ai.onrender.com/api/sessions/session-uuid \
  -H "Authorization: Bearer demo-token-12345"
```

4. **Export**
```bash
curl -X GET https://compliance-response-ai.onrender.com/api/export/session-uuid/word \
  -H "Authorization: Bearer demo-token-12345" \
  --output completed-questionnaire.rtf
```
