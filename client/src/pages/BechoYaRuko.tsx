import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Preferences } from '@capacitor/preferences';
import { Link } from 'react-router-dom';
import { captureEvent } from '../services/posthog';
import { apiFetch } from '../services/api';
import { trackEvent } from '../services/analytics';
import SEO from '../components/common/SEO';
import { HARYANA_PRIMARY_CROPS, TIER1_DISTRICTS } from '../constants/haryana.constants';
import type { SellHoldRequest } from '../types/api.types';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const NonTier1Message: React.FC<{ district: string }> = ({ district }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">📍</div>
      <h2 className="text-xl font-black text-slate-900 mb-4 leading-tight uppercase tracking-tighter italic">
        आपके जिले {district} के लिए AI सुझाव जल्द आएगा।
      </h2>
      <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
        अभी MSP सुरक्षा जाँच करें — यह हर जिले में काम करती है।
      </p>
      <Link 
        to="/msp-check"
        className="inline-block bg-primary text-white px-8 py-4 rounded-3xl font-black uppercase tracking-tight shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        💰 MSP जाँचें
      </Link>
    </div>
  );
};

const BechoYaRuko: React.FC = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<SellHoldRequest>({
    crop: 'Wheat',
    quantity: 10,
    district: 'Hisar',
    storageCostPerDay: 0.50,
    urgency: 'flexible'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const resp = await apiFetch('/api/mandi/metadata/commodities?state=Haryana');
        const json = await resp.json();
        if (json.success) setAvailableCrops(json.data);
      } catch (e) { console.error('Failed to load metadata'); }
    };
    loadMetadata();
  }, []);

  useEffect(() => {
    const loadCached = async () => {
      const { value } = await Preferences.get({ key: 'last_recommendation' });
      if (value) {
        setResult(JSON.parse(value));
      }
    };
    loadCached();
    trackEvent('advisory_view');
  }, []);

  const steps = [
    { icon: '🌾', label: t('advisory.loading_step1') },
    { icon: '🌤️', label: t('advisory.loading_step2') },
    { icon: '🤖', label: t('advisory.loading_step3') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    captureEvent('advisory_requested', { crop: formData.crop, district: formData.district });

    // Step 1: Simulated animation for Mandi Data
    setLoadingStep(0);
    await new Promise(res => setTimeout(res, 1200));
    
    // Step 2: Simulated animation for Weather
    setLoadingStep(1);
    await new Promise(res => setTimeout(res, 1200));

    // Step 3: AI Processing
    setLoadingStep(2);

    try {
      const response = await apiFetch('/api/advisory/sell-hold', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        await Preferences.set({ key: 'last_recommendation', value: JSON.stringify(data.data) });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    if (!result) return;
    const text = `🌾 *KisanNiti AI Decision*%0A📦 Crop: ${formData.crop}%0A📢 Suggestion: *${getDecisionStyles(result.decision).label}*%0A💰 Price: ₹${result.expected_price_min} - ₹${result.expected_price_max}%0A📝 Reason: ${result.hindi_reason}%0A%0A_Download KisanNiti for smart farm advice!_`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const getDecisionStyles = (decision: string) => {
    switch(decision) {
      case 'SELL_NOW': return { color: '#B71C1C', label: t('advisory.decision_sell'), bg: 'bg-red-50' };
      case 'HOLD_7_DAYS': return { color: '#E65100', label: t('advisory.decision_hold7'), bg: 'bg-orange-50' };
      case 'HOLD_14_DAYS': return { color: '#F57F17', label: t('advisory.decision_hold14'), bg: 'bg-yellow-50' };
      case 'PARTIAL_SELL': return { color: '#0D47A1', label: t('advisory.decision_partial'), bg: 'bg-blue-50' };
      default: return { color: '#1B5E20', label: decision, bg: 'bg-green-50' };
    }
  };

  const isTier1 = TIER1_DISTRICTS.includes(formData.district);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 py-8 md:py-12 pb-32"
    >
      <SEO 
        title={t('seo.advisory_title')} 
        description={t('seo.advisory_description')} 
      />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-primary mb-2 uppercase tracking-tighter italic leading-none">
          {t('advisory.title')}
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
          {t('advisory.subtitle')}
        </p>
      </div>

      {!isLoading && !result && (
        <>
          {!isTier1 ? (
            <NonTier1Message district={formData.district} />
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('advisory.form_crop')}</label>
                  <select 
                    value={formData.crop}
                    onChange={e => setFormData({...formData, crop: e.target.value})}
                    className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {availableCrops.length > 0 ? availableCrops.map(c => <option key={c} value={c}>{c}</option>) : HARYANA_PRIMARY_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('advisory.form_quantity')}</label>
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                    className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('advisory.form_district')}</label>
                  <select 
                    value={formData.district}
                    onChange={e => setFormData({...formData, district: e.target.value})}
                    className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {TIER1_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('advisory.form_storage')}</label>
                  <input 
                    type="number" step="0.1"
                    value={formData.storageCostPerDay}
                    onChange={e => setFormData({...formData, storageCostPerDay: parseFloat(e.target.value)})}
                    className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-4 text-center">{t('advisory.form_urgency')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button type="button" onClick={() => setFormData({...formData, urgency: 'now'})} className={`py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${formData.urgency === 'now' ? 'bg-[#B71C1C] border-[#B71C1C] text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}>{t('advisory.urgency_now')}</button>
                    <button type="button" onClick={() => setFormData({...formData, urgency: '2weeks'})} className={`py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${formData.urgency === '2weeks' ? 'bg-[#E65100] border-[#E65100] text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}>{t('advisory.urgency_2weeks')}</button>
                    <button type="button" onClick={() => setFormData({...formData, urgency: 'flexible'})} className={`py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${formData.urgency === 'flexible' ? 'bg-[#1B5E20] border-[#1B5E20] text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}>{t('advisory.urgency_flexible')}</button>
                  </div>
                </div>

                <button type="submit" className="md:col-span-2 bg-primary text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all mt-4 flex items-center justify-center gap-3 active:scale-95">
                  {t('advisory.submit_btn')} <span className="text-2xl">→</span>
                </button>
              </form>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-2xl flex flex-col items-center justify-center gap-10 text-center min-h-[450px]">
            <div className="relative">
              <div className="w-32 h-32 border-[12px] border-slate-50 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl">{steps[loadingStep].icon}</div>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              {steps.map((step, i) => (
                <div key={i} className={`flex items-center gap-4 text-sm font-black transition-all duration-500 ${i > loadingStep ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs ${i < loadingStep ? 'bg-primary border-primary text-white' : 'border-slate-300 text-slate-400'}`}>
                    {i < loadingStep ? '✓' : i + 1}
                  </span>
                  {step.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {result && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
          <div className={`rounded-[3rem] p-10 shadow-2xl relative overflow-hidden border-2 ${getDecisionStyles(result.decision).bg}`} style={{ borderColor: getDecisionStyles(result.decision).color }}>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex flex-col gap-2">
                <span className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit" style={{ color: getDecisionStyles(result.decision).color }}>
                  {t(`advisory.confidence_${result.confidence.toLowerCase()}` as any)}
                </span>
                <span className="bg-slate-900/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                  {result.data_freshness} ✓
                </span>
              </div>
              <span className="text-5xl filter drop-shadow-lg">🌾</span>
            </div>
            
            <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter italic leading-none" style={{ color: getDecisionStyles(result.decision).color }}>
              {getDecisionStyles(result.decision).label}
            </h2>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] mb-8 border border-white/40">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-[0.2em]">{t('advisory.expected_range')}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                ₹{result.expected_price_min.toLocaleString()} — ₹{result.expected_price_max.toLocaleString()} <span className="text-lg text-slate-400">/q</span>
              </p>
            </div>

            <p className="text-xl font-bold leading-relaxed mb-6 text-slate-800 italic">"{result.hindi_reason}"</p>
            
            {result.stale_disclaimer && (
              <p className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 w-fit animate-pulse">
                ⚠️ {result.stale_disclaimer}
              </p>
            )}

            <div className="bg-black/5 p-6 rounded-[2rem] border border-black/5 mb-6">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">{t('advisory.risk_label')}</p>
              <p className="text-base font-bold text-slate-700 leading-tight">{result.risk_note}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.mandis_checked?.map((m: string) => (
                <span key={m} className="bg-white/40 px-3 py-1 rounded-lg text-[9px] font-bold text-slate-500 border border-white/20 uppercase">📍 {m}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={shareToWhatsApp} className="bg-[#25D366] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-tight hover:scale-[1.02] active:scale-95 transition-all">
              <span className="text-2xl">📱</span> {t('advisory.share_whatsapp')}
            </button>
            <button onClick={() => setResult(null)} className="bg-white border-2 border-slate-100 text-slate-400 py-5 rounded-[2rem] font-black text-lg shadow-lg uppercase tracking-tight hover:bg-slate-50 transition-all">
              {t('advisory.new_advisory')}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BechoYaRuko;
