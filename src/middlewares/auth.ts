import { Request, Response, NextFunction, request } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { Role } from "../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string, role: Role }
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {

  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = headers.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = verifyAccessToken(token);
    if(payload.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' })
    }

    // Attach user to request context
    req.user = { id: payload.sub, role: payload.role }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token '})
  }
}

export function authorize(...allowedRules: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ error: 'Access Denied, No Role Provided'})
    }

    if (!allowedRules.includes(userRole)) {
      return res.status(403).json({ error: 'Access Denied, Insufficent Permissions'})
    }

    next();
  }
}