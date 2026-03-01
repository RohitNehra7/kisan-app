const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const cron = require('node-cron');
require('dotenv').config();
const dns = require('dns');

// Force IPv4 for cloud network reliability
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve Supabase ENETUNREACH by using the hostname but optimizing connection
// Note: We removed the hardcoded IP to ensure enterprise-grade DNS resilience.
const dbUrl = process.env.DATABASE_URL;

const corsOptions = {
  origin: ['http://localhost:3000', /\.vercel\.app$/, /\.onrender\.com$/],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// 1. Initialize PostgreSQL Connection Pool with Enterprise Stabilization
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  // Pool Hardening Settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Increased to 15s to prevent timeouts
});

// Pool Error Handling (Critical for Stability)
pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client', err);
});

async function initDB() {
  try {
    await pool.query('SELECT NOW()'); // Health check
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prices (
        id SERIAL PRIMARY KEY,
        state TEXT,
        district TEXT,
        market TEXT,
        commodity TEXT,
        variety TEXT,
        arrivalDate TEXT,
        minPrice REAL,
        maxPrice REAL,
        modalPrice REAL,
        fetchTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS preferences (
        id SERIAL PRIMARY KEY,
        type TEXT,
        value TEXT,
        UNIQUE(type, value)
      )
    `);

    console.log('📦 Supabase Cloud Database initialized and verified');
    backfillHistoricalData().catch(err => console.error('Backfill Error:', err));
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err.message);
    // In an enterprise app, we don't exit; we allow the app to run in "Live Only" mode
  }
}

// Data Backfill Engine (Optimized for PG)
async function backfillHistoricalData() {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || !apiKey) return;

  console.log('⏳ [Backfill Engine] Starting 7-day historical sync...');
  
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    
    try {
      const response = await axios.get(DATA_GOV_API_URL, {
        params: { 'api-key': apiKey, 'format': 'json', 'limit': 200, 'filters[arrival_date]': dateStr }
      });
      
      const records = response.data.records || [];
      if (records.length > 0) {
        const cleanedData = records.map(record => {
          const getVal = (obj, targetKey) => {
            const key = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
            return key ? obj[key] : null;
          };
          return {
            state: getVal(record, 'state') || "N/A",
            district: getVal(record, 'district') || "N/A",
            market: getVal(record, 'market') || "N/A",
            commodity: getVal(record, 'commodity') || "N/A",
            variety: getVal(record, 'variety') || "N/A",
            arrivalDate: getVal(record, 'arrival_date') || getVal(record, 'arrivalDate') || dateStr,
            minPrice: parseFloat(getVal(record, 'min_price')) || 0,
            maxPrice: parseFloat(getVal(record, 'max_price')) || 0,
            modalPrice: parseFloat(getVal(record, 'modal_price')) || 0
          };
        });
        await saveToDB(cleanedData);
      }
    } catch (err) {
      console.warn(`⚠️ Failed to backfill for ${dateStr}`);
    }
  }
}

async function saveToDB(records) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of records) {
      const exists = await client.query(
        'SELECT id FROM prices WHERE market = $1 AND commodity = $2 AND arrivalDate = $3',
        [r.market, r.commodity, r.arrivalDate]
      );
      
      if (exists.rowCount === 0) {
        await client.query(
          'INSERT INTO prices (state, district, market, commodity, variety, arrivalDate, minPrice, maxPrice, modalPrice) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [r.state, r.district, r.market, r.commodity, r.variety, r.arrivalDate, r.minPrice, r.maxPrice, r.modalPrice]
        );
      }
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

app.get('/api/weather', async (req, res) => {
  const { district } = req.query;
  res.json({
    temp: 24,
    condition: "Partly Cloudy",
    district: district || "Haryana",
    is_mock: true
  });
});

app.get('/api/preferences', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM preferences');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/preferences', async (req, res) => {
  const { type, value } = req.body;
  try {
    await pool.query('INSERT INTO preferences (type, value) VALUES ($1, $2) ON CONFLICT (type, value) DO NOTHING', [type, value]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/preferences', async (req, res) => {
  const { type, value } = req.body;
  try {
    await pool.query('DELETE FROM preferences WHERE type = $1 AND value = $2', [type, value]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/mandi-prices', async (req, res) => {
  const { state, commodity, limit = 50 } = req.query;
  const apiKey = process.env.DATA_GOV_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({ error: 'Server configuration error: Missing valid API Key' });
  }

  try {
    const params = { 'api-key': apiKey, 'format': 'json', 'limit': limit };
    if (state) params['filters[state]'] = state;
    if (commodity) params['filters[commodity]'] = commodity;

    const response = await axios.get(DATA_GOV_API_URL, { params });
    const records = response.data.records || [];
    
    const cleanedData = records.map(record => {
      const getVal = (obj, targetKey) => {
        const key = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
        return key ? obj[key] : null;
      };
      return {
        state: getVal(record, 'state') || "N/A",
        district: getVal(record, 'district') || "N/A",
        market: getVal(record, 'market') || "N/A",
        commodity: getVal(record, 'commodity') || "N/A",
        variety: getVal(record, 'variety') || "N/A",
        arrivalDate: getVal(record, 'arrival_date') || getVal(record, 'arrivalDate') || "N/A",
        minPrice: parseFloat(getVal(record, 'min_price')) || 0,
        maxPrice: parseFloat(getVal(record, 'max_price')) || 0,
        modalPrice: parseFloat(getVal(record, 'modal_price')) || 0
      };
    });

    if (cleanedData.length > 0) {
      saveToDB(cleanedData).catch(err => console.error('DB Save Error:', err));
    }

    res.json({ source: 'api', count: cleanedData.length, records: cleanedData, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.log('🔄 API failed, attempting DB fallback...');
    try {
      let query = 'SELECT * FROM prices WHERE 1=1';
      let dbParams = [];
      if (state) { query += ' AND state = $1'; dbParams.push(state); }
      const result = await pool.query(query + ' ORDER BY "fetchTimestamp" DESC LIMIT 50', dbParams);
      res.json({ source: 'database_fallback', records: result.rows });
    } catch (dbErr) {
      res.status(500).json({ error: 'Data source unavailable' });
    }
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const { market, commodity } = req.query;
    const result = await pool.query(
      'SELECT "arrivalDate", "modalPrice" FROM prices WHERE market = $1 AND commodity = $2 ORDER BY "arrivalDate" ASC LIMIT 30',
      [market, commodity]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('History API error:', err.message);
    res.status(500).json({ error: "Failed to load historical trends" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Enterprise Cloud-Connected Server running on port ${PORT}`));
});
