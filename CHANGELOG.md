# Changelog

All notable changes to PharmaOS Compliance Response AI will be documented in this file.

## [1.2.0] - 2026-03-09

### Added
- **Citation Snippets**: Citations now include 200-character evidence snippets from source documents
- **Seamless Inline Editing**: Click-to-edit functionality for questions, answers, and references (ChatGPT-style)
- **Auto-save**: Automatic saving with 1000ms debounce for edited content
- **Markdown Sanitization**: Removes all markdown symbols (##, **, *, -, `) from displayed text
- **Production URLs**: Configured production endpoints for Render/Vercel deployment
- **Environment Override**: Support for `.env.local` to override API URLs in development

### Changed
- **UI Theme**: Updated to teal/emerald color scheme with `rgba(19, 78, 74, 0.3)` backgrounds
- **Reference Display**: References now shown in emerald cards with document name, page, and text snippet
- **Download Options**: Improved Word (RTF) and PDF (print dialog) export functionality
- **Version System**: Fixed state mutation issues for proper version tracking

### Fixed
- **Demo Authentication**: Resolved UUID foreign key violations for demo mode uploads
- **Version Numbers**: Fixed incorrect version display (was showing 3/3 instead of 2/2)
- **Version Navigation**: Arrow buttons now correctly navigate between answer versions
- **Word Export**: Cleaned RTF output to remove `\b` and `\b0` formatting codes
- **PDF Export**: Fixed PDF downloads using browser print dialog instead of markdown
- **State Mutations**: Resolved React state mutation bugs in version system

## [1.1.0] - 2026-03-08

### Added
- **Multi-format Document Upload**: Support for PDF, DOCX, TXT, and MD files
- **Questionnaire Parser**: Automatic extraction of questions from XLSX files
- **RAG Pipeline**: Retrieval-Augmented Generation with Supabase pgvector
- **Citation System**: Automatic source citations with document and page numbers
- **Confidence Scoring**: 0-100% confidence scores for generated answers
- **Version History**: Track and navigate multiple answer versions
- **Export Functionality**: Download completed questionnaires as Word/PDF/Markdown

### Security
- **Demo Mode**: Secure demo authentication with dedicated user IDs
- **Firebase Auth**: Production authentication with Google OAuth

## [1.0.0] - 2026-03-01

### Added
- Initial release of Compliance Response AI
- Basic RAG pipeline with document embeddings
- Question answering with Gemini 1.5 Pro
- Simple web interface for questionnaire processing
