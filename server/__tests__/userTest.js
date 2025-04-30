const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');

// Set JWT_SECRET untuk testing
process.env.JWT_SECRET = 'test-secret-key';

// Mock Google OAuth
jest.mock('google-auth-library');

describe('User API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'test@user.com',
          password: 'password123',
          role: 'user',
          phone: '+6281234567890'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail to register with invalid email', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
          role: 'user',
          phone: '+6281234567890'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail to register with duplicate email', async () => {
      await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'duplicate@user.com',
          password: 'password123',
          role: 'user',
          phone: '+6281234567890'
        });

      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'Another User',
          email: 'duplicate@user.com',
          password: 'password123',
          role: 'user',
          phone: '+6280987654321'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/login', () => {
    it('should login with correct credentials', async () => {
      const password = await bcrypt.hash('password123', 10);
      await sequelize.models.User.create({
        name: 'Login User',
        email: 'login@user.com',
        password,
        role: 'user',
        phone: '+6281234567890'
      });

      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'login@user.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'login@user.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should fail to login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@user.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /api/google-login', () => {
    beforeEach(() => {
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue({
        getPayload: () => ({
          name: 'Google User',
          email: 'google@user.com'
        })
      });
    });

    it('should login with valid Google token', async () => {
      const res = await request(app)
        .post('/api/google-login')
        .send({ token: 'mock-google-token' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should create new user if Google email does not exist', async () => {
      const res = await request(app)
        .post('/api/google-login')
        .send({ token: 'mock-google-token' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');

      const user = await sequelize.models.User.findOne({ where: { email: 'google@user.com' } });
      expect(user).not.toBeNull();
      expect(user.name).toEqual('Google User');
      expect(user.role).toEqual('user');
    });

    it('should fail with invalid Google token', async () => {
      OAuth2Client.prototype.verifyIdToken = jest.fn().mockRejectedValue(new Error('Invalid token'));
      const res = await request(app)
        .post('/api/google-login')
        .send({ token: 'invalid-google-token' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid token');
    });
  });
});