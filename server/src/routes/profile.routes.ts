import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

router.post('/', ProfileController.updateProfile);
router.get('/:phone', ProfileController.getProfile);

export default router;
