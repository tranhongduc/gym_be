'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Food extends Model {
        static associate(models) {
            // Không có quan hệ nào ở đây
        }
    }

    Food.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true, // Có thể không có mô tả
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true, // Loại món ăn (chế độ ăn, món chính, v.v.)
        },
        dietMode: {
            type: DataTypes.STRING,
            allowNull: true, // Chế độ ăn (kiêng, bình thường, v.v.)
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: true, // Lượng calo có thể là số nguyên
        },
        cookingTime: {
            type: DataTypes.INTEGER,
            allowNull: true, // Thời gian nấu ăn (số phút)
        },
        servingSize: {
            type: DataTypes.INTEGER,
            allowNull: true, // Kích thước phần ăn
        },
    }, {
        sequelize,
        modelName: 'Food',
        tableName: 'foods',
        underscored: true, // Chuyển tên trường sang dạng snake_case
        underscoredAll: true, // Áp dụng cho tất cả các tên thuộc tính
    });

    return Food;
};
