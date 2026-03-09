import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';
import crypto from 'crypto';
import { supabase } from '../config/supabase';
import { createLogger } from '../utils/logger';

const log = createLogger('AuthMiddleware');
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

/**
 * Ensures demo user and organization exist in database.
 * Creates them if they don't exist, returns the IDs.
 */
async function ensureDemoUserExists() {
  // Use deterministic UUIDs for demo records
  const demoOrgId = toUuid('demo-retail-org');
  const demoUserId = toUuid('demo-user-id');
  const demoEmail = 'demo@pharmaos.com';

  try {
    // Check if demo organization exists
    const { data: orgData } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', demoOrgId)
      .single();

    // Create org if doesn't exist
    if (!orgData) {
      await supabase.from('organizations').insert({
        id: demoOrgId,
        name: 'Demo Retail Organization',
        type: 'RETAIL',
      });
      log.info('Created demo organization');
    }

    // Check if demo user exists
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('id', demoUserId)
      .single();

    // Create user if doesn't exist
    if (!userData) {
      await supabase.from('users').insert({
        id: demoUserId,
        email: demoEmail,
        name: 'Demo User',
        role: 'ADMIN',
        organization_id: demoOrgId,
        password_hash: 'demo-hash', // Not used for demo token auth
      });
      log.info('Created demo user');
    }

    return { userId: demoUserId, organizationId: demoOrgId };
  } catch (error: any) {
    log.warn('Failed to ensure demo user exists', { error: error.message });
    // Return the IDs anyway - they might exist but query failed
    return { userId: demoUserId, organizationId: demoOrgId };
  }
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
    const { userId, organizationId } = await ensureDemoUserExists();
    (req as AuthRequest).user = {
      userId,
      email: 'demo@pharmaos.com',
      role: 'ADMIN',
      organizationId,
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
