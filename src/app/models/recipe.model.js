'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      // Mối quan hệ giữa Recipe và Food (N:N)
      Recipe.belongsToMany(models.Food, {
        through: models.FoodRecipe, // Bảng trung gian
        foreignKey: 'recipeId',     // Khóa ngoại từ bảng FoodRecipe trỏ đến Recipe
        otherKey: 'foodId',         // Khóa ngoại từ bảng FoodRecipe trỏ đến Food
        as: 'foods',                // Alias cho quan hệ này
      });
    }
  }

  Recipe.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Tên nguyên liệu không được để trống
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false, // Đơn vị (gram, ml, cái, v.v.)
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
  }, {
    sequelize,
    modelName: 'Recipe', // Đặt tên model là 'Recipe'
    tableName: 'recipes', // Đảm bảo tên bảng là 'recipes'
    underscored: true, // Đảm bảo tên trường có dấu gạch dưới thay vì camelCase
  });



  return Recipe;
};
