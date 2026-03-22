import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiFetch } from '../../services/api';

interface StorageLocation {
  id: string;
  name: string;
  district: string;
  type: string;
  capacity_mt: number;
  nwr_eligible: boolean;
  cost_per_qtl_month: number;
  commodities_accepted: string[];
}

interface StorageOptionsProps {
  district: string;
  commodity: string;
}

const StorageOptions: React.FC<StorageOptionsProps> = ({ district, commodity }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const resp = await apiFetch(`/api/storage/nearby?district=${district}&commodity=${encodeURIComponent(commodity)}`);
        const json = await resp.json();
        if (json.success) setLocations(json.data);
      } catch (e) {
        console.error('Failed to load storage options');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStorage();
  }, [district, commodity]);

  if (isLoading) return <div className="animate-pulse bg-slate-100 h-32 rounded-3xl w-full" />;
  if (locations.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 ml-1">
        <span className="text-xl">🏢</span>
        <h3 className="text-lg font-black uppercase tracking-tighter italic text-slate-800">
          {isHindi ? 'भंडारण (Storage) के विकल्प' : 'Nearby Storage Options'}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {locations.map((loc, idx) => (
          <motion.div 
            key={loc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-black text-slate-900 leading-none uppercase italic tracking-tighter">{loc.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">📍 {loc.district}</p>
              </div>
              {loc.nwr_eligible && (
                <div className="bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">NWR Pledge ✓</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{isHindi ? 'लागत' : 'Cost'}</p>
                <p className="text-lg font-black text-primary">₹{loc.cost_per_qtl_month}<span className="text-[10px] text-slate-400">/q/month</span></p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{isHindi ? 'क्षमता' : 'Capacity'}</p>
                <p className="text-lg font-black text-slate-700">{loc.capacity_mt.toLocaleString()}<span className="text-[10px] text-slate-400"> MT</span></p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{isHindi ? 'लोन की सुविधा' : 'Loan (NWR) Benefit'}</p>
              <p className="text-xs font-bold text-slate-600 leading-tight">
                {isHindi ? 'फसल यहाँ रखें, KCC लोन लें और भाव बढ़ने का इंतज़ार करें।' : 'Store crop here, get KCC credit and wait for better prices.'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StorageOptions;
