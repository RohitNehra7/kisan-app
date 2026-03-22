import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/api'; // Ensure this is exported from your api service or create a new supabaseClient.ts
import { apiFetch } from '../services/api';
import { trackEvent } from '../services/analytics';
import { HARYANA_DISTRICTS, HARYANA_PRIMARY_CROPS } from '../constants/haryana.constants';
import SEO from '../components/common/KisanSeo';

interface FarmerProfile {
  auth_id: string;
  name?: string;
  district: string;
  main_crop: string;
  quantity_quintals: number;
  land_acres: number;
  crop_types: string[];
}

const DEFAULT_PROFILE: FarmerProfile = {
  auth_id: '',
  district: 'Karnal',
  main_crop: 'Wheat',
  quantity_quintals: 50,
  land_acres: 0,
  crop_types: [],
};

const FarmerProfilePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        loadProfile(user.id);
      }
    };
    checkUser();
  }, []);

  const loadProfile = async (authId: string) => {
    try {
      const resp = await apiFetch(`/api/profile/${authId}`);
      const json = await resp.json();
      if (json.success && json.data) {
        setProfile(json.data);
        setStep(3); // Go to summary/edit if profile exists
      }
    } catch (e) {
      console.error('Failed to load profile');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/profile' }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resp = await apiFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({ ...profile, auth_id: user.id })
      });
      if (resp.ok) {
        setStep(3);
        trackEvent('profile_completed', { district: profile.district });
      }
    } catch (e) {
      console.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Step 1: Login
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <SEO title="Login | KisanNiti" />
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
          <span className="text-6xl mb-6 block">👤</span>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
            {isHindi ? 'अपनी पहचान जोड़ें' : 'Join KisanNiti'}
          </h1>
          <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed">
            {isHindi ? 'अपनी खेती की जानकारी को सुरक्षित रखने और अपडेट्स पाने के लिए लॉगिन करें।' : 'Login to secure your farm data and receive personalized market alerts.'}
          </p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-slate-200 py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            <span className="font-black text-slate-700 uppercase tracking-tight">Google के साथ लॉगिन करें</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32">
      <SEO title={isHindi ? 'मेरा खेत' : 'My Farm'} />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none mb-1">
            {isHindi ? 'मेरा खेत' : 'My Farm'}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Logged in as {user.email}
          </p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase text-red-500 border-b-2 border-red-500 pb-0.5">Logout</button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
            <h2 className="text-xl font-black mb-6 italic uppercase tracking-tight flex items-center gap-2">
              <span className="text-2xl">🚜</span> {isHindi ? 'खेत की जानकारी' : 'Farm Details'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">{isHindi ? 'कुल जमीन (एकड़)' : 'Total Land (Acres)'}</label>
                <input 
                  type="number" step="0.1" value={profile.land_acres} 
                  onChange={e => setProfile({...profile, land_acres: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-black outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">{isHindi ? 'जिला' : 'District'}</label>
                <select 
                  value={profile.district} 
                  onChange={e => setProfile({...profile, district: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 font-black outline-none"
                >
                  {HARYANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-tight shadow-xl">अगला कदम →</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
            <h2 className="text-xl font-black mb-6 italic uppercase tracking-tight flex items-center gap-2">
              <span className="text-2xl">🌾</span> {isHindi ? 'फसल पोर्टफोलियो' : 'Crop Portfolio'}
            </h2>
            <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">{isHindi ? 'आप कौन-सी फसलें उगाते हैं?' : 'Select crops you grow'}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-10">
              {HARYANA_PRIMARY_CROPS.map(crop => (
                <button
                  key={crop}
                  onClick={() => {
                    const next = profile.crop_types.includes(crop) 
                      ? profile.crop_types.filter(c => c !== crop) 
                      : [...profile.crop_types, crop];
                    setProfile({...profile, crop_types: next, main_crop: next[0] || 'Wheat'});
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-black uppercase border-2 transition-all ${profile.crop_types.includes(crop) ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                >
                  {crop}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-3xl font-black uppercase">पीछे</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-[2] bg-primary text-white py-5 rounded-3xl font-black uppercase shadow-xl">
                {isSaving ? 'सेव हो रहा है...' : (isHindi ? 'प्रोफ़ाइल पूरी करें ✓' : 'Complete Profile ✓')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-8xl opacity-5">🚜</div>
              <h2 className="text-2xl font-black mb-6 italic uppercase tracking-tighter text-slate-900">{isHindi ? 'आपकी प्रोफ़ाइल' : 'Your Farm Summary'}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">District</p>
                  <p className="text-lg font-black text-primary uppercase italic">{profile.district}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Land Size</p>
                  <p className="text-lg font-black text-slate-700">{profile.land_acres} <span className="text-xs">Acres</span></p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">Crops in Portfolio</p>
                <div className="flex flex-wrap gap-2">
                  {profile.crop_types.map(c => (
                    <span key={c} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">{c}</span>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(1)} className="w-full border-2 border-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:bg-slate-50 transition-all">Edit Details</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerProfilePage;
