'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FoodRecipe extends Model {
        static associate(models) {
            // Thiết lập quan hệ nhiều-nhiều giữa Food và Recipe thông qua bảng nối FoodRecipe
            models.Food.belongsToMany(models.Recipe, {
                through: models.FoodRecipe, // Bảng nối giữa Food và Recipe
                foreignKey: 'foodId',       // Khóa ngoại từ bảng FoodRecipe trỏ đến bảng Food
                otherKey: 'recipeId',      // Khóa ngoại từ bảng FoodRecipe trỏ đến bảng Recipe
            });

            models.Recipe.belongsToMany(models.Food, {
                through: models.FoodRecipe, // Bảng nối giữa Recipe và Food
                foreignKey: 'recipeId',     // Khóa ngoại từ bảng FoodRecipe trỏ đến bảng Recipe
                otherKey: 'foodId',         // Khóa ngoại từ bảng FoodRecipe trỏ đến bảng Food
            });
        }
    }

    FoodRecipe.init({
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'FoodRecipe',  // Đặt tên model là 'FoodRecipe'
        tableName: 'food_recipes', // Tên bảng trong CSDL là 'food_recipes'
        underscored: true,        // Sử dụng snake_case cho tên trường
    });

    return FoodRecipe;
};
