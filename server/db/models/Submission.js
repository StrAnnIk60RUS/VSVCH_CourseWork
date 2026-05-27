import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Submission };
