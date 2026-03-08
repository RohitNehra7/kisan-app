import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Preferences } from '@capacitor/preferences';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';
import { useMandiPrices, useMandiHistory } from '../hooks/useMandiPrices';
import { useDebouncedValue } from '../hooks/useDebouncedSearch';
import { fetchStates } from '../services/mandi.service';
import { getEnglishCommodity } from '../constants/synonyms';
import PriceCard from '../components/mandi/PriceCard';
import PriceCardSkeleton from '../components/mandi/PriceCardSkeleton';
import VoiceSearch from '../components/common/VoiceSearch';
import DataFreshnessBanner from '../components/mandi/DataFreshnessBanner';
import { HARYANA_PRIMARY_CROPS, PUNJAB_PRIMARY_CROPS } from '../constants/haryana.constants';
import type { UnitType } from '../types/mandi.types';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

type FilterMode = 'all' | 'primary' | 'favorites';

const MandiPrices: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Basic State
  const [state, setState] = useState<string>('Haryana');
  const [commodity, setCommodity] = useState<string>('');
  const [selectedMandi, setSelectedMandi] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [unit, setUnit] = useState<UnitType>('quintal');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [historyModal, setHistoryModal] = useState<{market: string, commodity: string} | null>(null);
  
  // Metadata for States (Discovered once)
  const [availableStates, setAvailableStates] = useState<string[]>(["Haryana", "Punjab", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh"]);

  const debouncedSearch = useDebouncedValue(commodity, 500);

  /**
   * DATA HANDLING (Efficient):
   * Fetch all records for the state once. All subsequent dropdown populations
   * are derived locally from this data to ensure 100% consistency.
   */
  const { data: prices, isLoading, dataUpdatedAt } = useMandiPrices({
    state,
    limit: 10000, // Full state coverage in one hop
  });

  const { data: historyData, isLoading: historyLoading } = useMandiHistory(
    historyModal?.market || '',
    historyModal?.commodity || '',
    !!historyModal
  );

  // 1. Initial Metadata Load (States only)
  useEffect(() => {
    fetchStates().then(data => { if (data.length > 0) setAvailableStates(data); });
  }, []);

  // 2. Localized Hierarchy Computation
  const availableMandis = useMemo(() => {
    if (!prices) return [];
    return Array.from(new Set(prices.map(p => p.market))).sort();
  }, [prices]);

  const availableCrops = useMemo(() => {
    if (!prices) return [];
    // If a mandi is selected, only show crops available in that specific mandi
    const source = selectedMandi === 'all' 
      ? prices 
      : prices.filter(p => p.market === selectedMandi);
    return Array.from(new Set(source.map(p => p.commodity))).sort();
  }, [prices, selectedMandi]);

  // Reset sub-filters on state change
  useEffect(() => {
    setSelectedMandi('all');
    setSelectedCrop('all');
  }, [state]);

  // Auto-correct crop selection if it's no longer available in the newly selected mandi
  useEffect(() => {
    if (selectedCrop !== 'all' && !availableCrops.includes(selectedCrop)) {
      setSelectedCrop('all');
    }
  }, [selectedMandi, availableCrops, selectedCrop]);

  useEffect(() => {
    const loadFavs = async () => {
      const { value } = await Preferences.get({ key: 'mandi_favorites' });
      if (value) setFavorites(JSON.parse(value));
    };
    loadFavs();
  }, []);

  const toggleFavorite = async (comm: string) => {
    const next = favorites.includes(comm) ? favorites.filter(f => f !== comm) : [...favorites, comm];
    setFavorites(next);
    await Preferences.set({ key: 'mandi_favorites', value: JSON.stringify(next) });
  };

  /**
   * Final Filtering Logic
   */
  const displayedPrices = useMemo(() => {
    if (!prices) return [];
    let filtered = [...prices];

    // Hierarchy Filters
    if (selectedMandi !== 'all') filtered = filtered.filter(p => p.market === selectedMandi);
    if (selectedCrop !== 'all') filtered = filtered.filter(p => p.commodity === selectedCrop);

    // Search refines further
    if (debouncedSearch.length > 0) {
      const term = debouncedSearch.toLowerCase();
      const englishTerm = getEnglishCommodity(term).toLowerCase();

      filtered = filtered.filter(p => 
        p.commodity.toLowerCase().includes(term) ||
        p.commodity.toLowerCase().includes(englishTerm) ||
        p.market.toLowerCase().includes(term)
      );
    } 

    const primaryCrops = state === 'Haryana' ? HARYANA_PRIMARY_CROPS : (state === 'Punjab' ? PUNJAB_PRIMARY_CROPS : []);

    // Tab Filters
    if (filterMode === 'favorites') {
      filtered = filtered.filter(p => favorites.includes(p.commodity));
    } else if (filterMode === 'primary') {
      filtered = filtered.filter(p => primaryCrops.some(pc => p.commodity.toLowerCase().includes(pc.toLowerCase())));
    }

    // Sort: Primary -> Favs -> Alpha
    return filtered.sort((a, b) => {
      const aIsPrimary = primaryCrops.some(pc => a.commodity.toLowerCase().includes(pc.toLowerCase()));
      const bIsPrimary = primaryCrops.some(pc => b.commodity.toLowerCase().includes(pc.toLowerCase()));
      if (aIsPrimary && !bIsPrimary) return -1;
      if (!aIsPrimary && bIsPrimary) return 1;
      return a.commodity.localeCompare(b.commodity);
    });
  }, [prices, selectedMandi, selectedCrop, debouncedSearch, filterMode, favorites, state]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col min-h-full">
      <div className="bg-white border-b border-slate-200 sticky top-14 md:top-16 z-30 px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 md:gap-4">
          
          {/* Exhaustive Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{t('common.select_state')}</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20">
                {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{i18n.language === 'hi' ? 'मंडी चुनें' : 'Select Mandi'}</label>
              <select value={selectedMandi} onChange={(e) => setSelectedMandi(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20">
                <option value="all">{isLoading ? 'Loading...' : (i18n.language === 'hi' ? 'सभी मंडियां' : 'All Mandis')}</option>
                {availableMandis.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">{i18n.language === 'hi' ? 'फसल चुनें' : 'Select Crop'}</label>
              <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary/20">
                <option value="all">{isLoading ? 'Loading...' : (i18n.language === 'hi' ? 'सभी फसलें' : 'All Crops')}</option>
                {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" placeholder={t('common.search_placeholder')} value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20" />
              </div>
              <VoiceSearch onResult={(text) => setCommodity(text)} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {(['primary', 'all', 'favorites'] as FilterMode[]).map(mode => (
                <button key={mode} onClick={() => setFilterMode(mode)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterMode === mode ? 'bg-primary border-primary text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  {mode === 'primary' && '⭐ '} {mode === 'all' && '🌎 '} {mode === 'favorites' && '❤️ '} {mode}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
              {(['quintal', 'maund', 'kg'] as UnitType[]).map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`flex-1 md:px-4 py-1.5 text-[10px] md:text-xs font-black rounded-lg transition-all ${unit === u ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}>{t(`common.${u}`).split(' ')[0]}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:px-8">
        {!isLoading && prices && prices.length > 0 && (
          <DataFreshnessBanner arrivalDate={prices[0].arrival_date} />
        )}

        <div className="min-h-[60vh]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <PriceCardSkeleton key={n} />)}
            </div>
          ) : displayedPrices.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center px-6 shadow-sm">
              <span className="text-6xl mb-6">{filterMode === 'favorites' ? '❤️' : '🔍'}</span>
              <h3 className="text-xl font-black text-slate-800 mb-2">
                {filterMode === 'favorites' ? t('favorites.empty_title') : t('common.no_records')}
              </h3>
              <p className="text-slate-400 font-bold text-sm max-w-xs leading-relaxed">
                {filterMode === 'favorites' ? t('favorites.empty_hint') : 'कुछ और खोजें या फ़िल्टर बदलें'}
              </p>
              {filterMode === 'favorites' && (
                <button onClick={() => setFilterMode('all')} className="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                  {t('favorites.browse_all')}
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedPrices.map((p, idx) => (
                <PriceCard key={`${p.market}-${p.commodity}-${idx}`} record={p} unit={unit} isFavorite={favorites.includes(p.commodity)} onToggleFavorite={toggleFavorite} onViewTrends={(market, commodity) => setHistoryModal({market, commodity})} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {historyModal && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setHistoryModal(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 500 }} className="bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 md:hidden" />
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tighter">{historyModal.commodity}</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">📍 {historyModal.market}</p>
                  </div>
                  <button onClick={() => setHistoryModal(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-90 font-bold text-xl shadow-sm">✕</button>
                </div>
                <div className="h-72 w-full">
                  {historyLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-50 rounded-3xl">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('common.loading')}</p>
                    </div>
                  ) : historyData && historyData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="arrival_date" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 900}} 
                          itemStyle={{color: '#1B5E20'}}
                        />
                        <Line type="monotone" dataKey="modal_price" stroke="#1B5E20" strokeWidth={5} dot={{r: 5, fill: '#1B5E20', strokeWidth: 0}} activeDot={{r: 8, strokeWidth: 0}} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-slate-50 rounded-3xl text-center p-8 border border-dashed border-slate-200">
                      <span className="text-5xl mb-4">📈</span>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-tight leading-relaxed">No historical data available for this market yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MandiPrices;
