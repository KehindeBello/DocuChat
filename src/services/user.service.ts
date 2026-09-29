import prisma from "../lib/db";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }})
  if (!user) throw new Error (`User not found`);

  return {
    email: user.email,
    name: user.name,
    role: user.role
  }
}