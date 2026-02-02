import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
    getStats,
    getManageableUsers,
    getStudents,
    getPlacedStudents,
    getProblems,
    getStudentDetail,
    getProblemDetail,
    deleteStudent,
    deleteProblem,
    getAllMeetings,
    updateMeeting,
    getLogs
} from '../controllers/adminController.js'

const router = express.Router()

// All routes are protected by auth and admin middleware
router.use(authMiddleware)
router.use(isAdmin)

router.get('/stats', getStats)
router.get('/users', getManageableUsers)
router.get('/students', getStudents)
router.get('/placed-students', getPlacedStudents)
router.get('/problems', getProblems)
router.get('/students/:id', getStudentDetail)
router.get('/problems/:id', getProblemDetail)
router.delete('/students/:id', deleteStudent)
router.delete('/users/:id', deleteStudent)
router.post('/problems/:id/delete', deleteProblem) // Using POST for deletion to send 'reason' in body

// Meetings management
router.get('/meetings', getAllMeetings)
router.put('/meetings/:id', updateMeeting)

// System Logs
router.get('/logs', getLogs)

export default router
