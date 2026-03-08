import multer from 'multer';
import { DOCUMENT_CONSTANTS } from '../config/constants';

/**
 * Multer middleware configured for document uploads.
 * Stores files in memory (buffer) for processing.
 */
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: DOCUMENT_CONSTANTS.MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    // Check by MIME type
    if (DOCUMENT_CONSTANTS.SUPPORTED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    // Fallback: check by extension (some browsers send generic MIME types)
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (ext && DOCUMENT_CONSTANTS.SUPPORTED_EXTENSIONS.includes(ext as any)) {
      cb(null, true);
      return;
    }

    cb(new Error(
      `Unsupported file type: ${file.mimetype}. Allowed: ${DOCUMENT_CONSTANTS.SUPPORTED_EXTENSIONS.join(', ')}`
    ));
  },
});
