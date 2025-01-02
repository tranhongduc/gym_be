// models/exercise.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      // Mối quan hệ giữa Exercise và ExerciseProgress (1:N)
      Exercise.hasMany(models.ExerciseProgress, {
        foreignKey: 'exerciseId',
        as: 'progresses',
      });

      // Exercise có nhiều Round
      Exercise.hasMany(models.Round, {
        foreignKey: 'exerciseId',
        as: 'rounds',
      });

    }
  }

  Exercise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false,
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      calories: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      num_of_exercises: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      muscle_group: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Các cột mới thêm vào
      urlImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urlVideo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Exercise',
      tableName: 'exercises',
      underscored: true, // Sử dụng dấu gạch dưới thay vì camelCase
    }
  );

  return Exercise;
};
