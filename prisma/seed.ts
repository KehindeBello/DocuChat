import prisma from '../src/lib/db';
import { UserUncheckedCreateInput } from '../src/generated/prisma/models';
import { hashPassword } from '../src/lib/password'

async function seed() {
  const users: UserUncheckedCreateInput[] = [
    {
    name: 'Kehinde',
    role: 'ADMIN',
    email: 'kehinde@example.com',
    passwordHash: 'password'
    },
    {
    name: 'Taiwo',
    role: 'USER',
    email: 'taiwo@example.com',
    passwordHash: 'password'
    },
    {
    name: 'Idowu',
    role: 'USER',
    email: 'idowu@example.com',
    passwordHash: 'password'
    }
  ]

  await prisma.user.deleteMany()
  for (const user of users ) {
    user.passwordHash = await hashPassword(user.passwordHash)
    await prisma.user.create({data: user})
  }

  console.log(`${users.length} users seeded into the DB`)
  process.exit();
}

seed()