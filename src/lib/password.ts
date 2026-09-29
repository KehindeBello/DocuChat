import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12;

export async function hashPassword(plaintext: string): Promise<string> {
  return await bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(plaintextPassword: string, hashedPassowrd: string): Promise<boolean> {
  return await bcrypt.compare(plaintextPassword, hashedPassowrd)
}