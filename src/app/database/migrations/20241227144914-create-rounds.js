// migrations/[timestamp]-create-rounds.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rounds', {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
      },
      exercise_id: {  // Đổi từ `exercise_Id` thành `exercise_id` để thống nhất
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
          model: 'exercises',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {  // Thay đổi từ `created_At` thành `created_at` cho đúng chuẩn
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {  // Thay đổi từ `updated_At` thành `updated_at`
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rounds');
  },
};
