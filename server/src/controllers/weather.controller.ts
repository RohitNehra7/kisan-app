import { Request, Response } from 'express';
import { WeatherService } from '../services/weather.service';

export class WeatherController {
  static async getCurrentWeather(req: Request, res: Response) {
    try {
      const { district } = req.query;
      if (!district) return res.status(400).json({ error: 'District is required' });

      const weather = await WeatherService.getFullWeather(district as string);
      
      if (!weather) {
        return res.json({ 
          success: true, 
          temp: 24, 
          condition: "Clear", 
          district, 
          is_mock: true 
        });
      }

      res.json({
        success: true,
        ...weather,
        district,
        is_mock: false
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
