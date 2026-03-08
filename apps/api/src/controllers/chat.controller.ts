import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { chatService } from '../services/rag';
import { createLogger } from '../utils/logger';

const log = createLogger('ChatController');

export class ChatController {

  /**
   * POST /api/chat/sessions
   * Create a new chat session.
   */
  createSession = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const sessionId = await chatService.createSession(user.userId, user.organizationId);
      return res.status(201).json({ sessionId });
    } catch (err: any) {
      log.error('Create session failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to create session' });
    }
  };

  /**
   * GET /api/chat/sessions
   * List chat sessions for the current user.
   */
  listSessions = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const sessions = await chatService.listSessions(user.userId);
      return res.json({ sessions });
    } catch (err: any) {
      log.error('List sessions failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to list sessions' });
    }
  };

  /**
   * GET /api/chat/sessions/:id
   * Get a chat session with messages.
   */
  getSession = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const session = await chatService.getSession(req.params.id, user.userId);
      if (!session) return res.status(404).json({ error: 'Session not found' });
      return res.json(session);
    } catch (err: any) {
      log.error('Get session failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to get session' });
    }
  };

  /**
   * DELETE /api/chat/sessions/:id
   * Delete a chat session.
   */
  deleteSession = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      await chatService.deleteSession(req.params.id, user.userId);
      return res.json({ success: true });
    } catch (err: any) {
      log.error('Delete session failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to delete session' });
    }
  };

  /**
   * POST /api/chat
   * Send a message and get a RAG-powered response.
   */
  sendMessage = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { message, sessionId, questionnaireDocumentId } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'message is required' });
      }

      // Use provided session or create new
      let sid = sessionId;
      if (!sid) {
        sid = await chatService.createSession(user.userId, user.organizationId);
      }

      const result = await chatService.sendMessage({
        sessionId: sid,
        userId: user.userId,
        organizationId: user.organizationId,
        message,
        questionnaireDocumentId: typeof questionnaireDocumentId === 'string' ? questionnaireDocumentId : undefined,
      });

      return res.json({
        sessionId: sid,
        answer: result.answer,
        citations: result.citations,
        confidence: result.confidence,
        evidenceSnippets: result.evidenceSnippets || [],
        questionnaireId: result.questionnaireId || null,
        structuredAnswers: result.structuredAnswers || null,
      });
    } catch (err: any) {
      log.error('Send message failed', { error: err.message, stack: err.stack });
      
      // Handle specific error types with clear user-facing messages
      let errorMessage = 'Failed to generate response';
      let statusCode = 500;
      
      if (err.message?.includes('QUOTA_EXCEEDED') || err.message?.includes('quota') || err.message?.includes('429')) {
        errorMessage = 'AI service rate limit reached. Please wait 1-2 minutes and try again.';
        statusCode = 429;
      } else if (err.message?.includes('Gemini') || err.message?.includes('generation')) {
        errorMessage = 'AI model error - please try again in a moment';
      } else if (err.message?.includes('Session')) {
        errorMessage = 'Session error - please refresh the page';
      } else if (err.message?.includes('supabase') || err.message?.includes('database')) {
        errorMessage = 'Database error - please retry';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return res.status(statusCode).json({ error: errorMessage });
    }
  };

  /**
   * GET /api/chat/stream
   * SSE streaming chat endpoint.
   * Query params: sessionId, message
   */
  streamMessage = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { sessionId, message } = req.query;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'message query param is required' });
      }

      let sid = sessionId as string;
      if (!sid) {
        sid = await chatService.createSession(user.userId, user.organizationId);
      }

      // Set SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      // Send sessionId first
      res.write(`data: ${JSON.stringify({ type: 'session', sessionId: sid })}\n\n`);

      const result = await chatService.sendMessageStream({
        sessionId: sid,
        userId: user.userId,
        organizationId: user.organizationId,
        message,
        onChunk: (text: string) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
        },
      });

      res.write(`data: ${JSON.stringify({
        type: 'complete',
        answer: result.answer,
        citations: result.citations,
        confidence: result.confidence,
      })}\n\n`);

      res.end();
    } catch (err: any) {
      log.error('Stream message failed', { error: err.message });
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Failed to stream response' });
      }
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
  };
  /**
   * POST /api/chat/regenerate-question
   * Regenerate the answer for a single question from the questionnaire.
   */
  regenerateQuestion = async (req: Request, res: Response) => {
    try {
      const user = (req as AuthRequest).user!;
      const { questionText, sessionId } = req.body;

      if (!questionText || typeof questionText !== 'string') {
        return res.status(400).json({ error: 'questionText is required' });
      }

      const result = await chatService.regenerateSingleQuestion({
        sessionId,
        userId: user.userId,
        organizationId: user.organizationId,
        questionText,
      });

      return res.json(result);
    } catch (err: any) {
      log.error('Regenerate question failed', { error: err.message });
      return res.status(500).json({ error: 'Failed to regenerate answer' });
    }
  };
}

export const chatController = new ChatController();
