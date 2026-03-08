import { Router } from 'express';
import { documentController } from '../controllers/document.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { validateBody, searchSchema } from '../middleware/validation.middleware';

const router = Router();

// All document routes require authentication
router.use(authenticateToken);

/**
 * POST /api/documents/upload-document
 * Upload a reference document (PDF, DOCX, TXT, MD)
 */
router.post(
  '/upload-document',
  uploadMiddleware.single('file') as any,
  documentController.uploadDocument
);

/**
 * POST /api/documents/upload-questionnaire
 * Upload a questionnaire (XLSX)
 */
router.post(
  '/upload-questionnaire',
  uploadMiddleware.single('file') as any,
  documentController.uploadQuestionnaire
);

/**
 * GET /api/documents
 * List all documents for the authenticated user
 */
router.get('/', documentController.getDocuments);

/**
 * GET /api/documents/status/:id
 * Get processing status of a document
 */
router.get('/status/:id', documentController.getDocumentStatus);

/**
 * POST /api/documents/search
 * Semantic search over document chunks
 */
router.post(
  '/search',
  validateBody(searchSchema),
  documentController.search
);

export default router;
