import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('GET /api/health returns ok', async () => {
  const app = createApp();
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
});

test('GET /api/teacher/courses without token returns 401', async () => {
  const app = createApp();
  const response = await request(app).get('/api/teacher/courses');
  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Требуется авторизация');
});

test(
  'teacher flow: register, create course, list teacher courses, download course summary PDF',
  { timeout: 30_000 },
  async () => {
    const app = createApp();
    const email = `it-teacher-${Date.now()}@example.com`;
    const reg = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
      name: 'Integration Teacher',
      role: 'teacher',
    });
    assert.equal(reg.status, 201, reg.body?.error ?? JSON.stringify(reg.body));
    const { token } = reg.body;
    assert.ok(typeof token === 'string' && token.length > 10);

    const courseRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Integration Course',
        description: 'Created by integration test.',
        language: 'en',
        level: 'A1',
      });
    assert.equal(courseRes.status, 201, courseRes.body?.error ?? JSON.stringify(courseRes.body));
    const courseId = courseRes.body.id;
    assert.ok(courseId);

    const list = await request(app).get('/api/teacher/courses').set('Authorization', `Bearer ${token}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body.items));
    assert.ok(list.body.items.some((c) => c.id === courseId));

    const pdf = await request(app)
      .get('/api/reports/course-summary.pdf')
      .query({ courseId })
      .set('Authorization', `Bearer ${token}`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers['content-type'], 'application/pdf');
    assert.ok(Buffer.isBuffer(pdf.body) ? pdf.body.length > 100 : pdf.body.byteLength > 100);
  },
);

test(
  'student flow: register and download student progress PDF',
  { timeout: 30_000 },
  async () => {
    const app = createApp();
    const email = `it-student-${Date.now()}@example.com`;
    const reg = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
      name: 'Integration Student',
    });
    assert.equal(reg.status, 201, reg.body?.error ?? JSON.stringify(reg.body));
    const { token } = reg.body;

    const pdf = await request(app).get('/api/reports/student-progress.pdf').set('Authorization', `Bearer ${token}`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers['content-type'], 'application/pdf');
    assert.ok(Buffer.isBuffer(pdf.body) ? pdf.body.length > 100 : pdf.body.byteLength > 100);
  },
);
