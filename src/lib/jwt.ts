import { config } from './config'
import jwt from 'jsonwebtoken'
import { Role } from '../generated/prisma/enums';
import { logger } from './logger';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;

interface JwtPayload {
  sub: string,
  role: Role,
  type: 'access' | 'refresh'
}

export function generateAccessToken(id: string, role: Role = Role.USER) {
  return jwt.sign(
    {sub: id, role, type: 'access'},
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m'}
  )
}

export function generateRefreshToken(id: string, role: Role = Role.USER) {
  return jwt.sign(
    {sub: id, role, type: 'refresh'},
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d'}
  )
}

function verifyToken(token: string, secret: string, expectedType: JwtPayload['type']): JwtPayload {
  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, secret) as JwtPayload;
  } catch {
    logger.error(`Unauthorized`)
    throw new Error('Unauthorized');
  }

  if (payload.type !== expectedType) {
    logger.error(`Invalid token type`)
    throw new Error('Unauthorized');
  }

  return payload;
}

export function verifyAccessToken(token: string): JwtPayload {
  return verifyToken(token, ACCESS_TOKEN_SECRET, 'access');
}

export function verifyRefreshToken(token: string): JwtPayload {
  return verifyToken(token, REFRESH_TOKEN_SECRET, 'refresh');
}