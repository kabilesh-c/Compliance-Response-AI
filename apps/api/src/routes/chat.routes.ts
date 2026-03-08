import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// ── Chat message endpoints ─────────────────────────────────────────────────

/** POST /api/chat — Send message, get RAG response */
router.post('/', chatController.sendMessage);

/** POST /api/chat/regenerate-question — Regenerate a single question answer */
router.post('/regenerate-question', chatController.regenerateQuestion);

/** GET /api/chat/stream — SSE streaming chat (?message=...&sessionId=...) */
router.get('/stream', chatController.streamMessage);

// ── Session management ─────────────────────────────────────────────────────

/** POST /api/chat/sessions — Create new session */
router.post('/sessions', chatController.createSession);

/** GET /api/chat/sessions — List sessions */
router.get('/sessions', chatController.listSessions);

/** GET /api/chat/sessions/:id — Get session with messages */
router.get('/sessions/:id', chatController.getSession);

/** DELETE /api/chat/sessions/:id — Delete session */
router.delete('/sessions/:id', chatController.deleteSession);

export default router;
