import { Router } from 'express';
import { analyticsSummary, analyticsTrends, analyticsByUser } from '../controllers/analyticsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();
router.use(requireAuth);

router.get('/summary', analyticsSummary);
router.get('/trends', analyticsTrends);
router.get('/user/:userId', analyticsByUser);

export default router;
