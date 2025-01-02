// models/smallExercise.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SmallExercise extends Model {
    static associate(models) {
      // Quan hệ 1:N với Round
      SmallExercise.belongsTo(models.Round, {
        foreignKey: 'roundId',
        as: 'round',
      });
    }
  }

  SmallExercise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'rounds',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false, // Thời gian thực hiện bài tập nhỏ
      },
      urlImg: {
        type: DataTypes.STRING,
        allowNull: true, // Cho phép NULL
      },
      urlVideo: {
        type: DataTypes.STRING,
        allowNull: true, // Cho phép NULL
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
      modelName: 'SmallExercise',
      tableName: 'small_exercises',
      underscored: true,
    }
  );

  return SmallExercise;
};
