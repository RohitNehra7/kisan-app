import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

router.post('/', ProfileController.updateProfile);
router.get('/:auth_id', ProfileController.getProfile);

export default router;
