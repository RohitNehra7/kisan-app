// server/src/services/advisory-rules.service.ts
// No API call. No cost. Deterministic. Testable.

export interface DecisionInputs {
  arrivalSignal: 'ABOVE_NORMAL' | 'NORMAL' | 'BELOW_NORMAL';
  dataAgeDays: number;
  urgency: 'now' | '2weeks' | 'flexible';
  priceTrend7d: number;       // ₹ change over 7 days (positive = rising)
  priceAboveMSPPct: number;   // % above MSP (can be negative)
  rainDaysNext14: number;     // from Open-Meteo
  cropType: string;
  storageCostPerDay: number;
  quantity: number;
}

export interface DecisionOutput {
  decision: 'SELL_NOW' | 'HOLD_7_DAYS' | 'HOLD_14_DAYS' | 'PARTIAL_SELL';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_price_min: number;
  expected_price_max: number;
  hindi_reason: string;
  risk_note: string;
  net_score: number;         // for internal tracking
}

export function ruleBasedDecision(inputs: DecisionInputs, currentPrice: number): DecisionOutput {
  const {
    arrivalSignal, dataAgeDays, urgency, priceTrend7d,
    priceAboveMSPPct, rainDaysNext14, cropType, storageCostPerDay, quantity
  } = inputs;

  // --- Score signals ---
  let sellScore = 0;   // higher = lean SELL
  let holdScore = 0;   // higher = lean HOLD

  // Arrival signal (strongest signal)
  if (arrivalSignal === 'ABOVE_NORMAL') sellScore += 3;   // oversupply → prices falling
  if (arrivalSignal === 'BELOW_NORMAL') holdScore += 3;   // scarcity → prices rising
  if (arrivalSignal === 'NORMAL') { sellScore += 1; holdScore += 1; }

  // Price trend
  if (priceTrend7d < -50) sellScore += 2;    // falling fast → sell before it drops more
  if (priceTrend7d > 50)  holdScore += 2;    // rising → momentum in your favour
  if (priceTrend7d > 0 && priceTrend7d <= 50) holdScore += 1;
  if (priceTrend7d < 0 && priceTrend7d >= -50) sellScore += 1;

  // MSP gap
  if (priceAboveMSPPct > 10) holdScore += 1;   // well above MSP → can afford to wait
  if (priceAboveMSPPct < 2)  sellScore += 2;   // near/below MSP → government floor, sell now

  // Weather / crop quality risk
  const cropRainyDayThreshold: Record<string, number> = {
    'Paddy': 3, 'Cotton': 4, 'Maize': 3, 'Wheat': 6, 'Mustard': 6
  };
  const threshold = cropRainyDayThreshold[cropType] || 5;
  if (rainDaysNext14 > threshold) sellScore += 2;   // rain risk → quality degradation
  if (rainDaysNext14 <= 2) holdScore += 1;          // dry → safe to store

  // Urgency
  if (urgency === 'now') sellScore += 3;
  if (urgency === '2weeks') sellScore += 1;
  if (urgency === 'flexible') holdScore += 1;

  // Storage cost eating into potential gain
  const storageCost7d = storageCostPerDay * 7 * quantity;
  const potentialGainPerQ = priceTrend7d > 0 ? priceTrend7d : 0;
  const totalPotentialGain = potentialGainPerQ * quantity;
  if (storageCost7d > totalPotentialGain && urgency !== 'flexible') sellScore += 1;

  // --- Map scores to decision ---
  const net = holdScore - sellScore;
  let decision: DecisionOutput['decision'];
  if (net >= 4) decision = 'HOLD_14_DAYS';
  else if (net >= 2) decision = 'HOLD_7_DAYS';
  else if (net <= -2) decision = 'SELL_NOW';
  else decision = 'PARTIAL_SELL';  // mixed signals

  // --- Confidence ---
  let confidence: DecisionOutput['confidence'] = 'HIGH';
  if (dataAgeDays >= 2) confidence = 'LOW';
  else if (dataAgeDays === 1 || Math.abs(net) <= 2) confidence = 'MEDIUM';

  // --- Price range estimate ---
  const expected_price_min = Math.round(currentPrice + (priceTrend7d > 0 ? 0 : priceTrend7d));
  const expected_price_max = Math.round(currentPrice + (priceTrend7d > 0 ? priceTrend7d * 1.5 : 0));

  // --- Hindi reason (template-based, no AI) ---
  const hindi_reason = buildHindiReason(decision, arrivalSignal, priceTrend7d, rainDaysNext14, cropType, priceAboveMSPPct);
  const risk_note = buildRiskNote(decision, cropType, rainDaysNext14, urgency);

  return { 
    decision, 
    confidence, 
    expected_price_min, 
    expected_price_max, 
    hindi_reason, 
    risk_note,
    net_score: net
  };
}

function buildHindiReason(
  decision: string,
  arrivalSignal: string,
  priceTrend: number,
  rainDays: number,
  crop: string,
  mspPct: number
): string {
  const arrivalText = {
    'ABOVE_NORMAL': 'मंडी में आज आवक सामान्य से ज़्यादा है, जिससे भाव पर दबाव है।',
    'BELOW_NORMAL': 'मंडी में आज आवक सामान्य से कम है, जो भाव के लिए अच्छा संकेत है।',
    'NORMAL':       'मंडी में आज आवक सामान्य है।'
  }[arrivalSignal as 'ABOVE_NORMAL' | 'NORMAL' | 'BELOW_NORMAL'] ?? 'आवक की स्थिति सामान्य है।';

  const trendText = priceTrend > 30
    ? `पिछले 7 दिनों में भाव ₹${Math.abs(priceTrend)} बढ़ा है।`
    : priceTrend < -30
    ? `पिछले 7 दिनों में भाव ₹${Math.abs(priceTrend)} गिरा है।`
    : 'पिछले 7 दिनों में भाव स्थिर है।';

  const weatherText = rainDays > 4
    ? `अगले 14 दिनों में ${rainDays} दिन बारिश संभव है — ${crop === 'Paddy' ? 'गीला धान MSP पर अस्वीकृत हो सकता है।' : 'भंडारण जोखिम है।'}`
    : 'मौसम सुरक्षित है।';

  return `${arrivalText} ${trendText} ${weatherText}`;
}

function buildRiskNote(decision: string, crop: string, rainDays: number, urgency: string): string {
  if (decision === 'SELL_NOW' && urgency !== 'now') return 'बाजार भाव अचानक बदल सकता है।';
  if (decision === 'HOLD_14_DAYS' && rainDays > 4) return `${crop} को बारिश में नुकसान हो सकता है।`;
  if (decision === 'PARTIAL_SELL') return 'आधा अभी बेचें — आधे का जोखिम खुद उठाएं।';
  return 'मंडी में भाव रोज़ बदलते हैं।';
}
