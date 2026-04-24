'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON enrollments (course_id);
      CREATE INDEX IF NOT EXISTS lessons_course_id_idx ON lessons (course_id);
      CREATE INDEX IF NOT EXISTS exercises_lesson_id_idx ON exercises (lesson_id);
      CREATE INDEX IF NOT EXISTS submissions_user_id_created_at_idx ON submissions (user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS course_staff_user_id_staff_role_idx ON course_staff (user_id, staff_role);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE enrollments
      ADD CONSTRAINT enrollments_progress_range_check CHECK (progress >= 0 AND progress <= 100);

      ALTER TABLE submissions
      ADD CONSTRAINT submissions_score_non_negative_check CHECK (score IS NULL OR score >= 0);

      ALTER TABLE lessons
      ADD CONSTRAINT lessons_sort_order_non_negative_check CHECK (sort_order >= 0);
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_sort_order_non_negative_check;
      ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_score_non_negative_check;
      ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_progress_range_check;
    `);

    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS course_staff_user_id_staff_role_idx;
      DROP INDEX IF EXISTS submissions_user_id_created_at_idx;
      DROP INDEX IF EXISTS exercises_lesson_id_idx;
      DROP INDEX IF EXISTS lessons_course_id_idx;
      DROP INDEX IF EXISTS enrollments_course_id_idx;
    `);
  },
};
