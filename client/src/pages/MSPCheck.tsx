import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../services/api';
import { trackEvent } from '../services/analytics';
import SEO from '../components/common/KisanSeo';
import { HARYANA_PRIMARY_CROPS } from '../constants/haryana.constants';

interface MSPValue {
  commodity: string;
  msp_per_quintal: number;
}

interface MSPCheckForm {
  crop: string;
  quantity: number;
  unit: 'quintal' | 'maund' | 'kg';
  priceOffered: number;
}

const MSPCheck: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mspData, setMspData] = useState<MSPValue[]>([]);
  const [form, setFormData] = useState<MSPCheckForm>({
    crop: 'Wheat',
    quantity: 10,
    unit: 'quintal',
    priceOffered: 0
  });
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchMSP = async () => {
      try {
        const resp = await apiFetch('/api/mandi/msp');
        const json = await resp.json();
        if (json.success) setMspData(json.msp);
      } catch (e) {
        console.error('Failed to fetch MSP data');
      }
    };
    fetchMSP();
    trackEvent('msp_check_view');
  }, []);

  const toQuintal = (quantity: number, unit: string): number => {
    if (unit === 'maund') return quantity * 0.4;
    if (unit === 'kg') return quantity * 0.01;
    return quantity;
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const mspRecord = mspData.find(m => m.commodity === form.crop);
    const mspValue = mspRecord?.msp_per_quintal || 2000;
    const qtyInQuintal = toQuintal(form.quantity, form.unit);
    const diff = form.priceOffered - mspValue;
    const totalAtMSP = qtyInQuintal * mspValue;
    const totalOffered = qtyInQuintal * form.priceOffered;
    const totalLoss = totalAtMSP - totalOffered;

    const isHindi = i18n.language === 'hi';

    const hindiVerdict = diff >= 0 
      ? `भाव सही है। सरकारी न्यूनतम ₹${mspValue} से ₹${Math.round(diff)} ज़्यादा मिल रहा है। ठीक है।`
      : `सरकारी न्यूनतम भाव ₹${mspValue}/क्विंटल है। आपको ₹${Math.round(Math.abs(diff))} कम मिल रहा है। ${qtyInQuintal} क्विंटल पर कुल नुकसान: ₹${Math.round(totalLoss)}। आप सरकारी खरीद केंद्र पर MSP पर बेच सकते हैं। मना करें।`;

    const englishVerdict = diff >= 0
      ? `Price is fair. You are getting ₹${Math.round(diff)} more than the government MSP of ₹${mspValue}.`
      : `Government MSP is ₹${mspValue}/q. You are getting ₹${Math.round(Math.abs(diff))} less. Total loss on ${qtyInQuintal}q is ₹${Math.round(totalLoss)}. Consider selling at a government procurement center instead.`;

    setResult({
      msp: mspValue,
      priceOffered: form.priceOffered,
      difference: diff,
      verdict: diff >= 0 ? 'FAIR' : 'BELOW_MSP',
      verdictText: isHindi ? hindiVerdict : englishVerdict,
      totalAtMSP,
      totalOffered,
      totalLoss: totalLoss > 0 ? totalLoss : 0
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-xl mx-auto px-4 py-8 pb-32"
    >
      <SEO 
        title={t('seo.msp_title')} 
        description={t('seo.msp_description')} 
      />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none mb-2">
          {t('msp.title')}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          {t('msp.subtitle')}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl mb-8">
        <form onSubmit={handleCheck} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('advisory.form_crop')}</label>
            <select 
              value={form.crop}
              onChange={e => setFormData({...form, crop: e.target.value})}
              className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold appearance-none cursor-pointer"
            >
              {HARYANA_PRIMARY_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{i18n.language === 'hi' ? 'मात्रा' : 'Quantity'}</label>
              <input 
                type="number" 
                value={form.quantity}
                onChange={e => setFormData({...form, quantity: parseFloat(e.target.value)})}
                className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold"
                placeholder={i18n.language === 'hi' ? 'उदा. 50' : 'e.g. 50'}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{i18n.language === 'hi' ? 'इकाई' : 'Unit'}</label>
              <select 
                value={form.unit}
                onChange={e => setFormData({...form, unit: e.target.value as any})}
                className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold appearance-none"
              >
                <option value="quintal">{t('common.quintal')}</option>
                <option value="maund">{t('common.maund')}</option>
                <option value="kg">{t('common.kg')}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{i18n.language === 'hi' ? 'व्यापारी ने क्या भाव दिया?' : 'Price Offered'}</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
              <input 
                type="number" required
                value={form.priceOffered}
                onChange={e => setFormData({...form, priceOffered: parseFloat(e.target.value)})}
                className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-5 py-4 font-black text-xl text-primary"
                placeholder={i18n.language === 'hi' ? 'यहाँ भाव लिखें' : 'Enter price here'}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all">
            {t('msp.check_btn')}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[3rem] p-6 md:p-10 shadow-2xl border-2 ${result.verdict === 'BELOW_MSP' ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-2xl md:text-3xl font-black uppercase italic tracking-tighter ${result.verdict === 'BELOW_MSP' ? 'text-red-700' : 'text-emerald-700'}`}>
                {result.verdict === 'BELOW_MSP' ? t('msp.low_price') : t('msp.fair_price')}
              </h2>
              <span className="text-4xl">{result.verdict === 'BELOW_MSP' ? '📉' : '💰'}</span>
            </div>

            <p className="text-lg font-bold leading-relaxed mb-8 text-slate-800">
              "{result.verdictText}"
            </p>

            {result.totalLoss > 0 && (
              <div className="bg-red-600 text-white p-6 rounded-3xl mb-8 shadow-lg shadow-red-200 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{t('msp.loss_label')}</p>
                <p className="text-4xl font-black italic tracking-tighter">₹{Math.round(result.totalLoss).toLocaleString()}</p>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/50 backdrop-blur-sm">
              <div className="flex flex-col">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-black/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <div>{t('msp.details')}</div>
                  <div className="text-right">{t('msp.msp_label')}</div>
                  <div className="text-right">{t('msp.offered_label')}</div>
                </div>
                
                {/* Price Row */}
                <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-black/5 items-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">Price (₹/q)</div>
                  <div className="text-right font-black text-slate-700 text-sm">₹{result.msp}</div>
                  <div className="text-right font-black text-slate-900 text-sm">₹{result.priceOffered}</div>
                </div>

                {/* Total Row */}
                <div className="grid grid-cols-3 gap-2 px-4 py-3 items-center">
                  <div className="text-[10px] font-black text-primary uppercase leading-tight">{t('msp.total_value')}</div>
                  <div className="text-right font-black text-slate-700 text-sm">₹{Math.round(result.totalAtMSP).toLocaleString()}</div>
                  <div className={`text-right font-black text-sm ${result.verdict === 'BELOW_MSP' ? 'text-red-600' : 'text-emerald-600'}`}>
                    ₹{Math.round(result.totalOffered).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full mt-8 bg-white/50 border border-black/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white transition-all"
            >
              {t('msp.recalculate')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MSPCheck;
