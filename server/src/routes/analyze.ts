import { Router } from 'express';
import { analyzeResume } from '../controllers/analyzeController';

const router = Router();

router.post('/', analyzeResume);

export default router;