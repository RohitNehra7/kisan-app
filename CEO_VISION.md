# KisanNiti — CEO Vision Document
## For Gemini CLI: Read this COMPLETELY before every session, every time.
**Version:** 4.0 | **Date:** March 2026 | **Status:** Active Development
**Author:** Rohit Nehra | **Mission:** ₹1 crore ARR by March 2027

---

## SECTION 1 — THE NORTH STAR

**KisanNiti (किसान नीति)** is India's first **Sell/Hold Decision Engine** for farmers.

We answer one question every other app refuses to answer:

> **"मेरी फसल आज बेचूं या रुकूं?" — Should I sell my crop today or wait?**

Every feature, every API call, every line of code must serve this question.
If it doesn't answer this question for a Haryana farmer, we don't build it.

---

## SECTION 2 — THE ACTUAL MARKET NEED (ground truth from research)

### The real problem is not information. It is financial entrapment.

Haryana wheat farmers face a structural trap that no price app solves:

**The Arhtiya Trap — the core problem KisanNiti must solve**

There are 22,000 arthiyas registered in Haryana. Each deals with 40–200 farmers.
The arhtiya is simultaneously the farmer's:
- Banker → lends money all season at 18–37% annual interest
- Commission agent → earns 2.5% on every sale, paid by the buyer
- Store owner → sells fertilizer, seed, pesticide on credit
- Advisor → recommends when to sell

The arhtiya's financial incentive is always to sell fast. Every week the crop waits:
- The farmer's interest debt compounds
- The arhtiya earns nothing on his float capital
- The arhtiya prefers fast turnover over farmer income maximization

When the arhtiya says "sell now," farmers comply — not because they trust the advice, but because they are financially dependent. This is not stupidity. It is a debt trap that has existed since the Green Revolution of the 1970s.

**The Income Loss Is Real and Quantifiable**

Farmers who sell wheat in the first 2 weeks of harvest (April 1–15) receive ₹50–200/quintal less than those who wait 3–4 weeks. The reason:
- All farmers harvest simultaneously → arrivals spike → prices crash
- Traders and millers know this seasonal pattern and wait
- Farmers cannot wait because of arhtiya interest pressure

For a 100-quintal farm (typical medium Haryana farm), this timing loss = ₹5,000–₹20,000 per harvest. Two harvests per year = ₹10,000–₹40,000/year left on the table. A single good timing decision — supported by data — can pay for a child's school fees.

**Academic evidence:** A 2025 Indian Journal of Agricultural Economics study of sub-MSP wheat transactions found farmers selling above MSP consistently earned ₹9,137–₹10,158 more per hectare than those who didn't — not because their crop was better, but because of timing and negotiation leverage.

**The app graveyard problem — why every agri app fails retention**

| App | Problem | Retention result |
|---|---|---|
| Kisan Suvidha (2016) | Shows prices. No action output. Crashes. | ~3L active users of 500M farmers |
| IFFCO Kisan | Information overload, no verdict | 80% churn within 2 months |
| AgroStar / DeHaat | Pre-harvest input sales, not sell-side | Different problem, different user |
| eNAM | Trader-facing auction platform | Not used by farmers directly |
| Bharat-VISTAAR (Feb 2026) | Govt AI chatbot, national scale, no local depth | Too early to measure |

**The common failure:** Apps tell farmers WHAT the price is. None tell them WHAT TO DO with that price. Farmers look at ₹2,380/quintal in Karnal and still don't know if they should sell. They close the app. They don't return.

KisanNiti gives a single verdict: **SELL** or **HOLD**. In Hindi. With a reason. That is why they come back.

### The gaps at ground level — what nobody has solved

**Gap 1: The second opinion gap**
Farmers have one advisor: their arhtiya. They have no way to get an independent data-backed second opinion. KisanNiti is that second opinion. Not competing with the arhtiya — existing alongside him.

**Gap 2: The arrival quantity gap**
No farmer app uses arrival quantity data as a price predictor. Traders have been using this signal for decades (high arrivals → oversupply → prices drop in 2–3 days). This exact signal is available free in the Agmarknet API. We will be the first to put it in a farmer's hands.

**Gap 3: The crop calendar timing gap**
Every app shows today's price. Nobody tells you that wheat prices in Haryana historically bottom in April (peak arrivals week) and recover 3–5% by mid-May. This seasonal pattern is predictable from 5+ years of Agmarknet historical data and it is the single most actionable insight a Haryana wheat farmer can receive.

**Gap 4: The Meri Fasal Mera Byora integration gap**
Haryana runs a mandatory crop registration portal (fasal.haryana.gov.in). Every farmer selling at MSP must register. This means the Haryana government already has: farmer name, phone, crop type, khasra number, district, quantity. No agri app has thought to connect this data to a sell/hold decision. This is a distribution and personalization opportunity unique to Haryana.

**Gap 5: The NWR pledge gap (most underutilized financial tool in Indian agriculture)**
Warehouse Development Regulatory Authority (WDRA) issues Negotiable Warehouse Receipts. A farmer can store grain in an accredited warehouse and borrow 70–80% of market value without selling. This allows holding without cash pressure. No consumer-facing app explains or enables this. KisanNiti Phase 3 should make this one tap.

**Gap 6: The post-harvest quality degradation gap**
Paddy loses ~5 quintals every 4 rain-days after harvest. Cotton depreciates with every day of excess humidity. Wheat quality grades down after 3 months without proper storage. The "hold" recommendation must account for quality loss. No existing app does this. Our weather integration + crop-specific quality rules must address it.

---

## SECTION 3 — THE FOUNDER'S EDGE (unfair moat)

Rohit Nehra has three things simultaneously that no Bangalore agritech founder has:

1. **Agricultural roots in Haryana** — understands what a Karnal farmer worries about at 4am (not yield — PRICE AND TIMING). Can validate the product with actual relatives.
2. **Swing trading knowledge** — arrival quantity as price signal, trend reversal detection, hold vs. exit discipline. This is crop market timing applied to financial market thinking. No competitor thinks this way.
3. **Engineer who can ship** — can build and iterate fast without a team.

**Never build generic. Always build Haryana-deep.**
When we know Haryana well, Punjab, Rajasthan, and UP will follow the same playbook.

---

## SECTION 4 — COMPETITIVE LANDSCAPE AND HOW WE WIN

### The real competitive map

| Competitor | Funded | What they do | Why farmers churn | Our advantage |
|---|---|---|---|---|
| Kisan Suvidha (Govt) | ∞ govt | Price info, weather | No verdict, crashes | One Hindi verdict |
| Bharat-VISTAAR (Feb 2026) | ₹10,372 Cr govt | National AI chatbot | Generic, no local depth | Haryana-specific signals |
| eNAM | ₹400 Cr govt | Online auction | Trader-facing, complex | We are advisory, they are transactional |
| AgroStar | $100M+ VC | Input sales + pest advisory | Pre-harvest problem | We own post-harvest |
| DeHaat | $200M+ VC | Full stack input+advisory | UP/Bihar focus | Haryana-native, single sharp feature |
| IFFCO Kisan | Cooperative | Advisory + weather | Information overload, no verdict | One verdict, in Hindi |
| NaPanta | Unknown | Mandi price tracking | Price only, no decision | We add AI decision layer |

### How we specifically beat each one

**Over Bharat-VISTAAR** — This is the battle that matters most. It launched February 2026 with ₹10,372 crore government investment. It calls the same Agmarknet API. It gives national-level generic advice. We beat it with:
- Arrival quantity signal (they don't use it)
- District-level crop calendar patterns (they don't know Haryana harvest timing)
- Arhtiya-as-distribution tool (they are bypassing arthiyas; we are making arthiyas our Pro customers)
- Hindi verdict UI (they are a chatbot; we are a decision)

**Over eNAM** — eNAM has 1.77 crore farmer registrations and 2.53 lakh trader registrations as of 2025. Farmers don't use eNAM to make decisions — they use it to complete a transaction. We are the layer that tells them whether to transact at all. We should eventually integrate eNAM data as our same-day price source.

**Over AgroStar/DeHaat** — They own the pre-harvest farmer relationship (input purchase). We own the post-harvest moment (sell decision). These are separate problems. We can eventually partner; we don't compete.

**The partnership insight:** Arthiyas are not our enemies. There are 22,000 registered arthiyas in Haryana. If KisanNiti gives each arhtiya a dashboard showing price trends, arrival signals, and hold/sell recommendations for all their farmers — and charges ₹399/month for it — that is ₹88L/month at full penetration. Arhtiya Pro is our B2B product. We make the arhtiya better at his job, not obsolete.

---

## SECTION 5 — COMPLETELY FREE APIs (zero cost, zero credit card)

### 🟢 TIER 1 — Available now, integrate immediately

#### API 1: Agmarknet — Mandi Prices + Arrival Quantity
```
Base URL: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
Auth: api-key from data.gov.in — free registration, no credit card ever
Key fields: state, district, market, commodity, min_price, max_price,
            modal_price, arrivals_in_qtl, arrival_date
Sample call:
  ?api-key={KEY}&format=json&filters[State]=Haryana
  &filters[Commodity]=Wheat&limit=100
Cost: Completely free. No rate limit published. Cache aggressively (TTL 6h).
Critical note: arrivals_in_qtl is in the same response — always fetch it.
               It is the single best free price prediction signal available.
```

#### API 2: Open-Meteo — Weather (16-day forecast, no key required)
```
Forecast URL: https://api.open-meteo.com/v1/forecast
Historical URL: https://archive-api.open-meteo.com/v1/archive
Auth: NONE. No API key. No registration. No credit card. Ever.
Daily fields: precipitation_sum, temperature_2m_max, temperature_2m_min,
              weathercode, windspeed_10m_max
Sample call:
  ?latitude=29.6857&longitude=76.9905
  &daily=precipitation_sum,temperature_2m_max,temperature_2m_min,weathercode
  &forecast_days=16&timezone=Asia/Kolkata
Cost: Free up to 10,000 calls/day. No key. Open source (MIT).
Data source: ECMWF IFS + NOAA GFS — same models used by paid services.
Why better than OpenWeatherMap:
  OpenWeatherMap free = 1,000 calls/day, 5-day forecast, requires key
  Open-Meteo = 10,000 calls/day, 16-day forecast, no key, no expiry
ACTION REQUIRED: Replace OpenWeatherMap with Open-Meteo. Remove OPENWEATHER_KEY from .env.

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

#### API 5: data.gov.in — MSP Dataset (replace hardcoded values)
```
Search: data.gov.in → search "minimum support price" → Agriculture sector
Auth: Same DATA_GOV_KEY — free
Fields: commodity, season, year, msp_per_quintal, announced_date
Use: Cache in Supabase msp_values table. Refresh every 6 months.
Why: MSP changes twice/year (Kharif in June, Rabi in October).
     Hardcoded values go stale. Current hardcoded values valid until Oct 2026.
```

---

### 🟡 TIER 2 — Free, register now, integrate in Phase 2

#### API 6: eNAM Live Trade Data (same-day prices, free after registration)
```
Registration: enam.gov.in/web/registration — free, requires business docs
Processing time: 1–2 weeks
Fields: mandi_name, commodity, bid_price, quantity, trade_time (near real-time)
Why better than Agmarknet: Same-day vs 1-2 day lag on Agmarknet
Haryana mandis on eNAM: ~50 including Karnal, Ambala, Hisar, Kaithal
Integration plan:
  - Primary source: eNAM (same-day) when available
  - Fallback: Agmarknet (next-day) when eNAM data missing
  - Show data freshness badge: "आज का भाव ✓" vs "कल का भाव"
ACTION: Register now at enam.gov.in. No cost. Takes 1–2 weeks.
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
  - Identify seasonal patterns: "April rainfall years → prices recover faster"
  - Feed seasonal context into Gemini prompt
Cost: Completely free. No limits on historical queries.
```

#### API 8: DACFW Sowing Progress (free, scrape weekly with Puppeteer MCP)
```
Source: agricoop.nic.in → Kharif/Rabi sowing progress PDFs
Frequency: Published every Monday during sowing season
Data: % of normal area sown by crop by state
Use: Supply forecast signal in Becho Ya Ruko engine
     "Mustard sowing 18% below normal → tight supply at harvest → lean HOLD"
Scrape method: Puppeteer MCP → every Monday 9am → crop_sowing_progress table
```

#### API 9: IMD Rainfall Data via data.gov.in (free)
```
Search: "district wise rainfall" on data.gov.in
Auth: DATA_GOV_KEY (free)
Fields: district, month, year, actual_rainfall_mm, normal_mm, departure_percent
Use: Seasonal rainfall departure → yield stress signal → price prediction
```

#### API 10: District-wise Crop Production Statistics (data.gov.in, free)
```
Catalog: data.gov.in → "district wise season wise crop production statistics"
Auth: DATA_GOV_KEY (free)
Fields: state, district, crop, year, season, area, production, yield
Use: Multi-year yield context for Gemini prompt
     "Karnal wheat yield 2021-24: 48, 51, 47, 52 q/ha → this year sowing normal"
```

#### API 11: Haryana Meri Fasal Mera Byora (fasal.haryana.gov.in)
```
What it is: Haryana government mandatory crop registration portal.
            Every farmer selling at MSP must register here.
            Portal contains: farmer name, phone, Aadhaar, crop type,
            khasra, district, quantity — for ALL Haryana MSP-selling farmers.
How to access: Apply to Haryana Dept. of Agriculture for API access
               OR use as distribution channel (farmers already registered = our TAM)
Strategic importance:
  - KisanNiti can offer "auto-fill from Meri Fasal Mera Byora" for Becho Ya Ruko form
  - Farmer enters phone → we pre-fill crop, district, quantity from MFMB data
  - This eliminates the biggest UX friction in our advisory form
  - No other agri app has done this integration
  - This is a Haryana-only competitive moat
Action Phase 2: Write to Haryana Agriculture Dept. for API/data partnership.
               Position as a tool that increases MFMB portal engagement.
```

---

### 🔵 TIER 3 — Free, integrate Phase 3 for B2B and advanced features

#### API 12: WDRA Registered Warehouses
```
Source: wdra.gov.in (registration required for API access, free)
Fields: warehouse_name, district, capacity_mt, NWR_eligible, commodities
Use: "Hold and Pledge" feature — show nearest NWR-eligible warehouse
     "Karnal warehouse: 20km away, ₹8/q/month — pledge grain, get KCC loan"
     This is the most powerful "alternative to selling" tool in Indian agriculture
     No other consumer app has built this. It is the next evolution of Becho Ya Ruko.
```

#### API 13: Soil Health Card Data
```
Source: soilhealth.dac.gov.in (NIC-maintained, public API)
Fields: district, NPK status, pH, organic carbon, micronutrients
Use:
  B2B: Sell district-level nutrient maps to agri-input companies (Bayer, UPL)
  Consumer: "आपके जिले की मिट्टी में नाइट्रोजन कम है — यह DAP लें"
  Advertising: Target fertilizer ads to nitrogen-deficient districts
```

#### API 14: PMFBY Crop Insurance
```
Source: pmfby.gov.in public data portal
Fields: state, district, crop, insured_area, premium_rate, claims_paid_ratio
Use:
  Consumer: "अपनी फसल का बीमा करें — ₹{premium}/क्विंटल"
  B2B: License historical claims data to insurance companies (₹20,000-50,000/month)
  Signal: High claims district in past year → price volatility → stronger hold signal
```

#### API 15: PM-KISAN Beneficiary Data
```
Source: data.gov.in (free)
Fields: state, district, beneficiary_count, amount_disbursed
Use:
  TAM sizing: Haryana has ~18 lakh PM-KISAN beneficiaries = total addressable farmers
  Timing signal: PM-KISAN payments in Feb/June/Oct → farmers have cash →
                 input purchases spike → not a distress-sell period
```

---

### 🔴 TIER 4 — Future infrastructure (2026–2027)

#### API 16: AgriStack / Farmers Registry
```
Status: Rolling out state by state. Haryana in early phases.
Impact when available: Auto-populate Becho Ya Ruko form with verified
                       land parcel, crop, and Aadhaar-linked identity.
                       "आपने 5 एकड़ में गेहूं बोया है — सही है?" (auto-verified)
```

#### API 17: UPAg — Unified Portal for Agricultural Statistics
```
Source: upag.gov.in (DACFW analytics portal)
Use: Backtest the Becho Ya Ruko algorithm against 5 years of Haryana price data.
     "If KisanNiti algorithm had been applied to Haryana wheat 2021-24,
      farmer would have earned avg ₹127 more per quintal vs selling in first week"
     This is the proof-of-value story for media, VCs, and government partnerships.
```

#### API 18: Krishi-DSS
```
Source: Govt geospatial decision support (launched Aug 2024)
Contains: Satellite imagery, soil, weather, crop maps by district
Use Phase 4: District yield estimation, drought detection, satellite crop health
```

---

## SECTION 6 — PHASE-BASED PRODUCT ROADMAP

### PHASE 0 — Ship the core (NOW → March 2026)
**Mission:** Get Becho Ya Ruko live. Get 10 real Haryana farmers to use it.
**Revenue:** ₹0. This phase is about proving the concept works.

```
Sprint tasks (complete in strict order):
[x] TASK 1:  Fix debounce — 1 API call per search ✅
[x] TASK 2:  Fix console errors ✅
[x] TASK 3:  Mobile-first responsive layout ✅
[x] TASK 4:  Haryana primary crop filter ✅
[ ] TASK 5:  Last Updated timestamp banner ← DO THIS NOW
[ ] TASK 6:  Fix price history backfill (Supabase migration)
[ ] TASK 7:  BUILD BECHO YA RUKO PAGE ← THE ENTIRE POINT OF THIS APP
[ ] TASK 8:  Switch weather to Open-Meteo (no key, 16-day, free, better)
[ ] TASK 9:  Page transitions (framer-motion)
[ ] TASK 10: Hindi placeholder text fix (all inputs must be in Hindi by default)
[ ] TASK 11: Empty states (favorites empty, no search results)
[ ] TASK 12: Price history modal close button
[ ] TASK 13: Final checks + APK build + Play Store submission

Exit gate: 10 real farmers in Haryana have received a Becho Ya Ruko recommendation.
           Not demo. Not family. Real farmers. Get Rohit's relatives to use it first.
```

### PHASE 1 — Signal quality + first users (April–May 2026)
**Mission:** Make the recommendation 3x more accurate. Reach 100 daily users.
**Revenue:** ₹0. Still proving that the recommendation helps farmers.

```
Features to build:
□ arrivals_in_qtl always fetched from Agmarknet (same API, add this field)
□ 7-day arrival average calculation → arrival signal (ABOVE/BELOW/NORMAL)
□ Arrival signal injected into Gemini prompt
□ Weekly DACFW sowing progress scraper (Puppeteer MCP, every Monday 9am)
□ Supply signal (TIGHT/SURPLUS/NORMAL) injected into Gemini prompt
□ WhatsApp share button on Becho Ya Ruko result card
□ MSP values moved to Supabase msp_values table (stop hardcoding)
□ "आज का भाव" / "कल का भाव" freshness badge on price cards
□ eNAM registration completed — begin integration planning
□ GitHub Actions CI/CD workflow (does not exist yet — create it)

Exit gate: 100 unique users per day.
           30+ Becho Ya Ruko advisory requests per day.
           At least 1 farmer who can be quoted saying it helped their timing decision.
```

### PHASE 2 — Retention + first revenue (June–August 2026)
**Mission:** Farmers come back daily. 1,000 DAU. First ₹1L revenue.
**Revenue target:** ₹1L MRR from 5 Arhtiya Pro subscribers.

```
Features to build:
□ Farmer Profile page (My Farm):
    - Stores: crop, district, land size, storage cost, arhtiya name, urgency
    - Auto-fills Becho Ya Ruko form every time (zero re-entry friction)
    - Links to Meri Fasal Mera Byora data if available
□ Push notifications (Capacitor push plugin):
    - "आज गेहूं का भाव ₹50 बढ़ा — बेचने का सही वक्त हो सकता है"
    - Price alert when commodity crosses user-set threshold
    - Harvest season timing reminders (crop-calendar based)
□ Historical chart on Becho Ya Ruko: 30-day price trend for farmer's crop
□ eNAM integration: same-day prices when available, Agmarknet fallback
□ Open-Meteo historical analysis: seasonal pattern card
    - "पिछले 5 साल में Karnal में गेहूं का भाव अप्रैल के बाद 3-5% बढ़ा है"
□ Storage Options card (below advisory result):
    - "Karnal में 3 cold storage available — ₹8/quintal/month"
    - Data sourced from Supabase storage_locations table (manually populated)
□ Mandi Arbitrage calculator:
    - "Ambala vs Karnal — ₹35/q difference, 45km apart, ₹8/q transport cost"
    - Net: ₹27/q better at Ambala → 100q = ₹2,700 extra
□ Arhtiya Pro dashboard BETA:
    - Target: 5 paying arthiyas in Karnal / Kaithal at ₹399/month
    - Features: All-farmer price alerts, arrival trend charts, bulk advisory PDF

Exit gate: 1,000 DAU. ₹1L MRR. 5 paying Arhtiya Pro subscribers.
           At least 1 farmer who earned measurably more because of KisanNiti.
```

### PHASE 3 — Monetization at scale (September–December 2026)
**Mission:** ₹5L MRR. 10,000 DAU. Fundable or cashflow positive.

```
Features to build:
□ Arhtiya Pro full launch (₹399/month):
    - Price trend dashboard for all farmer clients
    - Bulk advisory generation (paste 50 farmer names, get 50 PDFs)
    - Commission tracking and settlement history
    - Target: 200 paying arthiyas = ₹80,000/month
□ FPO Enterprise (₹1,999/month):
    - Group advisory for 200+ farmers in one FPO
    - Aggregated sell/hold dashboard for FPO manager
    - Export report for FPO board meetings
    - Target: 25 FPOs = ₹50,000/month
□ MSP procurement alert engine:
    - "आज Karnal मंडी में सरकारी खरीद शुरू — MSP ₹2,425 पर बेचें"
    - Push + SMS + WhatsApp when government procurement opens in farmer's district
□ NWR Pledge feature (the "Hold without cash pressure" solution):
    - "अभी मत बेचो — ये warehouse में रखो + KCC loan लो"
    - Conditions: price below MSP + NWR warehouse within 20km + urgency=flexible
    - Show: warehouse location, cost/month, estimated loan amount
    - This solves the arhtiya debt trap at its root
□ Soil health advisory (soilhealth.dac.gov.in):
    - District nutrient deficiency map → targeted fertilizer recommendation
□ RKVY grant application (₹10–25L non-dilutive):
    - Apply to Rashtriya Krishi Vikas Yojana Agri-Innovation grant
    - Use Phase 2 user data as proof of concept
□ Agri-brand advertising:
    - Bayer, Syngenta, UPL ad campaigns targeted by district + crop + soil type
    - Seasonal timing: pre-sowing = fertilizer ads, post-harvest = storage ads

Exit gate: ₹5L MRR. 10,000 DAU. Data licensing LOI from 1 bank/insurer.
```

### PHASE 4 — Geographic scale (2027)
**Mission:** ₹1 crore ARR. Launch Punjab and Rajasthan.

```
Expansion:
□ Punjab (mustard + wheat — same crop calendar, same arhtiya system)
□ Rajasthan (mustard belt — Alwar, Bharatpur, Jaipur districts)
□ B2B data licensing to NABARD, agri-banks, crop insurance companies
□ AgriStack integration (verified farmer identity → zero form friction)
□ Bharat-VISTAAR partnership: KisanNiti as the Haryana specialist layer

Exit gate: ₹1 crore ARR. 50,000 DAU across 3 states.
```

---

## SECTION 7 — THE BECHO YA RUKO ENGINE (build spec — exact)

### User flow
```
Farmer opens app → taps बेचो/रुको tab
→ Form (pre-filled from saved profile if exists):
    [फसल: Wheat ▼]  [मात्रा: 100 क्विंटल]  [जिला: Karnal ▼]
    [भंडारण लागत: ₹0.50/दिन/क्विंटल]  [पैसे कब: 🟢 जब अच्छा दाम मिले ▼]
→ Taps "सुझाव लो →"
→ Animated 3-step loader (each step must visibly complete before next):
    Step 1: "🌾 मंडी भाव देख रहे हैं..." → fetches Agmarknet (prices + arrivals)
    Step 2: "🌤️ मौसम जांच रहे हैं..." → fetches Open-Meteo 16-day forecast
    Step 3: "🤖 AI सुझाव बना रहा है..." → POST /api/advisory/sell-hold
→ Result card:
  ┌────────────────────────────────────────┐
  │  🟠 7 दिन रुको                         │  ← Decision badge (colored bg)
  │  पक्का सुझाव ✓                         │  ← Confidence
  │                                        │
  │  अनुमानित भाव: ₹2,280 – ₹2,380/क्विंटल │
  │                                        │
  │  [3-sentence Hindi reason]              │
  │                                        │
  │  ⚠️ जोखिम: [1-sentence risk note]       │
  │                                        │
  │  मंडी जाँची: Karnal, Nilokheri, Assandh │  ← Data transparency
  │  भाव: आज का ✓                          │  ← Freshness badge
  │                                        │
  │  [📱 WhatsApp]  [🔄 नया सुझाव]          │
  └────────────────────────────────────────┘
```

### Decision badges
| Decision | Hex color | Hindi label | When |
|---|---|---|---|
| SELL_NOW | `#B71C1C` red | 🔴 अभी बेचो | Arrivals high, prices falling, rain risk |
| HOLD_7_DAYS | `#E65100` deep orange | ⏳ 7 दिन रुको | Arrivals declining, trend turning |
| HOLD_14_DAYS | `#F57F17` amber | ⏳ 14 दिन रुको | Strong supply deficit signal |
| PARTIAL_SELL | `#0D47A1` dark blue | ⚡ आधा बेचो | Mixed signals + cash urgency |

### Backend endpoint
```typescript
// POST /api/advisory/sell-hold
// Rate limit: 5 requests per IP per hour
// Timeout: 15 seconds (Gemini can be slow)

interface SellHoldRequest {
  crop: string;              // "Wheat"
  quantity: number;          // quintals
  district: string;          // "Karnal"
  storageCostPerDay: number; // ₹/quintal/day — default 0.50
  urgency: 'now' | '2weeks' | 'flexible';
}

interface SellHoldResponse {
  decision: 'SELL_NOW' | 'HOLD_7_DAYS' | 'HOLD_14_DAYS' | 'PARTIAL_SELL';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_price_min: number;
  expected_price_max: number;
  hindi_reason: string;      // 3 sentences, ≤60 words
  risk_note: string;         // 1 sentence, ≤20 words
  mandis_checked: string[];  // ["Karnal", "Nilokheri", "Assandh"]
  data_freshness: string;    // "आज का भाव" | "कल का भाव"
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
  if (ratio > 1.30) return 'ABOVE_NORMAL'; // oversupply → price drop in 2-3 days
  if (ratio < 0.70) return 'BELOW_NORMAL'; // scarcity → price rise likely
  return 'NORMAL';
}
// ABOVE_NORMAL → lean strongly toward SELL_NOW
// BELOW_NORMAL → lean toward HOLD
// Always include in Gemini prompt with exact numbers
```

### Crop quality degradation rules (add to Gemini prompt context)
```typescript
// Quality loss rates — include in prompt when urgency = 'now' or rain risk = HIGH
const QUALITY_RULES = {
  'Paddy':   'Paddy loses ~5 quintals per 4 rain-days after harvest. Wet paddy rejected at MSP.',
  'Cotton':  'Cotton depreciates 2-3% per week of humidity exposure above 70%.',
  'Mustard': 'Mustard oil content drops if stored >3 months without cold storage.',
  'Wheat':   'Wheat quality stable for 3 months in dry storage; no urgency from quality alone.',
  'Maize':   'Maize highly susceptible to aflatoxin in humidity. Do not hold if rain forecast >5 days.',
};
```

### Gemini prompt — full production version
```
You are an expert agricultural commodity market analyst for Haryana, India.
You understand: mandi price dynamics, arhtiya credit pressure, MSP policy,
seasonal arrival patterns, and crop quality degradation rules.
RESPOND ONLY WITH VALID JSON. No markdown, no preamble, no text. JSON only.

FARMER SITUATION:
- Crop: {crop} | Quantity: {quantity} quintals (₹{totalValue} total at current price)
- District: {district}, Haryana | Storage cost: ₹{storageCostPerDay}/quintal/day
- Cash urgency: {urgency}
- Storage cost for 7 days: ₹{7 * storageCostPerDay * quantity} total
- Storage cost for 14 days: ₹{14 * storageCostPerDay * quantity} total

MARKET DATA (3 nearest mandis):
- {mandi1}: ₹{price1}/q | Arrivals: {arr1}q vs 7d avg {avg1}q → {signal1}
- {mandi2}: ₹{price2}/q
- {mandi3}: ₹{price3}/q
- 7-day price trend: {RISING/FALLING/STABLE} ({priceDelta} ₹/q change)
- 30-day average: ₹{avg30}/q
- MSP floor: ₹{msp}/q | Current price vs MSP: {aboveMSP}%

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
  "hindi_reason": "3 sentences in Hindi, ≤60 words total, explain WHY",
  "risk_note": "1 sentence in Hindi, ≤20 words, main risk of this decision"
}
```

### MSP values 2025–26 (hardcoded until Oct 2026)
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

### Haryana districts → mandis + GPS for Open-Meteo
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
// Show these by default without any search — this is the Haryana crop universe
export const HARYANA_PRIMARY_CROPS = [
  'Wheat',      // Rabi — king crop, harvested April
  'Paddy',      // Kharif — October harvest
  'Mustard',    // Rabi — March harvest (second biggest crop)
  'Bajra',      // Kharif — September
  'Cotton',     // Kharif — October/November (Hisar/Sirsa belt)
  'Maize',      // Kharif — September
  'Sugarcane',  // Year-round
  'Sunflower',  // Rabi — April/May
  'Barley',     // Rabi — March/April
  'Gram',       // Rabi — March
];
```

---

## SECTION 8 — TECH STACK (DO NOT CHANGE WITHOUT ASKING)

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
           @supabase/supabase-js ← MUST be in dependencies, not devDependencies
           Axios for external API calls
           express-rate-limit
           node-cron for scheduled scrapers
           Jest + Supertest for tests

Database:  Supabase (PostgreSQL on free tier)
Hosting:   Vercel (frontend) + Render (backend, free tier)
Android:   Capacitor → Android Studio → signed APK → Play Store
CI/CD:     GitHub Actions (no workflow file exists yet — create in Phase 1)
```

### CRITICAL BUG: Fix immediately
```
@supabase/supabase-js is in devDependencies in server/package.json.
Render builds with NODE_ENV=production → skips devDependencies → Supabase crashes in production.

Fix command:
  cd server && npm install @supabase/supabase-js --save

Verify fix: package.json "dependencies" section must include @supabase/supabase-js.
```

---

## SECTION 9 — SUPABASE DATABASE SCHEMA

### Existing tables
- `mandi_prices` — Agmarknet price cache
- `price_history` — 7/30-day price history

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

-- Advisory log — every Becho Ya Ruko recommendation stored for analytics
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

-- Mandi arrival quantity cache (from Agmarknet — same API, add arrivals_in_qtl field)
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

-- Crop sowing progress (weekly DACFW scrape — supply forecast signal)
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

## SECTION 10 — DESIGN SYSTEM

### Color palette
```
Primary:    #1B5E20  dark green — agriculture, trust, money
Accent:     #E65100  deep orange — alerts, primary CTAs
Background: #FAFAFA  off-white — readable in direct sunlight
Text:       #212121  near-black
Muted:      #757575  gray
Success:    #2E7D32  hold decisions
Warning:    #F57F17  partial sell
Error:      #B71C1C  sell now (red = urgency, not danger)
Info:       #0D47A1  alternate partial sell
```

### Mobile-first breakpoints
```
360px — base (₹5,000–8,000 Redmi/Realme phones — primary target device)
768px — md (tablets)
1024px — lg (desktop, secondary — mostly for arthiyas)

Test order: 360px → 393px → 412px → 768px → 1024px
If it breaks at 360px, it is broken. Fix it.
```

### Typography rules
```
Minimum body text:  16px (bright sunlight + work-roughened hands)
Prices displayed:   24px minimum
CTA buttons:        18px minimum
Hindi font:         'Noto Sans Devanagari', sans-serif (preloaded — not lazy-loaded)
Tap targets:        48x48dp minimum (WCAG AA for motor impairment)
```

### Navigation structure
```
Mobile (< 768px):  Fixed bottom nav bar, 64px height
Desktop (≥ 768px): Top nav, hide bottom bar

4 tabs:
  🌾 मंडी      → /            (mandi price tracker)
  🤖 बेचो/रुको  → /advisory    (THE CORE FEATURE)
  ⛅ मौसम      → /weather     (Open-Meteo weather)
  🚜 मेरा खेत   → /profile     (farmer profile)
```

---

## SECTION 11 — LOCALIZATION RULES

- **Default: Hindi** — English is toggle option
- All user-facing strings: use `t('key')` — never hardcode text
- All error messages: in Hindi — farmers must understand errors
- Prices: ₹ always, no ₹ formatting issues (use toLocaleString('hi-IN'))
- Dates: `15 मार्च 2026` — never `03/15/2026` or `March 15, 2026`
- Offline stale label: `अंतिम अपडेट: 2 घंटे पहले`
- Loading labels: specific steps, not generic "Loading..."

---

## SECTION 12 — ANDROID / CAPACITOR RULES

```bash
appId: 'com.kisanniti.app'
appName: 'KisanNiti - किसान नीति'
webDir: 'build'
androidScheme: 'https'
minSdkVersion: 24    # Android 7.0 — covers >95% of India rural Android phones
targetSdkVersion: 34 # Android 14

# After EVERY React change that touches UI:
npm run build && npx cap sync android

# Test on exact screen widths: 360px, 393px, 412px
# NEVER use localStorage → use @capacitor/preferences
# NEVER use alert() or confirm() → use @capacitor/dialog
# NEVER make direct API calls from frontend → always via backend
```

---

## SECTION 13 — REVENUE MODEL

| Stream | How | Monthly target | Timeline |
|---|---|---|---|
| Arhtiya Pro | ₹399/month per commission agent — price trends, bulk advisory | 800 = ₹3.2L/mo | Month 6+ |
| FPO Enterprise | ₹1,999/month per Farmer Producer Organization | 50 = ₹1L/mo | Month 9+ |
| Agri Advertising | ₹800–2,000 CPM — Bayer, Syngenta, UPL seasonal campaigns | ₹1.25L/mo | Month 10+ |
| Data Licensing | Monthly retainer — banks, crop insurers, commodity traders | ₹2L/mo | Month 11+ |
| RKVY Grant | Non-dilutive government agri-innovation grant | ₹10–25L one-time | Month 5+ |

**Strategic rule:** Never charge farmers directly. The farmer is the distribution channel. The arhtiya and FPO are the customers. Free farmer access = word-of-mouth growth = more data = more accurate AI = better Arhtiya Pro product.

**80% of revenue is B2B.** Build Arhtiya Pro before spending time on consumer monetization.

---

## SECTION 14 — WHAT YOU MUST NEVER DO

```
✗ Rewrite frontend in Next.js, Vue, or any other framework
✗ Replace Supabase with another database
✗ Suggest GraphQL — REST is the standard here
✗ Add npm packages without explaining why first and asking
✗ Use `any` type in TypeScript — fix the actual type error
✗ Use localStorage — use @capacitor/preferences
✗ Hardcode Hindi strings — always use i18n keys
✗ Call external APIs directly from frontend — always via backend
✗ Log phone numbers, Aadhaar, or financial data to console or logs
✗ Skip debounce on search — 1 API call per search, not per keystroke
✗ Mark a task done before npm run build passes with 0 TypeScript errors
✗ Show English error messages to farmers — all errors must be in Hindi
✗ Build Phase 1+ features before Becho Ya Ruko is live and tested
✗ Hallucinate API endpoints — use only verified endpoints in this document
✗ Skip arrivals_in_qtl — it is the strongest free price prediction signal
✗ Hardcode MSP permanently — they expire every 6 months
✗ Use OpenWeatherMap — switch to Open-Meteo (free, no key, 16-day, better)
✗ Leave @supabase/supabase-js in devDependencies — it will crash production
✗ Build the NWR Pledge feature before Arhtiya Pro is revenue-generating
✗ Ignore data freshness — always show "आज का भाव" or "कल का भाव" badge
```

---

## SECTION 15 — TASK EXECUTION RULES

1. **Read before writing** — use filesystem MCP to read all files you'll touch first
2. **State the contract** — what does this task do? what's the failure mode? how do I verify?
3. **One task at a time** — complete, verify, commit before the next
4. **npm run build** after every change — zero TypeScript errors, no exceptions
5. **npx cap sync android** after every UI change
6. **Commit format:** `type(scope): [TASK N] description`
7. **Check CI** — via GitHub MCP after push. Never mark done if CI is red.
8. **Check DB** — via Postgres MCP after every migration. Verify row counts.
9. **Test endpoint** — via Fetch MCP before touching frontend. POST real payloads.
10. **Test at 360px** — every screen must work on small Android phones
11. **Missing API key?** — STOP. Ask. Never mock a key or hardcode a fallback.
12. **Missing data?** — Show a Hindi error state, not a blank white screen.

---

## SECTION 16 — DONE CHECKLIST (every commit, no exceptions)

```
□ npm run build → 0 TypeScript errors, 0 warnings that matter
□ npm test → 0 failing tests
□ Hindi text renders correctly (test in browser, not just code review)
□ 360px layout: no horizontal scroll, no broken layout
□ No API keys or secrets in frontend code
□ i18n keys added to both hi.json and en.json
□ npx cap sync android → no errors
□ Offline mode: cached data shown when API unreachable, Hindi error if none
□ GitHub Actions CI: green (check via GitHub MCP)
□ git commit with correct format: type(scope): [TASK N] description
```

---

## SECTION 17 — THE ONE QUESTION THAT OVERRIDES EVERYTHING

> **"Did any farmer in Haryana make more money this week because of KisanNiti?"**

Start every session by answering this.
If yes → what caused it? Double down. Tell that story to users and VCs.
If no → don't build more features. Find out why the recommendation didn't help. Fix the engine.

This question is not inspirational. It is the only metric that matters.
User count, DAU, revenue — all of these follow from this question being yes.

---

## SECTION 18 — CURRENT SPRINT STATUS

```
[x] TASK 1:  Fix debounce ✅
[x] TASK 2:  Fix console errors ✅
[x] TASK 3:  Mobile-first responsive layout ✅
[x] TASK 4:  Haryana primary crop filter ✅
[ ] TASK 5:  Last Updated timestamp banner ← START HERE RIGHT NOW
[ ] TASK 6:  Fix price history backfill
[ ] TASK 7:  BUILD BECHO YA RUKO PAGE ← THE ENTIRE POINT OF THE APP
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

## SECTION 19 — LATER PHASE FEATURES (do not build until instructed)
> These ideas are captured here so they are never lost.
> None of them are to be started until the exit gate of the phase they belong to is met.
> Gemini CLI: if you see a task below, ask which phase we are in before touching it.

---

### 19.1 — PHASE 3 ADDITION: KisanNiti WhatsApp Bot (no app needed)
**Unlock condition:** 1,000 DAU on Android app AND ₹1L MRR reached.
**Why it matters:** 70%+ of rural Haryana farmers already use WhatsApp daily.
A WhatsApp bot eliminates the app-install barrier entirely for distribution.
**What to build:**
- Twilio WhatsApp Business API (free sandbox, paid at scale) OR
  Meta Cloud API (free tier: 1,000 conversations/month)
- Farmer sends: "गेहूं Karnal 100 क्विंटल" in any format
- Bot replies with the Becho Ya Ruko result card as a formatted WhatsApp message
- No app install. No Play Store. No onboarding friction.
**Integration path:** Same backend POST /api/advisory/sell-hold endpoint.
Bot is just a new input channel, not a new feature.
**Do NOT build this before Phase 3 exit gate.** The Android app must prove
the recommendation works before distributing it over WhatsApp.

---

### 19.2 — PHASE 3 ADDITION: SMS Fallback for 2G / Feature Phone Users
**Unlock condition:** WhatsApp bot is live and showing retention.
**Why it matters:** Some Haryana villages have 2G only. WhatsApp does not load.
A simple SMS fallback covers 100% of mobile users regardless of data.
**What to build:**
- Twilio SMS API (or MSG91 for India — cheaper, ₹0.12/SMS)
- Farmer sends SMS: "SELL WHEAT KARNAL 100"
- System returns 2-SMS reply with decision + price range in Hindi
- Keyword parser in backend: no AI needed for parsing farmer SMS inputs
**Constraint:** SMS is one-way, no images. Response must be pure text ≤320 chars.
**Do NOT build before WhatsApp bot is proven.**

---

### 19.3 — PHASE 3 ADDITION: Arhtiya Pro Mobile App (separate from farmer app)
**Unlock condition:** 20+ paying Arhtiya Pro subscribers on web dashboard.
**Why it matters:** Arthiyas also use smartphones but want a dedicated tool,
not the farmer-facing app. Separate app signals professionalism and justifies ₹399/mo.
**What to build:**
- Separate Capacitor build from the same React codebase (different appId)
- AppID: com.kisanniti.arhtiya
- Features unique to Arhtiya Pro:
  - Client farmer list with each farmer's crop, quantity, advisory status
  - Bulk price alert: "Set alert when Karnal wheat crosses ₹2,500"
  - Settlement tracker: record which farmers have sold, at what price, commission earned
  - PDF generation: monthly farmer advisory report for arhtiya's records
- Revenue gate: Only release after ₹2L MRR proven from web dashboard subscriptions

---

### 19.4 — PHASE 3 ADDITION: Offline-First Mode with Background Sync
**Unlock condition:** 500+ DAU on Android AND at least 3 crash reports from network failures.
**Why it matters:** Haryana fields have spotty internet. The app must work offline
and sync when connectivity returns — like a field tool, not a web app.
**What to build:**
- Service Worker (already available via Capacitor) for asset caching
- Background sync via Capacitor Background Runner plugin
- IndexedDB (via Capacitor Preferences) for local price cache:
  - Last known mandi prices per district → show even without internet
  - Last Becho Ya Ruko result → show "as of [date]" badge
- On reconnect: auto-refresh prices, push queued advisory requests
- "ऑफलाइन" banner when no connection — Hindi, prominent, not a toast
**Do NOT over-engineer.** Cache the last 3 API responses per district. That is enough.

---

### 19.5 — PHASE 4 ADDITION: Punjab Expansion Playbook
**Unlock condition:** Haryana DAU > 5,000 AND Punjab-specific crop data researched.
**What changes for Punjab:**
- Same crops (Wheat, Paddy, Mustard) — same decision engine
- Different mandis: Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Ferozepur
- Different districts and GPS coordinates needed in HARYANA_MANDIS equivalent
- Same arhtiya system exists in Punjab → same B2B model applies
- Language: Punjabi option needed in addition to Hindi (i18next supports it)
- Regulatory: Punjab APMC rules differ from Haryana — research before launch
**Reuse:** Same backend, same Gemini prompt, same Supabase schema
**New work:** Punjab mandi coordinates, Punjabi i18n strings, Punjab-specific
             crop calendar (Punjab paddy harvest is 2 weeks earlier than Haryana)

---

### 19.6 — PHASE 4 ADDITION: Backtesting Engine (proof-of-value for VCs + media)
**Unlock condition:** 6 months of sell_hold_recommendations data in Supabase.
**Why it matters:** The single most powerful investor/media story is:
"If a Karnal wheat farmer had followed KisanNiti's advice in April 2025,
 they would have earned ₹127 more per quintal vs selling in the first week."
This requires building a backtesting engine against historical Agmarknet data.
**What to build:**
- Use UPAg / data.gov.in historical price data (free)
- Replay the Becho Ya Ruko algorithm against 5 years of weekly Haryana wheat prices
- Calculate: if farmer followed HOLD recommendation, what did they actually earn?
- Generate: "KisanNiti Accuracy Report" — quarterly PDF for press + investor decks
**Constraint:** Backtest only crops with 5+ years of Agmarknet data in Haryana.
Wheat and Paddy qualify. Mustard borderline. Do not backtest exotic crops.

---

### 19.7 — PHASE 4 ADDITION: KCC Loan Integration (Kisan Credit Card)
**Unlock condition:** NWR Pledge feature is live AND 50+ farmers have used it.
**Why it matters:** NWR pledging allows a farmer to borrow against stored grain.
The next step is making KCC loan application directly accessible from the app.
Currently, farmers must visit a bank branch to apply for KCC.
**What to build:**
- Partnership with: SBI YONO Agri, NABARD, or a cooperative bank in Karnal/Kaithal
- In-app KCC pre-qualification form: land holding, crop type, NWR reference number
- Link to partner bank's KCC application flow
- Revenue model: referral fee per approved loan (₹200-500 per loan from bank partner)
**Do NOT build the actual lending infrastructure.** We are a referral partner,
not an NBFC. Regulatory complexity of lending is outside our scope.

---

### 19.8 — LONG-TERM: Voice Interface in Hindi (IVR / Voice Bot)
**Unlock condition:** 10,000 DAU, ₹5L MRR proven, Series A raised.
**Why it matters:** Significant portion of Haryana farmers over 50 are not
comfortable with touchscreen typing — especially in Hindi Devanagari.
A voice interface ("Call 1800-XXX-XXXX, say your crop and district")
could 5x the total addressable market beyond smartphone users.
**Technology path:**
- IVR: Exotel or Servetel (India-focused, ₹0.50/min)
- Speech-to-text: Google Cloud STT supports Hindi (free tier 60 min/month)
- TTS: Google Cloud TTS Hindi voice for responses
- Same backend advisory endpoint — voice is just another input channel
**Constraint:** This requires dedicated ops team to handle IVR infrastructure.
Do not start before Series A and a dedicated ops hire.



---

## SECTION 19 — LATER PHASE FEATURES (captured for future, do not build yet)
> These are validated ideas parked here so they are never lost.
> Gemini CLI: DO NOT start any item below until the phase exit gate it belongs to is explicitly met.
> When in doubt, ask which phase we are currently in before touching anything here.

---

### 19.1 — PHASE 3: KisanNiti WhatsApp Bot
**Unlock condition:** 1,000 DAU on Android app AND Phase 2 exit gate met.
**Why:** 70%+ of rural Haryana farmers already use WhatsApp daily.
A WhatsApp bot removes the app-install barrier entirely — the single biggest distribution friction.
**What to build:**
- Meta Cloud API (free: 1,000 conversations/month) OR Twilio WhatsApp Business sandbox
- Farmer sends any message: "गेहूं Karnal 100 क्विंटल"
- Bot replies with Becho Ya Ruko result as a formatted WhatsApp message
- No app install. No Play Store. No onboarding friction.
- Integration: Same POST /api/advisory/sell-hold endpoint. Bot is just a new input channel.
**Do NOT build before Phase 2 exit gate.** Android app must prove value first.

---

### 19.2 — PHASE 3: SMS Fallback for 2G / Feature Phone Users
**Unlock condition:** WhatsApp bot is live and showing retention.
**Why:** Some Haryana villages are 2G only. WhatsApp does not load on 2G.
SMS covers 100% of mobile users regardless of data speed.
**What to build:**
- MSG91 SMS API (India-focused, ~₹0.12/SMS — cheaper than Twilio)
- Keyword parser: farmer SMS "SELL WHEAT KARNAL 100" → advisory response
- Reply in pure Hindi text ≤320 chars (2 SMS max)
- No AI needed for parsing — simple keyword extraction
**Do NOT build before WhatsApp bot is proven working.**

---

### 19.3 — PHASE 3: Arhtiya Pro Mobile App (separate from farmer app)
**Unlock condition:** 20+ paying Arhtiya Pro subscribers on the web dashboard.
**Why:** Arthiyas want a dedicated professional tool, not the farmer app.
A separate app signals professionalism and justifies the ₹399/month subscription.
**What to build:**
- Separate Capacitor build from same React codebase (appId: com.kisanniti.arhtiya)
- Features unique to arthiyas:
  - Client farmer list: crop, quantity, advisory status per farmer
  - Bulk price alert: "Notify me when Karnal wheat crosses ₹2,500"
  - Settlement tracker: sold/unsold per farmer, commission earned
  - PDF export: monthly advisory summary for arhtiya's records
**Do NOT build before ₹2L MRR proven from web dashboard.**

---

### 19.4 — PHASE 3: Offline-First Mode with Background Sync
**Unlock condition:** 500+ DAU on Android AND 3+ reported crashes from network failure.
**Why:** Haryana fields have spotty coverage. The app must work offline like a field tool.
**What to build:**
- Service Worker (Capacitor) for asset caching
- Capacitor Background Runner for background sync on reconnect
- Local cache (Capacitor Preferences): last known prices per district + last advisory result
- "ऑफलाइन" banner in Hindi when disconnected — not a toast, a persistent banner
- On reconnect: auto-refresh prices, push any queued advisory requests
**Constraint:** Cache the last 3 API responses per district. Nothing more complex.

---

### 19.5 — PHASE 4: Punjab Expansion
**Unlock condition:** Haryana DAU > 5,000 AND Punjab crop data fully researched.
**What changes:**
- Same crops (Wheat, Paddy, Mustard) and same advisory engine — no changes needed
- New mandi list: Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Ferozepur
- New district GPS coordinates (for Open-Meteo)
- Punjabi language option needed (i18next supports it — add pu.json)
- Punjab paddy harvest is ~2 weeks earlier than Haryana — update crop calendar
- Punjab APMC rules differ from Haryana — legal review required before launch
**Reuse everything:** Same backend, same Supabase schema, same Gemini prompt.
**New work:** Mandi coordinates, Punjabi i18n, crop calendar delta, APMC compliance check.

---

### 19.6 — PHASE 4: Backtesting Engine (proof-of-value for VCs and media)
**Unlock condition:** 6 months of sell_hold_recommendations data in Supabase.
**Why:** The most powerful investor story is a number:
"A Karnal wheat farmer following KisanNiti in April 2025 would have earned
₹127 more per quintal than one who sold in the first week."
**What to build:**
- Pull 5 years of Agmarknet historical Haryana wheat and paddy prices (free via data.gov.in)
- Replay the Becho Ya Ruko algorithm week-by-week against historical data
- Calculate actual outcome vs algorithm recommendation
- Generate: "KisanNiti Accuracy Report" — quarterly — for press kit and investor decks
**Only backtest:** Wheat and Paddy (5+ years of reliable Haryana Agmarknet data).

---

### 19.7 — PHASE 4: KCC Loan Integration (Kisan Credit Card)
**Unlock condition:** NWR Pledge feature live AND 50+ farmers have used it.
**Why:** After pledging grain to a warehouse (NWR), the natural next step is a KCC loan.
Currently farmers must visit a bank branch. We can make it one tap.
**What to build:**
- Partner with: SBI YONO Agri, NABARD, or a Karnal/Kaithal cooperative bank
- In-app KCC pre-qualification form (land holding, crop, NWR reference)
- Link to partner bank's KCC application flow
- Revenue: referral fee per approved loan (₹200–500 per loan from bank partner)
**Hard constraint:** We are a referral channel only. We do not lend, hold deposits,
or touch any money. Becoming an NBFC is regulatory complexity we never take on.

---

### 19.8 — LONG TERM: Hindi Voice Interface / IVR
**Unlock condition:** 10,000 DAU, ₹5L MRR, Series A closed.
**Why:** Significant % of Haryana farmers over 50 are not comfortable typing
in Hindi Devanagari on a touchscreen. Voice ("Call 1800-XXX-XXXX, say your crop
and district") can 5x the addressable market to include feature phone users.
**Technology path:**
- IVR: Exotel or Servetel (India, ~₹0.50/min)
- Speech-to-text: Google Cloud STT Hindi (free 60 min/month, then pay-as-you-go)
- TTS: Google Cloud TTS Hindi WaveNet voice
- Same backend advisory endpoint — voice is just another input channel
**Hard constraint:** Requires a dedicated ops hire to manage IVR infrastructure.
Do not start before Series A and that hire are both confirmed.
