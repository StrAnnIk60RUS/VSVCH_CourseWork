import { Router } from 'express';
import { col } from 'sequelize';
import { z } from 'zod';
import { Certificate, Course, Enrollment } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { hasRole } from '../utils/permissions.js';
import { getLeadTeachersByCourseIds } from '../services/courseStaffService.js';

const router = Router();

const createSchema = z.object({
  courseId: z.string(),
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    const { courseId } = parsed.data;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    try {
      const enrollment = await Enrollment.create({
        userId: req.authUser.id,
        courseId,
        progress: 0,
      });
      return res.status(201).json(enrollment.get({ plain: true }));
    } catch (err) {
      if (err && typeof err === 'object' && 'name' in err && err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Вы уже записаны на курс' });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await Enrollment.findAll({
      where: { userId: req.authUser.id },
      include: [
        { model: Course, as: 'course' },
        { model: Certificate, as: 'certificate' },
      ],
      order: [[col('Enrollment.created_at'), 'DESC']],
    });
    const plainRows = rows.map((row) => row.get({ plain: true }));
    const leadByCourseId = await getLeadTeachersByCourseIds(plainRows.map((row) => row.courseId));
    const items = plainRows.map((plain) => ({
      id: plain.id,
      courseId: plain.courseId,
      progress: plain.progress,
      enrolledAt: plain.createdAt,
      course: plain.course,
      leadTeacher: leadByCourseId[plain.courseId]?.get({ plain: true }) ?? null,
      certificate: plain.certificate
        ? {
            id: plain.certificate.id,
            documentNumber: plain.certificate.documentNumber,
            issuedAt: plain.certificate.issuedAt,
          }
        : null,
    }));
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.delete('/:courseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const deleted = await Enrollment.destroy({ where: { userId: req.authUser.id, courseId } });
    if (!deleted) {
      return res.status(404).json({ error: 'Запись на курс не найдена' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
