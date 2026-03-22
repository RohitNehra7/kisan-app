import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { apiFetch } from '../../services/api';

interface SeasonalData {
  month: number;
  avg_price: number;
}

interface SeasonalPatternCardProps {
  district: string;
  commodity: string;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const SeasonalPatternCard: React.FC<SeasonalPatternCardProps> = ({ district, commodity }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  
  const [data, setData] = useState<SeasonalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeasonal = async () => {
      try {
        const resp = await apiFetch(`/api/mandi/seasonal?district=${district}&commodity=${encodeURIComponent(commodity)}`);
        const json = await resp.json();
        if (json.success) setData(json.data);
      } catch (e) {
        console.error('Failed to load seasonal data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeasonal();
  }, [district, commodity]);

  if (isLoading) return <div className="animate-pulse bg-slate-100 h-64 rounded-[2rem] w-full" />;
  if (data.length === 0) return null;

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl overflow-hidden mt-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">⏳</div>
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
            {isHindi ? '3-साल का ऐतिहासिक रुझान' : '3-Year Historical Trend'}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {commodity} | {district}
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(val) => MONTHS[val-1]}
              tick={{fontSize: 10, fontWeight: 900}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              labelFormatter={(val) => MONTHS[val-1]}
              contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900}}
            />
            <Bar dataKey="avg_price" radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.month === currentMonth ? '#1B5E20' : '#E2E8F0'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p className="text-xs font-bold text-slate-700 leading-tight">
          💡 {isHindi ? 'ऐतिहासिक रूप से, इस फसल के भाव अगले 30-60 दिनों में बढ़ने की संभावना है।' : 'Historically, prices for this crop tend to recover in the next 30-60 days.'}
        </p>
      </div>
    </div>
  );
};

export default SeasonalPatternCard;
