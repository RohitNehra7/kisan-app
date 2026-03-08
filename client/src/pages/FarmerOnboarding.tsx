import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { HARYANA_PRIMARY_CROPS, HARYANA_DISTRICTS } from '../constants/haryana.constants';

const pageVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

const FarmerOnboarding: React.FC = () => {
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    district: HARYANA_DISTRICTS[0] || 'Hisar',
    main_crop: HARYANA_PRIMARY_CROPS[0] || 'Wheat',
    quantity_quintals: 50,
    storage_cost_per_day: 0.50,
    urgency: 'flexible',
    whatsapp_alerts: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const storedPhone = localStorage.getItem('farmer_phone');
      if (storedPhone) {
        try {
          const response = await apiFetch(`/api/farmer-profile/${storedPhone}`);
          const json = await response.json();
          if (json.success) {
            setFormData({
              ...json.data,
              whatsapp_alerts: json.data.whatsapp_alerts ?? true
            });
          }
        } catch (e) { console.error('Failed to pre-fill profile'); }
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/farmer-profile', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('farmer_phone', formData.phone);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-center mb-2 italic tracking-tighter uppercase text-primary">प्रोफ़ाइल सेव हो गई!</h2>
        <p className="text-slate-500 text-center text-xs font-bold uppercase tracking-widest mb-8">आपका व्यक्तिगत एआई सलाहकार तैयार है।</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link to="/advisory" className="bg-primary text-white px-8 py-4 rounded-3xl font-black uppercase tracking-tight text-center shadow-lg shadow-primary/20">
            AI सुझाव लें
          </Link>
          <Link to="/forum" className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black uppercase tracking-tight text-center shadow-lg">
            किसान चौपाल में जुड़ें
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-xl mx-auto px-4 py-8 pb-32"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary mb-1 uppercase tracking-tighter italic">प्रोफ़ाइल सेटअप</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">अपने खेत के लिए स्मार्ट जानकारी पाएँ</p>
        </div>
        <Link to="/forum" className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl shadow-sm" title="किसान चौपाल">🤝</Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">मोबाइल नंबर</label>
            <input 
              type="tel" required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20 text-lg"
              placeholder="10 अंकों का मोबाइल नंबर"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">आपका पूरा नाम</label>
            <input 
              type="text" required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20"
              placeholder="नाम लिखें"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">जिला</label>
              <select 
                value={formData.district}
                onChange={e => setFormData({...formData, district: e.target.value})}
                className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold appearance-none cursor-pointer"
              >
                {HARYANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">मुख्य फसल</label>
              <select 
                value={formData.main_crop}
                onChange={e => setFormData({...formData, main_crop: e.target.value})}
                className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold appearance-none cursor-pointer"
              >
                {HARYANA_PRIMARY_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">कुल मात्रा (क्विंटल)</label>
              <input 
                type="number" 
                value={formData.quantity_quintals}
                onChange={e => setFormData({...formData, quantity_quintals: parseFloat(e.target.value)})}
                className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">भण्डारण खर्च (₹/दिन)</label>
              <input 
                type="number" step="0.1"
                value={formData.storage_cost_per_day}
                onChange={e => setFormData({...formData, storage_cost_per_day: parseFloat(e.target.value)})}
                className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold"
              />
            </div>
          </div>

          <div className="bg-green-50 rounded-3xl p-5 border border-green-100 flex items-center justify-between">
            <div>
              <p className="font-black text-green-800 text-sm leading-tight uppercase tracking-tight">WhatsApp अपडेट</p>
              <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">रोज़ाना मंडी भाव पाएँ</p>
            </div>
            <button 
              type="button"
              onClick={() => setFormData({...formData, whatsapp_alerts: !formData.whatsapp_alerts})}
              className={`w-14 h-8 rounded-full transition-all relative ${formData.whatsapp_alerts ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.whatsapp_alerts ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all mt-4 flex justify-center items-center gap-3 active:scale-95">
            {isLoading ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div> : 'AI प्रोफ़ाइल चालू करें'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default FarmerOnboarding;
