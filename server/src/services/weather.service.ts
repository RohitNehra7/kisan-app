import axios from 'axios';

interface DailyForecast {
  date: string;
  temp: number;
  condition: string;
}

const DISTRICT_COORDS: Record<string, {lat: number, lon: number}> = {
  "Ambala": {lat: 30.3782, lon: 76.7767},
  "Bhiwani": {lat: 28.7831, lon: 76.1394},
  "Charkhi Dadri": {lat: 28.5921, lon: 76.2653},
  "Faridabad": {lat: 28.4089, lon: 77.3178},
  "Fatehabad": {lat: 29.5139, lon: 75.4511},
  "Gurugram": {lat: 28.4595, lon: 77.0266},
  "Hisar": {lat: 29.1492, lon: 75.7217},
  "Jhajjar": {lat: 28.6063, lon: 76.6567},
  "Jind": {lat: 29.3176, lon: 76.3193},
  "Kaithal": {lat: 29.8015, lon: 76.3996},
  "Karnal": {lat: 29.6857, lon: 76.9907},
  "Kurukshetra": {lat: 29.9691, lon: 76.8783},
  "Mahendragarh": {lat: 28.2743, lon: 76.1321},
  "Nuh": {lat: 28.1064, lon: 77.0113},
  "Palwal": {lat: 28.1487, lon: 77.3320},
  "Panchkula": {lat: 30.6942, lon: 76.8606},
  "Panipat": {lat: 29.3909, lon: 76.9635},
  "Rewari": {lat: 28.1835, lon: 76.6020},
  "Rohtak": {lat: 28.8955, lon: 76.6066},
  "Sirsa": {lat: 29.5335, lon: 75.0177},
  "Sonipat": {lat: 28.9931, lon: 77.0151},
  "Yamunanagar": {lat: 30.1290, lon: 77.2674}
};

export class WeatherService {
  /**
   * Get 14-day weather forecast using free Open-Meteo API
   */
  static async get14DayForecast(district: string): Promise<DailyForecast[]> {
    try {
      const coords = DISTRICT_COORDS[district] || { lat: 29.6857, lon: 76.9907 };
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,weathercode&timezone=auto&forecast_days=14`;
      
      const response = await axios.get(url);
      const daily = response.data.daily;

      return daily.time.map((date: string, index: number) => {
        const code = daily.weathercode[index];
        let condition = "Clear";
        if (code >= 1 && code <= 3) condition = "Partly Cloudy";
        else if (code >= 45 && code <= 48) condition = "Fog";
        else if (code >= 51 && code <= 67) condition = "Rain";
        else if (code >= 71 && code <= 77) condition = "Snow";
        else if (code >= 80 && code <= 82) condition = "Showers";
        else if (code >= 95 && code <= 99) condition = "Thunderstorm";

        return {
          date,
          temp: Math.round(daily.temperature_2m_max[index]),
          condition
        };
      });
    } catch (e) {
      console.error('Weather Fetch Error:', e);
      return [];
    }
  }
}
