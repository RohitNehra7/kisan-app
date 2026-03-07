import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller';

const router = Router();

router.get('/', WeatherController.getCurrentWeather);

export default router;
