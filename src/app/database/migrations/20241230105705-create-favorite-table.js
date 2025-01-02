'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
          model: 'Users', // Bảng Users
          key: 'id',
        },
        onDelete: 'CASCADE', // Khi xóa user, favorites cũng sẽ bị xóa
      },
      exercise_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
          model: 'Exercises', // Tên bảng liên kết
          key: 'id',
        },
        onDelete: 'SET NULL', // Nếu xóa bài tập, exerciseId sẽ được đặt là null
      },
      food_Id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
        references: {
          model: 'Foods', // Tên bảng liên kết
          key: 'id',
        },
        onDelete: 'SET NULL', // Nếu xóa món ăn, foodId sẽ được đặt là null
      },
      created_At: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_At: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favorites');
  },
};
