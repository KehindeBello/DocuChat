import prisma from '../../src/lib/db';
import bcrypt from 'bcryptjs'

export async function resetDatabase() {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(overrides = {}) {
  const hash = await bcrypt.hash('#Password1', 4)
  return prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: hash,
      ...overrides
    }
  });
}