import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { apiFetch } from '../services/api';
import { trackEvent } from '../services/analytics';
import { HARYANA_DISTRICTS, HARYANA_PRIMARY_CROPS } from '../constants/haryana.constants';
import SEO from '../components/common/KisanSeo';

interface FarmerProfile {
  name?: string;
  district: string;
  main_crop: string;
  quantity_quintals: number;
  storage_cost_per_day: number;
  urgency: 'now' | '2weeks' | 'flexible';
  has_aadhaar: boolean;
  has_bank_account: boolean;
  has_kcc: boolean;
  land_acres: number;
  phone?: string;
}

interface DiagnosisResult {
  crop: string;
  disease: string;
  diagnosis_english: string;
  diagnosis_hindi: string;
  remedies_english: string[];
  remedies_hindi: string[];
  severity: string;
}

const DEFAULT_PROFILE: FarmerProfile = {
  district: 'Karnal',
  main_crop: 'Wheat',
  quantity_quintals: 50,
  storage_cost_per_day: 0.50,
  urgency: 'flexible',
  has_aadhaar: false,
  has_bank_account: false,
  has_kcc: false,
  land_acres: 0,
};

const FarmerProfilePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Crop Doctor State
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { value } = await Preferences.get({ key: 'farmer_profile' });
      if (value) {
        setProfile(JSON.parse(value));
      }
    };
    loadProfile();
  }, []);

  const handleCapture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (image.base64String) {
        setIsAnalysing(true);
        setDiagnosis(null);
        
        const resp = await apiFetch('/api/advisory/analyze-disease', {
          method: 'POST',
          body: JSON.stringify({
            image: image.base64String,
            crop: profile.main_crop
          })
        });

        const json = await resp.json();
        if (json.success) {
          setDiagnosis(json.data);
          trackEvent('crop_doctor_analysis', { disease: json.data.disease });
        }
      }
    } catch (e) {
      console.warn('Camera/Analysis failed');
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await Preferences.set({ key: 'farmer_profile', value: JSON.stringify(profile) });
      const resp = await apiFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      
      if (resp.ok) {
        setSaveStatus('success');
        trackEvent('profile_updated', { district: profile.district, crop: profile.main_crop });
      } else {
        setSaveStatus('error');
      }
    } catch (e) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32">
      <SEO 
        title={isHindi ? 'मेरा खेत' : 'My Farm'} 
        description={isHindi ? 'अपनी खेती की जानकारी अपडेट करें' : 'Update your farming profile'}
      />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none mb-2">
          {isHindi ? 'मेरा खेत' : 'My Farm'}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          {isHindi ? 'प्रोफ़ाइल और एआई डॉक्टर' : 'Profile & AI Doctor'}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 0: Crop Doctor (Gemini Vision) */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-8xl opacity-10 group-hover:rotate-12 transition-transform duration-500">🧪</div>
          <h2 className="text-xl font-black mb-2 italic uppercase tracking-tight flex items-center gap-2">
            <span className="text-2xl">👨‍⚕️</span> {isHindi ? 'एआई फसल डॉक्टर' : 'AI Crop Doctor'}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 italic">
            {isHindi ? 'बीमारी की फोटो खींचें और समाधान पाएं' : 'Take a photo of disease for instant remedy'}
          </p>

          <button 
            onClick={handleCapture}
            disabled={isAnalysing}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isAnalysing ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> {isHindi ? 'जाँच हो रही है...' : 'Analysing...'}</>
            ) : (
              <>{isHindi ? 'फोटो खींचें (कैमरा) 📸' : 'Capture Plant 📸'}</>
            )}
          </button>

          <AnimatePresence>
            {diagnosis && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-emerald-400 font-black italic uppercase tracking-tighter text-lg">
                    {isHindi ? diagnosis.disease : diagnosis.disease}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${diagnosis.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}>
                    {diagnosis.severity} Risk
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-300 leading-tight mb-6">
                  {isHindi ? diagnosis.diagnosis_hindi : diagnosis.diagnosis_english}
                </p>
                <div className="space-y-3">
                  {(isHindi ? diagnosis.remedies_hindi : diagnosis.remedies_english).map((r, i) => (
                    <div key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl">
                      <span className="text-primary font-black text-xs">{i+1}.</span>
                      <p className="text-xs font-bold leading-normal">{r}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 1: Agricultural Details */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
          <h2 className="text-xl font-black mb-6 italic uppercase tracking-tight flex items-center gap-2 text-slate-800">
            <span className="text-2xl">🚜</span> {isHindi ? 'खेती की जानकारी' : 'Farm Details'}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">
                {isHindi ? 'नाम (वैकल्पिक)' : 'Name (Optional)'}
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder={isHindi ? 'अपना नाम लिखें' : 'Enter your name'}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">
                  {isHindi ? 'जिला' : 'District'}
                </label>
                <select
                  value={profile.district}
                  onChange={(e) => setProfile({...profile, district: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold appearance-none outline-none text-slate-900"
                >
                  {HARYANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">
                  {isHindi ? 'मुख्य फसल' : 'Main Crop'}
                </label>
                <select
                  value={profile.main_crop}
                  onChange={(e) => setProfile({...profile, main_crop: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold appearance-none outline-none text-slate-900"
                >
                  {HARYANA_PRIMARY_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">
                {isHindi ? 'मात्रा (क्विंटल)' : 'Quantity (Quintals)'}
              </label>
              <input
                type="number"
                value={profile.quantity_quintals}
                onChange={(e) => setProfile({...profile, quantity_quintals: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal & Schemes */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
          <h2 className="text-xl font-black mb-6 italic uppercase tracking-tight flex items-center gap-2 text-slate-800">
            <span className="text-2xl">🏛️</span> {isHindi ? 'योजना जानकारी' : 'Scheme Info'}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm text-slate-700">{isHindi ? 'आधार कार्ड है?' : 'Have Aadhaar?'}</span>
              <button 
                onClick={() => setProfile({...profile, has_aadhaar: !profile.has_aadhaar})}
                className={`w-14 h-8 rounded-full relative transition-all ${profile.has_aadhaar ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.has_aadhaar ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm text-slate-700">{isHindi ? 'बैंक खाता है?' : 'Have Bank Account?'}</span>
              <button 
                onClick={() => setProfile({...profile, has_bank_account: !profile.has_bank_account})}
                className={`w-14 h-8 rounded-full relative transition-all ${profile.has_bank_account ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.has_bank_account ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">
                {isHindi ? 'कुल जमीन (एकड़)' : 'Total Land (Acres)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={profile.land_acres}
                onChange={(e) => setProfile({...profile, land_acres: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none text-slate-900"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-5 rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
            saveStatus === 'success' ? 'bg-emerald-500 text-white' : 
            saveStatus === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'
          }`}
        >
          {isSaving ? (
            <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {saveStatus === 'success' ? '✓ ' + (isHindi ? 'सेव हो गया' : 'Saved') : 
               saveStatus === 'error' ? '✕ ' + (isHindi ? 'त्रुटि हुई' : 'Error') : 
               (isHindi ? 'प्रोफ़ाइल सेव करें →' : 'Save Profile →')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
