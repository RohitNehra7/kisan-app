const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const cron = require('node-cron');
require('dotenv').config();
const dns = require('dns').promises;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());

const DATA_GOV_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

let pool;

async function connectWithRetry() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is missing in environment variables');
    return;
  }

  // SMART DNS RESOLUTION: Bypassing IPv6 issues by pre-resolving host to IPv4
  let resolvedUrl = dbUrl;
  try {
    const urlMatch = dbUrl.match(/@([^:/]+)/);
    if (urlMatch && urlMatch[1]) {
      const hostname = urlMatch[1];
      console.log(`🔍 Resolving IPv4 for ${hostname}...`);
      const addresses = await dns.resolve4(hostname);
      if (addresses && addresses.length > 0) {
        console.log(`✅ Host resolved to ${addresses[0]}`);
        resolvedUrl = dbUrl.replace(hostname, addresses[0]);
      }
    }
  } catch (dnsErr) {
    console.warn('⚠️ DNS Resolution failed, using original URL:', dnsErr.message);
  }

  pool = new Pool({
    connectionString: resolvedUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
    max: 10
  });

  // AGGRESSIVE RETRY LOOP (The "Smart" Way)
  let attempts = 0;
  while (attempts < 10) {
    try {
      attempts++;
      const client = await pool.connect();
      console.log(`✅ [Attempt ${attempts}] Cloud Database Handshake Successful`);
      client.release();
      return true;
    } catch (err) {
      console.error(`❌ [Attempt ${attempts}] Connection failed: ${err.message}`);
      if (attempts >= 10) throw err;
      await new Promise(res => setTimeout(res, 5000)); // Wait 5s between retries
    }
  }
}

async function initDB() {
  try {
    await connectWithRetry();
    
    // Standardize Schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prices (
        id SERIAL PRIMARY KEY,
        state TEXT, district TEXT, market TEXT, commodity TEXT, variety TEXT,
        arrival_date TEXT, min_price REAL, max_price REAL, modal_price REAL,
        fetch_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS preferences (
        id SERIAL PRIMARY KEY,
        type TEXT, value TEXT, UNIQUE(type, value)
      );
    `);

    console.log('📦 Supabase Infrastructure Synchronized');
    backfillHistoricalData().catch(err => console.error('Backfill Error:', err));
  } catch (err) {
    console.error('🔥 CRITICAL: Database could not be reached after 10 attempts.');
  }
}

async function backfillHistoricalData() {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') return;
  
  console.log('⏳ [Backfill] Syncing history...');
  for (let i = 1; i <= 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    try {
      const response = await axios.get(DATA_GOV_API_URL, {
        params: { 'api-key': apiKey, 'format': 'json', 'limit': 100, 'filters[arrival_date]': dateStr }
      });
      const records = response.data.records || [];
      if (records.length > 0) {
        const cleanedData = records.map(record => {
          const getVal = (obj, targetKey) => {
            const key = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
            return key ? obj[key] : null;
          };
          return [
            getVal(record, 'state') || "N/A", getVal(record, 'district') || "N/A",
            getVal(record, 'market') || "N/A", getVal(record, 'commodity') || "N/A",
            getVal(record, 'variety') || "N/A", dateStr,
            parseFloat(getVal(record, 'min_price')) || 0,
            parseFloat(getVal(record, 'max_price')) || 0,
            parseFloat(getVal(record, 'modal_price')) || 0
          ];
        });

        const client = await pool.connect();
        try {
          for (const row of cleanedData) {
            await client.query(
              'INSERT INTO prices (state, district, market, commodity, variety, arrival_date, min_price, max_price, modal_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
              row
            );
          }
        } finally { client.release(); }
      }
    } catch (err) {}
  }
}

app.get('/api/history', async (req, res) => {
  const { market, commodity } = req.query;
  try {
    const result = await pool.query(
      'SELECT arrival_date as "arrivalDate", modal_price as "modalPrice" FROM prices WHERE market = $1 AND commodity = $2 ORDER BY arrival_date ASC LIMIT 30',
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
      minPrice: parseFloat(r.min_price) || 0, maxPrice: parseFloat(r.max_price) || 0
    }));
    res.json({ source: 'api', records: cleanedData });
  } catch (error) {
    const result = await pool.query('SELECT * FROM prices LIMIT 50');
    res.json({ source: 'cache', records: result.rows });
  }
});

app.get('/api/weather', (req, res) => res.json({ temp: 24, condition: "Clear", is_mock: true }));

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Smart Cloud Server running on port ${PORT}`));
});
