'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 */
function splitExecutableStatements(sql) {
  return sql
    .split('\n')
    .filter((line) => !/^\s*--/.test(line))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

module.exports = {
  async up(queryInterface) {
    const sqlPath = path.join(__dirname, 'init-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    const statements = splitExecutableStatements(sql);
    for (const stmt of statements) {
      await queryInterface.sequelize.query(stmt);
    }
  },

  async down(queryInterface) {
    const tables = [
      'reminders',
      'favorites',
      'submissions',
      'lesson_completions',
      'enrollments',
      'exercises',
      'lessons',
      'courses',
      'users',
    ];
    for (const t of tables) {
      await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${t}" CASCADE;`);
    }
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "Role";');
  },
};
