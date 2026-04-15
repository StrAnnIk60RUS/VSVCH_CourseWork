import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { Op } from 'sequelize';
import {
  Course,
  Enrollment,
  Exercise,
  Lesson,
  Submission,
  User,
} from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { canManageCourse, hasRole } from '../utils/permissions.js';

const router = Router();

function buildPdfBuffer(lines) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    /** @type {Buffer[]} */
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    lines.forEach((line, idx) => {
      doc.fontSize(idx === 0 ? 16 : 11).text(line);
      doc.moveDown(0.5);
    });
    doc.end();
  });
}

async function buildDocxBuffer(lines) {
  const doc = new Document({
    sections: [
      {
        children: lines.map((line, idx) =>
          new Paragraph({
            children: [new TextRun({ text: line, bold: idx === 0 })],
            spacing: { after: 160 },
          }),
        ),
      },
    ],
  });
  return Packer.toBuffer(doc);
}

async function getStudentProgressReport(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }
  const enrollments = await Enrollment.findAll({
    where: { userId },
    include: [{ model: Course, as: 'course' }],
    order: [['createdAt', 'DESC']],
  });
  const scores = await Submission.findAll({
    where: { userId },
    attributes: ['score'],
    include: [
      {
        model: Exercise,
        as: 'exercise',
        attributes: ['lessonId'],
        include: [{ model: Lesson, as: 'lesson', attributes: ['courseId'] }],
      },
    ],
  });
  /** @type {Record<string, number>} */
  const scoreMap = {};
  for (const row of scores) {
    const courseId = row.exercise?.lesson?.courseId;
    if (!courseId) {
      continue;
    }
    scoreMap[courseId] = (scoreMap[courseId] || 0) + (Number(row.score) || 0);
  }
  return {
    user: user.get({ plain: true }),
    items: enrollments.map((x) => ({
      courseId: x.courseId,
      courseTitle: x.course?.title ?? 'Unknown',
      progress: x.progress,
      score: scoreMap[x.courseId] ?? 0,
    })),
  };
}

async function getCourseSummaryReport(courseId) {
  const course = await Course.findByPk(courseId);
  if (!course) {
    return null;
  }
  const enrollments = await Enrollment.findAll({
    where: { courseId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });
  const userIds = enrollments.map((x) => x.userId);
  const activityRows =
    userIds.length > 0
      ? await Submission.findAll({
          where: { userId: { [Op.in]: userIds } },
          attributes: ['userId', 'createdAt'],
          order: [['createdAt', 'DESC']],
        })
      : [];
  /** @type {Record<string, string>} */
  const lastByUser = {};
  for (const row of activityRows) {
    if (!lastByUser[row.userId]) {
      lastByUser[row.userId] = row.createdAt;
    }
  }
  const students = enrollments.map((enr) => ({
    userId: enr.userId,
    name: enr.user.name,
    email: enr.user.email,
    progress: enr.progress,
    lastActivity: new Date(lastByUser[enr.userId] || enr.createdAt).toISOString().slice(0, 10),
  }));
  const avgProgress =
    students.length > 0
      ? Math.round(students.reduce((acc, x) => acc + Number(x.progress || 0), 0) / students.length)
      : 0;
  return {
    course: course.get({ plain: true }),
    students,
    studentCount: students.length,
    avgProgress,
  };
}

async function sendEmailWithAttachment(email, filename, contentType, attachmentBuffer) {
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!hasSmtp) {
    return { demo: true, message: 'SMTP не настроен, письмо записано в demo-режиме' };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'noreply@vsvh.local',
    to: email,
    subject: 'VSVH report',
    text: 'Во вложении запрошенный отчёт.',
    attachments: [{ filename, content: attachmentBuffer, contentType }],
  });
  return { sent: true };
}

router.get('/student-progress.pdf', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const report = await getStudentProgressReport(req.authUser.id);
    if (!report) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const year = new Date().getFullYear();
    const lines = [
      'Student Progress Report',
      `Name: ${report.user.name}`,
      `Email: ${report.user.email}`,
      `Period: ${year}`,
      '',
      ...report.items.map((x) => `${x.courseTitle}: progress ${x.progress}% | score ${x.score}`),
    ];
    const buffer = await buildPdfBuffer(lines);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="student-progress.pdf"');
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
});

router.get('/student-progress.docx', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const report = await getStudentProgressReport(req.authUser.id);
    if (!report) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const year = new Date().getFullYear();
    const lines = [
      'Student Progress Report',
      `Name: ${report.user.name}`,
      `Email: ${report.user.email}`,
      `Period: ${year}`,
      '',
      ...report.items.map((x) => `${x.courseTitle}: progress ${x.progress}% | score ${x.score}`),
    ];
    const buffer = await buildDocxBuffer(lines);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="student-progress.docx"');
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
});

router.get('/course-summary.pdf', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.query;
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ error: 'Необходимо указать courseId' });
    }
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const report = await getCourseSummaryReport(courseId);
    if (!report) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const lines = [
      'Course Summary Report',
      `Course: ${report.course.title}`,
      `Language: ${report.course.language}`,
      `Level: ${report.course.level}`,
      `Students: ${report.studentCount}`,
      `Avg progress: ${report.avgProgress}%`,
      '',
      ...report.students.map((x) => `${x.name} | ${x.email} | ${x.progress}% | ${x.lastActivity}`),
    ];
    const buffer = await buildPdfBuffer(lines);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="course-summary.pdf"');
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
});

router.get('/course-summary.docx', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.query;
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ error: 'Необходимо указать courseId' });
    }
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const report = await getCourseSummaryReport(courseId);
    if (!report) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const lines = [
      'Course Summary Report',
      `Course: ${report.course.title}`,
      `Language: ${report.course.language}`,
      `Level: ${report.course.level}`,
      `Students: ${report.studentCount}`,
      `Avg progress: ${report.avgProgress}%`,
      '',
      ...report.students.map((x) => `${x.name} | ${x.email} | ${x.progress}% | ${x.lastActivity}`),
    ];
    const buffer = await buildDocxBuffer(lines);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="course-summary.docx"');
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
});

const sendSchema = z.object({
  email: z.string().email(),
  type: z.enum(['student-progress', 'course-summary']),
  format: z.enum(['pdf', 'docx']),
  courseId: z.string().optional(),
});

router.post('/send-email', requireAuth, async (req, res, next) => {
  try {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные параметры отправки' });
    }
    const { email, type, format, courseId } = parsed.data;
    let filename;
    let contentType;
    let buffer;
    if (type === 'student-progress') {
      if (!hasRole(req, 'STUDENT')) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }
      const report = await getStudentProgressReport(req.authUser.id);
      if (!report) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      const lines = [
        'Student Progress Report',
        `Name: ${report.user.name}`,
        `Email: ${report.user.email}`,
        ...report.items.map((x) => `${x.courseTitle}: progress ${x.progress}% | score ${x.score}`),
      ];
      if (format === 'pdf') {
        filename = 'student-progress.pdf';
        contentType = 'application/pdf';
        buffer = await buildPdfBuffer(lines);
      } else {
        filename = 'student-progress.docx';
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        buffer = await buildDocxBuffer(lines);
      }
    } else {
      if (!hasRole(req, 'TEACHER')) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }
      if (!courseId) {
        return res.status(400).json({ error: 'Для course-summary требуется courseId' });
      }
      const allowed = await canManageCourse(courseId, req.authUser.id);
      if (!allowed) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }
      const report = await getCourseSummaryReport(courseId);
      if (!report) {
        return res.status(404).json({ error: 'Курс не найден' });
      }
      const lines = [
        'Course Summary Report',
        `Course: ${report.course.title}`,
        `Students: ${report.studentCount}`,
        `Avg progress: ${report.avgProgress}%`,
        ...report.students.map((x) => `${x.name} | ${x.email} | ${x.progress}% | ${x.lastActivity}`),
      ];
      if (format === 'pdf') {
        filename = 'course-summary.pdf';
        contentType = 'application/pdf';
        buffer = await buildPdfBuffer(lines);
      } else {
        filename = 'course-summary.docx';
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        buffer = await buildDocxBuffer(lines);
      }
    }
    const result = await sendEmailWithAttachment(email, filename, contentType, buffer);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
