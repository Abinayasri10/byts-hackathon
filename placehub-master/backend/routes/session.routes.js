import express from 'express';
import * as sessionController from '../controllers/session.controller.js';
const router = express.Router();

router.post('/init', sessionController.initSession);
router.get('/:sessionId/stats', sessionController.getSessionStats);

export default router;
