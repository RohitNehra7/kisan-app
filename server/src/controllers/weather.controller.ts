import { Request, Response } from 'express';
import { WeatherService } from '../services/weather.service';

export class WeatherController {
  static async getCurrentWeather(req: Request, res: Response) {
    try {
      const { district, lat, lon } = req.query;
      
      const weatherParams: { district?: string; lat?: number; lon?: number } = {
        district: district as string
      };
      
      if (lat) weatherParams.lat = parseFloat(lat as string);
      if (lon) weatherParams.lon = parseFloat(lon as string);

      const weather = await WeatherService.getFullWeather(weatherParams);
      
      if (!weather) {
        return res.json({ 
          success: true, 
          temp: 24, 
          condition: "Clear", 
          district: district || "Unknown", 
          is_mock: true 
        });
      }

      res.json({
        success: true,
        ...weather,
        is_mock: false
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
