const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:RoTapasNe-26@db.rhvtwdshkfqgudjpnjwd.supabase.co:5432/postgres'
});

async function migrate() {
  await client.connect();

  // 1. Mandi Prices Table
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

  // 2. Add arrivals_in_qtl if it doesn't exist
  await client.query(`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prices' AND column_name='arrivals_in_qtl') THEN
        ALTER TABLE prices ADD COLUMN arrivals_in_qtl NUMERIC(12,2) DEFAULT 0;
      END IF;
    END $$;
  `);

  // 3. Drop old constraint if exists and add new one
  try {
    await client.query(`ALTER TABLE prices DROP CONSTRAINT IF EXISTS prices_market_commodity_arrival_date_key;`);
    await client.query(`ALTER TABLE prices ADD CONSTRAINT prices_market_commodity_variety_arrival_date_key UNIQUE(market, commodity, variety, arrival_date);`);
  } catch (e) {
    // Constraint might already exist with different name or columns
  }

  // 3. Farmer Profiles
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

  // 4. Recommendations Log
  await client.query(`
    CREATE TABLE IF NOT EXISTS sell_hold_recommendations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      farmer_id UUID REFERENCES farmer_profiles(id),
      crop TEXT NOT NULL,
      quantity INTEGER,
      decision TEXT NOT NULL,
      confidence TEXT,
      expected_price_min NUMERIC(8,2),
      expected_price_max NUMERIC(8,2),
      hindi_reason TEXT,
      risk_note TEXT,
      mandi_data JSONB,
      weather_data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 5. Metadata Directory (Exhaustive)
  await client.query(`
    CREATE TABLE IF NOT EXISTS mandi_directory (
      id SERIAL PRIMARY KEY,
      state TEXT NOT NULL,
      market TEXT NOT NULL,
      district TEXT,
      last_seen TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(state, market)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS commodity_directory (
      id SERIAL PRIMARY KEY,
      commodity TEXT NOT NULL UNIQUE,
      last_seen TIMESTAMPTZ DEFAULT NOW()
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

  console.log("Migration complete");
  await client.end();
}

migrate().catch(console.error);
