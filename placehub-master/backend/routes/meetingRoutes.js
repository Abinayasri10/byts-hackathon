import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  cancelMeeting,
  completeMeeting,
} from '../controllers/meetingController.js'

const router = express.Router()

router.post('/', authMiddleware, createMeeting)
router.get('/', authMiddleware, getMeetings)
router.get('/:meetingId', authMiddleware, getMeetingById)
router.put('/:meetingId', authMiddleware, updateMeeting)
router.put('/:meetingId/cancel', authMiddleware, cancelMeeting)
router.put('/:meetingId/complete', authMiddleware, completeMeeting)

export default router
