import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { storageService, ingestionService, ingestionQueue, searchService } from '../services/document';
import { createLogger } from '../utils/logger';

const log = createLogger('DocumentController');

/**
 * Handles all document intelligence API endpoints.
 */
export class DocumentController {

  /**
   * POST /upload-document
   * Uploads a reference document and queues it for async processing.
   */
  uploadDocument = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Determine correct MIME type (browsers sometimes send generic types for .md)
      let mimeType = file.mimetype;
      if (file.originalname.endsWith('.md') && mimeType === 'application/octet-stream') {
        mimeType = 'text/markdown';
      }
      if (file.originalname.endsWith('.txt') && mimeType === 'application/octet-stream') {
        mimeType = 'text/plain';
      }

      log.info('Document upload request', {
        fileName: file.originalname,
        mimeType,
        size: file.size,
        userId: user.userId,
      });

      // 1. Upload to Supabase Storage
      const storageResult = await storageService.uploadFile(
        file.buffer,
        file.originalname,
        mimeType,
        user.userId
      );

      // 2. Create document record
      const documentId = await storageService.createDocumentRecord({
        userId: user.userId,
        organizationId: user.organizationId,
        documentName: file.originalname,
        documentType: 'reference',
        sourceType: 'user',
        fileUrl: storageResult.fileUrl,
        fileSize: storageResult.fileSize,
        mimeType: storageResult.mimeType,
        checksum: storageResult.checksum,
      });

      // 3. Queue async processing
      ingestionQueue.enqueue(documentId, () =>
        ingestionService.processDocument(documentId, file.buffer, mimeType, file.originalname)
      );

      return res.status(201).json({
        message: 'Document uploaded and queued for processing',
        documentId,
        fileName: file.originalname,
        status: 'uploading',
        fileUrl: storageResult.fileUrl,
      });

    } catch (err: any) {
      log.error('Upload failed', { error: err.message });
      const status = err.message?.includes('Unsupported') || err.message?.includes('empty') || err.message?.includes('exceeds')
        ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
  };

  /**
   * POST /upload-questionnaire
   * Uploads a questionnaire (XLSX, PDF, DOCX, MD, TXT) and queues it for async processing.
   */
  uploadQuestionnaire = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Determine correct MIME type
      let mimeType = file.mimetype;
      if (file.originalname.endsWith('.md') && mimeType === 'application/octet-stream') {
        mimeType = 'text/markdown';
      }
      if (file.originalname.endsWith('.txt') && mimeType === 'application/octet-stream') {
        mimeType = 'text/plain';
      }

      const supportedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
      ];

      const isSupported = supportedTypes.includes(mimeType)
        || /\.(xlsx|pdf|docx|md|txt)$/i.test(file.originalname);

      if (!isSupported) {
        return res.status(400).json({
          error: 'Questionnaires must be in XLSX, PDF, DOCX, MD, or TXT format',
        });
      }

      log.info('Questionnaire upload request', {
        fileName: file.originalname,
        mimeType,
        size: file.size,
        userId: user.userId,
      });

      // 1. Upload to storage
      const storageResult = await storageService.uploadFile(
        file.buffer,
        file.originalname,
        mimeType,
        user.userId
      );

      // 2. Create document record
      const documentId = await storageService.createDocumentRecord({
        userId: user.userId,
        organizationId: user.organizationId,
        documentName: file.originalname,
        documentType: 'questionnaire',
        sourceType: 'user',
        fileUrl: storageResult.fileUrl,
        fileSize: storageResult.fileSize,
        mimeType: storageResult.mimeType,
        checksum: storageResult.checksum,
      });

      // 3. Queue async processing
      ingestionQueue.enqueue(documentId, () =>
        ingestionService.processQuestionnaire(documentId, file.buffer, user.userId, user.organizationId, mimeType, file.originalname)
      );

      return res.status(201).json({
        message: 'Questionnaire uploaded and queued for processing',
        documentId,
        fileName: file.originalname,
        status: 'uploading',
      });

    } catch (err: any) {
      log.error('Questionnaire upload failed', { error: err.message });
      const status = err.message?.includes('Unsupported') || err.message?.includes('empty') || err.message?.includes('exceeds')
        || err.message?.includes('No questions')
        ? 400 : 500;
      return res.status(status).json({ error: err.message });
    }
  };

  /**
   * GET /documents
   * Lists all documents accessible to the authenticated user.
   */
  getDocuments = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const documents = await storageService.getDocuments(user.userId, user.organizationId);

      return res.json({ documents });
    } catch (err: any) {
      log.error('Failed to list documents', { error: err.message });
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }
  };

  /**
   * GET /document-status/:id
   * Returns the processing status of a specific document.
   */
  getDocumentStatus = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Document ID is required' });
      }

      const document = await storageService.getDocumentById(id, user.userId);

      return res.json({
        id: document.id,
        documentName: document.document_name,
        documentType: document.document_type,
        status: document.upload_status,
        totalChunks: document.total_chunks,
        errorMessage: document.error_message,
        createdAt: document.created_at,
      });
    } catch (err: any) {
      log.error('Failed to get document status', { error: err.message });
      return res.status(404).json({ error: 'Document not found' });
    }
  };

  /**
   * POST /search
   * Performs semantic search over document chunks.
   */
  search = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { query, top_k, similarity_threshold } = req.body;

      log.info('Search request', {
        userId: user.userId,
        queryLength: query.length,
        topK: top_k,
      });

      const results = await searchService.search({
        query,
        userId: user.userId,
        organizationId: user.organizationId,
        topK: top_k,
        similarityThreshold: similarity_threshold,
      });

      return res.json({
        query,
        results,
        totalResults: results.length,
      });

    } catch (err: any) {
      log.error('Search failed', { error: err.message });
      return res.status(500).json({ error: 'Search failed' });
    }
  };
}

export const documentController = new DocumentController();
