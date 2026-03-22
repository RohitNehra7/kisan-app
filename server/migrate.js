const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
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
      arrivals_in_qtl NUMERIC(12,2) DEFAULT 0,
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
      has_aadhaar BOOLEAN DEFAULT false,
      has_bank_account BOOLEAN DEFAULT false,
      has_kcc BOOLEAN DEFAULT false,
      land_acres NUMERIC(8,2) DEFAULT 0,
      push_token TEXT,
      session_id TEXT,
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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      engine_used TEXT,
      net_score INTEGER
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

  // 7. Analytics Tracking
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      district TEXT,
      crop TEXT,
      disease TEXT,
      session_id TEXT,
      platform TEXT DEFAULT 'web',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 8. Scheme Rules Engine
  await client.query(`
    CREATE TABLE IF NOT EXISTS scheme_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      scheme_name TEXT NOT NULL,
      scheme_hindi TEXT NOT NULL,
      description_english TEXT NOT NULL,
      description_hindi TEXT NOT NULL,
      benefit_english TEXT NOT NULL,
      benefit_hindi TEXT NOT NULL,
      eligibility_rules JSONB NOT NULL,
      payment_schedule TEXT,
      apply_url TEXT,
      documents_required TEXT[],
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 9. Sync Logs (Reliability Heartbeat)
  await client.query(`
    CREATE TABLE IF NOT EXISTS sync_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      worker_name TEXT NOT NULL,
      status TEXT NOT NULL,
      records_synced INTEGER DEFAULT 0,
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 11. Storage Locations (NWR Pledge Support)
  await client.query(`
    CREATE TABLE IF NOT EXISTS storage_locations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      district TEXT NOT NULL,
      type TEXT DEFAULT 'government',
      capacity_mt INTEGER,
      nwr_eligible BOOLEAN DEFAULT true,
      cost_per_qtl_month NUMERIC(6,2),
      commodities_accepted TEXT[],
      latitude NUMERIC(10,6),
      longitude NUMERIC(10,6),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 12. Sell Interest (Arhtiya Pro Leads)
  await client.query(`
    CREATE TABLE IF NOT EXISTS sell_interests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      auth_id UUID REFERENCES farmer_profiles(auth_id),
      mandi TEXT NOT NULL,
      crop TEXT NOT NULL,
      quantity INTEGER,
      expected_price NUMERIC(10,2),
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed some Tier 1 Warehouses
  await client.query(`
    INSERT INTO storage_locations (name, district, capacity_mt, cost_per_qtl_month, commodities_accepted) VALUES
    ('HAFED Warehouse Karnal', 'Karnal', 5000, 8.00, ARRAY['Wheat', 'Paddy']),
    ('CWC Ambala', 'Ambala', 8000, 7.50, ARRAY['Wheat', 'Mustard', 'Gram']),
    ('SWC Hisar', 'Hisar', 12000, 7.00, ARRAY['Mustard', 'Cotton', 'Bajra']),
    ('HAFED Kaithal', 'Kaithal', 6000, 8.50, ARRAY['Paddy', 'Wheat'])
    ON CONFLICT DO NOTHING;
  `);

  // Seed initial schemes
  await client.query(`
    INSERT INTO scheme_rules (scheme_name, scheme_hindi, description_english, description_hindi, benefit_english, benefit_hindi, eligibility_rules, apply_url) VALUES
    (
      'PM-KISAN',
      'PM किसान सम्मान निधि',
      'Direct income support for farmers to meet domestic and farm needs.',
      'किसानों को खेती और घरेलू जरूरतों के लिए सीधी आय सहायता।',
      '₹6,000 per year — 3 installments of ₹2,000.',
      '₹6,000 प्रति वर्ष — ₹2,000 की तीन किस्तें',
      '{"has_land": true, "requires_aadhaar": true, "requires_bank": true}',
      'https://pmkisan.gov.in'
    ),
    (
      'KCC',
      'किसान क्रेडिट कार्ड (KCC)',
      'Easy credit for farming expenses, seeds, and fertilizers.',
      'खेती के खर्चों, बीज, खाद और मशीनरी के लिए आसान लोन।',
      'Low-interest loans up to ₹3 Lakhs.',
      'खेती के लिए कम ब्याज पर लोन',
      '{"has_land": true}',
      'https://www.nabard.org'
    ),
    (
      'MFMB',
      'मेरा पानी मेरी विरासत',
      'Incentive for Haryana farmers to switch from Paddy to other crops.',
      'धान की जगह दूसरी फसलें उगाने पर हरियाणा सरकार की प्रोत्साहन राशि।',
      '₹7,000 per acre incentive.',
      'फसल विविधीकरण के लिए ₹7,000 प्रति एकड़ प्रोत्साहन।',
      '{"is_haryana": true, "paddy_only": true}',
      'https://fasal.haryana.gov.in/'
    )
    ON CONFLICT DO NOTHING;
  `);

  console.log("Migration and Seeding complete");
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
    INSERT INTO price_history (market, commodity, variety, modal_price, min_price, max_price, arrivals_in_qtl, arrival_date, state)
    SELECT
      market,
      commodity,
      variety,
      modal_price,
      min_price,
      max_price,
      arrivals_in_qtl,
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
