import axios from 'axios';

interface DailyForecast {
  date: string;
  temp: number;
  minTemp: number;
  condition: string;
  uvIndex: number;
  precipProb: number;
  sunrise: string;
  sunset: string;
  et0?: number; // Evapotranspiration
  soilTemp?: number;
}

interface WeatherData {
  currentTemp: number;
  feelsLike: number;
  todayHigh: number;
  todayLow: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number | null;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  district: string;
  forecast: DailyForecast[];
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
  private static getCondition(code: number): string {
    if (code === 0) return "Clear";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
  }

  /**
   * Get exhaustive weather data using Open-Meteo API
   */
  static async getFullWeather(params: { district?: string, lat?: number, lon?: number }): Promise<WeatherData | null> {
    try {
      let lat = params.lat;
      let lon = params.lon;
      let districtName = params.district || "Detected Location";

      if (!lat || !lon) {
        const coords = DISTRICT_COORDS[params.district || "Karnal"] || DISTRICT_COORDS["Karnal"];
        lat = coords.lat;
        lon = coords.lon;
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,weather_code,relative_humidity_2m,wind_speed_10m,visibility&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max,precipitation_probability_max,sunrise,sunset,et0_fao_evapotranspiration&timezone=auto&forecast_days=14`;
      
      const response = await axios.get(url);
      const data = response.data;

      if (!data || !data.current || !data.daily) return null;

      const current = data.current;
      const daily = data.daily;

      const formatTime = (iso: string) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      };

      const forecast: DailyForecast[] = daily.time.map((date: string, index: number) => ({
        date,
        temp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        condition: this.getCondition(daily.weather_code[index]),
        uvIndex: daily.uv_index_max[index],
        precipProb: daily.precipitation_probability_max[index],
        sunrise: formatTime(daily.sunrise[index]),
        sunset: formatTime(daily.sunset[index]),
        et0: daily.et0_fao_evapotranspiration ? daily.et0_fao_evapotranspiration[index] : null
      }));

      return {
        currentTemp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        todayHigh: Math.round(daily.temperature_2m_max[0]),
        todayLow: Math.round(daily.temperature_2m_min[0]),
        condition: this.getCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        uvIndex: daily.uv_index_max[0],
        visibility: current.visibility ? Math.round(current.visibility / 1000) : null, 
        isDay: current.is_day === 1,
        sunrise: formatTime(daily.sunrise[0]),
        sunset: formatTime(daily.sunset[0]),
        district: districtName,
        forecast
      };
    } catch (e) {
      console.error('Weather Fetch Error:', e);
      return null;
    }
  }
}
