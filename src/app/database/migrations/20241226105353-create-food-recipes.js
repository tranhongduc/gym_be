'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('food_recipes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      food_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foods', // Tên bảng foods
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      recipe_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recipes', // Tên bảng recipes
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false, // Số lượng nguyên liệu cần
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
    await queryInterface.dropTable('food_recipes');
  },
};
