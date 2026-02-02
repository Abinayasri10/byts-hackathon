import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  getMyQuestions,
  addAnswer,
  markAnswerHelpful,
  markAsResolved,
  deleteQuestion,
} from '../controllers/questionController.js'

const router = express.Router()

router.post('/', authMiddleware, createQuestion)
router.get('/', authMiddleware, getQuestions)
router.get('/my', authMiddleware, getMyQuestions)
router.get('/:questionId', authMiddleware, getQuestionById)
router.post('/:questionId/answers', authMiddleware, addAnswer)
router.put('/:questionId/answers/:answerId/helpful', authMiddleware, markAnswerHelpful)
router.put('/:questionId/resolve', authMiddleware, markAsResolved)
router.delete('/:questionId', authMiddleware, deleteQuestion)

export default router
