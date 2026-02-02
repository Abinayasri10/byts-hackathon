import express from 'express';
const router = express.Router();
import * as questionController from '../controllers/question.controller.js';

router.post('/', questionController.createQuestion);
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);
router.patch('/:id/status', questionController.updateQuestionStatus);

export default router;
