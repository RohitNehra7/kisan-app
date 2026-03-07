import { Request, Response } from 'express';
import { WeatherService } from '../services/weather.service';

export class WeatherController {
  static async getCurrentWeather(req: Request, res: Response) {
    try {
      const { district } = req.query;
      if (!district) return res.status(400).json({ error: 'District is required' });

      const forecast = await WeatherService.get14DayForecast(district as string);
      
      if (forecast.length === 0) {
        return res.json({ 
          success: true, 
          temp: 24, 
          condition: "Clear", 
          district, 
          is_mock: true 
        });
      }

      const current = forecast[0];
      if (!current) throw new Error("Forecast data missing");

      res.json({
        success: true,
        temp: current.temp,
        condition: current.condition,
        district,
        forecast: forecast.slice(1, 8), // 7-day outlook
        is_mock: false
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
