import { Router } from 'express';
import ResumeAnalysis from '../models/ResumeAnalysis';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const history = await ResumeAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json(history);
  } catch (error) {
    console.error('Failed to fetch resume analysis history:', error);
    return res.status(500).json({
      error: 'Failed to fetch history',
    });
  }
});

export default router;
