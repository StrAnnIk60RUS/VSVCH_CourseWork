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
  Enrollment,
  Submission,
  sequelize,
} from '../db/models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { canManageCourse, hasRole } from '../utils/permissions.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { getAuthUserDtoById } from '../utils/authUser.js';
import { REVIEW_MIN_PROGRESS_PERCENT } from '../db/models/constants.js';

const router = Router();

const createCourseSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(120, 'title is too long'),
  description: z.string().trim().min(1, 'description is required').max(2000, 'description is too long'),
  language: z.string().trim().min(1, 'language is required').max(40, 'language is too long'),
  level: z.string().trim().min(1, 'level is required').max(40, 'level is too long'),
  published: z.boolean().optional(),
});

const updateCourseSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().min(1).max(2000).optional(),
    language: z.string().trim().min(1).max(40).optional(),
    level: z.string().trim().min(1).max(40).optional(),
    published: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.language !== undefined ||
      data.level !== undefined ||
      data.published !== undefined,
    { message: 'At least one field is required' },
  );

const reviewUpsertSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).optional(),
  })
  .transform((data) => ({
    ...data,
    comment: data.comment && data.comment.length > 0 ? data.comment : null,
  }));

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

function validationError(message, parsed) {
  return {
    error: message,
    details: parsed.error.issues.map((issue) => ({
      path: issue.path.join('.') || 'body',
      message: issue.message,
    })),
  };
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

function mapCourseEntity(course) {
  const plain = course.get({ plain: true });
  return {
    id: plain.id,
    title: plain.title,
    description: plain.description,
    language: plain.language,
    level: plain.level,
    published: plain.published,
    ratingAverage: plain.ratingAverage != null ? Number(plain.ratingAverage) : null,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

function clampProgress(value) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function maxScoreForExercise(payload) {
  const score = Number(payload?.maxScore ?? 10);
  return Number.isFinite(score) && score > 0 ? score : 10;
}

async function resolveOptionalAuthUser(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  const token = header.slice(7).trim();
  if (!token) {
    return null;
  }
  try {
    const { sub } = verifyAccessToken(token);
    return await getAuthUserDtoById(sub);
  } catch {
    return null;
  }
}

/**
 * @param {string} courseId
 * @param {import('sequelize').Transaction | undefined} transaction
 */
async function recalculateCourseRatingAverage(courseId, transaction) {
  const stats = await CourseReview.findOne({
    attributes: [[fn('AVG', col('rating')), 'ratingAverage']],
    where: { courseId },
    raw: true,
    transaction,
  });
  const avgRaw = stats?.ratingAverage;
  const ratingAverage =
    avgRaw == null ? null : Number(Number(avgRaw).toFixed(3));
  await Course.update(
    { ratingAverage },
    { where: { id: courseId }, transaction },
  );
  return ratingAverage;
}

router.get('/', async (req, res, next) => {
  try {
    const parsed = listQuerySchema.safeParse(normalizeQuery(req.query));
    if (!parsed.success) {
      return res.status(400).json(validationError('Некорректные параметры запроса', parsed));
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

    const [staffRows, lessons, reviewCount, authUser] = await Promise.all([
      CourseStaff.findAll({
        where: { courseId },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        order: [[col('CourseStaff.created_at'), 'ASC']],
      }),
      Lesson.findAll({
        where: { courseId },
        order: [['sortOrder', 'ASC']],
        attributes: ['id', 'title', 'sortOrder', 'content'],
      }),
      CourseReview.count({ where: { courseId } }),
      resolveOptionalAuthUser(req),
    ]);

    const lessonIds = lessons.map((l) => l.id);
    /** @type {Record<string, number>} */
    const exerciseByLesson = {};
    /** @type {Record<string, number>} */
    const lessonProgressByLessonId = {};
    if (lessonIds.length > 0) {
      const exerciseRows = await Exercise.findAll({
        attributes: ['id', 'lessonId', 'payload'],
        where: { lessonId: { [Op.in]: lessonIds } },
      });

      /** @type {Record<string, Array<{ id: string, maxScore: number }>>} */
      const exercisesByLesson = {};
      for (const row of exerciseRows) {
        const plain = row.get({ plain: true });
        const lessonKey = plain.lessonId;
        if (!exercisesByLesson[lessonKey]) {
          exercisesByLesson[lessonKey] = [];
        }
        exercisesByLesson[lessonKey].push({
          id: plain.id,
          maxScore: maxScoreForExercise(plain.payload),
        });
      }

      for (const lessonId of lessonIds) {
        exerciseByLesson[lessonId] = exercisesByLesson[lessonId]?.length ?? 0;
        lessonProgressByLessonId[lessonId] = 0;
      }

      const isStudent = Boolean(authUser?.roles?.includes('STUDENT'));
      if (isStudent && authUser) {
        const enrollment = await Enrollment.findOne({
          where: { userId: authUser.id, courseId },
          attributes: ['id'],
        });
        if (enrollment) {
          const exerciseIds = exerciseRows.map((row) => row.id);
          const bestByExercise = new Map();
          if (exerciseIds.length > 0) {
            const submissions = await Submission.findAll({
              where: { userId: authUser.id, exerciseId: { [Op.in]: exerciseIds } },
              attributes: ['exerciseId', 'score'],
            });
            for (const sub of submissions) {
              const exerciseId = sub.exerciseId;
              const score = Number(sub.score) || 0;
              const prev = bestByExercise.get(exerciseId) ?? 0;
              if (score > prev) {
                bestByExercise.set(exerciseId, score);
              }
            }
          }

          for (const lessonId of lessonIds) {
            const lessonExercises = exercisesByLesson[lessonId] ?? [];
            const maxTotal = lessonExercises.reduce((sum, ex) => sum + ex.maxScore, 0);
            if (maxTotal <= 0) {
              lessonProgressByLessonId[lessonId] = 0;
              continue;
            }
            const earnedTotal = lessonExercises.reduce(
              (sum, ex) => sum + (bestByExercise.get(ex.id) ?? 0),
              0,
            );
            lessonProgressByLessonId[lessonId] = clampProgress((earnedTotal / maxTotal) * 100);
          }
        }
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
        progressPercent: lessonProgressByLessonId[p.id] ?? 0,
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

router.get('/:courseId/reviews', async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({
      where: { id: courseId, published: true },
      attributes: ['id'],
    });
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const rows = await CourseReview.findAll({
      where: { courseId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [[col('CourseReview.created_at'), 'DESC']],
    });
    const items = rows.map((row) => {
      const plain = row.get({ plain: true });
      const author = plain.user ? { id: plain.user.id, name: plain.user.name } : null;
      const createdAt = row.createdAt ?? plain.createdAt ?? plain.created_at ?? null;
      const updatedAt = row.updatedAt ?? plain.updatedAt ?? plain.updated_at ?? null;
      return {
        rating: plain.rating,
        comment: plain.comment,
        createdAt,
        updatedAt,
        author,
      };
    });
    return res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
});

router.get('/:courseId/review/me', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const review = await CourseReview.findOne({
      where: { courseId, userId: req.authUser.id },
    });
    if (!review) {
      return res.status(200).json({ myReview: null });
    }
    const plain = review.get({ plain: true });
    return res.status(200).json({
      myReview: {
        rating: plain.rating,
        comment: plain.comment,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:courseId/review', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'STUDENT')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const parsed = reviewUpsertSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json(validationError('Некорректные данные отзыва', parsed));
    }

    const [course, enrollment] = await Promise.all([
      Course.findOne({ where: { id: courseId, published: true } }),
      Enrollment.findOne({ where: { userId: req.authUser.id, courseId } }),
    ]);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    if (!enrollment) {
      return res.status(403).json({ error: 'Сначала запишитесь на курс' });
    }
    if ((Number(enrollment.progress) || 0) < REVIEW_MIN_PROGRESS_PERCENT) {
      return res.status(403).json({
        error: `Отзыв доступен после ${REVIEW_MIN_PROGRESS_PERCENT}% прохождения курса`,
      });
    }

    const result = await sequelize.transaction(async (tx) => {
      const existing = await CourseReview.findOne({
        where: { userId: req.authUser.id, courseId },
        transaction: tx,
      });
      let review;
      if (existing) {
        review = await existing.update(parsed.data, { transaction: tx });
      } else {
        review = await CourseReview.create(
          {
            userId: req.authUser.id,
            courseId,
            ...parsed.data,
          },
          { transaction: tx },
        );
      }
      const [ratingAverage, reviewCount] = await Promise.all([
        recalculateCourseRatingAverage(courseId, tx),
        CourseReview.count({ where: { courseId }, transaction: tx }),
      ]);
      const reviewPlain = review.get({ plain: true });
      return {
        ratingAverage,
        reviewCount,
        myReview: {
          rating: reviewPlain.rating,
          comment: reviewPlain.comment,
          createdAt: reviewPlain.createdAt,
          updatedAt: reviewPlain.updatedAt,
        },
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const parsed = createCourseSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json(validationError('Некорректные данные курса', parsed));
    }

    const created = await sequelize.transaction(async (tx) => {
      const course = await Course.create(
        {
          title: parsed.data.title,
          description: parsed.data.description,
          language: parsed.data.language,
          level: parsed.data.level,
          published: parsed.data.published ?? false,
        },
        { transaction: tx },
      );
      await CourseStaff.create(
        {
          courseId: course.id,
          userId: req.authUser.id,
          staffRole: 'TEACHER',
        },
        { transaction: tx },
      );
      return course;
    });

    return res.status(201).json(mapCourseEntity(created));
  } catch (err) {
    next(err);
  }
});

router.put('/:courseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    const parsed = updateCourseSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json(validationError('Некорректные данные курса', parsed));
    }
    await course.update(parsed.data);
    return res.status(200).json(mapCourseEntity(course));
  } catch (err) {
    next(err);
  }
});

router.delete('/:courseId', requireAuth, async (req, res, next) => {
  try {
    if (!hasRole(req, 'TEACHER')) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const { courseId } = req.params;
    const allowed = await canManageCourse(courseId, req.authUser.id);
    if (!allowed) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Курс не найден' });
    }
    await course.destroy();
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
