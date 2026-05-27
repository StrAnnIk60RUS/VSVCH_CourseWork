import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Favorite };
