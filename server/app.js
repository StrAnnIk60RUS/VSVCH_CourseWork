import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import lessonsRoutes from './routes/lessons.js';
import exercisesRoutes from './routes/exercises.js';
import enrollmentsRoutes from './routes/enrollments.js';
import submissionsRoutes from './routes/submissions.js';
import favoritesRoutes from './routes/favorites.js';
import remindersRoutes from './routes/reminders.js';
import teacherRoutes from './routes/teacher.js';
import reportsRoutes from './routes/reportsHttp.js';
import usersRoutes from './routes/users.js';

export function createApp() {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/courses', coursesRoutes);
  app.use('/api/courses/:courseId/lessons', lessonsRoutes);
  app.use('/api/courses/:courseId/lessons/:lessonId/exercises', exercisesRoutes);
  app.use('/api/enrollments', enrollmentsRoutes);
  app.use('/api/submissions', submissionsRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/reminders', remindersRoutes);
  app.use('/api/teacher', teacherRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/users', usersRoutes);

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  });

  return app;
}
