'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.dropTable('lesson_completions');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('lesson_completions', {
      id: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      lesson_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
          model: 'lessons',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      completed_at: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('lesson_completions', ['user_id', 'lesson_id'], {
      unique: true,
      name: 'lesson_completions_user_id_lesson_id_key',
    });
  },
};
