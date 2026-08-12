import { Router } from 'express';
import ResumeAnalysis from '../models/ResumeAnalysis';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const history = await ResumeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch history',
    });
  }
});

export default router;