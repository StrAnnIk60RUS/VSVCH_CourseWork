import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { col } from 'sequelize';
import { z } from 'zod';
import { Certificate, Course, Enrollment, User } from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { hasRole } from '../utils/permissions.js';
import { buildPdfBuffer } from '../utils/pdf.js';

const router = Router();

const issueSchema = z.object({
  courseId: z.string(),
});

function generateDocumentNumber() {
  const year = new Date().getFullYear();
  const tail = randomBytes(4).toString('hex').toUpperCase();
  return `VSVH-${year}-${tail}`;
}

function serializeCertificate(cert) {
  return {
    id: cert.id,
    enrollmentId: cert.enrollmentId,
    documentNumber: cert.documentNumber,
    issuedAt: cert.issuedAt,
  };
}

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const parsed = issueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    const { courseId } = parsed.data;
    const enrollment = await Enrollment.findOne({
      where: { userId: req.authUser.id, courseId },
    });
    if (!enrollment) {
      return res.status(403).json({ error: 'Сначала запишитесь на курс' });
    }
    const existing = await Certificate.findOne({ where: { enrollmentId: enrollment.id } });
    if (existing) {
      return res.status(200).json(serializeCertificate(existing));
    }
    if (enrollment.progress !== 100) {
      return res.status(409).json({ error: 'Курс еще не завершен' });
    }
    try {
      const cert = await Certificate.create({
        enrollmentId: enrollment.id,
        documentNumber: generateDocumentNumber(),
      });
      return res.status(201).json(serializeCertificate(cert));
    } catch (err) {
      if (err && typeof err === 'object' && 'name' in err && err.name === 'SequelizeUniqueConstraintError') {
        const fallback = await Certificate.findOne({ where: { enrollmentId: enrollment.id } });
        if (fallback) {
          return res.status(200).json(serializeCertificate(fallback));
        }
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const rows = await Certificate.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          required: true,
          where: { userId: req.authUser.id },
          include: [{ model: Course, as: 'course' }],
        },
      ],
      order: [[col('Certificate.issued_at'), 'DESC']],
    });
    const items = rows.map((row) => {
      const plain = row.get({ plain: true });
      return {
        id: plain.id,
        documentNumber: plain.documentNumber,
        issuedAt: plain.issuedAt,
        enrollmentId: plain.enrollmentId,
        course: plain.enrollment?.course
          ? {
              id: plain.enrollment.course.id,
              title: plain.enrollment.course.title,
              language: plain.enrollment.course.language,
              level: plain.enrollment.course.level,
            }
          : null,
      };
    });
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/pdf', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findByPk(id, {
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: Course, as: 'course' },
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          ],
        },
      ],
    });
    if (!cert || !cert.enrollment) {
      return res.status(404).json({ error: 'Сертификат не найден' });
    }
    if (cert.enrollment.userId !== req.authUser.id) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const course = cert.enrollment.course;
    const student = cert.enrollment.user;
    const issuedAt = new Date(cert.issuedAt);
    const lines = [
      'Сертификат об успешном прохождении курса',
      '',
      `Настоящий сертификат удостоверяет, что ${student?.name ?? '—'}`,
      `успешно завершил(а) курс «${course?.title ?? '—'}».`,
      '',
      `Язык: ${course?.language ?? '—'}`,
      `Уровень: ${course?.level ?? '—'}`,
      '',
      `Номер документа: ${cert.documentNumber}`,
      `Дата выдачи: ${issuedAt.toLocaleDateString('ru-RU')}`,
    ];
    const buffer = await buildPdfBuffer(lines);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="certificate-${cert.documentNumber}.pdf"`,
    );
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
});

export default router;
