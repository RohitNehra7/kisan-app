import { Router } from 'express';
import { AdvisoryController } from '../controllers/advisory.controller';

const router = Router();

router.post('/sell-hold', AdvisoryController.getRecommendation);

export default router;
