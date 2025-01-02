const express = require('express');
const roundController = require('../controllers/round.controller');
const router = express.Router();

router.get('/rounds', roundController.getAllRounds); // Lấy tất cả rounds
router.post('/rounds', roundController.createRound); // Tạo một round mới
router.get('/rounds/:id', roundController.getRoundById); // Lấy thông tin chi tiết của một round
router.put('/rounds/:id', roundController.updateRound); // Cập nhật thông tin round
router.delete('/rounds/:id', roundController.deleteRound); // Xóa một round

module.exports = router;
