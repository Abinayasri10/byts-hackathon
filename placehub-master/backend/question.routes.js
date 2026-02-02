const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

router.post('/', questionController.createQuestion);
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);
router.patch('/:id/status', questionController.updateQuestionStatus);

module.exports = router;
