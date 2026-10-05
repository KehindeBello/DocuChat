import { appEvents } from "../lib/events";
import { AUTH_EVENTS } from "../events/auth.events";
import prisma from "../lib/db";
import { logger } from "../lib/logger";
import { hashPassword, verifyPassword } from "../lib/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { RegisterInput, LoginInput,  RefreshTokenInput } from "../validators/auth.validator";
import crypto from 'crypto'

export async function register(data: RegisterInput) {
  const { name, email, password } = data;
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (existing) {
    logger.error(`User ${email} already exists`)
    throw new Error(`Email already registered`)
  }

  const passwordHash = await hashPassword(password)

  const newUser = await prisma.user.create({ data: { email: email, name: name, passwordHash: passwordHash } })

  appEvents.emit(AUTH_EVENTS.USER_REGISTERED, { name: newUser.name} )

  return { id: newUser.id, email: newUser.email, role: newUser.role }
}

export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  })

  if (!user) {
    throw new Error(`Invalid Credentails`);
  } 

  if (!user.isActive) {
    appEvents.emit(AUTH_EVENTS.USER_LOGIN_FAILED, { reason: `User ${user.email} is not active` })
    throw new Error('Invalid Credentials'); //TODO: Check this later 
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash)
  
  if(!isPasswordValid) {
    appEvents.emit(AUTH_EVENTS.USER_LOGIN_FAILED, { reason: 'Wrong Password'})
    throw new Error('Invalid Credentials')
  }

  const accessToken = await generateAccessToken(user.id, user.role)
  const refreshToken = await generateRefreshToken(user.id, user.role)

  // Store refresh token hash (never store the raw token)
  const refreshTokenHAsh = createHash(refreshToken);
  
  await prisma.refreshToken.create({ data: { token: refreshTokenHAsh, expiresAt: refreshTokenExpiry(), userId: user.id } });

  appEvents.emit(AUTH_EVENTS.USER_LOGGED_IN, { email: user.email })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role }
  }
}

export async function refreshToken(data: RefreshTokenInput) {
  const { refreshToken } = data
  //take in token - verify the token
  const payload = await verifyRefreshToken(refreshToken);
  //hash and check if exists in db
  const hashRefreshToken = createHash(refreshToken)
  const existingToken = await prisma.refreshToken.findUnique({ where: { token: hashRefreshToken } })
  
  if (!existingToken || existingToken.expiresAt < new Date()) {
    throw new Error(`Token expired or revoked`)
  }

  // Get user
  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user) throw new Error(`User not found`)

  // delete the old token
  await prisma.refreshToken.delete({ where: { token: hashRefreshToken } })

  // rotate the access and refreshToken - New ones
  const newAccessToken = generateAccessToken(user.id, user.role)
  const newRefreshToken = generateRefreshToken(user.id, user.role)
  const hashNewRefreshToken = createHash(newRefreshToken)
  // save the new refresh
  await prisma.refreshToken.create({
    data: { token: hashNewRefreshToken, expiresAt: refreshTokenExpiry(), userId: user.id }
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}

export async function logout(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken)
  const hashRefreshToken = createHash(refreshToken)
  const hashToken = await prisma.refreshToken.findUnique({ where: { userId: payload.sub, token: hashRefreshToken }})
  if (!hashToken) return;
  
  return await prisma.refreshToken.delete({ where: { token: hashRefreshToken } });
}

// UTIL FUNCTIONS
/**
 * Create a crypto hash of a token
 * @param token 
 * @returns sha256 hash of the token passed
 */
function createHash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Return expiry time for refreshToken
 * @returns 7 days from now
 */
function refreshTokenExpiry() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
}
