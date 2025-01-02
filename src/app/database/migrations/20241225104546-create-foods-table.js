'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foods', {
      id: {
        type: Sequelize.BIGINT(20),
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
        type: Sequelize.ENUM('Breakfast', 'Lunch', 'Dinner'),
        allowNull: false,
      },
      allergies: {
        type: Sequelize.ENUM('Dairy', 'Nuts', 'Shellfish', 'Eggs'),
        allowNull: false,
      },
      dietary: {
        type: Sequelize.ENUM('Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'),
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
      url_img: {
        type: Sequelize.STRING,
        allowNull: true, // Cho phép giá trị null
      },
      url_video: {
        type: Sequelize.STRING,
        allowNull: true, // Cho phép giá trị null
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('foods');
  },
};
