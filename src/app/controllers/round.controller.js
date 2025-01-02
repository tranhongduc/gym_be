const { Round } = require('../models'); // Sử dụng model Round

// Lấy tất cả các round
exports.getAllRounds = async (req, res) => {
  try {
    const rounds = await Round.findAll();
    return res.status(200).json(rounds);
  } catch (error) {
    console.error('Error fetching rounds:', error);
    return res.status(500).json({ error: 'Failed to fetch rounds' });
  }
};

// Tạo một round mới
exports.createRound = async (req, res) => {
  const { exerciseId, name, description, order } = req.body;
  
  if (!exerciseId || !name || !description || order === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const round = await Round.create({
      exerciseId,
      name,
      description,
      order,
    });
    return res.status(201).json(round);
  } catch (error) {
    console.error('Error creating round:', error);
    return res.status(500).json({ error: 'Failed to create round' }, error.message);
  }
};

// Lấy thông tin chi tiết một round theo ID
exports.getRoundById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const round = await Round.findByPk(id);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    return res.status(200).json(round);
  } catch (error) {
    console.error('Error fetching round:', error);
    return res.status(500).json({ error: 'Failed to fetch round' });
  }
};

// Cập nhật thông tin một round
exports.updateRound = async (req, res) => {
  const { id } = req.params;
  const { exercise_id, name, description, order } = req.body;
  
  try {
    const round = await Round.findByPk(id);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    round.exercise_id = exercise_id || round.exercise_id;
    round.name = name || round.name;
    round.description = description || round.description;
    round.order = order !== undefined ? order : round.order;
    
    await round.save();
    return res.status(200).json(round);
  } catch (error) {
    console.error('Error updating round:', error);
    return res.status(500).json({ error: 'Failed to update round' });
  }
};

// Xóa một round
exports.deleteRound = async (req, res) => {
  const { id } = req.params;
  
  try {
    const round = await Round.findByPk(id);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    await round.destroy();
    return res.status(200).json({ message: 'Round deleted successfully' });
  } catch (error) {
    console.error('Error deleting round:', error);
    return res.status(500).json({ error: 'Failed to delete round' });
  }
};
