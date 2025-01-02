// routes/exerciseRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const favoriteController = require('../controllers/favorite.controller');

router.post('/favoriteFood', authMiddleware.getAccessToken, authMiddleware.checkAuth, favoriteController.favoritesfood);
router.post('/favoriteExercise', authMiddleware.getAccessToken, authMiddleware.checkAuth, favoriteController.favoritesExrcise);

module.exports = router;
