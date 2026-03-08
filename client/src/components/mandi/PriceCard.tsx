import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useInView } from 'react-intersection-observer';
import { apiFetch } from '../../services/api';
import { MSP_2025 } from '../../constants/haryana.constants';
import type { MandiPrice, UnitType } from '../../types/mandi.types';

interface PriceCardProps {
  record: MandiPrice;
  unit: UnitType;
  isFavorite: boolean;
  onToggleFavorite: (commodity: string) => void;
  onViewTrends: (market: string, commodity: string) => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ 
  record, 
  unit, 
  isFavorite, 
  onToggleFavorite,
  onViewTrends 
}) => {
  const { t } = useTranslation();
  const [trendData, setTrendData] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Lazy loading hook: triggered when card is 10% visible
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && !hasFetched) {
      const fetchTrend = async () => {
        try {
          const resp = await apiFetch(`/api/mandi/history?market=${encodeURIComponent(record.market)}&commodity=${encodeURIComponent(record.commodity)}`);
          const json = await resp.json();
          if (json.success) {
            setTrendData(json.data.slice(-7));
            setHasFetched(true);
          }
        } catch (e) {}
      };
      fetchTrend();
    }
  }, [inView, hasFetched, record.market, record.commodity]);

  const convertPrice = (price: number) => {
    if (unit === 'maund') return Math.round(price * 0.4);
    if (unit === 'kg') return Math.round(price / 100);
    return Math.round(price);
  };

  const shareToWhatsApp = () => {
    const text = `🌾 *KisanNiti Mandi Update*%0A📍 Mandi: ${record.market}, ${record.district}%0A📦 Crop: ${record.commodity}%0A💰 Price: ₹${record.modal_price}/quintal%0A📅 Date: ${record.arrival_date}%0A%0A_Download KisanNiti App for Live Updates!_`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const mspValue = MSP_2025[record.commodity] || MSP_2025[record.commodity.split('(')[0].trim()];
  const isAboveMSP = mspValue ? record.modal_price >= mspValue : null;

  const unitLabel = t(`common.${unit}`);

  const getDaysOld = (dateStr: string): number => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      const arrival = new Date(year, month - 1, day);
      arrival.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return Math.floor((today.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    } catch (e) { return 999; }
  };

  const daysOld = getDaysOld(record.arrival_date);
  const freshnessLabel = daysOld === 0 ? t('freshness.today') : (daysOld === 1 ? t('freshness.yesterday') : t('freshness.stale', { days: daysOld }));
  const freshnessColor = daysOld === 0 ? 'text-emerald-600 bg-emerald-50' : (daysOld === 1 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group h-full">
      {/* Freshness Badge */}
      <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest transition-colors ${freshnessColor}`}>
        {freshnessLabel}
      </div>

      {/* MSP Badge */}
      {mspValue && (
        <div className={`absolute top-0 left-0 px-3 py-1 rounded-br-2xl text-[8px] font-black uppercase tracking-widest ${isAboveMSP ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isAboveMSP ? '✅ Above MSP' : '⚠️ Below MSP'}
        </div>
      )}

      <div className="flex justify-between items-start mb-4 mt-2">
        <div>
          <h3 className="font-black text-slate-900 text-xl leading-tight uppercase tracking-tighter italic">
            {record?.commodity || 'N/A'}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {record?.variety || 'General'}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(record?.commodity)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-slate-400 text-lg font-semibold">₹</span>
        <span className="text-4xl font-black text-primary tracking-tighter">
          {convertPrice(record?.modal_price).toLocaleString()}
        </span>
        <span className="text-slate-400 text-[10px] font-bold uppercase ml-1">/ {unitLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-white transition-colors">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{t('common.min')}</p>
          <p className="text-slate-700 font-bold text-sm">₹{convertPrice(record?.min_price).toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-white transition-colors">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{t('common.max')}</p>
          <p className="text-slate-700 font-bold text-sm">₹{convertPrice(record?.max_price).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-lg">📍</div>
        <div className="overflow-hidden">
          <p className="text-slate-900 font-black text-sm leading-tight truncate uppercase tracking-tight">{record?.market}</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">{record?.district}</p>
        </div>
      </div>

      {/* 7-Day Sparkline */}
      {trendData.length > 1 && (
        <div className="h-12 w-full mb-4 bg-slate-50 rounded-xl p-1 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <YAxis hide domain={['auto', 'auto']} />
              <Line 
                type="monotone" 
                dataKey="modal_price" 
                stroke="#1B5E20" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onViewTrends(record?.market, record?.commodity)}
          className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:bg-primary flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
        >
          📊 {t('common.view_trends')}
        </button>
        <button
          onClick={shareToWhatsApp}
          className="w-12 bg-[#25D366] text-white py-3 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 hover:scale-105 transition-transform"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-2.578l-.361-.214-3.741.982 1.001-3.646-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default PriceCard;
