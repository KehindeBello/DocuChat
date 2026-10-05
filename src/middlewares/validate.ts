import { z, ZodError } from 'zod'; 
import { Request, Response, NextFunction } from 'express';

export function validate<T extends z.ZodType<{ body?: any; query?: any; params?: any }>>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => { 
    const result = schema.safeParse({ 
      body: req.body ?? {}, 
      query: req.query ?? {}, 
      params: req.params ?? {}, 
    }); 
 
    if (!result.success) { 
      const errors = result.error as ZodError;
 
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Request validation failed', 
          details: errors, 
        }, 
      }); 
    }
     const { body, query, params } = result.data;

    if (body !== undefined) req.body = body;
    if (params !== undefined) req.params = params;

    if (query !== undefined) {
      Object.defineProperty(req, 'query', {
        value: query,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } 
 
    // // Replace req properties with validated (and transformed) data 
    // req.body = result.data.body && req.body; 
    // req.query = result.data.query && req.query; 
    // req.params = result.data.params && req.params; 
 
    next(); 
  }; 
} 