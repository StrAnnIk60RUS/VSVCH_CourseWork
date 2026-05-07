import { Router } from 'express';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { canManageCourse, hasRole } from '../utils/permissions.js';
import { buildPdfBuffer } from '../utils/pdf.js';
import {
  getCourseAnalyticsReport,
  getCourseSummaryReport,
  getStudentProgressReport,
} from '../services/reportService.js';

const router = Router();
const FORCED_REPORT_RECIPIENT = 'slavick.voronoff2016@gmail.com';

const SUPPORTED_LANGS = ['ru', 'en'];

const REPORT_I18N = {
  ru: {
    studentProgressTitle: 'Отчёт о прогрессе студента',
    courseSummaryTitle: 'Сводный отчёт по курсу',
    name: 'Имя',
    email: 'Email',
    period: 'Период',
    course: 'Курс',
    language: 'Язык',
    level: 'Уровень',
    students: 'Студентов',
    avgProgress: 'Средний прогресс',
    progress: 'прогресс',
    score: 'оценка',
    reportSubject: 'Отчёт VSVH',
    reportBody: 'Во вложении запрошенный отчёт.',
  },
  en: {
    studentProgressTitle: 'Student Progress Report',
    courseSummaryTitle: 'Course Summary Report',
    name: 'Name',
    email: 'Email',
    period: 'Period',
    course: 'Course',
    language: 'Language',
    level: 'Level',
    students: 'Students',
    avgProgress: 'Avg progress',
    progress: 'progress',
    score: 'score',
    reportSubject: 'VSVH report',
    reportBody: 'The requested report is attached.',
  },
};

function normalizeLanguage(input) {
  if (!input || typeof input !== 'string') return null;
  const normalized = input.trim().toLowerCase().split(/[;, -]/)[0];
  return SUPPORTED_LANGS.includes(normalized) ? normalized : null;
}

function resolveRequestLanguage(req) {
  const explicitLang = normalizeLanguage(req.query.lang) ?? normalizeLanguage(req.body?.lang);
  if (explicitLang) return explicitLang;
  return normalizeLanguage(req.headers['accept-language']) ?? 'en';
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

async function sendEmailWithAttachment(email, filename, contentType, attachmentBuffer, locale) {
  const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
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
    subject: t.reportSubject,
    text: t.reportBody,
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
    const locale = resolveRequestLanguage(req);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const year = new Date().getFullYear();
    const lines = [
      t.studentProgressTitle,
      `${t.name}: ${report.user.name}`,
      `${t.email}: ${report.user.email}`,
      `${t.period}: ${year}`,
      '',
      ...report.items.map((x) => `${x.courseTitle}: ${t.progress} ${x.progress}% | ${t.score} ${x.score}`),
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
    const locale = resolveRequestLanguage(req);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const year = new Date().getFullYear();
    const lines = [
      t.studentProgressTitle,
      `${t.name}: ${report.user.name}`,
      `${t.email}: ${report.user.email}`,
      `${t.period}: ${year}`,
      '',
      ...report.items.map((x) => `${x.courseTitle}: ${t.progress} ${x.progress}% | ${t.score} ${x.score}`),
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
    const locale = resolveRequestLanguage(req);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const lines = [
      t.courseSummaryTitle,
      `${t.course}: ${report.course.title}`,
      `${t.language}: ${report.course.language}`,
      `${t.level}: ${report.course.level}`,
      `${t.students}: ${report.studentCount}`,
      `${t.avgProgress}: ${report.avgProgress}%`,
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
    const locale = resolveRequestLanguage(req);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const lines = [
      t.courseSummaryTitle,
      `${t.course}: ${report.course.title}`,
      `${t.language}: ${report.course.language}`,
      `${t.level}: ${report.course.level}`,
      `${t.students}: ${report.studentCount}`,
      `${t.avgProgress}: ${report.avgProgress}%`,
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
  email: z.string().email().optional(),
  type: z.enum(['student-progress', 'course-summary']),
  format: z.enum(['pdf', 'docx']),
  courseId: z.string().optional(),
  lang: z.enum(['ru', 'en']).optional(),
});

router.get('/teacher-analytics', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId, periodDays } = req.query;
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ error: 'Необходимо указать courseId' });
    }
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const parsedDays = typeof periodDays === 'string' ? Number(periodDays) : 30;
    const analytics = await getCourseAnalyticsReport(courseId, Number.isFinite(parsedDays) ? parsedDays : 30);
    if (!analytics) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    return res.status(200).json(analytics);
  } catch (err) {
    next(err);
  }
});

router.post('/send-email', requireAuth, async (req, res, next) => {
  try {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные параметры отправки' });
    }
    const { type, format, courseId } = parsed.data;
    const locale = resolveRequestLanguage(req);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
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
        t.studentProgressTitle,
        `${t.name}: ${report.user.name}`,
        `${t.email}: ${report.user.email}`,
        ...report.items.map((x) => `${x.courseTitle}: ${t.progress} ${x.progress}% | ${t.score} ${x.score}`),
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
        t.courseSummaryTitle,
        `${t.course}: ${report.course.title}`,
        `${t.students}: ${report.studentCount}`,
        `${t.avgProgress}: ${report.avgProgress}%`,
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
    const targetEmail = FORCED_REPORT_RECIPIENT;
    if (!targetEmail) {
      return res.status(400).json({ error: 'Не удалось определить e-mail получателя' });
    }
    const result = await sendEmailWithAttachment(targetEmail, filename, contentType, buffer, locale);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
