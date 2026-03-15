import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Preferences } from '@capacitor/preferences';
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
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadProfile = async () => {
      const { value } = await Preferences.get({ key: 'farmer_profile' });
      if (value) {
        setProfile(JSON.parse(value));
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      // 1. Local Save
      await Preferences.set({ key: 'farmer_profile', value: JSON.stringify(profile) });
      
      // 2. Remote Sync
      const resp = await apiFetch('/api/forum/profile', { // Using forum service temporarily or creating new profile route
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
          {isHindi ? 'प्रोफ़ाइल और जानकारी' : 'Profile & Information'}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: Agricultural Details */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
          <h2 className="text-xl font-black mb-6 italic uppercase tracking-tight flex items-center gap-2">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold appearance-none outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold appearance-none outline-none"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal & Schemes */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
          <h2 className="text-xl font-black mb-6 italic uppercase tracking-tight flex items-center gap-2">
            <span className="text-2xl">🏛️</span> {isHindi ? 'योजना जानकारी' : 'Scheme Info'}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'आधार कार्ड है?' : 'Have Aadhaar?'}</span>
              <button 
                onClick={() => setProfile({...profile, has_aadhaar: !profile.has_aadhaar})}
                className={`w-14 h-8 rounded-full relative transition-all ${profile.has_aadhaar ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.has_aadhaar ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-sm">{isHindi ? 'बैंक खाता है?' : 'Have Bank Account?'}</span>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none"
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
