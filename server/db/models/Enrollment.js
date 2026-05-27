import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Enrollment };
