import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { ROLE_CODES } from './constants.js';

class Role extends Model {}

Role.init(
  {
    code: {
      type: DataTypes.ENUM(...ROLE_CODES),
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    underscored: true,
    timestamps: false,
  },
);

export { Role };
