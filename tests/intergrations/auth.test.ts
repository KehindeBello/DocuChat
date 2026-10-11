import { describe, beforeEach, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetDatabase, createTestUser } from '../helpers/setup';

describe('POST /api/v1/auth/register', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'new@example.com',
        name: 'newUser',
        password: 'securePass1'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('new@example.com')
    expect(res.body.data).not.toHaveProperty('passwordHash');
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'newExample',
        name: 'newUser',
        password: 'securePass'
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // returns 409 for duplicate email
  it('returns 409 for duplicate email', async () => {
    await createTestUser()

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: '#Password1'
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  })
})

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await resetDatabase();
    await createTestUser({ email: 'loginuser@example.com'})
  });

  it('returns tokens for valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'loginUser@example.com',
        password: '#Password1'
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.email).toBe('loginuser@example.com');
  });

  it('returns 400 for wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password'
    });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'logintest@example.com',
        password: 'wrongPassword'
    });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});

describe('Protected routes', () => {
  let accessToken: string;
  beforeEach(async () => {
    await resetDatabase();
    await createTestUser({ email: 'protected@example.com'})

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'protected@example.com',
        password: '#Password1'
    });

    accessToken = login.body.data.accessToken;
  });

  it(`returns 401 without a token`, async () => {
    const res = await request(app)
      .get('/api/v1/document')

    expect(res.status).toBe(401);
  });

  it(`returns 200 with a valid token`, async () => {
    const res = await request(app)
      .get('/api/v1/document')
      .set('Authorization', `Bearer ${accessToken}`);
    
    expect(res.status).toBe(200)
  });
});