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
