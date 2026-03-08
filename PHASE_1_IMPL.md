# KisanNiti — Phase 1 Implementation Details

This document outlines the technical improvements and new features implemented during Phase 1.

## 🛠️ Technical Improvements

### 1. Infrastructure Upgrade (Node 20)
- **Problem**: `@supabase/supabase-js` and other libraries were warning about Node 18 deprecation and strict engine requirements.
- **Solution**: Upgraded all Dockerfiles (`server`, `client`, and root) to **Node 20-alpine**. This ensures long-term support and compatibility with React 19 and the latest Supabase client.

### 2. Clean Build Pipeline (CI Integration)
- **Problem**: Previous builds had linting warnings (unused variables) which blocked the production pipeline (`CI=true`).
- **Solution**: 
  - Systematic cleanup of all unused imports and variables in `BechoYaRuko.tsx`, `FarmerOnboarding.tsx`, `MandiPrices.tsx`, `Weather.tsx`, and `SchemeChecker.tsx`.
  - Added `--legacy-peer-deps` to all `npm install` commands in Dockerfiles to match the local development environment.
  - Verified local build with `$env:CI="true"; npm run build` before pushing.

### 3. Data Integrity & Sync Optimization
- **Problem**: The background sync was reporting Postgres conflict errors: `ON CONFLICT DO UPDATE command cannot affect row a second time`.
- **Solution**: Implemented **In-Memory Deduplication** in the `MandiService` batch processor. Before sending records to Supabase, we now filter the array to ensure only the most unique/recent record for a specific Mandi+Crop+Variety+Date combination is upserted.

## 🌟 New Features

### 1. Scheme Entitlement Checker (P1-5)
- **Functionality**: A new navigation tab "योजनाएं" (Schemes).
- **Interactive Form**: Farmers answer 5 simple "Yes/No" questions about land ownership, residency, and bank details.
- **Eligibility Engine**: Real-time matching against major schemes:
  - **PM-KISAN**: Income support check.
  - **PMFBY**: Crop insurance risk assessment.
  - **KCC**: Farming credit eligibility.
  - **Mera Pani Meri Virasat**: Haryana-specific crop diversification incentive.
- **Data-Driven**: Managed via the `scheme_rules` table in Supabase.

### 2. Market Direction Sparklines (P1-10)
- **Visual Intelligence**: Added a 7-day price trend sparkline directly onto every Mandi Price card.
- **UX Impact**: Farmers can now see if the price is trending up or down without clicking into details, allowing for faster scanning of the market.

### 3. Enterprise Analytics (P1-9)
- **Tracking**: Integrated an anonymous, privacy-first event tracking system.
- **Metrics**: Captures `page_view`, `advisory_requested`, `profile_activated`, and `scheme_checked` events.
- **Persistence**: All events are logged to the `app_events` table in Supabase for DAU calculation.

### 4. Performance Optimization: Sparkline Lazy-Loading
- **Problem**: Adding 7-day sparklines to every Mandi card triggered 100+ simultaneous API calls on page load, causing 429 (Too Many Requests) errors and significant UI lag.
- **Solution**: Implemented **Intersection Observer** (via `react-intersection-observer`). Sparkline data is now only fetched when a card actually enters the user's viewport.
- **Result**: Initial page load now triggers **Zero** history calls. Data is fetched smoothly as the user scrolls, protecting the backend and ensuring a fluid 60fps experience.

---
*Verified and Built by Gemini CLI Staff Engineering Agent.*
