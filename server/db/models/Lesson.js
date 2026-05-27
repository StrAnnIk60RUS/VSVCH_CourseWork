import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Lesson };
