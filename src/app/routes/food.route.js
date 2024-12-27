const express = require('express');
const router = express.Router();


const foodController = require('../controllers/food.controller');

// Định tuyến các hành động cho thực phẩm
router.post('/foods', foodController.createFood);
router.get('/foods', foodController.getAllFoods);
router.get('/foods/:id', foodController.getFoodById);
router.put('/foods/:id', foodController.updateFood);
router.delete('/foods/:id', foodController.deleteFood);


// API POST: Tạo món ăn kèm nguyên liệu
router.post('/food1', foodController.createFoodWithRecipes);

// API GET: Lấy món ăn theo ID kèm nguyên liệu
router.get('/food1/:id', foodController.getFoodByIdWithRecipes);


module.exports = router;
