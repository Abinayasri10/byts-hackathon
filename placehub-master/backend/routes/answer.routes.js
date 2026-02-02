import express from 'express';
const router = express.Router();
import * as answerController from '../controllers/answer.controller.js';

router.post('/', answerController.addAnswer);
router.get('/:questionId', answerController.getAnswersByQuestionId);
router.post('/:answerId/react', answerController.reactToAnswer);

export default router;
