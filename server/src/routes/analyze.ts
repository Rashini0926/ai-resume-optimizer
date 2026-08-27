import { Router } from 'express';
import { analyzeResume } from '../controllers/analyzeController';
import { optionalAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', optionalAuth, analyzeResume);

export default router;
