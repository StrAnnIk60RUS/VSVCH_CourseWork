## Route implementation status

`auth.js` is **fully implemented** (`POST /register`, `POST /login`, `GET /me` under `/api/auth`). See [docs/FUNCTIONAL_REQUIREMENTS.md](../../../docs/FUNCTIONAL_REQUIREMENTS.md) §4.1.

`courses.js` implements the public catalog and course card: `GET /api/courses` (FR-COURSE-01) and `GET /api/courses/:courseId` (FR-COURSE-02). See [docs/FUNCTIONAL_REQUIREMENTS.md](../../../docs/FUNCTIONAL_REQUIREMENTS.md) §4.3.

The route modules below are also implemented and no longer stubs:

- `users.js`: `GET /api/users`, `PUT /api/users`
- `lessons.js`: `GET/POST /api/courses/:courseId/lessons`, `PUT/DELETE /api/courses/:courseId/lessons/:lessonId`
- `exercises.js`: `GET/POST /api/courses/:courseId/lessons/:lessonId/exercises`, `PUT/DELETE /api/courses/:courseId/lessons/:lessonId/exercises/:exerciseId`
- `enrollments.js`: `POST /api/enrollments`, `GET /api/enrollments`, `DELETE /api/enrollments/:courseId`, `POST /api/enrollments/complete-lesson/:courseId/:lessonId`
- `submissions.js`: `POST /api/submissions`, `GET /api/submissions`
- `favorites.js`: `GET/POST /api/favorites`, `DELETE /api/favorites/:courseId`
- `reminders.js`: `GET/POST /api/reminders`, `PUT/DELETE /api/reminders/:id`
- `teacher.js`: `GET /api/teacher/courses`, `GET /api/teacher/courses/:courseId/students`, `GET /api/teacher/courses/:courseId/students.csv`
- `reportsHttp.js`: student/course PDF+DOCX reports and `POST /api/reports/send-email` with SMTP demo mode fallback

Status note:

- this repository currently uses route-level handlers directly (without a dedicated `controllers/` and `services/` split)
- as a next refinement step, handlers can be extracted into service/domain layers and covered with integration tests
