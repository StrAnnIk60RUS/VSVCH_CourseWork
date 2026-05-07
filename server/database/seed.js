import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {
  sequelize,
  User,
  UserRole,
  Course,
  CourseStaff,
  CourseReview,
  Lesson,
  Exercise,
  Enrollment,
  Certificate,
  Favorite,
  Reminder,
  Submission,
} from '../db/models/index.js';
import { recalculateProgress } from '../utils/progress.js';

const ROLES = { TEACHER: 'TEACHER', STUDENT: 'STUDENT' };
const MIN_TOTAL_RECORDS = 200;

/** Учётные данные для локальной разработки (выводятся в консоль после сида). */
const SEED_ACCOUNTS = {
  teacher: {
    email: 'elena.morozova@vsvh.demo',
    password: 'PrepVsvh2026!',
    name: 'Елена Морозова',
    role: 'преподаватель',
  },
  student: {
    email: 'ivan.volkov@vsvh.demo',
    password: 'StudVsvh2026!',
    name: 'Иван Волков',
    role: 'студент',
  },
};

/** Общий пароль для когорты студентов (отчётность по курсам Елены Морозовой). */
const COHORT_PASSWORD = 'CohortVsvh2026!';

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function ensureUser(email, passwordPlain, name) {
  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      email,
      passwordHash: await hashPassword(passwordPlain),
      name,
    });
  }
  return user;
}

/** Пользователь с фиксированным id (для детерминированных сид-аккаунтов). */
async function ensureSeedUser({ id, email, passwordPlain, name }) {
  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      id,
      email,
      passwordHash: await hashPassword(passwordPlain),
      name,
    });
  } else {
    await user.update({ name });
  }
  return user;
}

async function ensureUserRole(userId, roleCode) {
  const row = await UserRole.findOne({ where: { userId, roleCode } });
  if (!row) await UserRole.create({ userId, roleCode });
}

async function ensureCourseStaff(courseId, userId, staffRole) {
  const row = await CourseStaff.findOne({ where: { courseId, userId, staffRole } });
  if (!row) {
    await CourseStaff.create({ courseId, userId, staffRole });
  }
}

async function ensureCourse(row) {
  let course = await Course.findByPk(row.id);
  if (!course) {
    course = await Course.create(row);
  } else {
    await course.update({
      title: row.title,
      description: row.description,
      language: row.language,
      level: row.level,
      published: row.published,
    });
  }
  return course;
}

async function ensureLesson(row) {
  let lesson = await Lesson.findByPk(row.id);
  if (!lesson) {
    lesson = await Lesson.create(row);
  } else {
    await lesson.update({
      courseId: row.courseId,
      title: row.title,
      sortOrder: row.sortOrder,
      content: row.content,
    });
  }
  return lesson;
}

async function ensureExercise(row) {
  let ex = await Exercise.findByPk(row.id);
  if (!ex) {
    ex = await Exercise.create(row);
  } else {
    await ex.update({
      lessonId: row.lessonId,
      title: row.title,
      type: row.type,
      payload: row.payload,
    });
  }
  return ex;
}

async function ensureEnrollment(userId, courseId, progress, createdAt) {
  const row = await Enrollment.findOne({ where: { userId, courseId } });
  const attrs = { progress };
  if (createdAt) {
    attrs.createdAt = createdAt;
    attrs.updatedAt = createdAt;
  }
  if (!row) {
    return Enrollment.create({ userId, courseId, ...attrs });
  }
  await row.update(attrs);
  return row;
}

async function ensureReview(userId, courseId, rating, comment) {
  const existing = await CourseReview.findOne({ where: { userId, courseId } });
  if (!existing) {
    await CourseReview.create({ userId, courseId, rating, comment });
  } else {
    await existing.update({ rating, comment });
  }
}

async function syncCourseRatingAverage(courseId) {
  const reviews = await CourseReview.findAll({
    where: { courseId },
    attributes: ['rating'],
  });
  if (!reviews.length) {
    await Course.update({ ratingAverage: null }, { where: { id: courseId } });
    return;
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Number((sum / reviews.length).toFixed(3));
  await Course.update({ ratingAverage: avg }, { where: { id: courseId } });
}

async function ensureFavorite(userId, courseId) {
  const row = await Favorite.findOne({ where: { userId, courseId } });
  if (!row) await Favorite.create({ userId, courseId });
}

async function ensureReminder(userId, { courseId, title, remindAt }) {
  const row = await Reminder.findOne({
    where: { userId, title, courseId: courseId ?? null },
  });
  if (!row) await Reminder.create({ userId, courseId, title, remindAt });
}

function exercisePayload(question, correctAnswer, maxScore = 10) {
  return { question, correctAnswer, maxScore };
}

async function ensureSubmission(row) {
  let submission = await Submission.findByPk(row.id);
  if (!submission) {
    submission = await Submission.create(row);
  } else {
    await submission.update({
      userId: row.userId,
      exerciseId: row.exerciseId,
      score: row.score,
      payload: row.payload,
      ...(row.createdAt ? { createdAt: row.createdAt } : {}),
    });
  }
  return submission;
}

async function ensureCertificate(row) {
  let cert = await Certificate.findByPk(row.id);
  if (!cert) {
    cert = await Certificate.create(row);
  } else {
    await cert.update({
      enrollmentId: row.enrollmentId,
      documentNumber: row.documentNumber,
      ...(row.issuedAt ? { issuedAt: row.issuedAt } : {}),
    });
  }
  return cert;
}

async function countApplicationRecords() {
  const modelEntries = [
    ['users', User],
    ['user_roles', UserRole],
    ['courses', Course],
    ['course_staff', CourseStaff],
    ['course_reviews', CourseReview],
    ['lessons', Lesson],
    ['exercises', Exercise],
    ['enrollments', Enrollment],
    ['certificates', Certificate],
    ['submissions', Submission],
    ['favorites', Favorite],
    ['reminders', Reminder],
  ];

  const stats = [];
  for (const [name, ModelRef] of modelEntries) {
    const count = await ModelRef.count();
    stats.push({ name, count });
  }

  const total = stats.reduce((acc, item) => acc + item.count, 0);
  return { total, stats };
}

async function main() {
  const teacher = await ensureUser(
    SEED_ACCOUNTS.teacher.email,
    SEED_ACCOUNTS.teacher.password,
    SEED_ACCOUNTS.teacher.name,
  );
  await ensureUserRole(teacher.id, ROLES.TEACHER);

  const student = await ensureUser(
    SEED_ACCOUNTS.student.email,
    SEED_ACCOUNTS.student.password,
    SEED_ACCOUNTS.student.name,
  );
  await ensureUserRole(student.id, ROLES.STUDENT);

  const courseA1 = await ensureCourse({
    id: 'seed-course-en-a1',
    title: 'Английский с нуля: алфавит, цифры и приветствия',
    description:
      'Практический мини-курс для тех, кто только начинает. Вы освоите произношение базовых букв, научитесь представляться и задавать простые вопросы. Каждый урок сопровождается короткими упражнениями на закрепление.',
    language: 'en',
    level: 'A1',
    published: true,
  });

  const courseB1 = await ensureCourse({
    id: 'seed-course-en-b1',
    title: 'Business English: встречи и переговоры',
    description:
      'Разбор типовых сценариев: созвон с коллегами, повестка дня, вежливые формулы согласия и несогласия, фиксация договорённостей. Материалы ориентированы на работу в международных командах.',
    language: 'en',
    level: 'B1',
    published: true,
  });

  const courseDraft = await ensureCourse({
    id: 'seed-course-fr-draft',
    title: 'Français: phonétique (черновик)',
    description:
      'Будущий курс по произношению и связке букв; пока скрыт из каталога для демонстрации неопубликованных курсов.',
    language: 'fr',
    level: 'A2',
    published: false,
  });

  await ensureCourseStaff(courseA1.id, teacher.id, 'TEACHER');
  await ensureCourseStaff(courseB1.id, teacher.id, 'TEACHER');
  await ensureCourseStaff(courseDraft.id, teacher.id, 'TEACHER');
  await ensureCourseStaff(courseA1.id, teacher.id, 'AUTHOR');

  const a1L1 = await ensureLesson({
    id: 'seed-en-a1-l1',
    courseId: courseA1.id,
    title: 'Урок 1. Алфавит и произношение',
    sortOrder: 1,
    content: `## Цели урока
- Узнать английский алфавив и типичные названия букв в эфире.
- Потренировать пару минимальных пар звуков (например, **i** / **ee**).

## Краткая теория
В английском 26 букв; гласные **A E I O U**, остальные — согласные. На уровне A1 достаточно уверенно читать буквы по одной (диктовка e-mail, аббревиатуры).

## Практика
1. Прочитайте алфавит вслух два раза.
2. Запишите своё имя латиницей и проговорите по буквам.`,
  });

  const a1L2 = await ensureLesson({
    id: 'seed-en-a1-l2',
    courseId: courseA1.id,
    title: 'Урок 2. Приветствия и прощания',
    sortOrder: 2,
    content: `## Диалоги
- **Hello** / **Hi** — нейтральное и неформальное приветствие.
- **Good morning** — до полудня; **Good evening** — после работы.

## Формулы вежливости
**Nice to meet you** — при первом знакомстве. Ответ часто: **Nice to meet you too**.

## Домашнее задание
Составьте 4 реплики: поздороваться, представиться, спросить "How are you?", попрощаться.`,
  });

  const a1L3 = await ensureLesson({
    id: 'seed-en-a1-l3',
    courseId: courseA1.id,
    title: 'Урок 3. Цифры и даты',
    sortOrder: 3,
    content: `## Числа 0–20
Запомните порядок: *zero, one, two … twenty*.

## Год и день рождения
Год читают по парам цифр: **1998** — *nineteen ninety-eight*.

## Задание
Назовите свой день рождения на английском (день + месяц + год).`,
  });

  await ensureExercise({
    id: 'seed-en-a1-l1-ex1',
    lessonId: a1L1.id,
    title: 'Буква после D',
    type: 'text',
    payload: exercisePayload(
      'Какая буква английского алфавита идёт сразу после **D**?',
      'E',
      5,
    ),
  });

  await ensureExercise({
    id: 'seed-en-a1-l1-ex2',
    lessonId: a1L1.id,
    title: 'Количество гласных',
    type: 'text',
    payload: exercisePayload(
      'Сколько гласных букв в английском алфавите? Ответ числом.',
      '5',
      5,
    ),
  });

  await ensureExercise({
    id: 'seed-en-a1-l2-ex1',
    lessonId: a1L2.id,
    title: 'Нейтральное приветствие',
    type: 'text',
    payload: exercisePayload(
      'Как одним словом поздороваться нейтрально-формально днём (не good morning)?',
      'hello',
      10,
    ),
  });

  await ensureExercise({
    id: 'seed-en-a1-l2-ex2',
    lessonId: a1L2.id,
    title: 'Первая встреча',
    type: 'text',
    payload: exercisePayload(
      'Закончите фразу: Nice to meet you, ___. (одно слово, ответ на поздравление)',
      'too',
      10,
    ),
  });

  await ensureExercise({
    id: 'seed-en-a1-l3-ex1',
    lessonId: a1L3.id,
    title: 'Число twelve',
    type: 'text',
    payload: exercisePayload('Напишите цифрой число, которое на английском — *twelve*.', '12', 10),
  });

  const b1L1 = await ensureLesson({
    id: 'seed-en-b1-l1',
    courseId: courseB1.id,
    title: 'Повестка и тайминг',
    sortOrder: 1,
    content: `## Структура встречи
1. **Opening** — цель и ожидания.
2. **Agenda** — пункты по времени.
3. **Action items** — кто что делает к какому сроку.

## Полезные фразы
- *Let's stick to the agenda.*
- *I'd like to table this for our next call.*`,
  });

  const b1L2 = await ensureLesson({
    id: 'seed-en-b1-l2',
    courseId: courseB1.id,
    title: 'Согласие и мягкое несогласие',
    sortOrder: 2,
    content: `## Согласие
*I agree with you on this point.*

## Мягкий отказ
*I'm not sure I fully agree — could we look at the data again?*

Избегайте резкого **You're wrong** в переписке с партнёрами.`,
  });

  await ensureExercise({
    id: 'seed-en-b1-l1-ex1',
    lessonId: b1L1.id,
    title: 'Синоним повестки',
    type: 'text',
    payload: exercisePayload(
      'Одним английским словом: документ с пунктами обсуждения на встрече (часто в начале письма).',
      'agenda',
      10,
    ),
  });

  await ensureExercise({
    id: 'seed-en-b1-l2-ex1',
    lessonId: b1L2.id,
    title: 'Вежливое несогласие',
    type: 'single_choice',
    payload: exercisePayload(
      'Какая формулировка звучит наиболее вежливо в деловой переписке?',
      "I'm not sure I fully agree",
      10,
    ),
  });

  await ensureLesson({
    id: 'seed-fr-draft-l1',
    courseId: courseDraft.id,
    title: 'Naso voyelles',
    sortOrder: 1,
    content: 'Черновик: nasales **an, in, on** — примеры будут добавлены.',
  });

  await ensureEnrollment(student.id, courseA1.id, 0);
  await ensureEnrollment(student.id, courseB1.id, 0);

  await ensureReview(student.id, courseA1.id, 5, 'Очень понятно для старта, особенно урок про приветствия.');
  await ensureReview(student.id, courseB1.id, 4, 'Полезно для созвонов; хотелось бы больше примеров писем.');

  await syncCourseRatingAverage(courseA1.id);
  await syncCourseRatingAverage(courseB1.id);

  await ensureFavorite(student.id, courseB1.id);

  const future = new Date();
  future.setDate(future.getDate() + 3);
  await ensureReminder(student.id, {
    courseId: courseA1.id,
    title: 'Повторить урок 2 (приветствия)',
    remindAt: future,
  });

  const exFirst = await Exercise.findByPk('seed-en-a1-l1-ex1');
  if (exFirst) {
    const sub = await Submission.findOne({
      where: { userId: student.id, exerciseId: exFirst.id },
    });
    if (!sub) {
      await ensureSubmission({
        id: 'seed-submission-base-student-ex1',
        userId: student.id,
        exerciseId: exFirst.id,
        score: 5,
        payload: { answer: 'E', correct: true },
      });
    }
  }

  const daysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(12, 0, 0, 0);
    return d;
  };

  const A1_EXERCISE_IDS = [
    'seed-en-a1-l1-ex1',
    'seed-en-a1-l1-ex2',
    'seed-en-a1-l2-ex1',
    'seed-en-a1-l2-ex2',
    'seed-en-a1-l3-ex1',
  ];
  const A1_MAX_SCORES = [5, 5, 10, 10, 10];

  const cohortDefs = [
    { n: 1, name: 'Анна Петрова', enrolledOffsetDays: 60, activityDays: 3, a1Count: 5, b1: 'full' },
    { n: 2, name: 'Сергей Соколов', enrolledOffsetDays: 60, activityDays: 3, a1Count: 5, b1: 'full' },
    { n: 3, name: 'Мария Кузнецова', enrolledOffsetDays: 30, activityDays: 5, a1Count: 4, b1: 'half' },
    { n: 4, name: 'Дмитрий Орлов', enrolledOffsetDays: 30, activityDays: 10, a1Count: 3, b1: 'quarter' },
    { n: 5, name: 'Ольга Соловьёва', enrolledOffsetDays: 45, activityDays: 30, a1Count: 2, b1: null },
    { n: 6, name: 'Никита Лебедев', enrolledOffsetDays: 0, activityDays: 0, a1Count: 0, b1: null },
  ];

  const cohortStudentUsers = [];
  for (const def of cohortDefs) {
    const id = `seed-cohort-student-${def.n}`;
    const email = `seed-cohort-student-${def.n}@vsvh.demo`;
    const u = await ensureSeedUser({
      id,
      email,
      passwordPlain: COHORT_PASSWORD,
      name: def.name,
    });
    await ensureUserRole(u.id, ROLES.STUDENT);
    cohortStudentUsers.push(u);
  }

  for (let i = 0; i < cohortDefs.length; i += 1) {
    const def = cohortDefs[i];
    const u = cohortStudentUsers[i];
    const enrollCreated =
      def.enrolledOffsetDays > 0 ? daysAgo(def.enrolledOffsetDays) : new Date();

    const enrA1 = await ensureEnrollment(u.id, courseA1.id, 0, enrollCreated);
    const activityAt = def.activityDays > 0 ? daysAgo(def.activityDays) : null;

    for (let exIdx = 0; exIdx < def.a1Count; exIdx += 1) {
      const exerciseId = A1_EXERCISE_IDS[exIdx];
      const maxScore = A1_MAX_SCORES[exIdx];
      await ensureSubmission({
        id: `seed-cohort-sub-${def.n}-a1-${exerciseId}`,
        userId: u.id,
        exerciseId,
        score: maxScore,
        payload: { answer: 'seed', correct: true, cohort: true },
        ...(activityAt ? { createdAt: activityAt } : {}),
      });
    }

    if (def.a1Count >= 5) {
      await ensureCertificate({
        id: `seed-cert-cohort-${def.n}-a1`,
        enrollmentId: enrA1.id,
        documentNumber: `VSVH-2026-COHORT-${def.n}-A1`,
        issuedAt: daysAgo(3),
      });
    }

    if (def.b1 === 'full' || def.b1 === 'half' || def.b1 === 'quarter') {
      const enrB1 = await ensureEnrollment(u.id, courseB1.id, 0, enrollCreated);
      const b1Activity = activityAt ?? daysAgo(def.activityDays || 3);
      if (def.b1 === 'full') {
        await ensureSubmission({
          id: `seed-cohort-sub-${def.n}-b1-seed-en-b1-l1-ex1`,
          userId: u.id,
          exerciseId: 'seed-en-b1-l1-ex1',
          score: 10,
          payload: { answer: 'agenda', correct: true, cohort: true },
          createdAt: b1Activity,
        });
        await ensureSubmission({
          id: `seed-cohort-sub-${def.n}-b1-seed-en-b1-l2-ex1`,
          userId: u.id,
          exerciseId: 'seed-en-b1-l2-ex1',
          score: 10,
          payload: { answer: "I'm not sure I fully agree", correct: true, cohort: true },
          createdAt: b1Activity,
        });
        await ensureCertificate({
          id: `seed-cert-cohort-${def.n}-b1`,
          enrollmentId: enrB1.id,
          documentNumber: `VSVH-2026-COHORT-${def.n}-B1`,
          issuedAt: daysAgo(3),
        });
      } else if (def.b1 === 'half') {
        await ensureSubmission({
          id: `seed-cohort-sub-${def.n}-b1-seed-en-b1-l1-ex1`,
          userId: u.id,
          exerciseId: 'seed-en-b1-l1-ex1',
          score: 10,
          payload: { answer: 'agenda', correct: true, cohort: true },
          createdAt: b1Activity,
        });
      } else if (def.b1 === 'quarter') {
        await ensureSubmission({
          id: `seed-cohort-sub-${def.n}-b1-seed-en-b1-l1-ex1`,
          userId: u.id,
          exerciseId: 'seed-en-b1-l1-ex1',
          score: 5,
          payload: { answer: 'partial', correct: false, cohort: true },
          createdAt: b1Activity,
        });
      }
    }
  }

  const bulkTeacher = await ensureUser(
    'seed.bulk.teacher@vsvh.demo',
    'BulkTeach2026!',
    'Seed Bulk Teacher',
  );
  await ensureUserRole(bulkTeacher.id, ROLES.TEACHER);

  const bulkStudents = [];
  for (let idx = 1; idx <= 10; idx += 1) {
    const studentUser = await ensureUser(
      `seed.bulk.student${idx}@vsvh.demo`,
      'BulkStud2026!',
      `Seed Student ${idx}`,
    );
    await ensureUserRole(studentUser.id, ROLES.STUDENT);
    bulkStudents.push(studentUser);
  }

  const bulkCourses = [];
  for (let courseIdx = 1; courseIdx <= 12; courseIdx += 1) {
    const level = courseIdx % 2 === 0 ? 'A2' : 'B1';
    const language = courseIdx % 3 === 0 ? 'de' : 'en';
    const course = await ensureCourse({
      id: `seed-bulk-course-${courseIdx}`,
      title: `Seed Bulk Course ${courseIdx}`,
      description:
        'Автосгенерированный курс для выполнения требования по минимальному объёму тестовых данных.',
      language,
      level,
      published: true,
    });

    await ensureCourseStaff(course.id, bulkTeacher.id, 'TEACHER');
    bulkCourses.push(course);
  }

  const allBulkExercises = [];
  const submissionRows = [];
  const certificateTargets = [];
  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + 5);

  for (const [courseIndex, course] of bulkCourses.entries()) {
    for (let lessonIdx = 1; lessonIdx <= 3; lessonIdx += 1) {
      const lesson = await ensureLesson({
        id: `seed-bulk-course-${courseIndex + 1}-lesson-${lessonIdx}`,
        courseId: course.id,
        title: `Bulk Lesson ${lessonIdx}`,
        sortOrder: lessonIdx,
        content:
          'Контент урока сгенерирован автоматически для увеличения числа связанных записей в базе.',
      });

      for (let exIdx = 1; exIdx <= 2; exIdx += 1) {
        const exercise = await ensureExercise({
          id: `seed-bulk-course-${courseIndex + 1}-lesson-${lessonIdx}-exercise-${exIdx}`,
          lessonId: lesson.id,
          title: `Bulk Exercise ${lessonIdx}.${exIdx}`,
          type: 'text',
          payload: exercisePayload(
            `Контрольный вопрос ${lessonIdx}.${exIdx} для курса ${courseIndex + 1}`,
            'ok',
            10,
          ),
        });
        allBulkExercises.push(exercise);
      }
    }
  }

  for (const [studentIndex, studentUser] of bulkStudents.entries()) {
    const firstCourseIdx = studentIndex % bulkCourses.length;
    const secondCourseIdx = (studentIndex + 3) % bulkCourses.length;
    const favoriteCourse = bulkCourses[(studentIndex + 1) % bulkCourses.length];

    await ensureEnrollment(studentUser.id, bulkCourses[firstCourseIdx].id, 0);
    await ensureEnrollment(studentUser.id, bulkCourses[secondCourseIdx].id, 0);
    await ensureFavorite(studentUser.id, favoriteCourse.id);
    await ensureReminder(studentUser.id, {
      courseId: favoriteCourse.id,
      title: `Bulk reminder ${studentIndex + 1}`,
      remindAt: reminderDate,
    });

    if (studentIndex < 6) {
      certificateTargets.push({
        userId: studentUser.id,
        courseId: bulkCourses[firstCourseIdx].id,
      });
    }

    for (let submissionIdx = 0; submissionIdx < 3; submissionIdx += 1) {
      const exercise =
        allBulkExercises[(studentIndex * 3 + submissionIdx) % allBulkExercises.length];
      submissionRows.push({
        id: `seed-bulk-submission-student-${studentIndex + 1}-${submissionIdx + 1}`,
        userId: studentUser.id,
        exerciseId: exercise.id,
        score: 10,
        payload: { answer: 'ok', correct: true, seed: true },
      });
    }
  }

  for (const row of submissionRows) {
    await ensureSubmission(row);
  }

  for (const [idx, course] of bulkCourses.entries()) {
    const reviewAuthor = bulkStudents[idx % bulkStudents.length];
    await ensureReview(
      reviewAuthor.id,
      course.id,
      4 + (idx % 2),
      `Seed review for bulk course ${idx + 1}`,
    );
    await syncCourseRatingAverage(course.id);
  }

  await recalculateProgress(student.id, courseA1.id);
  await recalculateProgress(student.id, courseB1.id);
  for (let i = 0; i < cohortStudentUsers.length; i += 1) {
    const u = cohortStudentUsers[i];
    await recalculateProgress(u.id, courseA1.id);
    if (cohortDefs[i].b1) {
      await recalculateProgress(u.id, courseB1.id);
    }
  }
  for (const studentUser of bulkStudents) {
    const enrollments = await Enrollment.findAll({ where: { userId: studentUser.id } });
    for (const enrollment of enrollments) {
      await recalculateProgress(studentUser.id, enrollment.courseId);
    }
  }

  for (const [idx, target] of certificateTargets.entries()) {
    const enrollment = await Enrollment.findOne({
      where: { userId: target.userId, courseId: target.courseId },
    });
    if (enrollment) {
      await ensureCertificate({
        id: `seed-bulk-certificate-${idx + 1}`,
        enrollmentId: enrollment.id,
        documentNumber: `VSVH-SEED-2026-${String(idx + 1).padStart(4, '0')}`,
      });
    }
  }

  const recordStats = await countApplicationRecords();
  if (recordStats.total < MIN_TOTAL_RECORDS) {
    throw new Error(
      `Seed validation failed: expected at least ${MIN_TOTAL_RECORDS} records, got ${recordStats.total}.`,
    );
  }

  // eslint-disable-next-line no-console
  console.log('\n========== VSVH seed ==========');
  // eslint-disable-next-line no-console
  console.log('Пользователь 1 (преподаватель):');
  // eslint-disable-next-line no-console
  console.log(`  Email:    ${SEED_ACCOUNTS.teacher.email}`);
  // eslint-disable-next-line no-console
  console.log(`  Пароль:   ${SEED_ACCOUNTS.teacher.password}`);
  // eslint-disable-next-line no-console
  console.log(`  Имя:      ${SEED_ACCOUNTS.teacher.name}`);
  // eslint-disable-next-line no-console
  console.log('Пользователь 2 (студент):');
  // eslint-disable-next-line no-console
  console.log(`  Email:    ${SEED_ACCOUNTS.student.email}`);
  // eslint-disable-next-line no-console
  console.log(`  Пароль:   ${SEED_ACCOUNTS.student.password}`);
  // eslint-disable-next-line no-console
  console.log(`  Имя:      ${SEED_ACCOUNTS.student.name}`);
  // eslint-disable-next-line no-console
  console.log('Когорта из 6 студентов (курсы Елены Морозовой — проверка отчётности):');
  // eslint-disable-next-line no-console
  console.log(`  Общий пароль: ${COHORT_PASSWORD}`);
  for (const def of cohortDefs) {
    // eslint-disable-next-line no-console
    console.log(`  Email: seed-cohort-student-${def.n}@vsvh.demo  —  ${def.name}`);
  }
  // eslint-disable-next-line no-console
  console.log(`Всего записей (прикладные таблицы): ${recordStats.total} (минимум: ${MIN_TOTAL_RECORDS})`);
  // eslint-disable-next-line no-console
  console.log(
    `По таблицам: ${recordStats.stats.map((x) => `${x.name}=${x.count}`).join(', ')}`,
  );
  // eslint-disable-next-line no-console
  console.log('================================\n');
}

main()
  .then(() => sequelize.close())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await sequelize.close();
    process.exit(1);
  });
