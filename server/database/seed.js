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
} from '../db/models/index.js';

const ROLES = {
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

async function main() {
  const passwordHash = await bcrypt.hash('demo-password', 10);

  let teacher = await User.findOne({ where: { email: 'teacher@vsvh.local' } });
  if (!teacher) {
    teacher = await User.create({
      email: 'teacher@vsvh.local',
      passwordHash,
      name: 'Demo Teacher',
    });
  }
  const teacherRole = await UserRole.findOne({
    where: { userId: teacher.id, roleCode: ROLES.TEACHER },
  });
  if (!teacherRole) {
    await UserRole.create({ userId: teacher.id, roleCode: ROLES.TEACHER });
  }

  let student = await User.findOne({ where: { email: 'student@vsvh.local' } });
  if (!student) {
    student = await User.create({
      email: 'student@vsvh.local',
      passwordHash,
      name: 'Demo Student',
    });
  }
  const studentRole = await UserRole.findOne({
    where: { userId: student.id, roleCode: ROLES.STUDENT },
  });
  if (!studentRole) {
    await UserRole.create({ userId: student.id, roleCode: ROLES.STUDENT });
  }

  let course = await Course.findByPk('seed-course-intro');
  if (!course) {
    course = await Course.create({
      id: 'seed-course-intro',
      title: 'Introduction',
      description: 'Seed course for local development.',
      language: 'en',
      level: 'A1',
      published: true,
    });
  }

  const leadStaff = await CourseStaff.findOne({
    where: { courseId: course.id, userId: teacher.id, staffRole: 'TEACHER' },
  });
  if (!leadStaff) {
    await CourseStaff.create({
      courseId: course.id,
      userId: teacher.id,
      staffRole: 'TEACHER',
    });
  }

  let lesson = await Lesson.findByPk('seed-lesson-1');
  if (!lesson) {
    lesson = await Lesson.create({
      id: 'seed-lesson-1',
      courseId: course.id,
      title: 'First lesson',
      sortOrder: 1,
      content: 'Welcome to the platform.',
    });
  }

  let exercise = await Exercise.findByPk('seed-exercise-1');
  if (!exercise) {
    await Exercise.create({
      id: 'seed-exercise-1',
      lessonId: lesson.id,
      title: 'Warm-up',
      type: 'mcq',
      payload: { options: ['a', 'b'], answer: 'a' },
    });
  }

  const existingEnrollment = await Enrollment.findOne({
    where: { userId: student.id, courseId: course.id },
  });
  if (!existingEnrollment) {
    await Enrollment.create({
      userId: student.id,
      courseId: course.id,
      progress: 0,
    });
  }

  const seedReview = await CourseReview.findOne({
    where: { userId: student.id, courseId: course.id },
  });
  if (!seedReview) {
    await CourseReview.create({
      userId: student.id,
      courseId: course.id,
      rating: 5,
      comment: 'Seed review for catalog minRating checks.',
    });
  }
  await course.update({ ratingAverage: 5 });
}

main()
  .then(() => sequelize.close())
  .catch(async (e) => {
    console.error(e);
    await sequelize.close();
    process.exit(1);
  });
