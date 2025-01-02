'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Food extends Model {
        static associate(models) {
            Food.belongsToMany(models.Recipe, {
                through: models.FoodRecipe, // Bảng trung gian
                foreignKey: 'foodId',       // Khóa ngoại từ bảng FoodRecipe trỏ đến Food
                otherKey: 'recipeId',       // Khóa ngoại từ bảng FoodRecipe trỏ đến Recipe
                as: 'recipes',              // Alias cho quan hệ này
            }); 
            
            Food.hasMany(models.Favorite, {
                foreignKey: 'foodId',
                as: 'favorites',
              });
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
        allergies: {
            type: DataTypes.STRING,
            allowNull: true, // Loại món ăn (chế độ ăn, món chính, v.v.)
        },
        dietary: {
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
        urlImg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        urlVideo: {
            type: DataTypes.STRING,
            allowNull: true,
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
