import express from 'express'
import { createProfile, getProfile, updateProfile } from '../controllers/profileController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', authenticate, createProfile)
router.get('/', authenticate, getProfile)
router.put('/', authenticate, updateProfile)

export default router
