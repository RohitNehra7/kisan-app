import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';
import './App.css';
import { translations, Language } from './translations';

interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

interface Preference {
  type: string;
  value: string;
}

interface Weather {
  temp: number;
  condition: string;
  district: string;
}

function App() {
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState<string>('Haryana');
  const [commodityFilter, setCommodityFilter] = useState<string>('');
  const [lang, setLang] = useState<Language>('hi');
  const [favorites, setFavorites] = useState<Preference[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<any[]>([]);
  const [historyModal, setHistoryModal] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState<'quintal' | 'kg' | 'maund'>('quintal');

  const t = translations[lang];
  
  // Enterprise Fail-safe API URL handling
  const rawApiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const apiBase = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

  useEffect(() => {
    console.log(`🚀 [Enterprise Audit] Connecting to Backend at: ${apiBase}`);
  }, [apiBase]);

  const formatPrice = (basePrice: number) => {
    if (!basePrice || basePrice === 0) return '---';
    let price = basePrice;
    if (selectedUnit === 'kg') price = basePrice / 100;
    if (selectedUnit === 'maund') price = basePrice * 0.4;
    return price.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  // Handle scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${apiBase}/api/mandi-prices`);
      if (stateFilter) url.searchParams.append('state', stateFilter);
      if (commodityFilter) url.searchParams.append('commodity', commodityFilter);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();

      if (data.error) throw new Error(data.error);
      
      // CRASH PREVENTION: Ensure records is always an array
      setRecords(Array.isArray(data.records) ? data.records : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to the server. Please try again.');
      setRecords([]); // Safe fallback
    } finally {
      setLoading(false);
    }
  }, [stateFilter, commodityFilter, apiBase]);

  const fetchWeather = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/api/weather?district=${stateFilter}`);
      const data = await response.json();
      if (!data.error) setWeather(data);
    } catch (err) {
      console.warn('Weather service unavailable');
    }
  }, [stateFilter, apiBase]);

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/api/preferences`);
      const data = await response.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Preferences service unavailable');
    }
  }, [apiBase]);

  useEffect(() => {
    fetchPrices();
    fetchWeather();
    fetchPreferences();
  }, [fetchPrices, fetchWeather, fetchPreferences]);

  const fetchHistory = async (market: string, commodity: string) => {
    setHistoryLoading(true);
    setHistoryModal(`${commodity} - ${market}`);
    try {
      const response = await fetch(`${apiBase}/api/history?market=${market}&commodity=${commodity}`);
      const data = await response.json();
      setSelectedHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('History error', err);
      setSelectedHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleFavorite = async (commodity: string) => {
    const isFav = favorites.some(f => f.type === 'commodity' && f.value === commodity);
    const method = isFav ? 'DELETE' : 'POST';
    
    // Optimistic UI update for UX
    if (isFav) {
      setFavorites(prev => prev.filter(f => !(f.type === 'commodity' && f.value === commodity)));
    } else {
      setFavorites(prev => [...prev, { type: 'commodity', value: commodity }]);
    }

    try {
      await fetch(`${apiBase}/api/preferences`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'commodity', value: commodity })
      });
    } catch (err) {
      console.error('Failed to toggle favorite');
      fetchPreferences(); // Revert on failure
    }
  };

  // Safe filtering
  const displayedRecords = showOnlyFavorites 
    ? records.filter(r => favorites.some(f => f.type === 'commodity' && f.value === r.commodity))
    : records;

  return (
    <div className="app-container">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="header-brand">
            <div className="logo-icon">🌾</div>
            <div className="brand-text">
              <h1>{t.logo.replace('🌾 ', '')}</h1>
              <span className="subtitle">Real-time Market Intelligence</span>
            </div>
          </div>
          
          <div className="header-controls">
            {weather && (
              <div className="weather-badge">
                <span className="weather-icon">{weather.condition.toLowerCase().includes('rain') ? '🌧️' : '⛅'}</span>
                <span className="temp">{weather.temp}°C</span>
              </div>
            )}
            
            <div className="lang-toggle">
              <button className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>HI</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="search-glass-panel">
            <div className="filter-group">
              <label>{t.selectState}</label>
              <select 
                value={stateFilter} 
                onChange={(e) => setStateFilter(e.target.value)}
                className="premium-select"
              >
                <option value="Haryana">{t.haryana}</option>
                <option value="Punjab">{t.punjab}</option>
                <option value="Rajasthan">{t.rajasthan}</option>
                <option value="Uttar Pradesh">{t.up}</option>
                <option value="Madhya Pradesh">{t.mp}</option>
              </select>
            </div>
            
            <div className="filter-group flex-grow">
              <label>Search Commodity</label>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder} 
                  value={commodityFilter}
                  onChange={(e) => setCommodityFilter(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchPrices()}
                  className="premium-input"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={fetchPrices} className="btn-primary">{t.searchButton}</button>
              <div className="unit-toggle-group">
                <button className={selectedUnit === 'quintal' ? 'active' : ''} onClick={() => setSelectedUnit('quintal')}>Q</button>
                <button className={selectedUnit === 'maund' ? 'active' : ''} onClick={() => setSelectedUnit('maund')}>Mann</button>
                <button className={selectedUnit === 'kg' ? 'active' : ''} onClick={() => setSelectedUnit('kg')}>Kg</button>
              </div>
              <button 
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)} 
                className={`btn-favorite ${showOnlyFavorites ? 'active' : ''}`}
              >
                {showOnlyFavorites ? t.showAll : `⭐ ${t.favorites} (${favorites.length})`}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-banner error">
            <span className="alert-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={fetchPrices} className="retry-btn">Try Again</button>
          </div>
        )}

        <div className="dashboard-layout">
          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="skeleton-card">
                  <div className="skel-header"></div>
                  <div className="skel-body"></div>
                  <div className="skel-footer"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {displayedRecords.length === 0 && !error ? (
                <div className="empty-state">
                  <div className="empty-icon">🏜️</div>
                  <h3>{t.noRecords}</h3>
                  <p>Try adjusting your search filters or selecting a different state.</p>
                </div>
              ) : (
                <div className="premium-grid">
                  {displayedRecords.map((record, index) => {
                    const isFav = favorites.some(f => f.type === 'commodity' && f.value === record.commodity);
                    return (
                      <div key={`${record.market}-${record.commodity}-${index}`} className="modern-card">
                        <div className="card-top">
                          <div className="badges">
                            <span className="badge category">{record.commodity}</span>
                            <span className="badge variety">{record.variety || 'General'}</span>
                          </div>
                          <button 
                            className={`star-btn ${isFav ? 'active' : ''}`}
                            onClick={() => toggleFavorite(record.commodity)}
                            title="Save to Favorites"
                          >
                            {isFav ? '⭐' : '☆'}
                          </button>
                        </div>
                        
                        <div className="price-display">
                          <div className="price-main">
                            <span className="currency">₹</span>
                            <span className="amount">{formatPrice(record.modalPrice)}</span>
                            <span className="unit">/ {selectedUnit === 'quintal' ? 'Quintal' : selectedUnit === 'maund' ? '40kg' : 'kg'}</span>
                          </div>
                          <div className="price-meta">
                            <span className="label">{t.modalPrice}</span>
                          </div>
                        </div>

                        <div className="price-range-bar">
                          <div className="range-labels">
                            <span>{t.min}: ₹{formatPrice(record.minPrice)}</span>
                            <span>{t.max}: ₹{formatPrice(record.maxPrice)}</span>
                          </div>
                          <div className="progress-bg">
                            <div className="progress-fill" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        <div className="card-bottom">
                          <div className="location-info">
                            <span className="icon">📍</span>
                            <div>
                              <p className="market-name">{record.market}</p>
                              <p className="district-name">{record.district}</p>
                            </div>
                          </div>
                          <button 
                            className="btn-icon"
                            onClick={() => fetchHistory(record.market, record.commodity)}
                            title={t.viewTrends}
                          >
                            📈
                          </button>
                        </div>
                        <div className="timestamp">
                          Updated: {record.arrivalDate}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {historyModal && (
        <div className="modal-backdrop" onClick={() => setHistoryModal(null)}>
          <div className="premium-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{historyModal}</h2>
                <p className="modal-subtitle">30-Day Price Trajectory (₹ / Quintal)</p>
              </div>
              <button onClick={() => setHistoryModal(null)} className="btn-close">✕</button>
            </div>
            
            <div className="modal-body">
              {historyLoading ? (
                <div className="chart-skeleton">
                  <div className="skel-line"></div>
                  <p>Analyzing historical trends...</p>
                </div>
              ) : selectedHistory && selectedHistory.length > 0 ? (
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="arrivalDate" tick={{fontSize: 12, fill: '#64748b'}} tickMargin={10} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [value ? `₹${value.toLocaleString('en-IN')}` : 'N/A', 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="modalPrice" 
                        stroke="#0ea5e9" 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">
                  <p>Not enough historical data available for this specific market and crop.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
