import { Router } from 'express';
import { z } from 'zod';
import { Op, fn, col } from 'sequelize';
import {
  Course,
  CourseStaff,
  CourseReview,
  User,
  Lesson,
  Exercise,
  sequelize,
} from '../db/models/index.js';

const router = Router();

const listQuerySchema = z
  .object({
    language: z.string().optional(),
    level: z.string().optional(),
    minRating: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['createdAt', 'popularity', 'rating']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(8),
  })
  .superRefine((val, ctx) => {
    if (val.minRating !== undefined && val.minRating !== '') {
      const n = Number(val.minRating);
      if (!Number.isFinite(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'minRating must be a number',
          path: ['minRating'],
        });
      }
    }
  })
  .transform((d) => {
    let minRating;
    if (d.minRating !== undefined && d.minRating !== '') {
      minRating = Number(d.minRating);
    }
    return {
      ...d,
      minRating,
      limit: Math.min(d.limit, 50),
    };
  });

function normalizeQuery(query) {
  /** @type {Record<string, string | undefined>} */
  const out = {};
  for (const [key, val] of Object.entries(query)) {
    if (Array.isArray(val)) {
      out[key] = val[0];
    } else {
      out[key] = val;
    }
  }
  return out;
}

const lessonCountSql = `(SELECT COUNT(*)::int FROM lessons WHERE lessons.course_id = "Course"."id")`;
const enrollmentCountSql = `(SELECT COUNT(*)::int FROM enrollments WHERE enrollments.course_id = "Course"."id")`;
const reviewCountSql = `(SELECT COUNT(*)::int FROM course_reviews WHERE course_reviews.course_id = "Course"."id")`;
const leadTeacherSql = `(
  SELECT json_build_object('id', u.id, 'name', u.name, 'email', u.email)
  FROM course_staff cs
  INNER JOIN users u ON u.id = cs.user_id
  WHERE cs.course_id = "Course"."id" AND cs.staff_role = 'TEACHER'
  ORDER BY cs.created_at ASC
  LIMIT 1
)`;

/**
 * @param {'asc' | 'desc'} dir
 */
function orderClause(sort, dir) {
  const d = dir.toUpperCase();
  if (sort === 'createdAt') {
    return [[col('Course.created_at'), dir]];
  }
  if (sort === 'rating') {
    const nulls = d === 'DESC' ? 'NULLS LAST' : 'NULLS FIRST';
    return [[sequelize.literal(`"Course"."rating_average" ${d} ${nulls}`)]];
  }
  return [[sequelize.literal(`${enrollmentCountSql} ${d}`)]];
}

/**
 * @param {import('sequelize').Model<any, any>} row
 */
function mapListItem(row) {
  const j = row.get({ plain: true });
  let leadTeacher = j.leadTeacher;
  if (typeof leadTeacher === 'string') {
    try {
      leadTeacher = JSON.parse(leadTeacher);
    } catch {
      leadTeacher = null;
    }
  }
  return {
    id: j.id,
    title: j.title,
    description: j.description,
    language: j.language,
    level: j.level,
    published: j.published,
    ratingAverage: j.ratingAverage != null ? Number(j.ratingAverage) : null,
    createdAt: j.createdAt,
    lessonCount: Number(j.lessonCount) || 0,
    enrollmentCount: Number(j.enrollmentCount) || 0,
    reviewCount: Number(j.reviewCount) || 0,
    leadTeacher,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(normalizeQuery(req.query));
    if (!parsed.success) {
      return res.status(400).json({ error: 'Некорректные параметры запроса' });
    }
    const { language, level, minRating, search, sort, order, page, limit } = parsed.data;

    /** @type {import('sequelize').WhereOptions} */
    const where = { published: true };
    if (language) {
      where.language = language;
    }
    if (level) {
      where.level = level;
    }
    if (minRating !== undefined) {
      where.ratingAverage = { [Op.ne]: null, [Op.gte]: minRating };
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.and] = [{ [Op.or]: [{ title: { [Op.iLike]: term } }, { description: { [Op.iLike]: term } }] }];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Course.findAndCountAll({
      where,
      attributes: {
        include: [
          [sequelize.literal(lessonCountSql), 'lessonCount'],
          [sequelize.literal(enrollmentCountSql), 'enrollmentCount'],
          [sequelize.literal(reviewCountSql), 'reviewCount'],
          [sequelize.literal(leadTeacherSql), 'leadTeacher'],
        ],
      },
      order: orderClause(sort, order),
      limit,
      offset,
    });

    return res.json({
      items: rows.map(mapListItem),
      total: count,
      page,
      limit,
    });
  } catch (err) {
    next(err);
  }
});

function staffRoleOrder(role) {
  const order = { TEACHER: 0, AUTHOR: 1, METHODIST: 2, CURATOR: 3 };
  return order[role] ?? 99;
}

router.get('/:courseId', async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      where: { id: courseId, published: true },
    });
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    const [staffRows, lessons, reviewCount] = await Promise.all([
      CourseStaff.findAll({
        where: { courseId },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        order: [['createdAt', 'ASC']],
      }),
      Lesson.findAll({
        where: { courseId },
        order: [['sortOrder', 'ASC']],
        attributes: ['id', 'title', 'sortOrder', 'content'],
      }),
      CourseReview.count({ where: { courseId } }),
    ]);

    const lessonIds = lessons.map((l) => l.id);
    /** @type {Record<string, number>} */
    const exerciseByLesson = {};
    if (lessonIds.length > 0) {
      const agg = await Exercise.findAll({
        attributes: ['lessonId', [fn('COUNT', col('Exercise.id')), 'exerciseCount']],
        where: { lessonId: { [Op.in]: lessonIds } },
        group: ['lessonId'],
        raw: true,
      });
      for (const row of agg) {
        exerciseByLesson[row.lessonId] = Number(row.exerciseCount) || 0;
      }
    }

    const staff = staffRows.map((s) => {
      const u = s.user?.get({ plain: true });
      return {
        id: s.id,
        staffRole: s.staffRole,
        user: u ? { id: u.id, name: u.name, email: u.email } : null,
      };
    });

    const teachers = staffRows
      .filter((s) => s.staffRole === 'TEACHER')
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return ta - tb;
      });
    const lead = teachers[0]?.user?.get({ plain: true });
    const leadTeacher = lead ? { id: lead.id, name: lead.name, email: lead.email } : null;

    const coursePlain = course.get({ plain: true });
    const lessonsOut = lessons.map((l) => {
      const p = l.get({ plain: true });
      return {
        id: p.id,
        title: p.title,
        order: p.sortOrder,
        content: p.content,
        exerciseCount: exerciseByLesson[p.id] ?? 0,
      };
    });

    staff.sort((a, b) => staffRoleOrder(a.staffRole) - staffRoleOrder(b.staffRole));

    return res.json({
      id: coursePlain.id,
      title: coursePlain.title,
      description: coursePlain.description,
      language: coursePlain.language,
      level: coursePlain.level,
      published: coursePlain.published,
      ratingAverage:
        coursePlain.ratingAverage != null ? Number(coursePlain.ratingAverage) : null,
      createdAt: coursePlain.createdAt,
      updatedAt: coursePlain.updatedAt,
      leadTeacher,
      staff,
      reviewCount,
      lessons: lessonsOut,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
