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

const dbUrl = process.env.DATABASE_URL;

const corsOptions = {
  origin: ['http://localhost:3000', /\.vercel\.app$/, /\.onrender\.com$/],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Global Exception Logger for Enterprise Debugging
process.on('uncaughtException', (err) => {
  console.error('🔥 CRITICAL UNCAUGHT EXCEPTION:', err);
});

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on('error', (err) => console.error('❌ Pool error:', err));

async function initDB() {
  try {
    console.log('🔄 Forced Schema Verification...');
    
    // Explicitly create table with snake_case
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prices (
        id SERIAL PRIMARY KEY,
        state TEXT,
        district TEXT,
        market TEXT,
        commodity TEXT,
        variety TEXT,
        arrival_date TEXT,
        min_price REAL,
        max_price REAL,
        modal_price REAL,
        fetch_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Force migration of old columns if they exist
    const checkCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'prices'");
    const existingCols = checkCols.rows.map(r => r.column_name);
    
    if (!existingCols.includes('arrival_date')) {
      console.log('🏗️ Migrating schema: Adding arrival_date');
      await pool.query('ALTER TABLE prices ADD COLUMN arrival_date TEXT');
    }
    if (!existingCols.includes('modal_price')) {
      console.log('🏗️ Migrating schema: Adding modal_price');
      await pool.query('ALTER TABLE prices ADD COLUMN modal_price REAL');
    }

    console.log('📦 Supabase Cloud Database synced and verified');
    backfillHistoricalData().catch(err => console.error('Backfill Error:', err));
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err);
  }
}

async function backfillHistoricalData() {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return;
  
  console.log('⏳ [Backfill Engine] Starting sync...');
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
            arrival_date: getVal(record, 'arrival_date') || getVal(record, 'arrivalDate') || dateStr,
            min_price: parseFloat(getVal(record, 'min_price')) || 0,
            max_price: parseFloat(getVal(record, 'max_price')) || 0,
            modal_price: parseFloat(getVal(record, 'modal_price')) || 0
          };
        });
        await saveToDB(cleanedData);
      }
    } catch (err) { console.warn(`⚠️ Backfill failed for ${dateStr}`); }
  }
}

async function saveToDB(records) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of records) {
      const exists = await client.query(
        'SELECT id FROM prices WHERE market = $1 AND commodity = $2 AND arrival_date = $3',
        [r.market, r.commodity, r.arrival_date]
      );
      if (exists.rowCount === 0) {
        await client.query(
          'INSERT INTO prices (state, district, market, commodity, variety, arrival_date, min_price, max_price, modal_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [r.state, r.district, r.market, r.commodity, r.variety, r.arrival_date, r.min_price, r.max_price, r.modal_price]
        );
      }
    }
    await client.query('COMMIT');
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
}

app.get('/api/weather', (req, res) => {
  res.json({ temp: 24, condition: "Partly Cloudy", district: req.query.district || "Haryana", is_mock: true });
});

app.get('/api/preferences', async (req, res) => {
  try { const result = await pool.query('SELECT * FROM preferences'); res.json(result.rows); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/preferences', async (req, res) => {
  const { type, value } = req.body;
  try {
    await pool.query('INSERT INTO preferences (type, value) VALUES ($1, $2) ON CONFLICT (type, value) DO NOTHING', [type, value]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/preferences', async (req, res) => {
  const { type, value } = req.body;
  try {
    await pool.query('DELETE FROM preferences WHERE type = $1 AND value = $2', [type, value]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/mandi-prices', async (req, res) => {
  const { state, commodity, limit = 50 } = req.query;
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return res.status(500).json({ error: 'Missing API Key' });

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
      const dbRecords = cleanedData.map(r => ({ ...r, arrival_date: r.arrivalDate, min_price: r.minPrice, max_price: r.maxPrice, modal_price: r.modalPrice }));
      saveToDB(dbRecords).catch(err => console.error('DB Save Error:', err));
    }
    res.json({ source: 'api', count: cleanedData.length, records: cleanedData });
  } catch (error) {
    try {
      let query = 'SELECT state, district, market, commodity, variety, arrival_date as "arrivalDate", min_price as "minPrice", max_price as "maxPrice", modal_price as "modalPrice" FROM prices WHERE 1=1';
      let dbParams = [];
      if (state) { query += ' AND state = $1'; dbParams.push(state); }
      const result = await pool.query(query + ' ORDER BY fetch_timestamp DESC LIMIT 50', dbParams);
      res.json({ source: 'database_fallback', records: result.rows });
    } catch (dbErr) { res.status(500).json({ error: 'Data source unavailable' }); }
  }
});

app.get('/api/history', async (req, res) => {
  const { market, commodity } = req.query;
  console.log(`🔍 [History Audit] Market: ${market}, Commodity: ${commodity}`);
  
  if (!market || !commodity) return res.status(400).json({ error: "Missing params" });

  try {
    const result = await pool.query(
      'SELECT arrival_date as "arrivalDate", modal_price as "modalPrice" FROM prices WHERE market = $1 AND commodity = $2 ORDER BY arrival_date ASC LIMIT 30',
      [market, commodity]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ HISTORY API ERROR:', err);
    res.status(500).json({ 
      error: "Internal Database Error",
      details: err.message,
      sqlState: err.code
    });
  }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
