const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Hybrid Persistence Layer
let dbMode = 'cloud';
let pgPool = null;
let sqliteDB = null;

async function initPersistence() {
  // 1. Try Cloud (Supabase)
  if (process.env.DATABASE_URL) {
    try {
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000 // Quick fail
      });
      await pgPool.query('SELECT NOW()');
      console.log('✅ Connected to Supabase Cloud');
      dbMode = 'cloud';
    } catch (err) {
      console.warn('⚠️ Cloud DB Failed, falling back to Local Engine:', err.message);
      dbMode = 'local';
    }
  } else {
    dbMode = 'local';
  }

  // 2. Initialize Local Fallback (SQLite)
  sqliteDB = await open({
    filename: './kisan_local.db',
    driver: sqlite3.Database
  });

  const schema = `
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state TEXT, district TEXT, market TEXT, commodity TEXT, variety TEXT,
      arrival_date TEXT, min_price REAL, max_price REAL, modal_price REAL,
      fetch_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT, value TEXT, UNIQUE(type, value)
    );
  `;
  
  if (dbMode === 'local') {
    await sqliteDB.exec(schema);
    console.log('📦 Local Persistence Engine Active');
  } else {
    // Sync schema to cloud if needed
    try {
      await pgPool.query(schema.replace(/AUTOINCREMENT/g, '')); // Simplified for PG
    } catch (e) {}
  }
}

// Unified Query Helper
async function query(text, params) {
  if (dbMode === 'cloud') {
    try {
      const res = await pgPool.query(text.replace(/\?/g, (_, i) => `$${i + 1}`), params);
      return { rows: res.rows };
    } catch (e) {
      console.error('Cloud Query Error, using local cache:', e.message);
    }
  }
  // Local Fallback
  const rows = await sqliteDB.all(text, params);
  return { rows };
}

async function execute(text, params) {
  if (dbMode === 'cloud') {
    try {
      await pgPool.query(text.replace(/\?/g, (_, i) => `$${i + 1}`), params);
      return;
    } catch (e) {}
  }
  await sqliteDB.run(text, params);
}

app.get('/api/history', async (req, res) => {
  const { market, commodity } = req.query;
  try {
    const result = await query(
      'SELECT arrival_date as "arrivalDate", modal_price as "modalPrice" FROM prices WHERE market = ? AND commodity = ? ORDER BY arrival_date ASC LIMIT 30',
      [market, commodity]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/mandi-prices', async (req, res) => {
  const { state, commodity } = req.query;
  const apiKey = process.env.DATA_GOV_API_KEY;
  try {
    const response = await axios.get(DATA_GOV_API_URL, {
      params: { 'api-key': apiKey, 'format': 'json', 'limit': 100, 'filters[state]': state, 'filters[commodity]': commodity }
    });
    const records = response.data.records || [];
    const cleanedData = records.map(r => ({
      arrivalDate: r.arrival_date, modalPrice: parseFloat(r.modal_price) || 0,
      market: r.market, commodity: r.commodity, district: r.district, variety: r.variety,
      minPrice: parseFloat(r.min_price) || 0, max_price: parseFloat(r.max_price) || 0
    }));

    // Async Save
    for (const r of cleanedData) {
      execute(
        'INSERT OR IGNORE INTO prices (state, district, market, commodity, variety, arrival_date, min_price, max_price, modal_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [state, r.district, r.market, r.commodity, r.variety, r.arrivalDate, r.minPrice, r.maxPrice, r.modalPrice]
      ).catch(() => {});
    }

    res.json({ source: 'api', records: cleanedData });
  } catch (error) {
    const result = await query('SELECT * FROM prices LIMIT 50', []);
    res.json({ source: 'cache', records: result.rows });
  }
});

// Other endpoints (preferences, weather) simplified...
app.get('/api/weather', (req, res) => res.json({ temp: 24, condition: "Clear", district: req.query.district, is_mock: true }));

initPersistence().then(() => {
  app.listen(PORT, () => console.log(`🚀 Hybrid Enterprise Server running on port ${PORT}`));
});
