import { Router } from 'express'
import {
  listOpportunities,
  getOpportunityFilters,
  getOpportunityById,
  createOpportunity,
} from '../controllers/opportunityController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', listOpportunities)
router.get('/filters', getOpportunityFilters)
router.get('/:id', getOpportunityById)
router.post('/', authMiddleware, createOpportunity)

export default router
