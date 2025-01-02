const express = require('express');
const mediaController = require('../controllers/media.controller');

const router = express.Router();

// Endpoint upload media
router.post('/', mediaController.uploadMedia);
router.post('/uploadF', mediaController.uploadMediaF);
router.post('/uploadS', mediaController.uploadMediaS);
router.post('/upload', mediaController.uploadMedia2);


module.exports = router;
