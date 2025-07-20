
const express = require('express');
const VideoController = require('../controllers/videoController');
const router = express.Router();

router.post('/upload', VideoController.upload);

module.exports = router;
