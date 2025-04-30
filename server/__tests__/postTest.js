const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let authToken;
let userId;

beforeAll(async () => {
  // Set JWT_SECRET untuk testing
  process.env.JWT_SECRET = 'test-secret-key';
  
  await sequelize.sync({ force: true });
  
  // Buat user untuk testing
  const password = await bcrypt.hash('testpassword', 10);
  const user = await sequelize.models.User.create({
    name: 'Test Driver',
    email: 'driver@test.com',
    password: password,
    role: 'driver',
    phone: '+6281234567890'
  });
  userId = user.id;
  
  // Generate token untuk testing
  authToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Post API', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        truckType: 'Box',
        maxWeight: 1000,
        origin: 'Jakarta',
        destination: 'Bandung',
        availableDate: '2025-05-01',
        availableTime: '10:00',
        shippingCost: 500000
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
  
  it('should get all posts', async () => {
    const res = await request(app)
      .get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  it('should get post by id', async () => {
    // Buat post terlebih dahulu
    const post = await sequelize.models.Post.create({
      truckType: 'Pickup',
      maxWeight: 500,
      origin: 'Surabaya',
      destination: 'Malang',
      availableDate: '2025-05-02',
      availableTime: '14:00',
      shippingCost: 350000,
      driverId: userId  // Changed from UserId to driverId
    });
    
    const res = await request(app)
      .get(`/api/posts/${post.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', post.id);
  });
  
  it('should fail to create post without authentication', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        truckType: 'Box',
        maxWeight: 1000,
        origin: 'Jakarta',
        destination: 'Bandung',
        availableDate: '2025-05-01',
        availableTime: '10:00',
        shippingCost: 500000
      });
    expect(res.statusCode).toEqual(401);
  });
});