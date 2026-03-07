# KisanNiti â€” CEO Vision Document
## For Gemini CLI: Read this COMPLETELY before every session, every time.
**Version:** 4.0 | **Date:** March 2026 | **Status:** Active Development
**Author:** Rohit Nehra | **Mission:** â‚¹1 crore ARR by March 2027

---

## SECTION 1 â€” THE NORTH STAR

**KisanNiti (à¤•à¤¿à¤¸à¤¾à¤¨ à¤¨à¥€à¤¤à¤¿)** is India's first **Sell/Hold Decision Engine** for farmers.

We answer one question every other app refuses to answer:

> **"à¤®à¥‡à¤°à¥€ à¤«à¤¸à¤² à¤†à¤œ à¤¬à¥‡à¤šà¥‚à¤‚ à¤¯à¤¾ à¤°à¥à¤•à¥‚à¤‚?" â€” Should I sell my crop today or wait?**

Every feature, every API call, every line of code must serve this question.
If it doesn't answer this question for a Haryana farmer, we don't build it.

---

## SECTION 2 â€” THE ACTUAL MARKET NEED (ground truth from research)

### The real problem is not information. It is financial entrapment.

Haryana wheat farmers face a structural trap that no price app solves:

**The Arhtiya Trap â€” the core problem KisanNiti must solve**

There are 22,000 arthiyas registered in Haryana. Each deals with 40â€“200 farmers.
The arhtiya is simultaneously the farmer's:
- Banker â†’ lends money all season at 18â€“37% annual interest
- Commission agent â†’ earns 2.5% on every sale, paid by the buyer
- Store owner â†’ sells fertilizer, seed, pesticide on credit
- Advisor â†’ recommends when to sell

The arhtiya's financial incentive is always to sell fast. Every week the crop waits:
- The farmer's interest debt compounds
- The arhtiya earns nothing on his float capital
- The arhtiya prefers fast turnover over farmer income maximization

When the arhtiya says "sell now," farmers comply â€” not because they trust the advice, but because they are financially dependent. This is not stupidity. It is a debt trap that has existed since the Green Revolution of the 1970s.

**The Income Loss Is Real and Quantifiable**

Farmers who sell wheat in the first 2 weeks of harvest (April 1â€“15) receive â‚¹50â€“200/quintal less than those who wait 3â€“4 weeks. The reason:
- All farmers harvest simultaneously â†’ arrivals spike â†’ prices crash
- Traders and millers know this seasonal pattern and wait
- Farmers cannot wait because of arhtiya interest pressure

For a 100-quintal farm (typical medium Haryana farm), this timing loss = â‚¹5,000â€“â‚¹20,000 per harvest. Two harvests per year = â‚¹10,000â€“â‚¹40,000/year left on the table. A single good timing decision â€” supported by data â€” can pay for a child's school fees.

**Academic evidence:** A 2025 Indian Journal of Agricultural Economics study of sub-MSP wheat transactions found farmers selling above MSP consistently earned â‚¹9,137â€“â‚¹10,158 more per hectare than those who didn't â€” not because their crop was better, but because of timing and negotiation leverage.

**The app graveyard problem â€” why every agri app fails retention**

| App | Problem | Retention result |
|---|---|---|
| Kisan Suvidha (2016) | Shows prices. No action output. Crashes. | ~3L active users of 500M farmers |
| IFFCO Kisan | Information overload, no verdict | 80% churn within 2 months |
| AgroStar / DeHaat | Pre-harvest input sales, not sell-side | Different problem, different user |
| eNAM | Trader-facing auction platform | Not used by farmers directly |
| Bharat-VISTAAR (Feb 2026) | Govt AI chatbot, national scale, no local depth | Too early to measure |

**The common failure:** Apps tell farmers WHAT the price is. None tell them WHAT TO DO with that price. Farmers look at â‚¹2,380/quintal in Karnal and still don't know if they should sell. They close the app. They don't return.

KisanNiti gives a single verdict: **SELL** or **HOLD**. In Hindi. With a reason. That is why they come back.

### The gaps at ground level â€” what nobody has solved

**Gap 1: The second opinion gap**
Farmers have one advisor: their arhtiya. They have no way to get an independent data-backed second opinion. KisanNiti is that second opinion. Not competing with the arhtiya â€” existing alongside him.

**Gap 2: The arrival quantity gap**
No farmer app uses arrival quantity data as a price predictor. Traders have been using this signal for decades (high arrivals â†’ oversupply â†’ prices drop in 2â€“3 days). This exact signal is available free in the Agmarknet API. We will be the first to put it in a farmer's hands.

**Gap 3: The crop calendar timing gap**
Every app shows today's price. Nobody tells you that wheat prices in Haryana historically bottom in April (peak arrivals week) and recover 3â€“5% by mid-May. This seasonal pattern is predictable from 5+ years of Agmarknet historical data and it is the single most actionable insight a Haryana wheat farmer can receive.

**Gap 4: The Meri Fasal Mera Byora integration gap**
Haryana runs a mandatory crop registration portal (fasal.haryana.gov.in). Every farmer selling at MSP must register. This means the Haryana government already has: farmer name, phone, crop type, khasra number, district, quantity. No agri app has thought to connect this data to a sell/hold decision. This is a distribution and personalization opportunity unique to Haryana.

**Gap 5: The NWR pledge gap (most underutilized financial tool in Indian agriculture)**
Warehouse Development Regulatory Authority (WDRA) issues Negotiable Warehouse Receipts. A farmer can store grain in an accredited warehouse and borrow 70â€“80% of market value without selling. This allows holding without cash pressure. No consumer-facing app explains or enables this. KisanNiti Phase 3 should make this one tap.

**Gap 6: The post-harvest quality degradation gap**
Paddy loses ~5 quintals every 4 rain-days after harvest. Cotton depreciates with every day of excess humidity. Wheat quality grades down after 3 months without proper storage. The "hold" recommendation must account for quality loss. No existing app does this. Our weather integration + crop-specific quality rules must address it.

---

## SECTION 3 â€” THE FOUNDER'S EDGE (unfair moat)

Rohit Nehra has three things simultaneously that no Bangalore agritech founder has:

1. **Agricultural roots in Haryana** â€” understands what a Karnal farmer worries about at 4am (not yield â€” PRICE AND TIMING). Can validate the product with actual relatives.
2. **Swing trading knowledge** â€” arrival quantity as price signal, trend reversal detection, hold vs. exit discipline. This is crop market timing applied to financial market thinking. No competitor thinks this way.
3. **Engineer who can ship** â€” can build and iterate fast without a team.

**Never build generic. Always build Haryana-deep.**
When we know Haryana well, Punjab, Rajasthan, and UP will follow the same playbook.

---

## SECTION 4 â€” COMPETITIVE LANDSCAPE AND HOW WE WIN

### The real competitive map

| Competitor | Funded | What they do | Why farmers churn | Our advantage |
|---|---|---|---|---|
| Kisan Suvidha (Govt) | âˆž govt | Price info, weather | No verdict, crashes | One Hindi verdict |
| Bharat-VISTAAR (Feb 2026) | â‚¹10,372 Cr govt | National AI chatbot | Generic, no local depth | Haryana-specific signals |
| eNAM | â‚¹400 Cr govt | Online auction | Trader-facing, complex | We are advisory, they are transactional |
| AgroStar | $100M+ VC | Input sales + pest advisory | Pre-harvest problem | We own post-harvest |
| DeHaat | $200M+ VC | Full stack input+advisory | UP/Bihar focus | Haryana-native, single sharp feature |
| IFFCO Kisan | Cooperative | Advisory + weather | Information overload, no verdict | One verdict, in Hindi |
| NaPanta | Unknown | Mandi price tracking | Price only, no decision | We add AI decision layer |

### How we specifically beat each one

**Over Bharat-VISTAAR** â€” This is the battle that matters most. It launched February 2026 with â‚¹10,372 crore government investment. It calls the same Agmarknet API. It gives national-level generic advice. We beat it with:
- Arrival quantity signal (they don't use it)
- District-level crop calendar patterns (they don't know Haryana harvest timing)
- Arhtiya-as-distribution tool (they are bypassing arthiyas; we are making arthiyas our Pro customers)
- Hindi verdict UI (they are a chatbot; we are a decision)

**Over eNAM** â€” eNAM has 1.77 crore farmer registrations and 2.53 lakh trader registrations as of 2025. Farmers don't use eNAM to make decisions â€” they use it to complete a transaction. We are the layer that tells them whether to transact at all. We should eventually integrate eNAM data as our same-day price source.

**Over AgroStar/DeHaat** â€” They own the pre-harvest farmer relationship (input purchase). We own the post-harvest moment (sell decision). These are separate problems. We can eventually partner; we don't compete.

**The partnership insight:** Arthiyas are not our enemies. There are 22,000 registered arthiyas in Haryana. If KisanNiti gives each arhtiya a dashboard showing price trends, arrival signals, and hold/sell recommendations for all their farmers â€” and charges â‚¹399/month for it â€” that is â‚¹88L/month at full penetration. Arhtiya Pro is our B2B product. We make the arhtiya better at his job, not obsolete.

---

## SECTION 5 â€” COMPLETELY FREE APIs (zero cost, zero credit card)

### ðŸŸ¢ TIER 1 â€” Available now, integrate immediately

#### API 1: Agmarknet â€” Mandi Prices + Arrival Quantity
```
Base URL: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
Auth: api-key from data.gov.in â€” free registration, no credit card ever
Key fields: state, district, market, commodity, min_price, max_price,
            modal_price, arrivals_in_qtl, arrival_date
Sample call:
  ?api-key={KEY}&format=json&filters[State]=Haryana
  &filters[Commodity]=Wheat&limit=100
Cost: Completely free. No rate limit published. Cache aggressively (TTL 6h).
Critical note: arrivals_in_qtl is in the same response â€” always fetch it.
               It is the single best free price prediction signal available.
```

#### API 2: Open-Meteo â€” Weather (16-day forecast, no key required)
```
Forecast URL: https://api.open-meteo.com/v1/forecast
Historical URL: https://archive-api.open-meteo.com/v1/archive
Auth: NONE. No API key. No registration. No credit card. Ever.
Daily fields: precipitation_sum, temperature_2m_max, temperature_2m_min,
              weathercode, windspeed_10m_max
Sample call:
  ?latitude=29.6857&longitude=76.9905
  &current=temperature_2m,apparent_temperature,weathercode,relativehumidity_2m,windspeed_10m
  &daily=precipitation_sum,temperature_2m_max,temperature_2m_min,weathercode
  &forecast_days=16&timezone=Asia/Kolkata
Cost: Free up to 10,000 calls/day. No key. Open source (MIT).
Data source: ECMWF IFS + NOAA GFS â€” same models used by paid services.
Why better than OpenWeatherMap:
  OpenWeatherMap free = 1,000 calls/day, 5-day forecast, requires key
  Open-Meteo = 10,000 calls/day, 16-day forecast, no key, no expiry
ACTION REQUIRED: Replace OpenWeatherMap with Open-Meteo. Remove OPENWEATHER_KEY from .env.
CRITICAL — correct field mapping (do not show daily max as current temp):
  data.current.temperature_2m        -> current temp RIGHT NOW  (show as "अभी: 21°C")
  data.daily.temperature_2m_max[0]   -> today's daytime peak    (show as "अधिकतम: 34°C")
  data.daily.temperature_2m_min[0]   -> tonight's low           (show as "न्यूनतम: 16°C")
  NEVER use temperature_2m_max as the current temperature — it is the daily HIGH.
  Google shows current temp from data.current — your app must do the same.

Haryana district coordinates for Open-Meteo API calls:
  const HARYANA_COORDS = {
    'Karnal':       { lat: 29.6857, lon: 76.9905 },
    'Kaithal':      { lat: 29.8014, lon: 76.3998 },
    'Hisar':        { lat: 29.1492, lon: 75.7217 },
    'Ambala':       { lat: 30.3782, lon: 76.7767 },
    'Kurukshetra':  { lat: 29.9695, lon: 76.8783 },
    'Sirsa':        { lat: 29.5330, lon: 75.0166 },
    'Rohtak':       { lat: 28.8955, lon: 76.6066 },
    'Bhiwani':      { lat: 28.7975, lon: 76.1322 },
    'Jind':         { lat: 29.3159, lon: 76.3145 },
    'Panipat':      { lat: 29.3909, lon: 76.9635 },
    'Sonipat':      { lat: 28.9288, lon: 77.0147 },
    'Fatehabad':    { lat: 29.5144, lon: 75.4548 },
    'Yamunanagar':  { lat: 30.1290, lon: 77.2674 },
    'Rewari':       { lat: 28.1985, lon: 76.6171 },
  };
```

#### API 3: Gemini Flash (already integrated)
```
URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
Auth: GEMINI_KEY from server/.env
Free tier: 15 req/min, 1,500 req/day, 1M tokens/day
Cost: Free tier sufficient for first 1,000 DAU.
Upgrade trigger: When daily advisory requests exceed 1,200/day.
```

#### API 4: Supabase (already integrated)
```
Free tier: 500MB storage, 2GB bandwidth/month, unlimited API calls
Cost: Free tier sufficient for first 10,000 registered users.
Upgrade trigger: Storage >400MB or bandwidth >1.5GB/month.
```

#### API 5: data.gov.in â€” MSP Dataset (replace hardcoded values)
```
Search: data.gov.in â†’ search "minimum support price" â†’ Agriculture sector
Auth: Same DATA_GOV_KEY â€” free
Fields: commodity, season, year, msp_per_quintal, announced_date
Use: Cache in Supabase msp_values table. Refresh every 6 months.
Why: MSP changes twice/year (Kharif in June, Rabi in October).
     Hardcoded values go stale. Current hardcoded values valid until Oct 2026.
```

---

### ðŸŸ¡ TIER 2 â€” Free, register now, integrate in Phase 2

#### API 6: eNAM Live Trade Data (same-day prices, free after registration)
```
Registration: enam.gov.in/web/registration â€” free, requires business docs
Processing time: 1â€“2 weeks
Fields: mandi_name, commodity, bid_price, quantity, trade_time (near real-time)
Why better than Agmarknet: Same-day vs 1-2 day lag on Agmarknet
Haryana mandis on eNAM: ~50 including Karnal, Ambala, Hisar, Kaithal
Integration plan:
  - Primary source: eNAM (same-day) when available
  - Fallback: Agmarknet (next-day) when eNAM data missing
  - Show data freshness badge: "à¤†à¤œ à¤•à¤¾ à¤­à¤¾à¤µ âœ“" vs "à¤•à¤² à¤•à¤¾ à¤­à¤¾à¤µ"
ACTION: Register now at enam.gov.in. No cost. Takes 1â€“2 weeks.
```

#### API 7: Open-Meteo Historical Archive (80 years of data, completely free)
```
URL: https://archive-api.open-meteo.com/v1/archive
Auth: None required
Sample call:
  ?latitude=29.6857&longitude=76.9905
  &start_date=2019-04-01&end_date=2024-05-31
  &daily=precipitation_sum,temperature_2m_max&timezone=Asia/Kolkata
Use in Phase 2:
  - Build Haryana wheat price vs rainfall correlation (5-year dataset)
  - Identify seasonal patterns: "April rainfall years â†’ prices recover faster"
  - Feed seasonal context into Gemini prompt
Cost: Completely free. No limits on historical queries.
```

#### API 8: DACFW Sowing Progress (free, scrape weekly with Puppeteer MCP)
```
Source: agricoop.nic.in â†’ Kharif/Rabi sowing progress PDFs
Frequency: Published every Monday during sowing season
Data: % of normal area sown by crop by state
Use: Supply forecast signal in Becho Ya Ruko engine
     "Mustard sowing 18% below normal â†’ tight supply at harvest â†’ lean HOLD"
Scrape method: Puppeteer MCP â†’ every Monday 9am â†’ crop_sowing_progress table
```

#### API 9: IMD Rainfall Data via data.gov.in (free)
```
Search: "district wise rainfall" on data.gov.in
Auth: DATA_GOV_KEY (free)
Fields: district, month, year, actual_rainfall_mm, normal_mm, departure_percent
Use: Seasonal rainfall departure â†’ yield stress signal â†’ price prediction
```

#### API 10: District-wise Crop Production Statistics (data.gov.in, free)
```
Catalog: data.gov.in â†’ "district wise season wise crop production statistics"
Auth: DATA_GOV_KEY (free)
Fields: state, district, crop, year, season, area, production, yield
Use: Multi-year yield context for Gemini prompt
     "Karnal wheat yield 2021-24: 48, 51, 47, 52 q/ha â†’ this year sowing normal"
```

#### API 11: Haryana Meri Fasal Mera Byora (fasal.haryana.gov.in)
```
What it is: Haryana government mandatory crop registration portal.
            Every farmer selling at MSP must register here.
            Portal contains: farmer name, phone, Aadhaar, crop type,
            khasra, district, quantity â€” for ALL Haryana MSP-selling farmers.
How to access: Apply to Haryana Dept. of Agriculture for API access
               OR use as distribution channel (farmers already registered = our TAM)
Strategic importance:
  - KisanNiti can offer "auto-fill from Meri Fasal Mera Byora" for Becho Ya Ruko form
  - Farmer enters phone â†’ we pre-fill crop, district, quantity from MFMB data
  - This eliminates the biggest UX friction in our advisory form
  - No other agri app has done this integration
  - This is a Haryana-only competitive moat
Action Phase 2: Write to Haryana Agriculture Dept. for API/data partnership.
               Position as a tool that increases MFMB portal engagement.
```

---

### ðŸ”µ TIER 3 â€” Free, integrate Phase 3 for B2B and advanced features

#### API 12: WDRA Registered Warehouses
```
Source: wdra.gov.in (registration required for API access, free)
Fields: warehouse_name, district, capacity_mt, NWR_eligible, commodities
Use: "Hold and Pledge" feature â€” show nearest NWR-eligible warehouse
     "Karnal warehouse: 20km away, â‚¹8/q/month â€” pledge grain, get KCC loan"
     This is the most powerful "alternative to selling" tool in Indian agriculture
     No other consumer app has built this. It is the next evolution of Becho Ya Ruko.
```

#### API 13: Soil Health Card Data
```
Source: soilhealth.dac.gov.in (NIC-maintained, public API)
Fields: district, NPK status, pH, organic carbon, micronutrients
Use:
  B2B: Sell district-level nutrient maps to agri-input companies (Bayer, UPL)
  Consumer: "à¤†à¤ªà¤•à¥‡ à¤œà¤¿à¤²à¥‡ à¤•à¥€ à¤®à¤¿à¤Ÿà¥à¤Ÿà¥€ à¤®à¥‡à¤‚ à¤¨à¤¾à¤‡à¤Ÿà¥à¤°à¥‹à¤œà¤¨ à¤•à¤® à¤¹à¥ˆ â€” à¤¯à¤¹ DAP à¤²à¥‡à¤‚"
  Advertising: Target fertilizer ads to nitrogen-deficient districts
```

#### API 14: PMFBY Crop Insurance
```
Source: pmfby.gov.in public data portal
Fields: state, district, crop, insured_area, premium_rate, claims_paid_ratio
Use:
  Consumer: "à¤…à¤ªà¤¨à¥€ à¤«à¤¸à¤² à¤•à¤¾ à¤¬à¥€à¤®à¤¾ à¤•à¤°à¥‡à¤‚ â€” â‚¹{premium}/à¤•à¥à¤µà¤¿à¤‚à¤Ÿà¤²"
  B2B: License historical claims data to insurance companies (â‚¹20,000-50,000/month)
  Signal: High claims district in past year â†’ price volatility â†’ stronger hold signal
```

#### API 15: PM-KISAN Beneficiary Data
```
Source: data.gov.in (free)
Fields: state, district, beneficiary_count, amount_disbursed
Use:
  TAM sizing: Haryana has ~18 lakh PM-KISAN beneficiaries = total addressable farmers
  Timing signal: PM-KISAN payments in Feb/June/Oct â†’ farmers have cash â†’
                 input purchases spike â†’ not a distress-sell period
```

---

### ðŸ”´ TIER 4 â€” Future infrastructure (2026â€“2027)

#### API 16: AgriStack / Farmers Registry
```
Status: Rolling out state by state. Haryana in early phases.
Impact when available: Auto-populate Becho Ya Ruko form with verified
                       land parcel, crop, and Aadhaar-linked identity.
                       "à¤†à¤ªà¤¨à¥‡ 5 à¤à¤•à¤¡à¤¼ à¤®à¥‡à¤‚ à¤—à¥‡à¤¹à¥‚à¤‚ à¤¬à¥‹à¤¯à¤¾ à¤¹à¥ˆ â€” à¤¸à¤¹à¥€ à¤¹à¥ˆ?" (auto-verified)
```

#### API 17: UPAg â€” Unified Portal for Agricultural Statistics
```
Source: upag.gov.in (DACFW analytics portal)
Use: Backtest the Becho Ya Ruko algorithm against 5 years of Haryana price data.
     "If KisanNiti algorithm had been applied to Haryana wheat 2021-24,
      farmer would have earned avg â‚¹127 more per quintal vs selling in first week"
     This is the proof-of-value story for media, VCs, and government partnerships.
```

#### API 18: Krishi-DSS
```
Source: Govt geospatial decision support (launched Aug 2024)
Contains: Satellite imagery, soil, weather, crop maps by district
Use Phase 4: District yield estimation, drought detection, satellite crop health
```

---

## SECTION 6 â€” PHASE-BASED PRODUCT ROADMAP

### PHASE 0 â€” Ship the core (NOW â†’ March 2026)
**Mission:** Get Becho Ya Ruko live. Get 10 real Haryana farmers to use it.
**Revenue:** â‚¹0. This phase is about proving the concept works.

```
Sprint tasks (complete in strict order):
[x] TASK 1:  Fix debounce â€” 1 API call per search âœ…
[x] TASK 2:  Fix console errors âœ…
[x] TASK 3:  Mobile-first responsive layout âœ…
[x] TASK 4:  Haryana primary crop filter âœ…
[x] TASK 5:  Last Updated timestamp banner âœ…
[x] TASK 6:  Fix price history backfill (Supabase migration) âœ…
[x] TASK 7:  BUILD BECHO YA RUKO PAGE âœ…
[x] TASK 8:  Switch weather to Open-Meteo (no key, 16-day, free, better) âœ…
[x] TASK 9:  Page transitions (framer-motion) âœ…
[x] TASK 10: Hindi placeholder text fix (all inputs must be in Hindi by default) âœ…
[x] TASK 11: Empty states (favorites empty, no search results) âœ…
[x] TASK 12: Price history modal close button âœ…
[ ] TASK 13: Final checks + APK build + Play Store submission

Exit gate: 10 real farmers in Haryana have received a Becho Ya Ruko recommendation.
           Not demo. Not family. Real farmers. Get Rohit's relatives to use it first.
```

### PHASE 1 â€” Signal quality + first users (Aprilâ€“May 2026)
**Mission:** Make the recommendation 3x more accurate. Reach 100 daily users.
**Revenue:** â‚¹0. Still proving that the recommendation helps farmers.

```
Features to build:
â–¡ arrivals_in_qtl always fetched from Agmarknet (same API, add this field)
â–¡ 7-day arrival average calculation â†’ arrival signal (ABOVE/BELOW/NORMAL)
â–¡ Arrival signal injected into Gemini prompt
â–¡ Weekly DACFW sowing progress scraper (Puppeteer MCP, every Monday 9am)
â–¡ Supply signal (TIGHT/SURPLUS/NORMAL) injected into Gemini prompt
â–¡ WhatsApp share button on Becho Ya Ruko result card
â–¡ MSP values moved to Supabase msp_values table (stop hardcoding)
â–¡ "à¤†à¤œ à¤•à¤¾ à¤­à¤¾à¤µ" / "à¤•à¤² à¤•à¤¾ à¤­à¤¾à¤µ" freshness badge on price cards
â–¡ eNAM registration completed â€” begin integration planning
â–¡ GitHub Actions CI/CD workflow (does not exist yet â€” create it)

Exit gate: 100 unique users per day.
           30+ Becho Ya Ruko advisory requests per day.
           At least 1 farmer who can be quoted saying it helped their timing decision.
```

### PHASE 2 â€” Retention + first revenue (Juneâ€“August 2026)
**Mission:** Farmers come back daily. 1,000 DAU. First â‚¹1L revenue.
**Revenue target:** â‚¹1L MRR from 5 Arhtiya Pro subscribers.

```
Features to build:
â–¡ Farmer Profile page (My Farm):
    - Stores: crop, district, land size, storage cost, arhtiya name, urgency
    - Auto-fills Becho Ya Ruko form every time (zero re-entry friction)
    - Links to Meri Fasal Mera Byora data if available
â–¡ Push notifications (Capacitor push plugin):
    - "à¤†à¤œ à¤—à¥‡à¤¹à¥‚à¤‚ à¤•à¤¾ à¤­à¤¾à¤µ â‚¹50 à¤¬à¤¢à¤¼à¤¾ â€” à¤¬à¥‡à¤šà¤¨à¥‡ à¤•à¤¾ à¤¸à¤¹à¥€ à¤µà¤•à¥à¤¤ à¤¹à¥‹ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆ"
    - Price alert when commodity crosses user-set threshold
    - Harvest season timing reminders (crop-calendar based)
â–¡ Historical chart on Becho Ya Ruko: 30-day price trend for farmer's crop
â–¡ eNAM integration: same-day prices when available, Agmarknet fallback
â–¡ Open-Meteo historical analysis: seasonal pattern card
    - "à¤ªà¤¿à¤›à¤²à¥‡ 5 à¤¸à¤¾à¤² à¤®à¥‡à¤‚ Karnal à¤®à¥‡à¤‚ à¤—à¥‡à¤¹à¥‚à¤‚ à¤•à¤¾ à¤­à¤¾à¤µ à¤…à¤ªà¥à¤°à¥ˆà¤² à¤•à¥‡ à¤¬à¤¾à¤¦ 3-5% à¤¬à¤¢à¤¼à¤¾ à¤¹à¥ˆ"
â–¡ Storage Options card (below advisory result):
    - "Karnal à¤®à¥‡à¤‚ 3 cold storage available â€” â‚¹8/quintal/month"
    - Data sourced from Supabase storage_locations table (manually populated)
â–¡ Mandi Arbitrage calculator:
    - "Ambala vs Karnal â€” â‚¹35/q difference, 45km apart, â‚¹8/q transport cost"
    - Net: â‚¹27/q better at Ambala â†’ 100q = â‚¹2,700 extra
â–¡ Arhtiya Pro dashboard BETA:
    - Target: 5 paying arthiyas in Karnal / Kaithal at â‚¹399/month
    - Features: All-farmer price alerts, arrival trend charts, bulk advisory PDF

Exit gate: 1,000 DAU. â‚¹1L MRR. 5 paying Arhtiya Pro subscribers.
           At least 1 farmer who earned measurably more because of KisanNiti.
```

### PHASE 3 â€” Monetization at scale (Septemberâ€“December 2026)
**Mission:** â‚¹5L MRR. 10,000 DAU. Fundable or cashflow positive.

```
Features to build:
â–¡ Arhtiya Pro full launch (â‚¹399/month):
    - Price trend dashboard for all farmer clients
    - Bulk advisory generation (paste 50 farmer names, get 50 PDFs)
    - Commission tracking and settlement history
    - Target: 200 paying arthiyas = â‚¹80,000/month
â–¡ FPO Enterprise (â‚¹1,999/month):
    - Group advisory for 200+ farmers in one FPO
    - Aggregated sell/hold dashboard for FPO manager
    - Export report for FPO board meetings
    - Target: 25 FPOs = â‚¹50,000/month
â–¡ MSP procurement alert engine:
    - "à¤†à¤œ Karnal à¤®à¤‚à¤¡à¥€ à¤®à¥‡à¤‚ à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤–à¤°à¥€à¤¦ à¤¶à¥à¤°à¥‚ â€” MSP â‚¹2,425 à¤ªà¤° à¤¬à¥‡à¤šà¥‡à¤‚"
    - Push + SMS + WhatsApp when government procurement opens in farmer's district
â–¡ NWR Pledge feature (the "Hold without cash pressure" solution):
    - "à¤…à¤­à¥€ à¤®à¤¤ à¤¬à¥‡à¤šà¥‹ â€” à¤¯à¥‡ warehouse à¤®à¥‡à¤‚ à¤°à¤–à¥‹ + KCC loan à¤²à¥‹"
    - Conditions: price below MSP + NWR warehouse within 20km + urgency=flexible
    - Show: warehouse location, cost/month, estimated loan amount
    - This solves the arhtiya debt trap at its root
â–¡ Soil health advisory (soilhealth.dac.gov.in):
    - District nutrient deficiency map â†’ targeted fertilizer recommendation
â–¡ RKVY grant application (â‚¹10â€“25L non-dilutive):
    - Apply to Rashtriya Krishi Vikas Yojana Agri-Innovation grant
    - Use Phase 2 user data as proof of concept
â–¡ Agri-brand advertising:
    - Bayer, Syngenta, UPL ad campaigns targeted by district + crop + soil type
    - Seasonal timing: pre-sowing = fertilizer ads, post-harvest = storage ads

Exit gate: â‚¹5L MRR. 10,000 DAU. Data licensing LOI from 1 bank/insurer.
```

### PHASE 4 â€” Geographic scale (2027)
**Mission:** â‚¹1 crore ARR. Launch Punjab and Rajasthan.

```
Expansion:
â–¡ Punjab (mustard + wheat â€” same crop calendar, same arhtiya system)
â–¡ Rajasthan (mustard belt â€” Alwar, Bharatpur, Jaipur districts)
â–¡ B2B data licensing to NABARD, agri-banks, crop insurance companies
â–¡ AgriStack integration (verified farmer identity â†’ zero form friction)
â–¡ Bharat-VISTAAR partnership: KisanNiti as the Haryana specialist layer

Exit gate: â‚¹1 crore ARR. 50,000 DAU across 3 states.
```

---

## SECTION 7 â€” THE BECHO YA RUKO ENGINE (build spec â€” exact)

### User flow
```
Farmer opens app â†’ taps à¤¬à¥‡à¤šà¥‹/à¤°à¥à¤•à¥‹ tab
â†’ Form (pre-filled from saved profile if exists):
    [à¤«à¤¸à¤²: Wheat â–¼]  [à¤®à¤¾à¤¤à¥à¤°à¤¾: 100 à¤•à¥à¤µà¤¿à¤‚à¤Ÿà¤²]  [à¤œà¤¿à¤²à¤¾: Karnal â–¼]
    [à¤­à¤‚à¤¡à¤¾à¤°à¤£ à¤²à¤¾à¤—à¤¤: â‚¹0.50/à¤¦à¤¿à¤¨/à¤•à¥à¤µà¤¿à¤‚à¤Ÿà¤²]  [à¤ªà¥ˆà¤¸à¥‡ à¤•à¤¬: ðŸŸ¢ à¤œà¤¬ à¤…à¤šà¥à¤›à¤¾ à¤¦à¤¾à¤® à¤®à¤¿à¤²à¥‡ â–¼]
â†’ Taps "à¤¸à¥à¤à¤¾à¤µ à¤²à¥‹ â†’"
â†’ Animated 3-step loader (each step must visibly complete before next):
    Step 1: "ðŸŒ¾ à¤®à¤‚à¤¡à¥€ à¤­à¤¾à¤µ à¤¦à¥‡à¤– à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚..." â†’ fetches Agmarknet (prices + arrivals)
    Step 2: "ðŸŒ¤ï¸ à¤®à¥Œà¤¸à¤® à¤œà¤¾à¤‚à¤š à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚..." â†’ fetches Open-Meteo 16-day forecast
    Step 3: "ðŸ¤– AI à¤¸à¥à¤à¤¾à¤µ à¤¬à¤¨à¤¾ à¤°à¤¹à¤¾ à¤¹à¥ˆ..." â†’ POST /api/advisory/sell-hold
â†’ Result card:
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚  ðŸŸ  7 à¤¦à¤¿à¤¨ à¤°à¥à¤•à¥‹                         â”‚  â† Decision badge (colored bg)
  â”‚  à¤ªà¤•à¥à¤•à¤¾ à¤¸à¥à¤à¤¾à¤µ âœ“                         â”‚  â† Confidence
  â”‚                                        â”‚
  â”‚  à¤…à¤¨à¥à¤®à¤¾à¤¨à¤¿à¤¤ à¤­à¤¾à¤µ: â‚¹2,280 â€“ â‚¹2,380/à¤•à¥à¤µà¤¿à¤‚à¤Ÿà¤² â”‚
  â”‚                                        â”‚
  â”‚  [3-sentence Hindi reason]              â”‚
  â”‚                                        â”‚
  â”‚  âš ï¸ à¤œà¥‹à¤–à¤¿à¤®: [1-sentence risk note]       â”‚
  â”‚                                        â”‚
  â”‚  à¤®à¤‚à¤¡à¥€ à¤œà¤¾à¤à¤šà¥€: Karnal, Nilokheri, Assandh â”‚  â† Data transparency
  â”‚  à¤­à¤¾à¤µ: à¤†à¤œ à¤•à¤¾ âœ“                          â”‚  â† Freshness badge
  â”‚                                        â”‚
  â”‚  [ðŸ“± WhatsApp]  [ðŸ”„ à¤¨à¤¯à¤¾ à¤¸à¥à¤à¤¾à¤µ]          â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Decision badges
| Decision | Hex color | Hindi label | When |
|---|---|---|---|
| SELL_NOW | `#B71C1C` red | ðŸ”´ à¤…à¤­à¥€ à¤¬à¥‡à¤šà¥‹ | Arrivals high, prices falling, rain risk |
| HOLD_7_DAYS | `#E65100` deep orange | â³ 7 à¤¦à¤¿à¤¨ à¤°à¥à¤•à¥‹ | Arrivals declining, trend turning |
| HOLD_14_DAYS | `#F57F17` amber | â³ 14 à¤¦à¤¿à¤¨ à¤°à¥à¤•à¥‹ | Strong supply deficit signal |
| PARTIAL_SELL | `#0D47A1` dark blue | âš¡ à¤†à¤§à¤¾ à¤¬à¥‡à¤šà¥‹ | Mixed signals + cash urgency |

### Backend endpoint
```typescript
// POST /api/advisory/sell-hold
// Rate limit: 5 requests per IP per hour
// Timeout: 15 seconds (Gemini can be slow)

interface SellHoldRequest {
  crop: string;              // "Wheat"
  quantity: number;          // quintals
  district: string;          // "Karnal"
  storageCostPerDay: number; // â‚¹/quintal/day â€” default 0.50
  urgency: 'now' | '2weeks' | 'flexible';
}

interface SellHoldResponse {
  decision: 'SELL_NOW' | 'HOLD_7_DAYS' | 'HOLD_14_DAYS' | 'PARTIAL_SELL';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_price_min: number;
  expected_price_max: number;
  hindi_reason: string;      // 3 sentences, â‰¤60 words
  risk_note: string;         // 1 sentence, â‰¤20 words
  mandis_checked: string[];  // ["Karnal", "Nilokheri", "Assandh"]
  data_freshness: string;    // "à¤†à¤œ à¤•à¤¾ à¤­à¤¾à¤µ" | "à¤•à¤² à¤•à¤¾ à¤­à¤¾à¤µ"
  arrival_signal: string;    // "ABOVE_NORMAL" | "NORMAL" | "BELOW_NORMAL"
}
```

### Arrival signal logic (calculate before calling Gemini)
```typescript
function getArrivalSignal(
  todayArrivals: number,
  avg7dArrivals: number
): 'ABOVE_NORMAL' | 'NORMAL' | 'BELOW_NORMAL' {
  if (!avg7dArrivals || avg7dArrivals === 0) return 'NORMAL';
  const ratio = todayArrivals / avg7dArrivals;
  if (ratio > 1.30) return 'ABOVE_NORMAL'; // oversupply â†’ price drop in 2-3 days
  if (ratio < 0.70) return 'BELOW_NORMAL'; // scarcity â†’ price rise likely
  return 'NORMAL';
}
// ABOVE_NORMAL â†’ lean strongly toward SELL_NOW
// BELOW_NORMAL â†’ lean toward HOLD
// Always include in Gemini prompt with exact numbers
```

### Crop quality degradation rules (add to Gemini prompt context)
```typescript
// Quality loss rates â€” include in prompt when urgency = 'now' or rain risk = HIGH
const QUALITY_RULES = {
  'Paddy':   'Paddy loses ~5 quintals per 4 rain-days after harvest. Wet paddy rejected at MSP.',
  'Cotton':  'Cotton depreciates 2-3% per week of humidity exposure above 70%.',
  'Mustard': 'Mustard oil content drops if stored >3 months without cold storage.',
  'Wheat':   'Wheat quality stable for 3 months in dry storage; no urgency from quality alone.',
  'Maize':   'Maize highly susceptible to aflatoxin in humidity. Do not hold if rain forecast >5 days.',
};
```

### Gemini prompt â€” full production version
```
You are an expert agricultural commodity market analyst for Haryana, India.
You understand: mandi price dynamics, arhtiya credit pressure, MSP policy,
seasonal arrival patterns, and crop quality degradation rules.
RESPOND ONLY WITH VALID JSON. No markdown, no preamble, no text. JSON only.

FARMER SITUATION:
- Crop: {crop} | Quantity: {quantity} quintals (â‚¹{totalValue} total at current price)
- District: {district}, Haryana | Storage cost: â‚¹{storageCostPerDay}/quintal/day
- Cash urgency: {urgency}
- Storage cost for 7 days: â‚¹{7 * storageCostPerDay * quantity} total
- Storage cost for 14 days: â‚¹{14 * storageCostPerDay * quantity} total

MARKET DATA (3 nearest mandis):
- {mandi1}: â‚¹{price1}/q | Arrivals: {arr1}q vs 7d avg {avg1}q â†’ {signal1}
- {mandi2}: â‚¹{price2}/q
- {mandi3}: â‚¹{price3}/q
- 7-day price trend: {RISING/FALLING/STABLE} ({priceDelta} â‚¹/q change)
- 30-day average: â‚¹{avg30}/q
- MSP floor: â‚¹{msp}/q | Current price vs MSP: {aboveMSP}%

SUPPLY SIGNALS:
- {crop} sowing this season: {pctOfNormal}% of normal area ({supplySignal})
- Arrival trend last 7 days: {arrivalTrend}

WEATHER (Open-Meteo, next 14 days, {district}):
- {weatherSummary}
- Rain risk for {crop}: {riskLevel}
- {cropQualityRule}

RESPOND WITH EXACTLY:
{
  "decision": "SELL_NOW" | "HOLD_7_DAYS" | "HOLD_14_DAYS" | "PARTIAL_SELL",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "expected_price_min": number,
  "expected_price_max": number,
  "hindi_reason": "3 sentences in Hindi, â‰¤60 words total, explain WHY",
  "risk_note": "1 sentence in Hindi, â‰¤20 words, main risk of this decision"
}
```

### MSP values 2025â€“26 (hardcoded until Oct 2026)
```typescript
// Announced by CACP, valid Rabi 2025-26 and Kharif 2025
// Replace with Supabase msp_values table in Phase 1
export const MSP_2025_26: Record<string, number> = {
  'Wheat':     2425,  // Rabi 2025-26
  'Paddy':     2300,  // Kharif 2025
  'Mustard':   5950,  // Rabi 2025-26
  'Bajra':     2625,  // Kharif 2025
  'Cotton':    7121,  // Kharif 2025 (medium staple)
  'Sunflower': 7280,  // Kharif 2025
  'Maize':     2225,  // Kharif 2025
  'Gram':      5650,  // Rabi 2025-26
  'Barley':    1850,  // Rabi 2025-26
};
```

### Haryana districts â†’ mandis + GPS for Open-Meteo
```typescript
export const HARYANA_MANDIS: Record<string, {
  mandis: string[];
  lat: number;
  lon: number;
}> = {
  'Karnal':       { mandis: ['Karnal','Nilokheri','Assandh'],       lat: 29.6857, lon: 76.9905 },
  'Kaithal':      { mandis: ['Kaithal','Pundri','Kalayat'],         lat: 29.8014, lon: 76.3998 },
  'Hisar':        { mandis: ['Hisar','Hansi','Fatehabad'],          lat: 29.1492, lon: 75.7217 },
  'Ambala':       { mandis: ['Ambala','Shahabad','Naraingarh'],     lat: 30.3782, lon: 76.7767 },
  'Kurukshetra':  { mandis: ['Kurukshetra','Shahabad','Thanesar'],  lat: 29.9695, lon: 76.8783 },
  'Sirsa':        { mandis: ['Sirsa','Ellenabad','Dabwali'],        lat: 29.5330, lon: 75.0166 },
  'Rohtak':       { mandis: ['Rohtak','Jhajjar','Bahadurgarh'],     lat: 28.8955, lon: 76.6066 },
  'Bhiwani':      { mandis: ['Bhiwani','Charkhi Dadri','Loharu'],   lat: 28.7975, lon: 76.1322 },
  'Jind':         { mandis: ['Jind','Narwana','Safidon'],           lat: 29.3159, lon: 76.3145 },
  'Panipat':      { mandis: ['Panipat','Samalkha','Israna'],        lat: 29.3909, lon: 76.9635 },
  'Sonipat':      { mandis: ['Sonipat','Gohana','Kharkhoda'],       lat: 28.9288, lon: 77.0147 },
  'Fatehabad':    { mandis: ['Fatehabad','Tohana','Ratia'],         lat: 29.5144, lon: 75.4548 },
  'Yamunanagar':  { mandis: ['Yamunanagar','Jagadhri','Radaur'],    lat: 30.1290, lon: 77.2674 },
  'Rewari':       { mandis: ['Rewari','Narnaul','Mahendragarh'],    lat: 28.1985, lon: 76.6171 },
};
```

### Haryana primary crops
```typescript
// Show these by default without any search â€” this is the Haryana crop universe
export const HARYANA_PRIMARY_CROPS = [
  'Wheat',      // Rabi â€” king crop, harvested April
  'Paddy',      // Kharif â€” October harvest
  'Mustard',    // Rabi â€” March harvest (second biggest crop)
  'Bajra',      // Kharif â€” September
  'Cotton',     // Kharif â€” October/November (Hisar/Sirsa belt)
  'Maize',      // Kharif â€” September
  'Sugarcane',  // Year-round
  'Sunflower',  // Rabi â€” April/May
  'Barley',     // Rabi â€” March/April
  'Gram',       // Rabi â€” March
];
```

---

## SECTION 8 â€” TECH STACK (DO NOT CHANGE WITHOUT ASKING)

```
Frontend:  React 18 + TypeScript (strict, zero `any`)
           TanStack React Query v5 (staleTime explicit on every query)
           React Router v6
           Recharts for price charts
           Capacitor v8 for Android APK
           framer-motion for page transitions
           date-fns for all date formatting
           i18next + react-i18next for Hindi/English

Backend:   Node.js + Express + TypeScript
           @supabase/supabase-js â† MUST be in dependencies, not devDependencies
           Axios for external API calls
           express-rate-limit
           node-cron for scheduled scrapers
           Jest + Supertest for tests

Database:  Supabase (PostgreSQL on free tier)
Hosting:   Vercel (frontend) + Render (backend, free tier)
Android:   Capacitor â†’ Android Studio â†’ signed APK â†’ Play Store
CI/CD:     GitHub Actions (no workflow file exists yet â€” create in Phase 1)
```

### CRITICAL BUG: Fix immediately
```
@supabase/supabase-js is in devDependencies in server/package.json.
Render builds with NODE_ENV=production â†’ skips devDependencies â†’ Supabase crashes in production.

Fix command:
  cd server && npm install @supabase/supabase-js --save

Verify fix: package.json "dependencies" section must include @supabase/supabase-js.
```

---

## SECTION 9 â€” SUPABASE DATABASE SCHEMA

### Existing tables
- `mandi_prices` â€” Agmarknet price cache
- `price_history` â€” 7/30-day price history

### Tables to create (migrations needed)
```sql
-- Farmer profiles (filled from Becho Ya Ruko form, persisted for next visit)
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  district TEXT NOT NULL,
  main_crop TEXT NOT NULL,
  quantity_quintals INTEGER,
  storage_cost_per_day NUMERIC(6,2) DEFAULT 0.50,
  urgency TEXT DEFAULT 'flexible',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advisory log â€” every Becho Ya Ruko recommendation stored for analytics
CREATE TABLE IF NOT EXISTS sell_hold_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmer_profiles(id),
  crop TEXT NOT NULL,
  quantity INTEGER,
  district TEXT,
  decision TEXT NOT NULL,        -- SELL_NOW | HOLD_7_DAYS | HOLD_14_DAYS | PARTIAL_SELL
  confidence TEXT,               -- HIGH | MEDIUM | LOW
  expected_price_min NUMERIC(8,2),
  expected_price_max NUMERIC(8,2),
  hindi_reason TEXT,
  risk_note TEXT,
  arrival_signal TEXT,           -- ABOVE_NORMAL | NORMAL | BELOW_NORMAL
  supply_signal TEXT,            -- TIGHT | NORMAL | SURPLUS
  mandi_data JSONB,              -- Raw API response snapshot
  weather_data JSONB,            -- Open-Meteo response snapshot
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mandi arrival quantity cache (from Agmarknet â€” same API, add arrivals_in_qtl field)
CREATE TABLE IF NOT EXISTS mandi_arrivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market TEXT NOT NULL,
  commodity TEXT NOT NULL,
  arrivals_qtl NUMERIC(10,2),
  arrival_date DATE NOT NULL,
  state TEXT DEFAULT 'Haryana',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(market, commodity, arrival_date)
);

-- Crop sowing progress (weekly DACFW scrape â€” supply forecast signal)
CREATE TABLE IF NOT EXISTS crop_sowing_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop TEXT NOT NULL,
  state TEXT NOT NULL,
  season TEXT NOT NULL,             -- 'Kharif' | 'Rabi'
  year INTEGER NOT NULL,
  area_sown_lakh_ha NUMERIC(8,2),
  normal_area_lakh_ha NUMERIC(8,2),
  percent_of_normal NUMERIC(5,1),
  supply_signal TEXT,               -- 'TIGHT' | 'SURPLUS' | 'NORMAL'
  week_ending DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(crop, state, season, year, week_ending)
);

-- MSP values cache (replace hardcoded values in Phase 1)
CREATE TABLE IF NOT EXISTS msp_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity TEXT NOT NULL,
  season TEXT NOT NULL,             -- 'Kharif' | 'Rabi' | 'Others'
  year TEXT NOT NULL,               -- '2025-26'
  msp_per_quintal NUMERIC(8,2) NOT NULL,
  announced_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(commodity, season, year)
);

-- Storage locations (manually populated for Haryana, Phase 2)
CREATE TABLE IF NOT EXISTS storage_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT DEFAULT 'Haryana',
  type TEXT NOT NULL,               -- 'cold_storage' | 'warehouse_nwr' | 'warehouse_regular'
  capacity_mt NUMERIC(10,2),
  nwr_eligible BOOLEAN DEFAULT false,
  cost_per_qtl_month NUMERIC(6,2),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  commodities_accepted TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## SECTION 10 â€” DESIGN SYSTEM

### Color palette
```
Primary:    #1B5E20  dark green â€” agriculture, trust, money
Accent:     #E65100  deep orange â€” alerts, primary CTAs
Background: #FAFAFA  off-white â€” readable in direct sunlight
Text:       #212121  near-black
Muted:      #757575  gray
Success:    #2E7D32  hold decisions
Warning:    #F57F17  partial sell
Error:      #B71C1C  sell now (red = urgency, not danger)
Info:       #0D47A1  alternate partial sell
```

### Mobile-first breakpoints
```
360px â€” base (â‚¹5,000â€“8,000 Redmi/Realme phones â€” primary target device)
768px â€” md (tablets)
1024px â€” lg (desktop, secondary â€” mostly for arthiyas)

Test order: 360px â†’ 393px â†’ 412px â†’ 768px â†’ 1024px
If it breaks at 360px, it is broken. Fix it.
```

### Typography rules
```
Minimum body text:  16px (bright sunlight + work-roughened hands)
Prices displayed:   24px minimum
CTA buttons:        18px minimum
Hindi font:         'Noto Sans Devanagari', sans-serif (preloaded â€” not lazy-loaded)
Tap targets:        48x48dp minimum (WCAG AA for motor impairment)
```

### Navigation structure
```
Mobile (< 768px):  Fixed bottom nav bar, 64px height
Desktop (â‰¥ 768px): Top nav, hide bottom bar

4 tabs:
  ðŸŒ¾ à¤®à¤‚à¤¡à¥€      â†’ /            (mandi price tracker)
  ðŸ¤– à¤¬à¥‡à¤šà¥‹/à¤°à¥à¤•à¥‹  â†’ /advisory    (THE CORE FEATURE)
  â›… à¤®à¥Œà¤¸à¤®      â†’ /weather     (Open-Meteo weather)
  ðŸšœ à¤®à¥‡à¤°à¤¾ à¤–à¥‡à¤¤   â†’ /profile     (farmer profile)
```

---

## SECTION 11 â€” LOCALIZATION RULES

- **Default: Hindi** â€” English is toggle option
- All user-facing strings: use `t('key')` â€” never hardcode text
- All error messages: in Hindi â€” farmers must understand errors
- Prices: â‚¹ always, no â‚¹ formatting issues (use toLocaleString('hi-IN'))
- Dates: `15 à¤®à¤¾à¤°à¥à¤š 2026` â€” never `03/15/2026` or `March 15, 2026`
- Offline stale label: `à¤…à¤‚à¤¤à¤¿à¤® à¤…à¤ªà¤¡à¥‡à¤Ÿ: 2 à¤˜à¤‚à¤Ÿà¥‡ à¤ªà¤¹à¤²à¥‡`
- Loading labels: specific steps, not generic "Loading..."

---

## SECTION 12 â€” ANDROID / CAPACITOR RULES

```bash
appId: 'com.kisanniti.app'
appName: 'KisanNiti - à¤•à¤¿à¤¸à¤¾à¤¨ à¤¨à¥€à¤¤à¤¿'
webDir: 'build'
androidScheme: 'https'
minSdkVersion: 24    # Android 7.0 â€” covers >95% of India rural Android phones
targetSdkVersion: 34 # Android 14

# After EVERY React change that touches UI:
npm run build && npx cap sync android

# Test on exact screen widths: 360px, 393px, 412px
# NEVER use localStorage â†’ use @capacitor/preferences
# NEVER use alert() or confirm() â†’ use @capacitor/dialog
# NEVER make direct API calls from frontend â†’ always via backend
```

---

## SECTION 13 â€” REVENUE MODEL

| Stream | How | Monthly target | Timeline |
|---|---|---|---|
| Arhtiya Pro | â‚¹399/month per commission agent â€” price trends, bulk advisory | 800 = â‚¹3.2L/mo | Month 6+ |
| FPO Enterprise | â‚¹1,999/month per Farmer Producer Organization | 50 = â‚¹1L/mo | Month 9+ |
| Agri Advertising | â‚¹800â€“2,000 CPM â€” Bayer, Syngenta, UPL seasonal campaigns | â‚¹1.25L/mo | Month 10+ |
| Data Licensing | Monthly retainer â€” banks, crop insurers, commodity traders | â‚¹2L/mo | Month 11+ |
| RKVY Grant | Non-dilutive government agri-innovation grant | â‚¹10â€“25L one-time | Month 5+ |

**Strategic rule:** Never charge farmers directly. The farmer is the distribution channel. The arhtiya and FPO are the customers. Free farmer access = word-of-mouth growth = more data = more accurate AI = better Arhtiya Pro product.

**80% of revenue is B2B.** Build Arhtiya Pro before spending time on consumer monetization.

---

## SECTION 14 â€” WHAT YOU MUST NEVER DO

```
âœ— Rewrite frontend in Next.js, Vue, or any other framework
âœ— Replace Supabase with another database
âœ— Suggest GraphQL â€” REST is the standard here
âœ— Add npm packages without explaining why first and asking
âœ— Use `any` type in TypeScript â€” fix the actual type error
âœ— Use localStorage â€” use @capacitor/preferences
âœ— Hardcode Hindi strings â€” always use i18n keys
âœ— Call external APIs directly from frontend â€” always via backend
âœ— Log phone numbers, Aadhaar, or financial data to console or logs
âœ— Skip debounce on search â€” 1 API call per search, not per keystroke
âœ— Mark a task done before npm run build passes with 0 TypeScript errors
âœ— Show English error messages to farmers â€” all errors must be in Hindi
âœ— Build Phase 1+ features before Becho Ya Ruko is live and tested
âœ— Hallucinate API endpoints â€” use only verified endpoints in this document
âœ— Skip arrivals_in_qtl â€” it is the strongest free price prediction signal
âœ— Hardcode MSP permanently â€” they expire every 6 months
âœ— Use OpenWeatherMap â€” switch to Open-Meteo (free, no key, 16-day, better)
âœ— Leave @supabase/supabase-js in devDependencies â€” it will crash production
âœ— Build the NWR Pledge feature before Arhtiya Pro is revenue-generating
âœ— Ignore data freshness â€” always show "à¤†à¤œ à¤•à¤¾ à¤­à¤¾à¤µ" or "à¤•à¤² à¤•à¤¾ à¤­à¤¾à¤µ" badge
```

---

## SECTION 15 â€” TASK EXECUTION RULES

1. **Read before writing** â€” use filesystem MCP to read all files you'll touch first
2. **State the contract** â€” what does this task do? what's the failure mode? how do I verify?
3. **One task at a time** â€” complete, verify, commit before the next
4. **npm run build** after every change â€” zero TypeScript errors, no exceptions
5. **npx cap sync android** after every UI change
6. **Commit format:** `type(scope): [TASK N] description`
7. **Check CI** â€” via GitHub MCP after push. Never mark done if CI is red.
8. **Check DB** â€” via Postgres MCP after every migration. Verify row counts.
9. **Test endpoint** â€” via Fetch MCP before touching frontend. POST real payloads.
10. **Test at 360px** â€” every screen must work on small Android phones
11. **Missing API key?** â€” STOP. Ask. Never mock a key or hardcode a fallback.
12. **Missing data?** â€” Show a Hindi error state, not a blank white screen.

---

## SECTION 16 â€” DONE CHECKLIST (every commit, no exceptions)

```
â–¡ npm run build â†’ 0 TypeScript errors, 0 warnings that matter
â–¡ npm test â†’ 0 failing tests
â–¡ Hindi text renders correctly (test in browser, not just code review)
â–¡ 360px layout: no horizontal scroll, no broken layout
â–¡ No API keys or secrets in frontend code
â–¡ i18n keys added to both hi.json and en.json
â–¡ npx cap sync android â†’ no errors
â–¡ Offline mode: cached data shown when API unreachable, Hindi error if none
â–¡ GitHub Actions CI: green (check via GitHub MCP)
â–¡ git commit with correct format: type(scope): [TASK N] description
```

---

## SECTION 17 â€” THE ONE QUESTION THAT OVERRIDES EVERYTHING

> **"Did any farmer in Haryana make more money this week because of KisanNiti?"**

Start every session by answering this.
If yes â†’ what caused it? Double down. Tell that story to users and VCs.
If no â†’ don't build more features. Find out why the recommendation didn't help. Fix the engine.

This question is not inspirational. It is the only metric that matters.
User count, DAU, revenue â€” all of these follow from this question being yes.

---

## SECTION 18 â€” CURRENT SPRINT STATUS

```
[x] TASK 1:  Fix debounce âœ…
[x] TASK 2:  Fix console errors âœ…
[x] TASK 3:  Mobile-first responsive layout âœ…
[x] TASK 4:  Haryana primary crop filter âœ…
[ ] TASK 5:  Last Updated timestamp banner â† START HERE RIGHT NOW
[ ] TASK 6:  Fix price history backfill
[ ] TASK 7:  BUILD BECHO YA RUKO PAGE â† THE ENTIRE POINT OF THE APP
[ ] TASK 8:  Switch weather to Open-Meteo (remove OpenWeatherMap dependency)
[ ] TASK 9:  Page transitions (framer-motion)
[ ] TASK 10: Hindi placeholder text (all inputs Hindi by default)
[ ] TASK 11: Empty states (favorites empty, no search results)
[ ] TASK 12: Price history modal close button
[ ] TASK 13: Final checks + APK build + Play Store submission
```

**Immediate next action:** TASK 5. Then TASK 6. Then TASK 7.
Do not touch Phase 1+ features until TASK 13 is shipped.
The APK must exist before any other work is justified.


---

## SECTION 19 â€” LATER PHASE FEATURES (do not build until instructed)
> These ideas are captured here so they are never lost.
> None of them are to be started until the exit gate of the phase they belong to is met.
> Gemini CLI: if you see a task below, ask which phase we are in before touching it.

---

### 19.1 â€” PHASE 3 ADDITION: KisanNiti WhatsApp Bot (no app needed)
**Unlock condition:** 1,000 DAU on Android app AND â‚¹1L MRR reached.
**Why it matters:** 70%+ of rural Haryana farmers already use WhatsApp daily.
A WhatsApp bot eliminates the app-install barrier entirely for distribution.
**What to build:**
- Twilio WhatsApp Business API (free sandbox, paid at scale) OR
  Meta Cloud API (free tier: 1,000 conversations/month)
- Farmer sends: "à¤—à¥‡à¤¹à¥‚à¤‚ Karnal 100 à¤•à¥à¤µà¤¿à¤‚à¤Ÿà¤²" in any format
- Bot replies with the Becho Ya Ruko result card as a formatted WhatsApp message
- No app install. No Play Store. No onboarding friction.
**Integration path:** Same backend POST /api/advisory/sell-hold endpoint.
Bot is just a new input channel, not a new feature.
**Do NOT build this before Phase 3 exit gate.** The Android app must prove
the recommendation works before distributing it over WhatsApp.

---

### 19.2 â€” PHASE 3 ADDITION: SMS Fallback for 2G / Feature Phone Users
**Unlock condition:** WhatsApp bot is live and showing retention.
**Why it matters:** Some Haryana villages have 2G only. WhatsApp does not load.
A simple SMS fallback covers 100% of mobile users regardless of data.
**What to build:**
- Twilio SMS API (or MSG91 for India â€” cheaper, â‚¹0.12/SMS)
- Farmer sends SMS: "SELL WHEAT KARNAL 100"
- System returns 2-SMS reply with decision + price range in Hindi
- Keyword parser in backend: no AI needed for parsing farmer SMS inputs
**Constraint:** SMS is one-way, no images. Response must be pure text â‰¤320 chars.
**Do NOT build before WhatsApp bot is proven.**

---

### 19.3 â€” PHASE 3 ADDITION: Arhtiya Pro Mobile App (separate from farmer app)
**Unlock condition:** 20+ paying Arhtiya Pro subscribers on web dashboard.
**Why it matters:** Arthiyas also use smartphones but want a dedicated tool,
not the farmer-facing app. Separate app signals professionalism and justifies â‚¹399/mo.
**What to build:**
- Separate Capacitor build from the same React codebase (different appId)
- AppID: com.kisanniti.arhtiya
- Features unique to Arhtiya Pro:
  - Client farmer list with each farmer's crop, quantity, advisory status
  - Bulk price alert: "Set alert when Karnal wheat crosses â‚¹2,500"
  - Settlement tracker: record which farmers have sold, at what price, commission earned
  - PDF generation: monthly farmer advisory report for arhtiya's records
- Revenue gate: Only release after â‚¹2L MRR proven from web dashboard subscriptions

---

### 19.4 â€” PHASE 3 ADDITION: Offline-First Mode with Background Sync
**Unlock condition:** 500+ DAU on Android AND at least 3 crash reports from network failures.
**Why it matters:** Haryana fields have spotty internet. The app must work offline
and sync when connectivity returns â€” like a field tool, not a web app.
**What to build:**
- Service Worker (already available via Capacitor) for asset caching
- Background sync via Capacitor Background Runner plugin
- IndexedDB (via Capacitor Preferences) for local price cache:
  - Last known mandi prices per district â†’ show even without internet
  - Last Becho Ya Ruko result â†’ show "as of [date]" badge
- On reconnect: auto-refresh prices, push queued advisory requests
- "à¤‘à¤«à¤²à¤¾à¤‡à¤¨" banner when no connection â€” Hindi, prominent, not a toast
**Do NOT over-engineer.** Cache the last 3 API responses per district. That is enough.

---

### 19.5 â€” PHASE 4 ADDITION: Punjab Expansion Playbook
**Unlock condition:** Haryana DAU > 5,000 AND Punjab-specific crop data researched.
**What changes for Punjab:**
- Same crops (Wheat, Paddy, Mustard) â€” same decision engine
- Different mandis: Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Ferozepur
- Different districts and GPS coordinates needed in HARYANA_MANDIS equivalent
- Same arhtiya system exists in Punjab â†’ same B2B model applies
- Language: Punjabi option needed in addition to Hindi (i18next supports it)
- Regulatory: Punjab APMC rules differ from Haryana â€” research before launch
**Reuse:** Same backend, same Gemini prompt, same Supabase schema
**New work:** Punjab mandi coordinates, Punjabi i18n strings, Punjab-specific
             crop calendar (Punjab paddy harvest is 2 weeks earlier than Haryana)

---

### 19.6 â€” PHASE 4 ADDITION: Backtesting Engine (proof-of-value for VCs + media)
**Unlock condition:** 6 months of sell_hold_recommendations data in Supabase.
**Why it matters:** The single most powerful investor/media story is:
"If a Karnal wheat farmer had followed KisanNiti's advice in April 2025,
 they would have earned â‚¹127 more per quintal vs selling in the first week."
This requires building a backtesting engine against historical Agmarknet data.
**What to build:**
- Use UPAg / data.gov.in historical price data (free)
- Replay the Becho Ya Ruko algorithm against 5 years of weekly Haryana wheat prices
- Calculate: if farmer followed HOLD recommendation, what did they actually earn?
- Generate: "KisanNiti Accuracy Report" â€” quarterly PDF for press + investor decks
**Constraint:** Backtest only crops with 5+ years of Agmarknet data in Haryana.
Wheat and Paddy qualify. Mustard borderline. Do not backtest exotic crops.

---

### 19.7 â€” PHASE 4 ADDITION: KCC Loan Integration (Kisan Credit Card)
**Unlock condition:** NWR Pledge feature is live AND 50+ farmers have used it.
**Why it matters:** NWR pledging allows a farmer to borrow against stored grain.
The next step is making KCC loan application directly accessible from the app.
Currently, farmers must visit a bank branch to apply for KCC.
**What to build:**
- Partnership with: SBI YONO Agri, NABARD, or a cooperative bank in Karnal/Kaithal
- In-app KCC pre-qualification form: land holding, crop type, NWR reference number
- Link to partner bank's KCC application flow
- Revenue model: referral fee per approved loan (â‚¹200-500 per loan from bank partner)
**Do NOT build the actual lending infrastructure.** We are a referral partner,
not an NBFC. Regulatory complexity of lending is outside our scope.

---

### 19.8 â€” LONG-TERM: Voice Interface in Hindi (IVR / Voice Bot)
**Unlock condition:** 10,000 DAU, â‚¹5L MRR proven, Series A raised.
**Why it matters:** Significant portion of Haryana farmers over 50 are not
comfortable with touchscreen typing â€” especially in Hindi Devanagari.
A voice interface ("Call 1800-XXX-XXXX, say your crop and district")
could 5x the total addressable market beyond smartphone users.
**Technology path:**
- IVR: Exotel or Servetel (India-focused, â‚¹0.50/min)
- Speech-to-text: Google Cloud STT supports Hindi (free tier 60 min/month)
- TTS: Google Cloud TTS Hindi voice for responses
- Same backend advisory endpoint â€” voice is just another input channel
**Constraint:** This requires dedicated ops team to handle IVR infrastructure.
Do not start before Series A and a dedicated ops hire.



---

---

## SECTION 20 — LIVE MARKET PULSE: RESEARCH VERDICT & STRATEGY

### What "live" government data actually is — the real pipeline

The phrase "live market pulse" is marketing language. Understanding the actual
data pipeline is critical before designing any feature around it.

**How Agmarknet data gets made (ground reality):**
A physical auction happens in the mandi at 6–10am. A Data Entry Operator (DEO),
employed by the APMC, manually types the day's prices into the Agmarknet portal.
The official directive requires upload by 5pm the same day. In well-run Haryana
mandis (Karnal, Ambala, Hisar, Kaithal) this mostly happens. In smaller sub-yards
and other states, the Central Government was still writing letters in August 2025
to mandis that had simply stopped uploading.

**So "live" Agmarknet data is, in practice: same-day-evening data at best.**
The price in the API reflects what happened at 7am — uploaded by ~4–5pm.
By the time a farmer sees it, that trading session is already closed.
You cannot act on it today. You can only use it to understand yesterday
and make a decision about tomorrow.

**Agmarknet 2.0 (launched November 2025)** improved this with a mobile app
for mandi officials — data can now enter the portal within hours of each lot
being auctioned. But it is still batch-by-batch, mandi-by-mandi, dependent
on individual DEO discipline. It is NOT tick-by-tick.

**eNAM is genuinely closer to real-time** because it IS the auction software
itself — bids are recorded as they happen. But only ~50 of Haryana's 367 mandis
are on eNAM. The remaining 317 mandis feed only Agmarknet, with its natural lag.

---

### Data trustworthiness by source

| Source | Latency | Reliability (Haryana) | Reliability (other states) |
|---|---|---|---|
| Agmarknet (Haryana major mandis) | Same-day by 5pm | HIGH — APMC well-funded | VARIABLE — some states dormant |
| Agmarknet (Haryana sub-yards) | 1–2 day lag | MEDIUM | LOW |
| eNAM (Haryana, ~50 mandis) | Near real-time (minutes) | HIGH | HIGH |
| HAFED/HSAMB procurement alerts | Same-day | HIGH — state-run | N/A |

**For Haryana specifically, Agmarknet is among the most reliable in India.**
Wheat and paddy are high-volume, high-stakes — mandis have strong incentive
to report accurately. HAFED (state procurement) cross-validates prices against
its own records, creating a natural consistency check.

**Practical rule already in the codebase:** Always check `arrival_date` in
the API response. If date is > 1 day old, show "कल का भाव" badge. If 2+ days
old, downgrade Gemini confidence to MEDIUM regardless of other signals.

---

### Is a Live Market Pulse useful for KisanNiti farmers?

**Short answer: No — not as a standalone consumer feature.**

A Haryana wheat farmer does not trade intraday. They bring their cart to the
mandi at 6am. The auction happens. They accept or reject the lot price on the
spot. That decision is made in the mandi yard, not on a phone. No price ticker
changes that moment.

What changes that moment is what KisanNiti already does: a pre-visit advisory
("should you even come to the mandi today, or wait 7 days?") based on yesterday's
prices + arrivals + weather + supply signals. The live ticker is irrelevant
to this decision. A farmer who checks the app at 5pm and sees prices is not
going to load his tractor at midnight. He will check again tomorrow morning.

**The real daily usage pattern for a farmer:**
- 6am: checks app before leaving for mandi → sees yesterday's closing price
- Makes drive/no-drive decision based on Becho Ya Ruko result
- If driving: no app needed — the mandi auction sets the real price
- Evening: checks what prices did today → updates his mental model

This means the farmer's meaningful interaction is **once per day, in the morning,
based on yesterday's data.** A live ticker refreshing every 5 minutes adds
zero value to this workflow and creates false sophistication.

---

### Where "live" data IS strategically valuable for KisanNiti

**Use Case 1 (Phase 2 — Arhtiya Pro): Morning Cross-Mandi Briefing**
An arhtiya manages 40–200 farmers simultaneously. He IS making intraday decisions:
which mandi to route which farmer's truck to. He wants to know:
"Is Ambala running ₹40 higher than Karnal for wheat right now?"
This is actionable because the truck hasn't left yet.

Build for Phase 2 Arhtiya Pro:
- Daily 6am push notification: "आज Ambala में गेहूं ₹35 ज़्यादा — Karnal से"
- Cross-mandi arbitrage card: price + transport cost + net gain per quintal
- Data source: Agmarknet previous day's close (this is sufficient — prices
  don't reset between closing and opening, they carry forward)

**Use Case 2 (Phase 3 — highest value notification we can send): MSP Procurement Alert**
When the Haryana government opens MSP procurement at a mandi, this is
announced same-day via HAFED and HSAMB notices. A farmer 30km away needs
this alert within the hour, not tomorrow.

"आज Karnal मंडी में सरकारी खरीद शुरू — MSP ₹2,425 पर बेचें।
यह मौका आज ही है।"

This is the ONE moment where near-real-time matters for a farmer directly.
Data source: Monitor HAFED website + HSAMB procurement schedule — not Agmarknet.

**Use Case 3 (Phase 1 — already planned): 7-day Arrival Trend Signal**
The most valuable extraction from the daily Agmarknet feed is NOT today's
single price — it is the multi-day arrival-weighted trend. When Karnal wheat
arrivals spike 40% above the 7-day average and modal price drops ₹30 in 2 days,
that pattern predicts the next 3–5 days better than any single data point.
This is already in the Becho Ya Ruko engine via arrivals_in_qtl. Build it right.

---

### What NOT to build

```
✗ A stock-market-style price ticker refreshing every 5 minutes
  → Data doesn't support it (Agmarknet is daily, not tick-by-tick)
  → Use case doesn't exist (farmers don't trade intraday)
  → Creates false urgency that could cause bad sell decisions

✗ A "Live Market Pulse" tab as a standalone farmer feature
  → Farmers don't need to watch prices — they need a decision
  → Every competitor already shows prices; we win by advising

✗ WebSocket real-time price streaming
  → Unnecessary infrastructure cost, no matching use case
  → Even if eNAM data were available tick-by-tick, a farmer
     looking at a live chart cannot act on minute-by-minute changes
```

---

### What TO build (phased)

```
PHASE 1 — Already planned (no new work):
  ✓ "आज का भाव" vs "कल का भाव" freshness badge
  ✓ 7-day arrival trend → arrival signal in Becho Ya Ruko
  ✓ Data staleness check → downgrade confidence if date > 1 day old

PHASE 2 — Arhtiya Pro morning briefing (new, high B2B value):
  ✓ 6am daily push: cross-mandi price comparison for arhtiya's district
  ✓ Arbitrage card: "Ambala ₹35 ज़्यादा — ट्रक रूट बदलें?"
  ✓ eNAM integration as primary source where available (same-day)
  ✓ Agmarknet as fallback (previous day's close)
  ✓ "Best mandi today" chip on mandi price page (for arthiyas on desktop)

PHASE 3 — MSP procurement alert (highest-value notification):
  ✓ Monitor HAFED + HSAMB procurement schedule
  ✓ Push + WhatsApp + SMS alert when procurement opens in farmer's district
  ✓ Exact mandi name, MSP rate, validity window ("आज ही")
  ✓ This is the single notification farmers will share with their entire village
```

---

### The honest framing for CEO_VISION.md

"Live Market Pulse" as most people imagine it (stock ticker, real-time feed)
is a distraction from KisanNiti's core. The government data is daily, not live.
The farmer workflow is once-per-morning, not intraday.

The strategic value of market data for KisanNiti is:
1. **Trend signals over 7–30 days** → powers Becho Ya Ruko accuracy
2. **Cross-mandi arbitrage at 6am** → powers Arhtiya Pro retention
3. **MSP procurement alerts same-day** → most viral notification possible

All three are already in the roadmap. None of them require a "live" ticker.
The data is trustworthy for Haryana. The use case is daily, not intraday.
Build accordingly.
