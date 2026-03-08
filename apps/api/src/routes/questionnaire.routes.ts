import { Router } from 'express';
import { answerController } from '../controllers/answer.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All answer routes require authentication
router.use(authenticateToken);

// ── Questionnaire-level endpoints ──────────────────────────────────────────

/**
 * POST /api/questionnaires/:id/generate
 * Trigger answer generation for all questions in a questionnaire
 */
router.post('/:id/generate', answerController.generateAnswers);

/**
 * GET /api/questionnaires/:id/coverage
 * Get coverage statistics for a questionnaire
 */
router.get('/:id/coverage', answerController.getCoverage);

/**
 * GET /api/questionnaires/:id/questions
 * List all questions with their answers for a questionnaire
 */
router.get('/:id/questions', answerController.getQuestions);

/**
 * GET /api/questionnaires/:id/export?format=xlsx|pdf|docx|md
 * Export questionnaire results in the specified format
 */
router.get('/:id/export', answerController.exportQuestionnaire);

export default router;
