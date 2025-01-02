// routes/smallExerciseRoutes.js

const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.profile);
router.put('/profile', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.updateProfile);

module.exports = router;
