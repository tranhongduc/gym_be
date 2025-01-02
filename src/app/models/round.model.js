// models/round.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    static associate(models) {
      // Quan hệ 1:N với Exercise
      Round.belongsTo(models.Exercise, {
        foreignKey: 'exerciseId',
        as: 'exercise',
      });

      // Quan hệ 1:N với SmallExercise
      Round.hasMany(models.SmallExercise, {
        foreignKey: 'roundId',
        as: 'smallExercises',
      });

      // Quan hệ 1:N với ExerciseProgress (nếu cần theo dõi quá trình của người dùng)
      Round.hasMany(models.ExerciseProgress, {
        foreignKey: 'roundId',
        as: 'progresses',
      });
    }
  }

  Round.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      exerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'exercises',
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
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'Round',
      tableName: 'rounds',
      underscored: true,
    }
  );

  return Round;
};
