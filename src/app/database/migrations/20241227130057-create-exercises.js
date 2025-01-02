// migrations/[timestamp]-create-exercises.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exercises', {
      id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
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
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false,
      },
      time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      calories: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      num_of_exercises: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      muscle_group: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('exercises');
  },
};
