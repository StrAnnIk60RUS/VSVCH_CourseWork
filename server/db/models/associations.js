import { Role } from './Role.js';
import { User } from './User.js';
import { UserRole } from './UserRole.js';
import { Course } from './Course.js';
import { CourseStaff } from './CourseStaff.js';
import { CourseReview } from './CourseReview.js';
import { Lesson } from './Lesson.js';
import { Exercise } from './Exercise.js';
import { Enrollment } from './Enrollment.js';
import { Certificate } from './Certificate.js';
import { Submission } from './Submission.js';
import { Favorite } from './Favorite.js';
import { Reminder } from './Reminder.js';

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
