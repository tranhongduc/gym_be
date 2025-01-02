// routes/smallExerciseRoutes.js

const express = require('express');
const smallExerciseController = require('../controllers/small_exercise.controller');
const router = express.Router();

router.get('/small-exercises', smallExerciseController.getAllSmallExercises);
router.post('/small-exercises', smallExerciseController.createSmallExercise);
router.get('/small-exercises/:id', smallExerciseController.getSmallExerciseById);
router.put('/small-exercises/:id', smallExerciseController.updateSmallExercise);
router.delete('/small-exercises/:id', smallExerciseController.deleteSmallExercise);

module.exports = router;
