import { Router } from 'express';
import { analyticsSummary, analyticsTrends, analyticsByUser } from '../controllers/analyticsController';

const router = Router();

router.get('/summary', analyticsSummary);
router.get('/trends', analyticsTrends);
router.get('/user/:userId', analyticsByUser);

export default router;
