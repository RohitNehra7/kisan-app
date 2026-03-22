import { Router } from 'express';
import { StorageController } from '../controllers/storage.controller';

const router = Router();

router.get('/nearby', StorageController.getNearbyStorage);

export default router;
