import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { Analytics } from '@vercel/analytics/react';
import PulseNotification from './components/common/PulseNotification';
import { io } from 'socket.io-client';
import { API_BASE } from './services/api';
import { FEATURES } from './config/features';

// Lazy load pages
const MandiPrices = lazy(() => import('./pages/MandiPrices'));
const BechoYaRuko = lazy(() => import('./pages/BechoYaRuko'));
const MSPCheck = lazy(() => import('./pages/MSPCheck'));
const FarmerOnboarding = lazy(() => import('./pages/FarmerOnboarding'));
const Weather = lazy(() => import('./pages/Weather'));

const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [pulse, setPulse] = useState<any>(null);

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLng);
  };

  useEffect(() => {
    if (!FEATURES.enableLiveMandiPulse) return;
    const socket = io(API_BASE || 'http://localhost:5000');
    socket.on('pricePulse', (data) => setPulse(data));
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    const setupPush = async () => {
      try {
        let perm = await PushNotifications.checkPermissions();
        if (perm.receive !== 'granted') {
          perm = await PushNotifications.requestPermissions();
        }

        if (perm.receive === 'granted') {
          await PushNotifications.register();
        }

        PushNotifications.addListener('registration', async (token) => {
          const { value: phone } = await Preferences.get({ key: 'user_phone' });
          if (phone) {
            await fetch('/api/farmer-profile/push-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone, push_token: token.value })
            });
          }
        });
      } catch (e) {
        console.warn('Push registration failed - likely running in browser');
      }
    };

    setupPush();
  }, []);

  const navTabs = [
    { path: '/', label: t('nav.mandi'), icon: '🌾' },
    { path: '/msp-check', label: t('nav.msp'), icon: '💰' },
    ...(FEATURES.enableAdvisoryEngine ? [{ path: '/advisory', label: t('nav.advisory'), icon: '🤖' }] : []),
    { path: '/weather', label: t('nav.weather'), icon: '⛅' },
    { path: '/profile', label: t('nav.profile'), icon: '🚜' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-inter overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-primary text-white h-14 md:h-16 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🌾</span>
            <div className="flex flex-col leading-none">
              <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase">KisanNiti</h1>
              <span className="hidden md:block text-[9px] font-bold opacity-70 tracking-widest uppercase mt-0.5">Empowering Farmers</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 items-center h-full">
            {navTabs.map(tab => (
              <NavLink 
                key={tab.path} 
                to={tab.path} 
                className={({isActive}) => 
                  `h-full flex items-center px-1 text-xs font-black transition-all border-b-4 uppercase tracking-wider ${isActive ? 'text-white border-white' : 'text-white/70 border-transparent hover:text-white'}`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={toggleLanguage}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest hidden md:block"
            >
              {i18n.language === 'hi' ? 'English' : 'हिंदी'}
            </button>
            <NavLink to="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all text-sm text-white">
              👤
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-8">
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{t('common.loading')}</p>
            </div>
          }>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<MandiPrices />} />
              <Route path="/msp-check" element={<MSPCheck />} />
              {FEATURES.enableAdvisoryEngine && <Route path="/advisory" element={<BechoYaRuko />} />}
              <Route path="/profile" element={<FarmerOnboarding />} />
              <Route path="/weather" element={<Weather />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {FEATURES.enableLiveMandiPulse && <PulseNotification pulse={pulse} />}

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex md:hidden z-50 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)] pb-safe overflow-x-auto">
        <div className="flex min-w-full">
          {navTabs.map(tab => (
            <NavLink 
              key={tab.path} 
              to={tab.path} 
              className={({ isActive }) => 
                `flex-1 min-w-[64px] flex flex-col items-center justify-center gap-0.5 transition-all ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary/70'}`
              }
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{tab.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <Analytics />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
