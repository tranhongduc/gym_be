const express = require('express');
const router = express.Router();


const foodController = require('../controllers/food.controller');

// Định tuyến các hành động cho thực phẩm
router.post('/foods', foodController.createFood);
router.get('/foods', foodController.getAllFoods);
router.get('/foods/:id', foodController.getFoodById);
router.put('/foods/:id', foodController.updateFood);
router.delete('/foods/:id', foodController.deleteFood);

module.exports = router;
