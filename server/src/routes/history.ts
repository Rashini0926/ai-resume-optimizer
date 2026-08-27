import { Router } from 'express';
import ResumeAnalysis from '../models/ResumeAnalysis';
import { requireAuth } from '../middleware/authMiddleware';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const history = await ResumeAnalysis.find({ userId: req.user!.id })
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
