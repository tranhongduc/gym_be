const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

router.get('/', recipeController.getAllrecipes);
router.post('/', recipeController.createrecipe);
router.get('/:id', recipeController.getrecipeById);
router.post('/add-to-food', recipeController.addrecipeToFood);
router.get('/food/:recipeId', recipeController.getFoodsByrecipe);


module.exports = router;
