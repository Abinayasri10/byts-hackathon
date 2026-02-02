import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  createMaterial,
  getMaterialFilters,
  getMaterials,
  getMaterialById,
} from '../controllers/materialController.js'

const router = express.Router()

router.get('/', getMaterials)
router.get('/filters/options', getMaterialFilters)
router.get('/:id', getMaterialById)
router.post('/', authMiddleware, createMaterial)

export default router
