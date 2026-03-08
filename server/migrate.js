const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:RoTapasNe-26@db.rhvtwdshkfqgudjpnjwd.supabase.co:5432/postgres'
});

async function migrate() {
  await client.connect();

  // 1. Mandi Prices Table (Transactional Cache)
  await client.query(`
    CREATE TABLE IF NOT EXISTS prices (
      id SERIAL PRIMARY KEY,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      market TEXT NOT NULL,
      commodity TEXT NOT NULL,
      variety TEXT,
      arrival_date TEXT NOT NULL,
      min_price NUMERIC(10,2),
      max_price NUMERIC(10,2),
      modal_price NUMERIC(10,2),
      arrivals_in_qtl NUMERIC(12,2) DEFAULT 0,
      fetch_timestamp TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(market, commodity, variety, arrival_date)
    );
  `);

  // 2. Price History Table (Long-term)
  await client.query(`
    CREATE TABLE IF NOT EXISTS price_history (
      id SERIAL PRIMARY KEY,
      market TEXT NOT NULL,
      commodity TEXT NOT NULL,
      variety TEXT,
      modal_price NUMERIC(10,2),
      min_price NUMERIC(10,2),
      max_price NUMERIC(10,2),
      arrival_date DATE NOT NULL,
      state TEXT,
      UNIQUE(market, commodity, variety, arrival_date)
    );
  `);

  // 3. MSP Values Table
  await client.query(`
    CREATE TABLE IF NOT EXISTS msp_values (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      commodity TEXT NOT NULL,
      season TEXT NOT NULL,
      year TEXT NOT NULL,
      msp_per_quintal NUMERIC(8,2) NOT NULL,
      announced_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(commodity, season, year)
    );
  `);

  // 4. Farmer Profiles
  await client.query(`
    CREATE TABLE IF NOT EXISTS farmer_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone TEXT UNIQUE NOT NULL,
      name TEXT,
      district TEXT NOT NULL,
      main_crop TEXT NOT NULL,
      quantity_quintals INTEGER,
      storage_cost_per_day NUMERIC(6,2) DEFAULT 0.50,
      urgency TEXT DEFAULT 'flexible',
      push_token TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 5. Advisory Log
  await client.query(`
    CREATE TABLE IF NOT EXISTS sell_hold_recommendations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      farmer_id UUID REFERENCES farmer_profiles(id),
      crop TEXT NOT NULL,
      quantity INTEGER,
      district TEXT,
      decision TEXT NOT NULL,
      confidence TEXT,
      expected_price_min NUMERIC(8,2),
      expected_price_max NUMERIC(8,2),
      hindi_reason TEXT,
      risk_note TEXT,
      arrival_signal TEXT,
      data_age_days INTEGER DEFAULT 0,
      mandi_data JSONB,
      weather_data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 6. Farmer Forum
  await client.query(`
    CREATE TABLE IF NOT EXISTS forum_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      author TEXT NOT NULL,
      district TEXT NOT NULL,
      crop TEXT NOT NULL,
      price NUMERIC(10,2),
      message TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed MSP values
  await client.query(`
    INSERT INTO msp_values (commodity, season, year, msp_per_quintal, announced_date) VALUES
    ('Wheat',     'Rabi',   '2025-26', 2425, '2025-10-01'),
    ('Paddy',     'Kharif', '2025',    2300, '2025-06-01'),
    ('Mustard',   'Rabi',   '2025-26', 5950, '2025-10-01'),
    ('Bajra',     'Kharif', '2025',    2625, '2025-06-01'),
    ('Cotton',    'Kharif', '2025',    7121, '2025-06-01'),
    ('Sunflower', 'Kharif', '2025',    7280, '2025-06-01'),
    ('Maize',     'Kharif', '2025',    2225, '2025-06-01'),
    ('Gram',      'Rabi',   '2025-26', 5650, '2025-10-01'),
    ('Barley',    'Rabi',   '2025-26', 1850, '2025-10-01')
    ON CONFLICT (commodity, season, year) DO NOTHING;
  `);

  // Backfill price_history from prices
  await client.query(`
    INSERT INTO price_history (market, commodity, variety, modal_price, min_price, max_price, arrival_date, state)
    SELECT
      market,
      commodity,
      variety,
      modal_price,
      min_price,
      max_price,
      TO_DATE(arrival_date, 'DD/MM/YYYY') AS arrival_date,
      state
    FROM prices
    WHERE arrival_date IS NOT NULL AND arrival_date != 'N/A'
    ON CONFLICT (market, commodity, variety, arrival_date) DO NOTHING;
  `);

  console.log("Migration and Backfill complete");
  await client.end();
}

migrate().catch(console.error);
