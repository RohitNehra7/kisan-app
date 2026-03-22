import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../services/api';
import { apiFetch } from '../../services/api';
import { trackEvent } from '../../services/analytics';

interface SellInterestModalProps {
  mandi: string;
  crop: string;
  isOpen: boolean;
  onClose: () => void;
}

const SellInterestModal: React.FC<SellInterestModalProps> = ({ mandi, crop, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [qty, setQty] = useState(50);
  const [isSubmitting, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const resp = await apiFetch('/api/mandi/sell-interest', {
        method: 'POST',
        body: JSON.stringify({
          auth_id: user?.id,
          mandi,
          crop,
          quantity: qty
        })
      });

      if (resp.ok) {
        setStatus('success');
        trackEvent('lead_generated', { crop, mandi });
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 2000);
      }
    } catch (e) {
      console.error('Lead failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute -right-4 -top-4 text-8xl opacity-5">💰</div>
            
            {status === 'success' ? (
              <div className="py-10">
                <span className="text-6xl mb-6 block">✅</span>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-2">
                  {isHindi ? 'इंट्रेस्ट सेव हो गया!' : 'Lead Registered!'}
                </h2>
                <p className="text-slate-500 font-bold text-sm">
                  {isHindi ? 'आढ़ती आपसे जल्द संपर्क करेंगे।' : 'Arhtiyas will contact you soon.'}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-primary uppercase tracking-tighter italic mb-2">
                  {isHindi ? 'फसल बेचने का इंट्रेस्ट' : 'Sell Interest'}
                </h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">
                  {crop} | {mandi}
                </p>

                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 text-left">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1">
                    {isHindi ? 'कितनी मात्रा बेचनी है? (क्विंटल)' : 'Quantity to sell (Quintals)'}
                  </label>
                  <input 
                    type="number"
                    value={qty}
                    onChange={e => setQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 font-black text-xl outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={onClose}
                    className="flex-1 border-2 border-slate-100 py-5 rounded-[1.5rem] font-black text-[10px] uppercase text-slate-400 tracking-widest hover:bg-slate-50 transition-all"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] bg-primary text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  >
                    {isSubmitting ? '...' : (isHindi ? 'इंट्रेस्ट भेजें →' : 'Send Lead →')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SellInterestModal;
