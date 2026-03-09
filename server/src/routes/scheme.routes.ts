import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller';

const router = Router();

router.get('/', SchemeController.getSchemes);

export default router;
