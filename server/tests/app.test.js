const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.JWT_SECRET = 'testsecret';
  await mongoose.connect(uri);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Authentication flow', () => {
  test('registers and logs in a user', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'alice',
        password: 'password123',
        organizationId: 'OrgA',
        role: 'editor'
      });

    expect(registerRes.statusCode).toBe(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'alice',
        password: 'password123'
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body.user.role).toBe('editor');
  });
});

describe('Role-based upload protections', () => {
  test('viewer cannot upload videos', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'viewerUser',
        password: 'password123',
        organizationId: 'OrgB',
        role: 'viewer'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'viewerUser',
        password: 'password123'
      });

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const uploadRes = await request(app)
      .post('/api/videos/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Viewer Attempt')
      .attach('video', path.join(__dirname, 'fixtures', 'sample.mp4'));

    expect(uploadRes.statusCode).toBe(403);
    expect(uploadRes.body.message).toMatch(/insufficient/i);
  });
});

describe('Admin management endpoints', () => {
  test('admin can list and update organization members', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'adminUser',
        password: 'password123',
        organizationId: 'OrgC',
        role: 'admin'
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'teamViewer',
        password: 'password123',
        organizationId: 'OrgC',
        role: 'viewer'
      });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'adminUser',
        password: 'password123'
      });

    const token = adminLogin.body.token;
    expect(token).toBeDefined();

    const listRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body).toHaveLength(2);

    const viewerRecord = await User.findOne({ username: 'teamViewer' });
    const updateRes = await request(app)
      .patch(`/api/admin/users/${viewerRecord._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'editor' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.role).toBe('editor');
  });
});
