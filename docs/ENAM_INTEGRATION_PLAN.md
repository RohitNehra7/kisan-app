# KisanNiti — eNAM Integration Strategy (Phase 2)

## 1. Objective
Transition from Agmarknet (same-evening lag) to eNAM (near-real-time auction prices) for Tier 1 Mandis in Haryana and Punjab.

## 2. Technical Architecture
- **Primary Source**: eNAM API (Bearer Auth).
- **Secondary Source**: Agmarknet (Data.gov.in) as fallback for non-eNAM mandis.
- **Cache**: Supabase `prices` table (15-minute refresh during auction hours: 8 AM – 3 PM).

## 3. Data Freshness Hierarchy
1. **eNAM ✓**: Real-time auction data (High Trust).
2. **Today ✓**: Agmarknet daily report (Medium Trust).
3. **Yesterday**: Stale data (Fallback).

## 4. Key Tier 1 eNAM Mandis
- Haryana: Karnal, Ambala City, Hisar, Kaithal, Sirsa.
- Punjab: Rajpura, Mansa, Khanna.

## 5. Integration Tasks
- [ ] Obtain API credentials from SFAC (Small Farmers' Agribusiness Consortium).
- [ ] Build `EnamService.ts` with token-refresh logic.
- [ ] Map eNAM `mandi_id` to our existing `mandi_directory`.
- [ ] Update UI to show "Live Auction Price" badge.

---
*Verified and Planned by Gemini CLI Staff Engineering Agent.*
