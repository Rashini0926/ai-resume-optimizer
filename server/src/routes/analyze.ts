import { Router } from 'express';
import { analyzeResume } from '../controllers/analyzeController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, analyzeResume);

export default router;
