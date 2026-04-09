const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const common = {
  dialect: 'postgres',
  logging: false,
};

module.exports = {
  development: {
    ...common,
    url: process.env.DATABASE_URL,
  },
  production: {
    ...common,
    url: process.env.DATABASE_URL,
  },
};
