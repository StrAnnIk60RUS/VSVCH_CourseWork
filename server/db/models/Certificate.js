import { DataTypes, Model } from 'sequelize';
import { randomUUID } from 'node:crypto';
import { sequelize } from '../sequelize.js';

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

export { Certificate };
