'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exercise_progresses', {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
      },
      exercise_id: {  // Đổi từ `exercise_Id` thành `exercise_id`
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
          model: 'exercises',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {  // Đổi từ `user_Id` thành `user_id`
        type: Sequelize.BIGINT(20),
        allowNull: false,
      },
      round_id: {  // Thêm trường `round_id` để lưu thông tin vòng học
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
          model: 'rounds',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      small_exercise_id: {  // Thêm trường `small_exercise_id` để lưu bài tập nhỏ
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
          model: 'small_exercises',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      completed_at: {  // Thêm trường để lưu thời gian hoàn thành bài tập nhỏ
        type: Sequelize.DATE,
        allowNull: true,
      },
      alldone: {  // Trạng thái bài tập đã hoàn thành
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {  // Thay đổi từ `created_At` thành `created_at`
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
    await queryInterface.dropTable('exercise_progresses');
  },
};
