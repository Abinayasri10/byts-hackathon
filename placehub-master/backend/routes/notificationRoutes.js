import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  createReport,
  blockUser,
  unblockUser,
  getBlockedUsers,
} from '../controllers/notificationController.js'

const router = express.Router()

router.get('/', authMiddleware, getNotifications)
router.put('/:notificationId/read', authMiddleware, markNotificationAsRead)
router.put('/read-all', authMiddleware, markAllAsRead)
router.delete('/:notificationId', authMiddleware, deleteNotification)
router.post('/report', authMiddleware, createReport)
router.post('/block', authMiddleware, blockUser)
router.delete('/block/:blockedUserId', authMiddleware, unblockUser)
router.get('/blocked', authMiddleware, getBlockedUsers)

export default router
