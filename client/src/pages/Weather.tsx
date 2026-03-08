import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../services/api';
import { trackEvent } from '../services/analytics';
import SEO from '../components/common/Seo';
import { HARYANA_DISTRICTS } from '../constants/haryana.constants';

interface ForecastItem {
  date: string;
  temp: number;
  minTemp: number;
  condition: string;
  uvIndex: number;
  precipProb: number;
  sunrise: string;
  sunset: string;
  et0?: number; // Evapotranspiration
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
  forecast: ForecastItem[];
  is_mock: boolean;
}

const Weather: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [locating, setLocating] = useState(false);

  const fetchWeather = useCallback(async (district?: string, lat?: number, lon?: number) => {
    setLoading(true);
    try {
      let url = '/api/weather';
      if (lat && lon) {
        url += `?lat=${lat}&lon=${lon}`;
      } else if (district) {
        url += `?district=${district}`;
      } else {
        const phone = localStorage.getItem('farmer_phone');
        let d = 'Hisar';
        if (phone) {
          try {
            const profile = await apiFetch(`/api/farmer-profile/${phone}`);
            const profData = await profile.json();
            if (profData.success) d = profData.data.district;
          } catch (e) {}
        }
        url += `?district=${d}`;
        setSelectedDistrict(d);
      }

      const response = await apiFetch(url);
      const data = await response.json();
      if (data.success) {
        setWeather(data);
        if (data.district && !lat) setSelectedDistrict(data.district);
        trackEvent('weather_view', { district: data.district });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = e.target.value;
    setSelectedDistrict(d);
    fetchWeather(d);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(undefined, latitude, longitude);
        setLocating(false);
      },
      (error) => {
        console.error('Location error:', error);
        alert('Failed to detect location. Please select district manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const isHindi = i18n.language === 'hi';

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getUVStatus = (uv: number) => {
    if (uv <= 2) return isHindi ? 'कम' : 'Low';
    if (uv <= 5) return isHindi ? 'मध्यम' : 'Moderate';
    if (uv <= 7) return isHindi ? 'उच्च' : 'High';
    return isHindi ? 'अत्यधिक' : 'Very High';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32">
      <SEO 
        title={t('seo.weather_title')} 
        description={t('seo.weather_description')} 
      />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none">
          {isHindi ? 'किसान मौसम' : 'Kisan Mausam'}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 mb-6">
          {isHindi ? 'सटीक खेती की जानकारी' : 'Precision Weather for Farmers'}
        </p>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <select 
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 font-bold appearance-none shadow-sm focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>{isHindi ? 'अपना जिला चुनें' : 'Select District'}</option>
              {HARYANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
          </div>
          
          <button 
            onClick={handleDetectLocation}
            disabled={locating}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {locating ? '📡 Locating...' : '📍 Use My Current Location'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 shadow-2xl border border-slate-100">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Scanning Atmosphere...</p>
        </div>
      ) : weather && (
        <div className="flex flex-col gap-8">
          <div className={`bg-gradient-to-br ${weather.isDay ? 'from-[#1e3a8a] to-[#3b82f6]' : 'from-[#0f172a] to-[#1e293b]'} rounded-[3rem] p-10 text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] relative overflow-hidden group`}>
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-700"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight italic">{weather.district}</h2>
                <p className="opacity-70 font-bold text-xs uppercase tracking-widest mt-1">Haryana • India</p>
              </div>
              <span className="text-6xl filter drop-shadow-lg">
                {weather.condition.includes('Rain') ? '🌧️' : weather.condition.includes('Cloud') ? '⛅' : weather.isDay ? '☀️' : '🌙'}
              </span>
            </div>

            <div className="mt-12 mb-6 relative z-10">
              <div className="flex items-baseline">
                <span className="text-sm font-black uppercase tracking-widest opacity-70 mr-2">{isHindi ? 'अभी:' : 'Now:'}</span>
                <h3 className="text-8xl font-black leading-none tracking-tighter">{weather.currentTemp}</h3>
                <span className="text-4xl font-bold mt-2">°C</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-2xl font-black uppercase tracking-tight italic opacity-90">{weather.condition}</p>
                <span className="opacity-60 font-bold text-sm">• {isHindi ? 'महसूस' : 'Feels like'} {weather.feelsLike}°C</span>
              </div>
            </div>

            <div className="flex gap-4 mb-10 relative z-10">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex-1 text-center">
                <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-0.5">{isHindi ? 'अधिकतम' : 'High'}</p>
                <p className="text-xl font-black">{weather.todayHigh}°C</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex-1 text-center">
                <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-0.5">{isHindi ? 'न्यूनतम' : 'Low'}</p>
                <p className="text-xl font-black">{weather.todayLow}°C</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/20 pt-8 relative z-10">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'नमी' : 'Humidity'}</p>
                <p className="font-black text-xl">{weather.humidity}%</p>
              </div>
              <div className="text-center border-l border-white/10">
                <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'हवा' : 'Wind'}</p>
                <p className="font-black text-xl">{weather.windSpeed}<span className="text-xs ml-0.5">km/h</span></p>
              </div>
              {weather.uvIndex > 0 && (
                <div className="text-center border-l border-white/10">
                  <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'UV इंडेक्स' : 'UV Index'}</p>
                  <p className="font-black text-xl">{weather.uvIndex} <span className="text-[10px] opacity-60">({getUVStatus(weather.uvIndex)})</span></p>
                </div>
              )}
              {weather.visibility && (
                <div className="text-center border-l border-white/10">
                  <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'दृश्यता' : 'Visibility'}</p>
                  <p className="font-black text-xl">{weather.visibility}<span className="text-xs ml-0.5">km</span></p>
                </div>
              )}
            </div>

            {(weather.sunrise || weather.sunset) && (
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between relative z-10">
                {weather.sunrise && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌅</span>
                    <div>
                      <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">{isHindi ? 'सूर्योदय' : 'Sunrise'}</p>
                      <p className="font-bold text-sm">{weather.sunrise}</p>
                    </div>
                  </div>
                )}
                {weather.sunset && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">{isHindi ? 'सूर्यास्त' : 'Sunset'}</p>
                      <p className="font-bold text-sm">{weather.sunset}</p>
                    </div>
                    <span className="text-xl">🌇</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">{isHindi ? '7-दिनों का पूर्वानुमान' : '7-Day Agriculture Outlook'}</h4>
            <div className="flex flex-col gap-6">
              {weather.forecast?.map((day, idx) => (
                <div key={idx} className="flex justify-between items-center group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col w-32">
                    <p className="font-black text-slate-900 uppercase text-[10px] tracking-tighter">{formatDay(day.date)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-blue-500">💧 {day.precipProb}%</span>
                      {day.et0 && <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">🔥 ET0: {day.et0}mm</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                      {day.condition.includes('Rain') ? '🌧️' : day.condition.includes('Cloud') ? '⛅' : '☀️'}
                    </span>
                    <span className="text-[8px] font-black text-slate-400 uppercase mt-1">{day.condition}</span>
                  </div>
                  <div className="flex gap-4 w-24 justify-end items-baseline">
                    <span className="text-xl font-black text-slate-900">{day.temp}°</span>
                    <span className="text-sm font-bold text-slate-300">{day.minTemp}°</span>
                  </div>
                </div>
              )) || (
                <p className="text-slate-400 text-xs font-bold text-center py-4">No forecast data available</p>
              )}
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-100 rounded-[2rem] p-6 flex gap-5 items-start">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">💡</div>
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{isHindi ? 'एआई फसल सलाह' : 'AI Harvest Intelligence'}</p>
              <p className="text-base font-bold text-amber-900 leading-tight italic">
                {isHindi 
                  ? (weather.condition.includes('Rain') || (weather.forecast && weather.forecast[0].precipProb > 30) ? 'अगले कुछ दिनों में बारिश की संभावना है। कृपया तैयार फसल को सुरक्षित स्थान पर रखें।' : 'आसमान साफ रहने की उम्मीद है। फसलों की कटाई और सुखाने के लिए यह सही समय है।') 
                  : (weather.condition.includes('Rain') || (weather.forecast && weather.forecast[0].precipProb > 30) ? 'Rain expected soon. Move harvested crops to safe storage immediately.' : 'Clear skies expected. Ideal time for crop harvesting and drying.')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
