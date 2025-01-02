'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Favorite extends Model {
        static associate(models) {
            // Quan hệ với User
            Favorite.belongsTo(models.users, {
                foreignKey: 'userId',
                as: 'user', // Alias cho quan hệ này
            });

            // Quan hệ với Exercise (nếu có exerciseId)
            Favorite.belongsTo(models.Exercise, {
                foreignKey: 'exerciseId',
                as: 'exercise', // Alias cho quan hệ này
            });

            // Quan hệ với Food (nếu có foodId)
            Favorite.belongsTo(models.Food, {
                foreignKey: 'foodId',
                as: 'food', // Alias cho quan hệ này
            });
        }
    }

    Favorite.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exerciseId: {
            type: DataTypes.INTEGER,
            allowNull: true,  // Có thể null nếu không có exerciseId
        },
        foodId: {
            type: DataTypes.INTEGER,
            allowNull: true,  // Có thể null nếu không có foodId
        },
    }, {
        sequelize,
        modelName: 'Favorite',
        tableName: 'favorites',
        underscored: true, // Chuyển tên trường sang dạng snake_case
        underscoredAll: true, // Áp dụng cho tất cả các tên thuộc tính
        validate: {
            // Kiểm tra nếu một trong hai `exerciseId` và `foodId` là null, và chỉ có một trong chúng có giá trị
            checkIds() {
                if ((this.exerciseId && this.foodId) || (!this.exerciseId && !this.foodId)) {
                    throw new Error('Only one of exerciseId or foodId should be provided.');
                }
            },
        },
    });

    return Favorite;
};
