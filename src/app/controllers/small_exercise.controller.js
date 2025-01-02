// controllers/smallExerciseController.js

const { SmallExercise } = require('../models'); // Giả sử bạn đã có mô hình SmallExercise trong models

// Lấy tất cả các small exercises
exports.getAllSmallExercises = async (req, res) => {
  try {
    const smallExercises = await SmallExercise.findAll();
    res.status(200).json(smallExercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching small exercises', error: error.message });
  }
};

// Tạo mới một small exercise
exports.createSmallExercise = async (req, res) => {
  const { roundId, name, description, duration } = req.body;

  try {
    const smallExercise = await SmallExercise.create({
      roundId,
      name,
      description,
      duration
    });
    res.status(201).json(smallExercise);
  } catch (error) {
    res.status(500).json({ message: 'Error creating small exercise', error: error.message });
  }
};

// Lấy thông tin chi tiết về một small exercise
exports.getSmallExerciseById = async (req, res) => {
  const { id } = req.params;

  try {
    const smallExercise = await SmallExercise.findOne({ where: { id } });

    if (!smallExercise) {
      return res.status(404).json({ message: 'Small exercise not found' });
    }

    res.status(200).json(smallExercise);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching small exercise', error: error.message });
  }
};

// Cập nhật thông tin của một small exercise
exports.updateSmallExercise = async (req, res) => {
  const { id } = req.params;
  const { round_id, name, description, duration } = req.body;

  try {
    const smallExercise = await SmallExercise.findOne({ where: { id } });

    if (!smallExercise) {
      return res.status(404).json({ message: 'Small exercise not found' });
    }

    smallExercise.round_id = round_id;
    smallExercise.name = name;
    smallExercise.description = description;
    smallExercise.duration = duration;

    await smallExercise.save();
    res.status(200).json(smallExercise);
  } catch (error) {
    res.status(500).json({ message: 'Error updating small exercise', error: error.message });
  }
};

// Xóa một small exercise
exports.deleteSmallExercise = async (req, res) => {
  const { id } = req.params;

  try {
    const smallExercise = await SmallExercise.findOne({ where: { id } });

    if (!smallExercise) {
      return res.status(404).json({ message: 'Small exercise not found' });
    }

    await smallExercise.destroy();
    res.status(200).json({ message: 'Small exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting small exercise', error: error.message });
  }
};
