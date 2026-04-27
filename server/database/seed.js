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
  Favorite,
  Reminder,
  LessonCompletion,
  Submission,
} from '../db/models/index.js';
import { recalculateProgress } from '../utils/progress.js';

const ROLES = { TEACHER: 'TEACHER', STUDENT: 'STUDENT' };

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

async function ensureEnrollment(userId, courseId, progress) {
  const row = await Enrollment.findOne({ where: { userId, courseId } });
  if (!row) {
    return Enrollment.create({ userId, courseId, progress });
  }
  await row.update({ progress });
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

async function ensureLessonCompletion(userId, lessonId) {
  const row = await LessonCompletion.findOne({ where: { userId, lessonId } });
  if (!row) await LessonCompletion.create({ userId, lessonId });
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

  await ensureLessonCompletion(student.id, a1L1.id);
  await ensureLessonCompletion(student.id, a1L2.id);

  const exFirst = await Exercise.findByPk('seed-en-a1-l1-ex1');
  if (exFirst) {
    const sub = await Submission.findOne({
      where: { userId: student.id, exerciseId: exFirst.id },
    });
    if (!sub) {
      await Submission.create({
        userId: student.id,
        exerciseId: exFirst.id,
        score: 5,
        payload: { answer: 'E', correct: true },
      });
    }
  }

  await recalculateProgress(student.id, courseA1.id);
  await recalculateProgress(student.id, courseB1.id);

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
