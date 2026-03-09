import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

/**
 * Converts a Firebase UID (non-UUID string) into a deterministic UUID v4-format string.
 * Same input always produces the same output UUID.
 */
function toUuid(id: string): string {
  const hash = crypto.createHash('sha256').update(id).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

// Initialize Firebase Admin (uses project ID only — no service account needed for ID token verification)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'pharmaos-5fc57',
  });
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  // Fall back to query parameter for SSE endpoints (EventSource cannot set headers)
  if (!token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // DEMO MODE: Accept demo token for testing
  if (token === 'demo-token-12345') {
    (req as AuthRequest).user = {
      userId: 'demo-user-id',
      email: 'demo@pharmaos.com',
      role: 'ADMIN',
      organizationId: 'demo-retail-org',
    };
    return next();
  }

  // Try custom JWT first (from backend /api/auth/login)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as AuthRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };
    return next();
  } catch {
    // Not a custom JWT — try Firebase token
  }

  // Try Firebase ID token
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uuid = toUuid(decoded.uid);
    (req as AuthRequest).user = {
      userId: uuid,
      email: decoded.email || '',
      role: 'ADMIN',
      organizationId: uuid,
    };
    return next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
