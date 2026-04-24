import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

export const ROLE_CODES = ['STUDENT', 'TEACHER', 'ADMIN'];

export const COURSE_STAFF_ROLES = ['TEACHER', 'AUTHOR', 'METHODIST', 'CURATOR'];

class Role extends Model {}
Role.init(
  {
    code: {
      type: DataTypes.ENUM(...ROLE_CODES),
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    underscored: true,
    timestamps: false,
  },
);

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

class UserRole extends Model {}
UserRole.init(
  {
    userId: { type: DataTypes.STRING, allowNull: false, primaryKey: true, field: 'user_id' },
    roleCode: {
      type: DataTypes.ENUM(...ROLE_CODES),
      allowNull: false,
      primaryKey: true,
      field: 'role_code',
    },
  },
  {
    sequelize,
    tableName: 'user_roles',
    underscored: true,
    timestamps: false,
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
    published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ratingAverage: { type: DataTypes.DECIMAL(4, 3), allowNull: true, field: 'rating_average' },
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

class CourseStaff extends Model {}
CourseStaff.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    courseId: { type: DataTypes.STRING, allowNull: false, field: 'course_id' },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    staffRole: {
      type: DataTypes.ENUM(...COURSE_STAFF_ROLES),
      allowNull: false,
      field: 'staff_role',
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at', defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'course_staff',
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ['course_id', 'user_id', 'staff_role'] }],
  },
);

class CourseReview extends Model {}
CourseReview.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    courseId: { type: DataTypes.STRING, allowNull: false, field: 'course_id' },
    rating: { type: DataTypes.SMALLINT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: 'course_reviews',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['user_id', 'course_id'] }],
  },
);

class Lesson extends Model {}
Lesson.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    courseId: { type: DataTypes.STRING, allowNull: false, field: 'course_id' },
    title: { type: DataTypes.STRING, allowNull: false },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
      validate: { min: 0 },
    },
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
    progress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, max: 100 } },
  },
  {
    sequelize,
    tableName: 'enrollments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['user_id', 'course_id'] }],
  },
);

class Certificate extends Model {}
Certificate.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    enrollmentId: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'enrollment_id' },
    documentNumber: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'document_number' },
    issuedAt: { type: DataTypes.DATE, allowNull: false, field: 'issued_at', defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'certificates',
    underscored: true,
    timestamps: false,
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
    indexes: [{ unique: true, fields: ['user_id', 'lesson_id'] }],
  },
);

class Submission extends Model {}
Submission.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => randomUUID() },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    exerciseId: { type: DataTypes.STRING, allowNull: false, field: 'exercise_id' },
    score: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0 } },
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
    indexes: [{ unique: true, fields: ['user_id', 'course_id'] }],
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

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_code',
  as: 'roleEntities',
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'role_code',
  otherKey: 'user_id',
  as: 'usersWithRole',
});

UserRole.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserRole.belongsTo(Role, { foreignKey: 'role_code', targetKey: 'code', as: 'role' });
User.hasMany(UserRole, { foreignKey: 'user_id', as: 'userRoles' });
Role.hasMany(UserRole, { foreignKey: 'role_code', sourceKey: 'code', as: 'assignments' });

Course.hasMany(CourseStaff, { foreignKey: 'course_id', as: 'staff' });
CourseStaff.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
User.hasMany(CourseStaff, { foreignKey: 'user_id', as: 'courseStaffAssignments' });
CourseStaff.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(CourseReview, { foreignKey: 'course_id', as: 'reviews' });
CourseReview.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
User.hasMany(CourseReview, { foreignKey: 'user_id', as: 'courseReviews' });
CourseReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Lesson.hasMany(Exercise, { foreignKey: 'lesson_id', as: 'exercises' });
Exercise.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

User.hasMany(Enrollment, { foreignKey: 'user_id', as: 'enrollments' });
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Enrollment.hasOne(Certificate, { foreignKey: 'enrollment_id', as: 'certificate' });
Certificate.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

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
  Role,
  User,
  UserRole,
  Course,
  CourseStaff,
  CourseReview,
  Lesson,
  Exercise,
  Enrollment,
  Certificate,
  LessonCompletion,
  Submission,
  Favorite,
  Reminder,
};
