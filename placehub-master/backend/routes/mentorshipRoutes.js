import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getAvailableMentors,
  getAvailableMentees,
  sendMentorshipRequest,
  getReceivedRequests,
  getSentRequests,
  respondToRequest,
  completeMentorship,
  cancelRequest,
  submitFeedback,
  getMentorshipStats,
  updateMentorNotes,
  incrementSessionCount,
} from '../controllers/mentorshipController.js'

const router = express.Router()

// Get mentors and mentees
router.get('/mentors', authMiddleware, getAvailableMentors)
router.get('/mentees', authMiddleware, getAvailableMentees)

// Mentorship stats
router.get('/stats', authMiddleware, getMentorshipStats)

// Request management
router.post('/request', authMiddleware, sendMentorshipRequest)
router.get('/requests/received', authMiddleware, getReceivedRequests)
router.get('/requests/sent', authMiddleware, getSentRequests)
router.put('/requests/:requestId/respond', authMiddleware, respondToRequest)
router.put('/requests/:requestId/complete', authMiddleware, completeMentorship)
router.put('/requests/:requestId/cancel', authMiddleware, cancelRequest)

// Feedback and notes
router.post('/requests/:requestId/feedback', authMiddleware, submitFeedback)
router.put('/requests/:requestId/notes', authMiddleware, updateMentorNotes)
router.put('/requests/:requestId/session', authMiddleware, incrementSessionCount)

export default router
