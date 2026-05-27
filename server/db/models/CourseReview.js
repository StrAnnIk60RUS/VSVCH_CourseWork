import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { CourseReview };
