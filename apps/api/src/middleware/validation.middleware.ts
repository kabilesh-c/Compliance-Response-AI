import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';

/**
 * Middleware factory that validates request body against a Zod schema.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}

// ── Schemas ──

export const searchSchema = z.object({
  query: z.string().min(1, 'Query is required').max(2000, 'Query too long'),
  top_k: z.number().int().min(1).max(50).optional(),
  similarity_threshold: z.number().min(0).max(1).optional(),
});
