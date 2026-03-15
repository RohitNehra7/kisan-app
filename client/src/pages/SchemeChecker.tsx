import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../services/api';
import SEO from '../components/common/KisanSeo';

interface Scheme {
  id: string;
  scheme_name: string;
  scheme_hindi: string;
  description_english: string;
  description_hindi: string;
  benefit_english: string;
  benefit_hindi: string;
  eligibility_rules: {
    has_land?: boolean;
    requires_bank?: boolean;
    requires_aadhaar?: boolean;
    is_haryana?: boolean;
    paddy_only?: boolean;
  };
  apply_url: string;
}

const SchemeChecker: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [answers, setFormData] = useState({
    hasLand: true,
    isHaryanaResident: true,
    hasBankDetail: true,
    ownsPaddyLand: false,
    cropLossRisk: true
  });

  const [eligibleSchemes, setEligibleSchemes] = useState<Scheme[] | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const resp = await apiFetch('/api/schemes');
        const json = await resp.json();
        if (json.success) setSchemes(json.data);
      } catch (e) {
        console.error('Failed to load schemes');
      }
    };
    fetchSchemes();
  }, []);

  const handleCheck = () => {
    const results = schemes.filter(s => {
      const rules = s.eligibility_rules;
      if (rules.has_land && !answers.hasLand) return false;
      if (rules.is_haryana && !answers.isHaryanaResident) return false;
      if (rules.requires_bank && !answers.hasBankDetail) return false;
      if (rules.paddy_only && !answers.ownsPaddyLand) return false;
      return true;
    });
    setEligibleSchemes(results);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32">
      <SEO 
        title={isHindi ? 'सरकारी योजनाएं' : 'Govt Schemes'} 
        description={isHindi ? 'चेक करें कि आप किन सरकारी योजनाओं के पात्र हैं' : 'Check your eligibility for govt schemes'}
      />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none mb-2">
          {isHindi ? 'योजना जाँच' : 'Scheme Checker'}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          {isHindi ? 'आपके लिए सही सरकारी लाभ' : 'Find Govt benefits for you'}
        </p>
      </div>

      {!eligibleSchemes ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-2xl">
          <h2 className="text-xl font-black mb-8 text-center italic uppercase tracking-tight">
            {isHindi ? '5 आसान सवालों के जवाब दें' : 'Answer 5 simple questions'}
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'क्या आपके पास अपनी ज़मीन है?' : 'Do you own farm land?'}</span>
              <button onClick={() => setFormData({...answers, hasLand: !answers.hasLand})} className={`w-14 h-8 rounded-full relative transition-all ${answers.hasLand ? 'bg-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${answers.hasLand ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'क्या आप हरियाणा के निवासी हैं?' : 'Are you a Haryana resident?'}</span>
              <button onClick={() => setFormData({...answers, isHaryanaResident: !answers.isHaryanaResident})} className={`w-14 h-8 rounded-full relative transition-all ${answers.isHaryanaResident ? 'bg-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${answers.isHaryanaResident ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'बैंक खाता और आधार लिंक है?' : 'Active bank A/C & Aadhaar?'}</span>
              <button onClick={() => setFormData({...answers, hasBankDetail: !answers.hasBankDetail})} className={`w-14 h-8 rounded-full relative transition-all ${answers.hasBankDetail ? 'bg-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${answers.hasBankDetail ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'क्या आप धान उगाते हैं?' : 'Do you grow Paddy?'}</span>
              <button onClick={() => setFormData({...answers, ownsPaddyLand: !answers.ownsPaddyLand})} className={`w-14 h-8 rounded-full relative transition-all ${answers.ownsPaddyLand ? 'bg-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${answers.ownsPaddyLand ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'प्राकृतिक आपदा का डर है?' : 'Risk of natural disaster?'}</span>
              <button onClick={() => setFormData({...answers, cropLossRisk: !answers.cropLossRisk})} className={`w-14 h-8 rounded-full relative transition-all ${answers.cropLossRisk ? 'bg-primary' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${answers.cropLossRisk ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button 
              onClick={handleCheck}
              className="mt-4 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all"
            >
              {isHindi ? 'पात्रता जाँचें →' : 'Check Eligibility →'}
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-black uppercase text-slate-800 italic">{isHindi ? 'आपकी योजनाएं' : 'Matching Schemes'}</h3>
            <button onClick={() => setEligibleSchemes(null)} className="text-primary font-black text-xs underline uppercase">{isHindi ? 'बदलें' : 'Change'}</button>
          </div>

          {eligibleSchemes.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border-2 border-dashed border-slate-200">
              <span className="text-5xl mb-4 block">🔍</span>
              <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">{isHindi ? 'कोई मिलान नहीं' : 'No matches found'}</p>
            </div>
          ) : (
            eligibleSchemes.map((s, idx) => (
              <motion.div 
                key={s.id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] border-2 border-emerald-100 p-8 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[8px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">Eligible</div>
                <h4 className="text-2xl font-black text-slate-900 mb-2 leading-none uppercase italic tracking-tighter">{isHindi ? s.scheme_hindi : s.scheme_name}</h4>
                <p className="text-slate-500 text-sm font-bold mb-6 leading-tight">{isHindi ? s.description_hindi : s.description_english}</p>
                
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 mb-6 group-hover:bg-emerald-100 transition-colors">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{isHindi ? 'मुख्य लाभ' : 'Key Benefit'}</p>
                  <p className="text-lg font-black text-emerald-900 leading-tight">{isHindi ? s.benefit_hindi : s.benefit_english}</p>
                </div>

                <a 
                  href={s.apply_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-primary transition-all active:scale-95"
                >
                  {isHindi ? 'योजना की जानकारी' : 'View Full Details'}
                </a>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SchemeChecker;
