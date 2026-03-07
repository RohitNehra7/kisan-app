import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { captureEvent } from '../services/posthog';
import { apiFetch } from '../services/api';
import { HARYANA_PRIMARY_CROPS, HARYANA_DISTRICTS } from '../constants/haryana.constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ArbitrageResult {
  mandi: string;
  distance: number;
  gross_price: number;
  transport_cost: number;
  net_earnings: number;
  is_best: boolean;
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const MandiArbitrage: React.FC = () => {
  const { i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    quantity: 50,
    district: 'Hisar',
    transport_rate: 4 // Rs/km/quintal
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ArbitrageResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    
    captureEvent('arbitrage_calculated', { crop: formData.crop, district: formData.district });

    try {
      const response = await apiFetch('/api/arbitrage', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 py-8 md:py-12 pb-32"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-primary mb-2 uppercase tracking-tighter italic">
          {i18n.language === 'hi' ? 'मंडी मैथ' : 'Mandi Math'}
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-70">
          {i18n.language === 'hi' ? 'सबसे ज्यादा मुनाफा देने वाली मंडी चुनें' : 'Find the Mandi with Maximum Net Profit'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Crop</label>
                <select 
                  value={formData.crop}
                  onChange={e => setFormData({...formData, crop: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold appearance-none"
                >
                  {HARYANA_PRIMARY_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity (Quintals)</label>
                <input 
                  type="number" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Location (District)</label>
                <select 
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold appearance-none"
                >
                  {HARYANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transport Rate (₹/km/quintal)</label>
                <input 
                  type="number" step="0.1"
                  value={formData.transport_rate}
                  onChange={e => setFormData({...formData, transport_rate: parseFloat(e.target.value)})}
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold"
                />
              </div>

              <button type="submit" disabled={isLoading} className="md:col-span-2 bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:opacity-90 transition-all mt-4 flex items-center justify-center gap-3">
                {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'CALCULATE NET EARNINGS'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Profit Comparison (Net ₹)
                </h3>
                <button onClick={() => setResults(null)} className="text-primary font-black text-xs underline uppercase">Change Inputs</button>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="mandi" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900, fontSize: '10px'}}
                    />
                    <Bar dataKey="net_earnings" radius={[6, 6, 0, 0]} barSize={32}>
                      {results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.is_best ? '#2ecc71' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {results.map((res, i) => (
                <motion.div 
                  key={res.mandi}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative overflow-hidden bg-white border rounded-3xl p-6 transition-all ${res.is_best ? 'border-primary ring-2 ring-primary/10' : 'border-slate-200 shadow-sm'}`}
                >
                  {res.is_best && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                      Best Choice
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">{res.mandi} Mandi</h4>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{res.distance} km away</p>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Gross Price</p>
                        <p className="font-bold text-slate-700">₹{res.gross_price.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Transport</p>
                        <p className="font-bold text-slate-700">-₹{res.transport_cost.toLocaleString()}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border ${res.is_best ? 'bg-primary text-white border-primary' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        <p className={`text-[8px] font-black uppercase mb-1 ${res.is_best ? 'text-white/70' : 'text-green-500'}`}>Net Profit</p>
                        <p className="text-xl font-black">₹{res.net_earnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MandiArbitrage;
