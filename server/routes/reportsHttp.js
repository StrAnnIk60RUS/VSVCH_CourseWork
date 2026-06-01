import { Router } from 'express';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
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
import { buildReportMail } from '../utils/mailTemplates.js';

const router = Router();

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
    reportTypeStudent: 'Прогресс студента',
    reportTypeCourse: 'Сводка по курсу',
    generatedAt: 'Сформирован',
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
    reportTypeStudent: 'Student progress',
    reportTypeCourse: 'Course summary',
    generatedAt: 'Generated at',
  },
};

const reportLangQuerySchema = z.object({
  lang: z.enum(['ru', 'en']).optional(),
});

const courseSummaryQuerySchema = z.object({
  courseId: z.string().trim().min(1, 'courseId is required'),
  lang: z.enum(['ru', 'en']).optional(),
});

const teacherAnalyticsQuerySchema = z.object({
  courseId: z.string().trim().min(1, 'courseId is required'),
  periodDays: z.coerce.number().int().min(1).max(365).default(30),
});

function validationError(message, parsed) {
  return {
    error: message,
    details: parsed.error.issues.map((issue) => ({
      path: issue.path.join('.') || 'query',
      message: issue.message,
    })),
  };
}

function normalizeLanguage(input) {
  if (!input || typeof input !== 'string') return null;
  const normalized = input.trim().toLowerCase().split(/[;, -]/)[0];
  return SUPPORTED_LANGS.includes(normalized) ? normalized : null;
}

function resolveRequestLanguage(req, validatedLang) {
  if (validatedLang) return validatedLang;
  return normalizeLanguage(req.headers['accept-language']) ?? 'en';
}

async function buildDocxBuffer(template) {
  const table =
    template.table && template.table.headers.length > 0
      ? new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          },
          rows: [
            new TableRow({
              children: template.table.headers.map(
                (header) =>
                  new TableCell({
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: String(header), bold: true, color: '1E293B' })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
              ),
            }),
            ...template.table.rows.map(
              (row, rowIndex) =>
                new TableRow({
                  children: row.map(
                    (value) =>
                      new TableCell({
                        shading:
                          rowIndex % 2 === 1
                            ? { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' }
                            : undefined,
                        children: [new Paragraph({ text: String(value ?? ''), alignment: AlignmentType.LEFT })],
                      }),
                  ),
                }),
            ),
          ],
        })
      : null;

  const sectionChildren = [
    new Paragraph({
      children: [new TextRun({ text: 'VSVH REPORT', bold: true, size: 18, color: '2563EB' })],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: template.title, bold: true, size: 40, color: '0F172A' })],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 180 },
    }),
    ...(template.subtitle
      ? [
          new Paragraph({
            children: [new TextRun({ text: template.subtitle, size: 22, color: '475569' })],
            spacing: { after: 140 },
          }),
        ]
      : []),
    ...(template.meta ?? []).map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 21, color: '1F2937' })],
          spacing: { after: 90 },
        }),
    ),
    ...(template.sections ?? []).flatMap((section) => [
      ...(section.heading
        ? [
            new Paragraph({
              children: [new TextRun({ text: section.heading, bold: true, size: 24, color: '0F172A' })],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 120, after: 70 },
            }),
          ]
        : []),
      ...section.lines.map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${line}`, size: 20, color: '334155' })],
            spacing: { after: 50 },
          }),
      ),
    ]),
    ...(table ? [new Paragraph({ spacing: { before: 160, after: 80 } }), table] : []),
    ...(template.footer ?? []).map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 18, color: '64748B' })],
          spacing: { before: 120, after: 40 },
        }),
    ),
  ];

  const doc = new Document({
    sections: [
      {
        children: sectionChildren,
      },
    ],
  });
  return Packer.toBuffer(doc);
}

function buildStudentProgressTemplate(report, t, locale) {
  const year = new Date().getFullYear();
  const generatedAt = new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', { hour12: false });
  return {
    variant: 'report',
    title: t.studentProgressTitle,
    subtitle: `${t.period}: ${year}`,
    meta: [`${t.name}: ${report.user.name}`, `${t.email}: ${report.user.email}`],
    table: {
      headers: [t.course, t.progress, t.score],
      rows: report.items.map((x) => [x.courseTitle, `${x.progress}%`, String(x.score)]),
    },
    footer: [`${t.generatedAt}: ${generatedAt}`],
  };
}

function buildCourseSummaryTemplate(report, t, locale) {
  const generatedAt = new Date().toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', { hour12: false });
  return {
    variant: 'report',
    title: t.courseSummaryTitle,
    meta: [
      `${t.course}: ${report.course.title}`,
      `${t.language}: ${report.course.language}`,
      `${t.level}: ${report.course.level}`,
      `${t.students}: ${report.studentCount}`,
      `${t.avgProgress}: ${report.avgProgress}%`,
    ],
    table: {
      headers: [t.name, t.email, t.progress, t.period],
      rows: report.students.map((x) => [x.name, x.email, `${x.progress}%`, x.lastActivity ?? '—']),
    },
    footer: [`${t.generatedAt}: ${generatedAt}`],
  };
}

async function sendEmailWithAttachment(
  email,
  filename,
  contentType,
  attachmentBuffer,
  locale,
  metadata,
) {
  const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
  const hasSmtp = Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
  if (!hasSmtp) {
    return { demo: true, to: email, message: 'SMTP не настроен, письмо записано в demo-режиме' };
  }
  const mailTemplate = buildReportMail({
    locale,
    reportTypeLabel: metadata.reportTypeLabel,
    reportFormatLabel: metadata.reportFormatLabel.toUpperCase(),
    generatedAtLabel: t.generatedAt,
    generatedAtValue: new Date().toLocaleString(
      locale === 'ru' ? 'ru-RU' : 'en-US',
      { hour12: false },
    ),
  });
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
    from: process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@vsvh.local',
    to: email,
    subject: mailTemplate.subject,
    text: mailTemplate.text,
    html: mailTemplate.html,
    attachments: [{ filename, content: attachmentBuffer, contentType }],
  });
  return { sent: true, to: email };
}

router.get('/student-progress.pdf', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const queryParsed = reportLangQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
      return res.status(400).json(validationError('Некорректные параметры запроса', queryParsed));
    }
    const report = await getStudentProgressReport(req.authUser.id);
    if (!report) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const locale = resolveRequestLanguage(req, queryParsed.data.lang);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const template = buildStudentProgressTemplate(report, t, locale);
    const buffer = await buildPdfBuffer(template);
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
    const queryParsed = reportLangQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
      return res.status(400).json(validationError('Некорректные параметры запроса', queryParsed));
    }
    const report = await getStudentProgressReport(req.authUser.id);
    if (!report) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const locale = resolveRequestLanguage(req, queryParsed.data.lang);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const template = buildStudentProgressTemplate(report, t, locale);
    const buffer = await buildDocxBuffer(template);
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
    const queryParsed = courseSummaryQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
      return res.status(400).json(validationError('Некорректные параметры запроса', queryParsed));
    }
    const { courseId, lang } = queryParsed.data;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const report = await getCourseSummaryReport(courseId);
    if (!report) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const locale = resolveRequestLanguage(req, lang);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const template = buildCourseSummaryTemplate(report, t, locale);
    const buffer = await buildPdfBuffer(template);
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
    const queryParsed = courseSummaryQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
      return res.status(400).json(validationError('Некорректные параметры запроса', queryParsed));
    }
    const { courseId, lang } = queryParsed.data;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const report = await getCourseSummaryReport(courseId);
    if (!report) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const locale = resolveRequestLanguage(req, lang);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    const template = buildCourseSummaryTemplate(report, t, locale);
    const buffer = await buildDocxBuffer(template);
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
  email: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().email().optional(),
  ),
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
    const queryParsed = teacherAnalyticsQuerySchema.safeParse(req.query);
    if (!queryParsed.success) {
      return res.status(400).json(validationError('Некорректные параметры запроса', queryParsed));
    }
    const { courseId, periodDays } = queryParsed.data;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const analytics = await getCourseAnalyticsReport(courseId, periodDays);
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
    const { type, format, courseId, lang } = parsed.data;
    const locale = resolveRequestLanguage(req, lang);
    const t = REPORT_I18N[locale] ?? REPORT_I18N.en;
    let filename;
    let contentType;
    let buffer;
    let reportTypeLabel;
    if (type === 'student-progress') {
      if (!hasRole(req, 'STUDENT')) {
        return res.status(403).json({ error: 'Недостаточно прав' });
      }
      const report = await getStudentProgressReport(req.authUser.id);
      if (!report) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      const template = buildStudentProgressTemplate(report, t, locale);
      reportTypeLabel = t.reportTypeStudent;
      if (format === 'pdf') {
        filename = 'student-progress.pdf';
        contentType = 'application/pdf';
        buffer = await buildPdfBuffer(template);
      } else {
        filename = 'student-progress.docx';
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        buffer = await buildDocxBuffer(template);
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
      const template = buildCourseSummaryTemplate(report, t, locale);
      reportTypeLabel = t.reportTypeCourse;
      if (format === 'pdf') {
        filename = 'course-summary.pdf';
        contentType = 'application/pdf';
        buffer = await buildPdfBuffer(template);
      } else {
        filename = 'course-summary.docx';
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        buffer = await buildDocxBuffer(template);
      }
    }
    const targetEmail = parsed.data.email || req.authUser.email;
    if (!targetEmail) {
      return res.status(400).json({ error: 'Не удалось определить e-mail получателя' });
    }
    const result = await sendEmailWithAttachment(
      targetEmail,
      filename,
      contentType,
      buffer,
      locale,
      {
        reportTypeLabel,
        reportFormatLabel: format,
      },
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
