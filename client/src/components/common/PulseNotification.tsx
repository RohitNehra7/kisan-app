import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PulseData {
  id: number;
  mandi: string;
  crop: string;
  price: number;
  change: 'up' | 'down';
  timestamp: string;
}

interface Props {
  pulse: PulseData | null;
}

const PulseNotification: React.FC<Props> = ({ pulse }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pulse) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  return (
    <AnimatePresence>
      {visible && pulse && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-50 pointer-events-none"
        >
          <div className="max-w-md mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-lg bg-opacity-90">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${pulse.change === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {pulse.change === 'up' ? '📈' : '📉'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Mandi Pulse</span>
                <span className="text-[10px] font-bold text-slate-500">{pulse.timestamp}</span>
              </div>
              <p className="font-bold text-sm">
                <span className="text-primary-light">{pulse.mandi}</span>: {pulse.crop} @ 
                <span className={`ml-1 ${pulse.change === 'up' ? 'text-green-400' : 'text-red-400'}`}>₹{pulse.price}</span>
              </p>
            </div>
            <div className="bg-white/5 px-2 py-1 rounded-lg">
              <span className="text-[8px] font-black uppercase text-white/40">Realtime</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PulseNotification;
