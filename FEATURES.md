# Features Guide

Complete guide to all features in PharmaOS Compliance Response AI.

## Core Features

### 1. Document Upload & Processing

#### Supported Formats

**Reference Documents:**
- PDF (.pdf) - Up to 100MB
- Microsoft Word (.docx) - Up to 50MB
- Plain Text (.txt) - Up to 10MB
- Markdown (.md) - Up to 10MB

**Questionnaires:**
- Excel (.xlsx) - Up to 10MB

#### Upload Process

1. Select questionnaire file (XLSX format)
2. Add one or more reference documents
3. Click "Start Analysis"
4. System processes documents and extracts questions
5. Navigate to session to view results

#### Behind the Scenes

- Documents are split into semantic chunks (500-1000 tokens)
- Text is embedded using Google's embedding model
- Vectors are stored in Supabase with pgvector
- Questions are parsed from XLSX structure
- Session is created for tracking progress

---

### 2. AI Answer Generation

#### How It Works

For each question:
1. **Retrieve**: Find relevant chunks from uploaded documents
2. **Generate**: Use Gemini 1.5 Pro to generate a grounded answer
3. **Cite**: Include source citations with page numbers
4. **Validate**: Calculate confidence score

#### Answer Quality

- **Grounded**: All answers based on uploaded documents
- **Cited**: Every answer includes source references
- **Confident**: Confidence scores indicate answer quality
- **Transparent**: "Not available in documents" when information is missing

---

### 3. Citation System with Evidence Snippets

#### Citation Components

Each citation includes:
- **Document Name**: Source document filename
- **Page Number**: Specific page (when available)
- **Evidence Snippet**: 200-character excerpt from source

#### Example Citation

```
Document: Security Policy v2.3.pdf (Page 12)
Snippet: "All data at rest is encrypted using AES-256 encryption 
with keys managed through AWS KMS. Encryption keys are rotated 
quarterly according to our key management procedures..."
```

#### Benefits

- **Verifiable**: Users can check source documents
- **Contextual**: Snippets provide immediate context
- **Auditable**: Full evidence trail for compliance
- **Editable**: Citations can be modified if needed

---

### 4. Seamless Inline Editing

#### ChatGPT-Style Editing

- **Click to Edit**: Click any text to start editing
- **No Edit Buttons**: No visible "Edit" buttons cluttering the UI
- **Auto-Save**: Changes saved automatically after 1 second
- **Visual Feedback**: Subtle border shows editable areas on hover

#### Editable Components

- ✅ Question text
- ✅ Answer text
- ✅ Citations (document name, page, snippet)
- ✅ Evidence points

#### Editing Features

- **Markdown Sanitization**: All markdown symbols automatically removed
- **Real-time Update**: Changes reflected immediately
- **Version Preservation**: Edit doesn't create new version
- **Undo/Redo**: Browser-level undo supported

---

### 5. Version History & Regeneration

#### Version System

Each question can have multiple answer versions:
- Version 1: Initial AI-generated answer
- Version 2+: Regenerated answers

#### Navigation

- **Previous/Next Arrows**: Navigate between versions
- **Version Counter**: Shows "Version 2 of 3"
- **Current Version**: Highlighted in display

#### Regeneration

1. Click "Regenerate" button
2. System retrieves new context chunks
3. AI generates fresh answer
4. New version added to history
5. Auto-switches to latest version

#### Use Cases

- Original answer too generic
- New information discovered in documents
- Question interpretation was incorrect
- Want alternative phrasing

---

### 6. Confidence Scoring

#### How Scores Are Calculated

```
Confidence = (Retrieval Score × 0.6) + (Completeness Score × 0.4)

Retrieval Score: Similarity of retrieved chunks to question
Completeness Score: How fully the answer addresses the question
```

#### Score Ranges

| Range | Color | Meaning |
|-------|-------|---------|
| 70-100% | 🟢 Green | High confidence - answer is well-grounded |
| 40-69% | 🟡 Yellow | Medium confidence - may need review |
| 0-39% | 🔴 Red | Low confidence - likely incomplete |

#### Visual Indicators

- Progress bar with color coding
- Percentage displayed next to bar
- Badge color matches confidence level

---

### 7. Export Functionality

#### Supported Formats

##### Microsoft Word (.rtf)

- Rich Text Format for maximum compatibility
- Preserves formatting (bold, italic)
- Includes all questions, answers, and citations
- Clean output without markdown artifacts
- Ready for printing or further editing

##### PDF (Print to PDF)

- Opens browser print dialog
- Clean HTML layout
- Includes all content
- User controls page settings
- Save as PDF through browser

##### Markdown (.md)

- Plain text with markdown formatting
- Excellent for version control
- Easy to edit in any text editor
- Compatible with documentation systems

#### Export Features

- **Filename Customization**: Uses questionnaire name
- **Complete Export**: All questions and answers included
- **Formatted Output**: Professional, ready-to-send format
- **Evidence Included**: Citations and snippets preserved

---

### 8. Demo Mode

#### Purpose

Test the system without creating an account:
- No email required
- No password needed
- Instant access
- Isolated demo environment

#### Features in Demo Mode

✅ Upload documents
✅ Generate answers
✅ Edit responses
✅ Regenerate answers
✅ View version history
✅ Export results

❌ Saved across sessions (demo data is temporary)
❌ Access from multiple devices
❌ Long-term storage

#### Using Demo Mode

1. Click "Try Demo Mode" on login page
2. System automatically authenticates with demo token
3. Create sessions and upload documents
4. All data isolated to demo user account

---

### 9. Theme & Visual Design

#### Color Palette

- **Primary**: Teal/Emerald (`rgba(19, 78, 74, 0.3)`)
- **Accent**: Emerald-600 for highlights
- **Success**: Green for high confidence
- **Warning**: Yellow for medium confidence
- **Error**: Red for low confidence

#### Design Principles

- **Clean**: Minimal clutter, focused on content
- **Consistent**: Same patterns throughout
- **Accessible**: Good contrast ratios
- **Responsive**: Works on desktop and tablet

#### UI Components

- **Cards**: Subtle teal backgrounds
- **Gradients**: Emerald gradients for panels
- **Borders**: Emerald borders on hover
- **Shadows**: Subtle shadows for depth

---

### 10. Real-time Features

#### Auto-Save

- **Debounced**: Waits 1000ms after last keystroke
- **Silent**: No loading spinners or notifications
- **Reliable**: Handles network errors gracefully
- **Instant**: Changes reflected immediately in UI

#### Live Updates

- Session status updates
- Progress indicators during generation
- Real-time answer streaming (future feature)

---

## Advanced Features

### Batch Processing

Generate answers for all questions at once:
- Parallel processing for speed
- Progress tracking
- Error handling per question
- Retry failed questions

### Context Memory

System remembers:
- Previously uploaded documents
- Session history
- User preferences (future)
- Common question patterns (future)

### Smart Retrieval

- Semantic search over keyword matching
- Considers question context
- Weights recent documents higher
- Filters out irrelevant chunks

---

## Upcoming Features

🔜 **Answer Streaming**: See answers generate in real-time
🔜 **Collaborative Editing**: Multiple users editing same questionnaire
🔜 **Templates**: Save common question patterns
🔜 **Batch Upload**: Upload multiple questionnaires at once
🔜 **API Access**: Programmatic access to generation
🔜 **Custom Models**: Choose between different AI models
🔜 **Advanced Analytics**: Track answer quality over time

---

## Feature Requests

Have an idea for a new feature? 

1. Check existing issues on GitHub
2. Create a feature request with:
   - Clear description
   - Use case explanation
   - Expected behavior
   - Screenshots/mockups (if UI change)

We prioritize features based on:
- User demand
- Implementation complexity
- System impact
- Alignment with product vision
