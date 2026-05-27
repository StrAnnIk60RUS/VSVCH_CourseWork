import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';
import { COURSE_STAFF_ROLES } from './constants.js';

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

export { CourseStaff };
