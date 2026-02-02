import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
  markAsRead,
} from '../controllers/messageController.js'

const router = express.Router()

router.get('/conversations', authMiddleware, getConversations)
router.post('/conversations', authMiddleware, startConversation)
router.get('/:conversationId', authMiddleware, getMessages)
router.post('/', authMiddleware, sendMessage)
router.put('/:conversationId/read', authMiddleware, markAsRead)

export default router
