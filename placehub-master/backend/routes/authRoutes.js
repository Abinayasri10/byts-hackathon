import express from 'express'
import { signup, login, getMe, updatePreferences } from '../controllers/authController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', authenticate, getMe)
router.patch('/preferences', authenticate, updatePreferences)

export default router
