import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiFetch } from '../services/api';
import SEO from '../components/common/KisanSeo';

const ArhtiyaDashboard: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  
  const [arbitrage, setArbitrage] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArhtiyaData = async () => {
      try {
        const resp = await apiFetch('/api/mandi/navigator?district=Karnal&crop=Wheat');
        const json = await resp.json();
        if (json.success) setArbitrage(json.data);
      } catch (e) {} finally {
        setIsLoading(false);
      }
    };
    loadArhtiyaData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <SEO 
        title={isHindi ? 'आढ़ती डैशबोर्ड' : 'Arhtiya Dashboard'} 
        description="Premium Business Intelligence for Arhtiyas"
      />

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-2">
            {isHindi ? 'आढ़ती कंट्रोल सेंटर' : 'Arhtiya Pro'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {isHindi ? 'प्रीमियम बिजनेस इंटेलिजेंस' : 'Premium Business Intel'}
            </p>
          </div>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
          <span className="text-primary font-black text-xs uppercase tracking-widest">BETA ACCESS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">📢</div>
          <h2 className="text-xl font-black mb-4 italic uppercase tracking-tight">{isHindi ? 'किसानों को अलर्ट भेजें' : 'Broadcast to Farmers'}</h2>
          <p className="text-slate-400 text-xs font-bold mb-6">{isHindi ? 'अपनी मंडी के सभी किसानों को एक क्लिक में भाव भेजें' : 'Notify all your farmers about price spikes'}</p>
          <button className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">
            {isHindi ? 'अलर्ट भेजें →' : 'Send Alert →'}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-black mb-4 italic uppercase tracking-tight text-slate-800">{isHindi ? 'मंडी आर्बिट्रेज' : 'Market Arbitrage'}</h2>
          <p className="text-slate-400 text-xs font-bold mb-6">{isHindi ? 'आस-पास की मंडियों में भाव का अंतर' : 'Price gaps in nearby markets'}</p>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-2">
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
              </div>
            ) : arbitrage.slice(0, 2).map((deal: any) => (
              <div key={deal.market} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-black text-xs text-slate-700 uppercase">{deal.market}</span>
                <span className="text-primary font-black">₹{deal.modal_price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center">
        <span className="text-5xl mb-4 block">🛡️</span>
        <h3 className="text-xl font-black text-slate-800 mb-2">{isHindi ? 'आगामी फीचर्स' : 'Coming Soon'}</h3>
        <p className="text-slate-400 font-bold text-xs max-w-sm mx-auto leading-relaxed">
          {isHindi ? 'डिजिटल बहीखाता और पेमेंट ट्रैकिंग जल्द ही उपलब्ध होंगे।' : 'Digital ledger and payment tracking for your shop coming soon.'}
        </p>
      </div>
    </div>
  );
};

export default ArhtiyaDashboard;
