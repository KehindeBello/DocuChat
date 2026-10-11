import { beforeEach, describe, expect, it, vi } from 'vitest'
import prisma from "../../lib/db";
import * as authService from '../auth.service'
import { hashPassword } from '../../lib/password';

// mock prima clinet
vi.mock('../../lib/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: { 
      create: vi.fn(),
      findUnique: vi.fn(), 
      delete: vi.fn(), 
      deleteMany: vi.fn(),
    },
  }
}));

// mock events
vi.mock('../../lib/events', () => ({
  appEvents: { emit: vi.fn(), on: vi.fn() }
}));


describe('auth.service.register', () => {
  beforeEach( () => vi.clearAllMocks())

  it('create a user with a hashed password', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({
      id: 'uuid-1',
      name: 'test user',
      email: 'test@example.com',
      passwordHash: '$2b$12$......'
    });

    const result = await authService.register({
      email: 'test@example.com',
      name: 'Test Name',
      password: 'password',
    })

    expect(prisma.user.findUnique).toHaveBeenCalled()
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
        name: 'Test Name',
        passwordHash: expect.stringMatching(/^\$2[aby]\$/)
      })
    })
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('throws ConflictError if email exists', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing'});
    await expect(authService.register({
      email: 'taken@example.com',
      name: 'Taken User',
      password: 'password',
    })).rejects.toThrow('Email already exists')
  });
});

// describe auth service login
describe('auth.service.login', () => {
  beforeEach(() => vi.clearAllMocks())

  it('it return token for valid credentials', async () => {
    const passwordHash = await hashPassword('password');

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'uuid-1',
      name: 'test user',
      email: 'test@example.com',
      passwordHash: passwordHash,
      isActive: true
    });

    const result = await authService.loginUser({
      email: 'test@example.com',
      password: 'password'
    });

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.email).toEqual('test@example.com');
  });

  it('it throws for wrong password', async () => {
    const passwordHash = await hashPassword('securePass');

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'uuid-1',
      name: 'test user',
      email: 'test@example.com',
      passwordHash: passwordHash,
      isActive: true
    });

    await expect(authService.loginUser({
      email: 'test@example.com',
      password: 'password'
    })).rejects.toThrow('Invalid Credentials');
  });

  it('throws for non existent user', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);

    await expect(authService.loginUser({
      email: 'test@example.com',
      password: 'password'
    })).rejects.toThrow('Invalid Credentials')
  })
})