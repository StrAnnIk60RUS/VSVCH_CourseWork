import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => randomUUID(),
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    name: { type: DataTypes.STRING, allowNull: false },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

class Course extends Model {}
Course.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    language: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.STRING, allowNull: false },
    teacherId: { type: DataTypes.STRING, allowNull: false, field: 'teacher_id' },
    enrollCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'enroll_count' },
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'courses',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

class Lesson extends Model {}
Lesson.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    courseId: { type: DataTypes.STRING, allowNull: false, field: 'course_id' },
    title: { type: DataTypes.STRING, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' },
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    tableName: 'lessons',
    underscored: true,
    timestamps: false,
  },
);

class Exercise extends Model {}
Exercise.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    lessonId: { type: DataTypes.STRING, allowNull: false, field: 'lesson_id' },
    title: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  },
  {
    sequelize,
    tableName: 'exercises',
    underscored: true,
    timestamps: false,
  },
);

class Enrollment extends Model {}
Enrollment.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    courseId: { type: DataTypes.STRING, allowNull: false, field: 'course_id' },
    progress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'enrollments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

class LessonCompletion extends Model {}
LessonCompletion.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    lessonId: { type: DataTypes.STRING, allowNull: false, field: 'lesson_id' },
    completedAt: { type: DataTypes.DATE, allowNull: false, field: 'completed_at', defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'lesson_completions',
    underscored: true,
    timestamps: false,
  },
);

class Submission extends Model {}
Submission.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    exerciseId: { type: DataTypes.STRING, allowNull: false, field: 'exercise_id' },
    score: { type: DataTypes.INTEGER, allowNull: true },
    payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'submissions',
    underscored: true,
    timestamps: false,
  },
);

class Favorite extends Model {}
Favorite.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    courseId: { type: DataTypes.STRING, allowNull: false, field: 'course_id' },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'favorites',
    underscored: true,
    timestamps: false,
  },
);

class Reminder extends Model {}
Reminder.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    courseId: { type: DataTypes.STRING, allowNull: true, field: 'course_id' },
    title: { type: DataTypes.STRING, allowNull: false },
    remindAt: { type: DataTypes.DATE, allowNull: false, field: 'remind_at' },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'reminders',
    underscored: true,
    timestamps: false,
  },
);

User.hasMany(Course, { foreignKey: 'teacher_id', as: 'coursesTeaching' });
Course.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Lesson.hasMany(Exercise, { foreignKey: 'lesson_id', as: 'exercises' });
Exercise.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

User.hasMany(Enrollment, { foreignKey: 'user_id', as: 'enrollments' });
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

User.hasMany(LessonCompletion, { foreignKey: 'user_id', as: 'lessonProgress' });
Lesson.hasMany(LessonCompletion, { foreignKey: 'lesson_id', as: 'completions' });
LessonCompletion.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
LessonCompletion.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

User.hasMany(Submission, { foreignKey: 'user_id', as: 'submissions' });
Exercise.hasMany(Submission, { foreignKey: 'exercise_id', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Submission.belongsTo(Exercise, { foreignKey: 'exercise_id', as: 'exercise' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'userFavorites' });
Course.hasMany(Favorite, { foreignKey: 'course_id', as: 'courseFavorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Favorite.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

User.hasMany(Reminder, { foreignKey: 'user_id', as: 'userReminders' });
Course.hasMany(Reminder, { foreignKey: 'course_id', as: 'courseReminders' });
Reminder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Reminder.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

export {
  sequelize,
  User,
  Course,
  Lesson,
  Exercise,
  Enrollment,
  LessonCompletion,
  Submission,
  Favorite,
  Reminder,
};
