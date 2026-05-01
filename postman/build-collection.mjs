/**
 * Generates postman/VSVH.postman_collection.json (Collection v2.1).
 * Run: node postman/build-collection.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function tests(lines) {
  return [{ listen: 'test', script: { exec: lines, type: 'text/javascript' } }];
}

function prereq(lines) {
  return [{ listen: 'prerequest', script: { exec: lines, type: 'text/javascript' } }];
}

function req(name, method, urlRaw, opts = {}) {
  /** @type {Record<string,string>} */
  const headers = { ...(opts.headers || {}) };
  if (opts.jsonBody !== undefined || opts.rawBody !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  const headerArr = Object.entries(headers).map(([key, value]) => ({ key, value }));
  const body =
    opts.jsonBody !== undefined
      ? { mode: 'raw', raw: JSON.stringify(opts.jsonBody, null, 2), options: { raw: { language: 'json' } } }
      : opts.rawBody !== undefined
        ? { mode: 'raw', raw: opts.rawBody, options: { raw: { language: 'json' } } }
        : undefined;

  /** @type {{ raw: string, host?: string[], path?: string[] }} */
  const urlObj = urlRaw.includes('?')
    ? { raw: urlRaw }
    : {
        raw: urlRaw,
        host: ['{{baseUrl}}'],
        path: urlRaw.replace(/\{\{baseUrl\}\}\//, '').split('/').filter(Boolean),
      };
  const item = {
    name,
    request: {
      method,
      header: headerArr.length ? headerArr : [],
      body,
      url: urlObj,
    },
  };
  const events = [];
  if (opts.prerequest) events.push(...prereq(opts.prerequest));
  if (opts.test) events.push(...tests(opts.test));
  if (events.length) item.event = events;
  return item;
}

const collection = {
  info: {
    name: 'VSVH API',
    description:
      'Полное покрытие REST API VSVH (Express). Запускайте после `npm run db:migrate` и `npm run db:seed`. Сервер: `npm run dev -w server`.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    _postman_id: 'vsvh-api-collection',
  },
  variable: [{ key: 'baseUrl', value: 'http://localhost:4000' }],
  item: [],
};

collection.item.push({
  name: '0. Bootstrap',
  item: [
    req('Register QA Teacher', 'POST', '{{baseUrl}}/api/auth/register', {
      prerequest: [
        'const ts = Date.now();',
        'pm.environment.set("qaTs", String(ts));',
        'pm.environment.set("qaTeacherEmail", `qa-teacher-${ts}@example.com`);',
        'pm.environment.set("qaStudentEmail", `qa-student-${ts}@example.com`);',
        'pm.environment.set("dupRegisterEmail", pm.environment.get("qaTeacherEmail"));',
      ],
      jsonBody: {
        email: '{{qaTeacherEmail}}',
        password: '{{qaPassword}}',
        name: 'QA Teacher',
        role: 'teacher',
      },
      test: [
        'pm.test("201 Created", () => pm.response.to.have.status(201));',
        'const b = pm.response.json();',
        'pm.test("has token and user", () => {',
        '  pm.expect(b.token).to.be.a("string");',
        '  pm.expect(b.user.roles).to.include("TEACHER");',
        '});',
        'pm.environment.set("qaTeacherToken", b.token);',
        'pm.environment.set("qaTeacherId", b.user.id);',
      ],
    }),
    req('Register QA Student', 'POST', '{{baseUrl}}/api/auth/register', {
      jsonBody: {
        email: '{{qaStudentEmail}}',
        password: '{{qaPassword}}',
        name: 'QA Student',
      },
      test: [
        'pm.test("201 Created", () => pm.response.to.have.status(201));',
        'const b = pm.response.json();',
        'pm.expect(b.user.roles).to.include("STUDENT");',
        'pm.environment.set("qaStudentToken", b.token);',
        'pm.environment.set("qaStudentId", b.user.id);',
      ],
    }),
    req('Create Course A (published)', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'QA Course A',
        description: 'Bootstrap course A for API tests.',
        language: 'en',
        level: 'A1',
        published: true,
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaCourseId", pm.response.json().id);',
      ],
    }),
    req('Create Course B (published)', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'QA Course B',
        description: 'Second course for enrollment tests.',
        language: 'en',
        level: 'A2',
        published: true,
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaCourseId2", pm.response.json().id);',
      ],
    }),
    req('Create Draft Course (unpublished)', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'QA Draft Course',
        description: 'Not in public catalog.',
        language: 'fr',
        level: 'A2',
        published: false,
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaDraftCourseId", pm.response.json().id);',
      ],
    }),
    req('Create Isolate Course (no enrollment)', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'QA Isolate Course',
        description: 'For 403 submission test.',
        language: 'de',
        level: 'A1',
        published: true,
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaCourseIsolateId", pm.response.json().id);',
      ],
    }),
    req('Create Isolate Lesson', 'POST', '{{baseUrl}}/api/courses/{{qaCourseIsolateId}}/lessons', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'Isolate Lesson', content: 'x', order: 1 },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaLessonIsolateId", pm.response.json().id);',
      ],
    }),
    req('Create Isolate Exercise', 'POST', '{{baseUrl}}/api/courses/{{qaCourseIsolateId}}/lessons/{{qaLessonIsolateId}}/exercises', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'Isolate Ex',
        question: 'Say x',
        type: 'text',
        correctAnswer: 'x',
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaExerciseIsolateId", pm.response.json().id);',
      ],
    }),
    req('Create Lesson on Course A', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'Lesson 1', content: 'Hello', order: 1 },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaLessonId", pm.response.json().id);',
      ],
    }),
    req('Create Exercise on Course A', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'Main Exercise',
        question: 'Type ok',
        type: 'text',
        correctAnswer: 'ok',
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaExerciseId", pm.response.json().id);',
      ],
    }),
    req('Enroll student on Course A', 'POST', '{{baseUrl}}/api/enrollments', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: '{{qaCourseId}}' },
      test: ['pm.test("201", () => pm.response.to.have.status(201));'],
    }),
  ],
});

collection.item.push({
  name: '1. Health',
  item: [
    req('GET /api/health', 'GET', '{{baseUrl}}/api/health', {
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.test("ok true", () => pm.expect(pm.response.json()).to.eql({ ok: true }));',
      ],
    }),
  ],
});

collection.item.push({
  name: '2. Auth',
  item: [
    req('Login QA Teacher', 'POST', '{{baseUrl}}/api/auth/login', {
      jsonBody: { email: '{{qaTeacherEmail}}', password: '{{qaPassword}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().token).to.be.a("string");',
      ],
    }),
    req('Login QA Student', 'POST', '{{baseUrl}}/api/auth/login', {
      jsonBody: { email: '{{qaStudentEmail}}', password: '{{qaPassword}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('GET /api/auth/me (teacher)', 'GET', '{{baseUrl}}/api/auth/me', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'const u = pm.response.json();',
        'pm.expect(u.email).to.eql(pm.environment.get("qaTeacherEmail"));',
      ],
    }),
    req('Register missing fields -> 400', 'POST', '{{baseUrl}}/api/auth/register', {
      jsonBody: {},
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('Register invalid email -> 400', 'POST', '{{baseUrl}}/api/auth/register', {
      jsonBody: { email: 'not-an-email', password: 'x', name: 'x' },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('Register duplicate email -> 409', 'POST', '{{baseUrl}}/api/auth/register', {
      jsonBody: {
        email: '{{dupRegisterEmail}}',
        password: '{{qaPassword}}',
        name: 'Dup',
      },
      test: [
        'pm.test("409", () => pm.response.to.have.status(409));',
        'pm.expect(pm.response.json().error).to.include("существует");',
      ],
    }),
    req('Login wrong password -> 401', 'POST', '{{baseUrl}}/api/auth/login', {
      jsonBody: { email: '{{qaTeacherEmail}}', password: 'wrong-password-xyz' },
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('GET /api/auth/me without token -> 401', 'GET', '{{baseUrl}}/api/auth/me', {
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('GET /api/auth/me invalid token -> 401', 'GET', '{{baseUrl}}/api/auth/me', {
      headers: { Authorization: 'Bearer invalid.token.here' },
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
  ],
});

collection.item.push({
  name: '3. Users',
  item: [
    req('GET /api/users', 'GET', '{{baseUrl}}/api/users', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json()).to.have.property("email");',
      ],
    }),
    req('PUT /api/users name', 'PUT', '{{baseUrl}}/api/users', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { name: 'QA Student Updated' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().name).to.eql("QA Student Updated");',
      ],
    }),
    req('GET /api/users without auth -> 401', 'GET', '{{baseUrl}}/api/users', {
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('PUT /api/users empty name -> 400', 'PUT', '{{baseUrl}}/api/users', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { name: '   ' },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
  ],
});

collection.item.push({
  name: '4. Courses (public)',
  item: [
    req('GET catalog', 'GET', '{{baseUrl}}/api/courses', {
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json()).to.have.keys("items","total","page","limit");',
      ],
    }),
    req('GET catalog with filters', 'GET', '{{baseUrl}}/api/courses?language=en&level=A1&minRating=1&search=a&sort=rating&order=asc&page=1&limit=10', {
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('GET course detail', 'GET', '{{baseUrl}}/api/courses/{{qaCourseId}}', {
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().id).to.eql(pm.environment.get("qaCourseId"));',
      ],
    }),
    req('GET catalog invalid sort -> 400', 'GET', '{{baseUrl}}/api/courses?sort=invalid', {
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('GET catalog invalid minRating -> 400', 'GET', '{{baseUrl}}/api/courses?minRating=abc', {
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('GET nonexistent course -> 404', 'GET', '{{baseUrl}}/api/courses/nonexistent-course-id-xyz', {
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
    req('GET unpublished course as guest -> 404', 'GET', '{{baseUrl}}/api/courses/{{qaDraftCourseId}}', {
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
  ],
});

collection.item.push({
  name: '5. Courses CRUD',
  item: [
    req('PUT update Course A', 'PUT', '{{baseUrl}}/api/courses/{{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'QA Course A Updated' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('POST ephemeral course then DELETE', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'Ephemeral Delete Me',
        description: 'tmp',
        language: 'en',
        level: 'A1',
        published: false,
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaEphemeralCourseId", pm.response.json().id);',
      ],
    }),
    req('DELETE ephemeral course', 'DELETE', '{{baseUrl}}/api/courses/{{qaEphemeralCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('POST course as student -> 403', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        title: 'X',
        description: 'y',
        language: 'en',
        level: 'A1',
      },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('POST course without auth -> 401', 'POST', '{{baseUrl}}/api/courses', {
      jsonBody: {
        title: 'X',
        description: 'y',
        language: 'en',
        level: 'A1',
      },
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('POST course empty title -> 400', 'POST', '{{baseUrl}}/api/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: '',
        description: 'y',
        language: 'en',
        level: 'A1',
      },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('PUT seed course as QA teacher -> 403', 'PUT', '{{baseUrl}}/api/courses/{{seedCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'Hacked' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('DELETE nonexistent course -> 404', 'DELETE', '{{baseUrl}}/api/courses/nonexistent-course-id', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
  ],
});

collection.item.push({
  name: '6. Lessons',
  item: [
    req('GET lessons list', 'GET', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons', {
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().items.length).to.be.at.least(1);',
      ],
    }),
    req('POST ephemeral lesson', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'Temp Lesson', content: 'c' },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaEphemeralLessonId", pm.response.json().id);',
      ],
    }),
    req('PUT ephemeral lesson', 'PUT', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaEphemeralLessonId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'Temp Lesson Renamed' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('DELETE ephemeral lesson', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaEphemeralLessonId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('GET lessons unknown course -> 404', 'GET', '{{baseUrl}}/api/courses/unknown-course-id/lessons', {
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
    req('POST lesson without auth -> 401', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons', {
      jsonBody: { title: 'No Auth' },
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('POST lesson as student -> 403', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { title: 'Student tries' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('PUT wrong lesson id -> 404', 'PUT', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/wrong-lesson-id', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { title: 'x' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
  ],
});

collection.item.push({
  name: '7. Exercises',
  item: [
    req('GET exercises list', 'GET', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises', {
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('POST ephemeral single_choice exercise', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'Choice',
        question: 'Pick A',
        type: 'single_choice',
        payload: { options: ['A', 'B'] },
        correctAnswer: 'A',
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaEphemeralExerciseId", pm.response.json().id);',
      ],
    }),
    req('PUT ephemeral exercise', 'PUT', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises/{{qaEphemeralExerciseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { question: 'Pick B now', correctAnswer: 'B' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('DELETE ephemeral exercise', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises/{{qaEphemeralExerciseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('POST exercise empty question -> 400', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: {
        title: 'Bad',
        question: '',
        type: 'text',
      },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('POST exercise as student -> 403', 'POST', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        title: 'X',
        question: 'Y',
      },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET exercises unknown lesson -> 404', 'GET', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/bad-lesson/exercises', {
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
  ],
});

collection.item.push({
  name: '8. Enrollments',
  item: [
    req('POST enroll Course B', 'POST', '{{baseUrl}}/api/enrollments', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: '{{qaCourseId2}}' },
      test: ['pm.test("201", () => pm.response.to.have.status(201));'],
    }),
    req('GET my enrollments', 'GET', '{{baseUrl}}/api/enrollments', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().items).to.be.an("array");',
      ],
    }),
    req('POST complete lesson (Course A)', 'POST', '{{baseUrl}}/api/enrollments/complete-lesson/{{qaCourseId}}/{{qaLessonId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().ok).to.be.true;',
      ],
    }),
    req('DELETE enrollment Course B', 'DELETE', '{{baseUrl}}/api/enrollments/{{qaCourseId2}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('POST enroll as teacher -> 403', 'POST', '{{baseUrl}}/api/enrollments', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      jsonBody: { courseId: '{{qaCourseId2}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('POST enroll fake course -> 404', 'POST', '{{baseUrl}}/api/enrollments', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: 'no-such-course' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
    req('POST duplicate enrollment Course A -> 409', 'POST', '{{baseUrl}}/api/enrollments', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: '{{qaCourseId}}' },
      test: ['pm.test("409", () => pm.response.to.have.status(409));'],
    }),
    req('POST complete-lesson without enrollment -> 403', 'POST', '{{baseUrl}}/api/enrollments/complete-lesson/{{qaCourseIsolateId}}/{{qaLessonIsolateId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('DELETE enrollment not found -> 404', 'DELETE', '{{baseUrl}}/api/enrollments/no-enrollment-course', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
  ],
});

collection.item.push({
  name: '9. Submissions',
  item: [
    req('POST correct answer', 'POST', '{{baseUrl}}/api/submissions', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { exerciseId: '{{qaExerciseId}}', answer: 'ok' },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'const b = pm.response.json();',
        'pm.expect(b.correct).to.be.true;',
        'pm.expect(b.score).to.be.above(0);',
      ],
    }),
    req('POST wrong answer', 'POST', '{{baseUrl}}/api/submissions', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { exerciseId: '{{qaExerciseId}}', answer: 'wrong' },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.expect(pm.response.json().correct).to.be.false;',
      ],
    }),
    req('GET submissions history', 'GET', '{{baseUrl}}/api/submissions', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('POST submission without auth -> 401', 'POST', '{{baseUrl}}/api/submissions', {
      jsonBody: { exerciseId: '{{qaExerciseId}}', answer: 'ok' },
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('POST submission fake exercise -> 404', 'POST', '{{baseUrl}}/api/submissions', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { exerciseId: 'bad-ex-id', answer: 'ok' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
    req('POST submission not enrolled -> 403', 'POST', '{{baseUrl}}/api/submissions', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { exerciseId: '{{qaExerciseIsolateId}}', answer: 'x' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
  ],
});

collection.item.push({
  name: '10. Favorites',
  item: [
    req('POST favorite', 'POST', '{{baseUrl}}/api/favorites', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: '{{qaCourseId}}' },
      test: ['pm.test("201", () => pm.response.to.have.status(201));'],
    }),
    req('POST favorite again (idempotent)', 'POST', '{{baseUrl}}/api/favorites', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: '{{qaCourseId}}' },
      test: [
        'pm.test("201 idempotent", () => pm.response.to.have.status(201));',
        'pm.expect(pm.response.json().ok).to.be.true;',
      ],
    }),
    req('GET favorites', 'GET', '{{baseUrl}}/api/favorites', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('DELETE favorite', 'DELETE', '{{baseUrl}}/api/favorites/{{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('POST favorite fake course -> 404', 'POST', '{{baseUrl}}/api/favorites', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { courseId: 'no-course' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
    req('POST favorite without auth -> 401', 'POST', '{{baseUrl}}/api/favorites', {
      jsonBody: { courseId: '{{qaCourseId}}' },
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
  ],
});

collection.item.push({
  name: '11. Reminders',
  item: [
    req('POST reminder', 'POST', '{{baseUrl}}/api/reminders', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        title: 'Study',
        remindAt: '2030-01-15T10:00:00.000Z',
        courseId: '{{qaCourseId}}',
      },
      test: [
        'pm.test("201", () => pm.response.to.have.status(201));',
        'pm.environment.set("qaReminderId", pm.response.json().id);',
      ],
    }),
    req('GET reminders', 'GET', '{{baseUrl}}/api/reminders', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('GET reminder notifications', 'GET', '{{baseUrl}}/api/reminders/notifications', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('PUT reminder', 'PUT', '{{baseUrl}}/api/reminders/{{qaReminderId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        title: 'Study hard',
        remindAt: '2030-02-01T12:00:00.000Z',
      },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('POST reminder acknowledge', 'POST', '{{baseUrl}}/api/reminders/{{qaReminderId}}/acknowledge', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('DELETE reminder', 'DELETE', '{{baseUrl}}/api/reminders/{{qaReminderId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('POST reminder bad date -> 400', 'POST', '{{baseUrl}}/api/reminders', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        title: 'Bad',
        remindAt: 'tomorrow',
      },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('POST reminder empty title -> 400', 'POST', '{{baseUrl}}/api/reminders', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        title: '',
        remindAt: '2030-01-15T10:00:00.000Z',
      },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('PUT unknown reminder -> 404', 'PUT', '{{baseUrl}}/api/reminders/unknown-reminder-id', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: { title: 'x' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
    req('DELETE unknown reminder -> 404', 'DELETE', '{{baseUrl}}/api/reminders/unknown-reminder-id', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("404", () => pm.response.to.have.status(404));'],
    }),
  ],
});

collection.item.push({
  name: '12. Teacher',
  item: [
    req('GET teacher courses', 'GET', '{{baseUrl}}/api/teacher/courses', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('GET course students (filtered)', 'GET', '{{baseUrl}}/api/teacher/courses/{{qaCourseId}}/students?status=active&sort=progress&order=desc', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('GET students CSV', 'GET', '{{baseUrl}}/api/teacher/courses/{{qaCourseId}}/students.csv', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.headers.get("Content-Type")).to.include("text/csv");',
        'pm.expect(pm.response.text().length).to.be.above(10);',
      ],
    }),
    req('GET teacher course editor view', 'GET', '{{baseUrl}}/api/teacher/courses/{{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('GET teacher courses as student -> 403', 'GET', '{{baseUrl}}/api/teacher/courses', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET teacher students as student -> 403', 'GET', '{{baseUrl}}/api/teacher/courses/{{qaCourseId}}/students', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET teacher CSV as student -> 403', 'GET', '{{baseUrl}}/api/teacher/courses/{{qaCourseId}}/students.csv', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET teacher course as student -> 403', 'GET', '{{baseUrl}}/api/teacher/courses/{{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET teacher courses no auth -> 401', 'GET', '{{baseUrl}}/api/teacher/courses', {
      test: ['pm.test("401", () => pm.response.to.have.status(401));'],
    }),
    req('GET foreign seed course students -> 403', 'GET', '{{baseUrl}}/api/teacher/courses/{{seedCourseId}}/students', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
  ],
});

collection.item.push({
  name: '13. Reports',
  item: [
    req('GET student progress PDF', 'GET', '{{baseUrl}}/api/reports/student-progress.pdf', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.headers.get("content-type")).to.include("pdf");',
        'pm.expect(pm.response.responseSize).to.be.above(100);',
      ],
    }),
    req('GET student progress DOCX', 'GET', '{{baseUrl}}/api/reports/student-progress.docx', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.headers.get("content-type")).to.include("wordprocessingml");',
      ],
    }),
    req('GET course summary PDF', 'GET', '{{baseUrl}}/api/reports/course-summary.pdf?courseId={{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.headers.get("content-type")).to.include("pdf");',
      ],
    }),
    req('GET course summary DOCX', 'GET', '{{baseUrl}}/api/reports/course-summary.docx?courseId={{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("200", () => pm.response.to.have.status(200));'],
    }),
    req('POST send-email student progress', 'POST', '{{baseUrl}}/api/reports/send-email', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        email: 'student@example.com',
        type: 'student-progress',
        format: 'pdf',
      },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'const b = pm.response.json();',
        'pm.expect(b.demo === true || b.sent === true).to.be.true;',
      ],
    }),
    req('GET student PDF as teacher -> 403', 'GET', '{{baseUrl}}/api/reports/student-progress.pdf', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET course summary PDF missing courseId -> 400', 'GET', '{{baseUrl}}/api/reports/course-summary.pdf', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
    req('GET course summary PDF as student -> 403', 'GET', '{{baseUrl}}/api/reports/course-summary.pdf?courseId={{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('GET course summary PDF foreign course -> 403', 'GET', '{{baseUrl}}/api/reports/course-summary.pdf?courseId={{seedCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("403", () => pm.response.to.have.status(403));'],
    }),
    req('POST send-email invalid -> 400', 'POST', '{{baseUrl}}/api/reports/send-email', {
      headers: { Authorization: 'Bearer {{qaStudentToken}}' },
      jsonBody: {
        email: 'not-email',
        type: 'student-progress',
        format: 'pdf',
      },
      test: ['pm.test("400", () => pm.response.to.have.status(400));'],
    }),
  ],
});

collection.item.push({
  name: '14. Seed smoke',
  item: [
    req('Login seed teacher', 'POST', '{{baseUrl}}/api/auth/login', {
      jsonBody: {
        email: '{{seedTeacherEmail}}',
        password: '{{seedTeacherPassword}}',
      },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'const b = pm.response.json();',
        'pm.expect(b.user.roles).to.include("TEACHER");',
        'pm.environment.set("seedTeacherToken", b.token);',
      ],
    }),
    req('Login seed student', 'POST', '{{baseUrl}}/api/auth/login', {
      jsonBody: {
        email: '{{seedStudentEmail}}',
        password: '{{seedStudentPassword}}',
      },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().user.roles).to.include("STUDENT");',
        'pm.environment.set("seedStudentToken", pm.response.json().token);',
      ],
    }),
    req('GET seed teacher courses non-empty', 'GET', '{{baseUrl}}/api/teacher/courses', {
      headers: { Authorization: 'Bearer {{seedTeacherToken}}' },
      test: [
        'pm.test("200", () => pm.response.to.have.status(200));',
        'pm.expect(pm.response.json().items.length).to.be.above(0);',
      ],
    }),
  ],
});

collection.item.push({
  name: '15. Cleanup',
  item: [
    req('DELETE main exercise', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}/exercises/{{qaExerciseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE isolate exercise', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseIsolateId}}/lessons/{{qaLessonIsolateId}}/exercises/{{qaExerciseIsolateId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE main lesson', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseId}}/lessons/{{qaLessonId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE isolate lesson', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseIsolateId}}/lessons/{{qaLessonIsolateId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE Course A', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE Course B', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseId2}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE Draft Course', 'DELETE', '{{baseUrl}}/api/courses/{{qaDraftCourseId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
    req('DELETE Isolate Course', 'DELETE', '{{baseUrl}}/api/courses/{{qaCourseIsolateId}}', {
      headers: { Authorization: 'Bearer {{qaTeacherToken}}' },
      test: ['pm.test("204", () => pm.response.to.have.status(204));'],
    }),
  ],
});

const outPath = path.join(__dirname, 'VSVH.postman_collection.json');
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Wrote', outPath);
