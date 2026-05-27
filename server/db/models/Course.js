import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Course };
