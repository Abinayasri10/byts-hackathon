const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');

router.post('/init', sessionController.initSession);
router.get('/:sessionId/stats', sessionController.getSessionStats);

module.exports = router;
