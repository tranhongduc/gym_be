'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("foods", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM("sáng", "trưa", "tối"),
        allowNull: false,
      },
      diet_Mode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      calories: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cooking_Time: {
        type: Sequelize.INTEGER, // Thời gian nấu (phút)
        allowNull: false,
      },
      serving_Size: {
        type: Sequelize.INTEGER, // Khẩu phần ăn (số lượng người)
        allowNull: false,
      },
      created_At: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Đặt mặc định cho createdAt
      },
      updated_At: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Đặt mặc định cho updatedAt
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("foods");
  }
};
