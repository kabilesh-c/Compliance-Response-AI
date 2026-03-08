import { Router } from 'express';
import { answerController } from '../controllers/answer.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All question routes require authentication
router.use(authenticateToken);

// ── Question-level endpoints ───────────────────────────────────────────────

/**
 * POST /api/questions/:id/regenerate
 * Regenerate the answer for a single question
 */
router.post('/:id/regenerate', answerController.regenerateAnswer);

/**
 * PATCH /api/questions/:id/approve
 * Approve a question's answer (draft → approved)
 */
router.patch('/:id/approve', answerController.approveAnswer);

/**
 * GET /api/questions/:id/answer-stream
 * SSE streaming endpoint for real-time answer generation
 */
router.get('/:id/answer-stream', answerController.streamAnswer);

export default router;
