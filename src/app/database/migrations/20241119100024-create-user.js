'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('foods', {
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
        type: Sequelize.ENUM('sáng', 'trưa', 'tối'),
        allowNull: false,
      },
      diet_mode: {  // Sửa thành diet_mode
        type: Sequelize.STRING,
        allowNull: false,
      },
      calories: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cooking_time: {  // Sửa thành cooking_time
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      serving_size: {  // Sửa thành serving_size
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {  // Sửa thành created_at
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Đặt giá trị mặc định là thời gian hiện tại
      },
      updated_at: {  // Sửa thành updated_at
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Đặt giá trị mặc định là thời gian hiện tại
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('foods');
  }
};
