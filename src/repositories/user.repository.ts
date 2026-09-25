import { prisma } from '../lib/db'

export const userRepository = { 
  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async create(data: {
    name: string,
    email: string,
    passwordHash: string;
  }) {
    return prisma.user.create({ data })
  },

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  }
}