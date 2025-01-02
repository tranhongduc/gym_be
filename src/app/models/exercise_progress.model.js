'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExerciseProgress extends Model {
    static associate(models) {
      // Quan hệ 1:N với Exercise
      ExerciseProgress.belongsTo(models.Exercise, {
        foreignKey: 'exerciseId',
        as: 'exercise',
      });

      // Quan hệ 1:N với Round
      ExerciseProgress.belongsTo(models.Round, {
        foreignKey: 'roundId',
        as: 'round',
      });
    }
  }

  ExerciseProgress.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'exercises',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      roundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'rounds',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      smallExerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'small_exercises',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      alldone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ExerciseProgress',
      tableName: 'exercise_progresses',
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate: async (progress, options) => {
          // Kiểm tra và cập nhật chỉ giữ 1 bản ghi duy nhất cho mỗi user và exercise
          const existingProgress = await sequelize.models.ExerciseProgress.findOne({
            where: {
              userId: progress.userId,
              exerciseId: progress.exerciseId,
            },
          });

          if (existingProgress) {
            // Nếu đã tồn tại bản ghi, thay vì thêm mới thì sẽ cập nhật bản ghi cũ
            existingProgress.roundId = progress.roundId;
            existingProgress.smallExerciseId = progress.smallExerciseId;
            existingProgress.completedAt = progress.completedAt;
            existingProgress.alldone = progress.alldone;
            await existingProgress.save();
            throw new Error('Existing progress record updated');
          }
        },
      },
    }
  );

  return ExerciseProgress;
};
