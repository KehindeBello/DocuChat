import { config } from './config'
import jwt from 'jsonwebtoken'

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = config;

enum UserRole {
  ADMIN ='admin',
  USER = 'user'
}

interface JwtPayload {
  sub: string,
  role: UserRole,
  type: 'access' | 'refresh'
}

export function generateAccessToken(id: string, role: UserRole) {
  return jwt.sign(
    {sub: id, role, type: 'access'},
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m'}
  )
}

export function generateRefreshToken(id: string, role: UserRole) {
  return jwt.sign(
    {sub: id, role, type: 'refresh'},
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d'}
  )
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload
}