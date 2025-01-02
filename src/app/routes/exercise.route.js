// routes/exerciseRoutes.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');

const authMiddleware = require('../middlewares/auth.middleware');


router.get('/exercises', exerciseController.getAllExercises);
router.post('/exercises', exerciseController.createExercise);
router.get('/exercises/:id', exerciseController.getExerciseById);
router.put('/exercises/:id', exerciseController.updateExercise);
router.delete('/exercises/:id', exerciseController.deleteExercise);

//
router.post('/exercises1', exerciseController.addExercise);
router.get('/exercises1', exerciseController.getExercises);
router.get('/exercises1/type/:type', exerciseController.getExercisesByType);
router.get('/exercises1/:id', exerciseController.getExerciseById1);
router.get('/recom', exerciseController.getRandomExercises);

router.get('/exercisestoUser', authMiddleware.getAccessToken, authMiddleware.checkAuth, exerciseController.getExercisesToUser);

module.exports = router;
