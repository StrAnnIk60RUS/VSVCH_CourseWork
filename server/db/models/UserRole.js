import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { ROLE_CODES } from './constants.js';

class UserRole extends Model {}

UserRole.init(
  {
    userId: { type: DataTypes.STRING, allowNull: false, primaryKey: true, field: 'user_id' },
    roleCode: {
      type: DataTypes.ENUM(...ROLE_CODES),
      allowNull: false,
      primaryKey: true,
      field: 'role_code',
    },
  },
  {
    sequelize,
    tableName: 'user_roles',
    underscored: true,
    timestamps: false,
  },
);

export { UserRole };
