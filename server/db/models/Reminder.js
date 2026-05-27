import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Reminder };
