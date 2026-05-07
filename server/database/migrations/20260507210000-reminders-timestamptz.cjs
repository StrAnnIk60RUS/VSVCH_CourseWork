'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE reminders
        ALTER COLUMN remind_at       TYPE TIMESTAMPTZ(3) USING remind_at       AT TIME ZONE 'UTC',
        ALTER COLUMN delivered_at    TYPE TIMESTAMPTZ(3) USING delivered_at    AT TIME ZONE 'UTC',
        ALTER COLUMN email_sent_at   TYPE TIMESTAMPTZ(3) USING email_sent_at   AT TIME ZONE 'UTC',
        ALTER COLUMN acknowledged_at TYPE TIMESTAMPTZ(3) USING acknowledged_at AT TIME ZONE 'UTC',
        ALTER COLUMN created_at      TYPE TIMESTAMPTZ(3) USING created_at      AT TIME ZONE 'UTC';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE reminders
        ALTER COLUMN remind_at       TYPE TIMESTAMP(3),
        ALTER COLUMN delivered_at    TYPE TIMESTAMP(3),
        ALTER COLUMN email_sent_at   TYPE TIMESTAMP(3),
        ALTER COLUMN acknowledged_at TYPE TIMESTAMP(3),
        ALTER COLUMN created_at      TYPE TIMESTAMP(3);
    `);
  },
};
