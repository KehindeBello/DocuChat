import prisma from "../lib/db";
import { NotFoundError } from "../lib/errors";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }})
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    email: user.email,
    name: user.name,
    role: user.role
  }
}