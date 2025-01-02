const { sequelize, } = require("../models/index"); 
const { Op } = require('sequelize');
const db = require("../models/index");
const Favorite = db.favorite;
const User = db.users;
const Food = db.foods;
const Exercise = db.exercises;

exports.favoritesfood = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
        where: { id },
        // include: ["requests"],
    });
    const { foodId } = req.body;

    if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
    }
    
    

    if (!foodId) {
        return res.status(400).json({
          message: 'Food ID is required',
        });
    }

    const food = await Food.findByPk(foodId);
    if (!food) {
        return res.status(404).json({
          message: 'Food not found',
        });
    }

    const existingFavorite = await Favorite.findOne({
        where: {
          userId: id,
          foodId: foodId,
        },
      });

  

  
    

    // Trả về kết quả
    if (existingFavorite) {
        // Nếu đã tồn tại, xoá món ăn khỏi danh sách yêu thích
        await existingFavorite.destroy();
        return res.status(200).json({
          message: 'Food removed from favorites successfully',
        });
      } else {
        // Nếu chưa tồn tại, thêm món ăn vào danh sách yêu thích
        const favorite = await Favorite.create({
          userId: id,
          foodId: foodId,
        });
        return res.status(200).json({
          message: 'Food added to favorites successfully',
          data: favorite,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error processing request',
        error: error.message,
      });
    }
  
};

exports.favoritesExrcise = async (req, res) => {
    try {
      const { id } = req.user;
      const user = await User.findOne({
          where: { id },
          // include: ["requests"],
      });
      const { exerciseId } = req.body;
  
      if (!user) {
          return res.status(404).json({
            message: 'User not found',
          });
      }
      
      
  
      if(!exerciseId) {
            return res.status(400).json({
                message: 'Exercise ID is required',
            });
        }
        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            return res.status(404).json({
              message: 'Exercise not found',
            });
        }
  
      const existingFavorite = await Favorite.findOne({
          where: {
            userId: id,
            exerciseId: exerciseId,
          },
        });
  
    
  
    
      
  
      // Trả về kết quả
      if (existingFavorite) {
          // Nếu đã tồn tại, xoá món ăn khỏi danh sách yêu thích
          await existingFavorite.destroy();
          return res.status(200).json({
            message: 'Food removed from favorites successfully',
          });
        } else {
          // Nếu chưa tồn tại, thêm món ăn vào danh sách yêu thích
          const favorite = await Favorite.create({
            userId: id,
            exerciseId: exerciseId,
        });
          return res.status(200).json({
            message: 'Food added to favorites successfully',
            data: favorite,
          });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error processing request',
          error: error.message,
        });
      }
    
  };