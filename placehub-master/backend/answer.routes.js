const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answer.controller');

router.post('/', answerController.addAnswer);
router.get('/:questionId', answerController.getAnswersByQuestionId);
router.post('/:answerId/react', answerController.reactToAnswer);

module.exports = router;
