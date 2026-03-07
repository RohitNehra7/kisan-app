import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../services/api';

interface ForecastItem {
  date: string;
  temp: number;
  condition: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  district: string;
  forecast?: ForecastItem[];
  is_mock: boolean;
}

const Weather: React.FC = () => {
  const { i18n } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const phone = localStorage.getItem('farmer_phone');
        let district = 'Hisar';
        
        if (phone) {
          try {
            const profile = await apiFetch(`/api/farmer-profile/${phone}`);
            const profData = await profile.json();
            if (profData.success) district = profData.data.district;
          } catch (e) {
            console.warn('Profile fetch fail, using default district');
          }
        }

        const response = await apiFetch(`/api/weather?district=${district}`);
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const isHindi = i18n.language === 'hi';

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none">
          {isHindi ? 'किसान मौसम' : 'Kisan Mausam'}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
          {isHindi ? 'सटीक खेती की जानकारी' : 'Precision Weather for Farmers'}
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 shadow-2xl border border-slate-100">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Scanning Atmosphere...</p>
        </div>
      ) : weather && (
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] rounded-[3rem] p-10 text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] relative overflow-hidden group">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-700"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight italic">{weather.district}</h2>
                <p className="opacity-70 font-bold text-xs uppercase tracking-widest mt-1">Haryana • India</p>
              </div>
              <span className="text-6xl filter drop-shadow-lg">
                {weather.condition.includes('Rain') ? '🌧️' : weather.condition.includes('Cloud') ? '⛅' : '☀️'}
              </span>
            </div>

            <div className="mt-12 mb-10 relative z-10">
              <div className="flex items-start">
                <h3 className="text-8xl font-black leading-none tracking-tighter">{weather.temp}</h3>
                <span className="text-4xl font-bold mt-2">°C</span>
              </div>
              <p className="text-2xl font-black mt-4 uppercase tracking-tight italic opacity-90">{weather.condition}</p>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-8 relative z-10">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'नमी' : 'Humidity'}</p>
                <p className="font-black text-xl">42%</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'हवा' : 'Wind'}</p>
                <p className="font-black text-xl">12<span className="text-xs ml-0.5">km/h</span></p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase opacity-50 tracking-widest mb-1">{isHindi ? 'बारिश' : 'Rain'}</p>
                <p className="font-black text-xl">{weather.condition.includes('Rain') ? '80%' : '0%'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">{isHindi ? '7-दिनों का पूर्वानुमान' : '7-Day Agriculture Outlook'}</h4>
            <div className="flex flex-col gap-6">
              {weather.forecast?.map((day, idx) => (
                <div key={idx} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-4 w-32">
                    <p className="font-black text-slate-900 uppercase text-[10px] tracking-tighter">{formatDay(day.date)}</p>
                  </div>
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                    {day.condition.includes('Rain') ? '🌧️' : day.condition.includes('Cloud') ? '⛅' : '☀️'}
                  </span>
                  <div className="flex gap-4 w-24 justify-end items-baseline">
                    <span className="text-xl font-black text-slate-900">{day.temp}°</span>
                    <span className="text-sm font-bold text-slate-300">{day.temp - 8}°</span>
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
                  ? (weather.condition.includes('Rain') ? 'अगले कुछ दिनों में बारिश की संभावना है। कृपया तैयार फसल को सुरक्षित स्थान पर रखें।' : 'आसमान साफ रहने की उम्मीद है। फसलों की कटाई और सुखाने के लिए यह सही समय है।') 
                  : (weather.condition.includes('Rain') ? 'Rain expected soon. Move harvested crops to safe storage immediately.' : 'Clear skies expected. Ideal time for crop harvesting and drying.')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
