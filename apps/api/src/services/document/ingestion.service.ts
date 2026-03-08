import { supabase } from '../../config/supabase';
import { storageService } from './storage.service';
import { parserService, ParsedQuestion } from './parser.service';
import { chunkerService, DocumentChunk } from './chunker.service';
import { embeddingService } from './embedding.service';
import { createLogger } from '../../utils/logger';

const log = createLogger('IngestionService');

/**
 * Orchestrates the full document ingestion pipeline:
 *   upload → parse → chunk → embed → store
 *
 * Runs asynchronously so the API can return immediately after upload.
 */
export class IngestionService {

  /**
   * Processes a reference document: parse → chunk → embed → store vectors.
   * Updates document status at each stage.
   */
  async processDocument(documentId: string, fileBuffer: Buffer, mimeType: string, fileName: string): Promise<void> {
    try {
      // ── Stage 1: Parse ──
      await storageService.updateDocumentStatus(documentId, 'parsing');
      log.info('Stage 1/3: Parsing document', { documentId, fileName });

      const parsed = await parserService.parse(fileBuffer, mimeType, fileName);

      // ── Stage 2: Chunk ──
      await storageService.updateDocumentStatus(documentId, 'chunking');
      log.info('Stage 2/3: Chunking document', { documentId, textLength: parsed.text.length });

      const chunks = chunkerService.chunkDocument(parsed.pages);

      if (chunks.length === 0) {
        throw new Error('Document produced no chunks after parsing');
      }

      // ── Stage 3: Embed & Store ──
      await storageService.updateDocumentStatus(documentId, 'embedding');
      log.info('Stage 3/3: Generating embeddings', { documentId, totalChunks: chunks.length });

      await this.embedAndStoreChunks(documentId, chunks, parsed.metadata);

      // ── Done ──
      await storageService.updateDocumentStatus(documentId, 'processed', {
        total_chunks: chunks.length,
      });

      log.info('Document processing complete', { documentId, totalChunks: chunks.length });

    } catch (err: any) {
      log.error('Document processing failed', { documentId, error: err.message });
      await storageService.updateDocumentStatus(documentId, 'failed', {
        error_message: err.message,
      });
    }
  }

  /**
   * Processes a questionnaire document: parse → extract questions → embed questions.
   * Supports XLSX, PDF, DOCX, MD, and TXT formats.
   */
  async processQuestionnaire(
    documentId: string,
    fileBuffer: Buffer,
    userId: string,
    organizationId: string,
    mimeType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileName: string = 'questionnaire.xlsx'
  ): Promise<void> {
    try {
      await storageService.updateDocumentStatus(documentId, 'parsing');
      log.info('Parsing questionnaire', { documentId, mimeType, fileName });

      const questions = await parserService.parseQuestionnaireAny(fileBuffer, mimeType, fileName);

      // Create questionnaire record
      const { data: questionnaire, error: qError } = await supabase
        .from('questionnaires')
        .insert({
          user_id: userId,
          organization_id: organizationId,
          document_id: documentId,
          total_questions: questions.length,
          status: 'processing',
        })
        .select('id')
        .single();

      if (qError) throw new Error(`Failed to create questionnaire: ${qError.message}`);

      // Embed and store questions
      await storageService.updateDocumentStatus(documentId, 'embedding');
      await this.embedAndStoreQuestions(questionnaire.id, questions);

      // Update statuses
      await supabase
        .from('questionnaires')
        .update({ status: 'ready' })
        .eq('id', questionnaire.id);

      await storageService.updateDocumentStatus(documentId, 'processed', {
        total_chunks: questions.length,
      });

      log.info('Questionnaire processing complete', {
        documentId,
        questionnaireId: questionnaire.id,
        totalQuestions: questions.length,
      });

    } catch (err: any) {
      log.error('Questionnaire processing failed', { documentId, error: err.message });
      await storageService.updateDocumentStatus(documentId, 'failed', {
        error_message: err.message,
      });
    }
  }

  /**
   * Generates embeddings for chunks and stores them in document_chunks.
   */
  private async embedAndStoreChunks(
    documentId: string,
    chunks: DocumentChunk[],
    docMetadata: Record<string, unknown>
  ): Promise<void> {
    const texts = chunks.map(c => c.chunkText);
    const embeddings = await embeddingService.embedBatch(texts);

    // Build rows for bulk insert
    const rows = chunks.map((chunk, i) => ({
      document_id: documentId,
      chunk_text: chunk.chunkText,
      chunk_index: chunk.chunkIndex,
      embedding: JSON.stringify(embeddings[i]),
      page_number: chunk.pageNumber,
      token_count: chunk.tokenCount,
      metadata: { ...docMetadata, charCount: chunk.chunkText.length },
    }));

    // Insert in batches of 50 to avoid payload size limits
    const BATCH = 50;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const { error } = await supabase.from('document_chunks').insert(batch);

      if (error) {
        log.error('Failed to insert chunk batch', { documentId, batch: i / BATCH + 1, error: error.message });
        throw new Error(`Failed to store chunks: ${error.message}`);
      }
    }
  }

  /**
   * Generates embeddings for questions and stores them in the questions table.
   */
  private async embedAndStoreQuestions(
    questionnaireId: string,
    questions: ParsedQuestion[]
  ): Promise<void> {
    const texts = questions.map(q => q.questionText);
    const embeddings = await embeddingService.embedBatch(texts);

    const rows = questions.map((q, i) => ({
      questionnaire_id: questionnaireId,
      question_text: q.questionText,
      question_index: q.questionIndex,
      section: q.section || null,
      embedding: JSON.stringify(embeddings[i]),
    }));

    const BATCH = 50;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const { error } = await supabase.from('questions').insert(batch);

      if (error) {
        throw new Error(`Failed to store questions: ${error.message}`);
      }
    }
  }
}

export const ingestionService = new IngestionService();
