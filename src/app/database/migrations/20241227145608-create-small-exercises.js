// migrations/[timestamp]-create-small-exercises.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('small_exercises', {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
      },
      round_Id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
        references: {
          model: 'rounds',
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
      duration: {
        type: Sequelize.INTEGER,
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
        defaultValue: Sequelize.NOW,
      },
      updated_At: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('small_exercises');
  },
};
