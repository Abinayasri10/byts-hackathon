import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  createExperience,
  getUserExperiences,
  getRecentExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  saveDraft,
  getDraft,
  getExperiencesByCompany,
  getExperiencesByBatch,
} from '../controllers/experienceController.js'

const router = express.Router()

// Protected routes (require authentication)
router.post('/', authMiddleware, createExperience)
router.get('/my', authMiddleware, getUserExperiences)
router.get('/draft', authMiddleware, getDraft)
router.post('/draft', authMiddleware, saveDraft)
router.put('/:id', authMiddleware, updateExperience)
router.delete('/:id', authMiddleware, deleteExperience)

// Public routes
router.get('/recent', getRecentExperiences)
router.get('/:id', getExperienceById)
router.get('/company/:company', getExperiencesByCompany)
router.get('/batch/:batch', getExperiencesByBatch)

export default router
