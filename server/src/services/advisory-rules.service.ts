// server/src/services/advisory-rules.service.ts
// Pure logic. No API calls. No imports from external services.
// Fully unit-testable. Works offline. Zero cost.

export interface RuleInputs {
  arrivalSignal: 'ABOVE_NORMAL' | 'NORMAL' | 'BELOW_NORMAL';
  priceTrend7d: number;        // ₹ change: positive = rising, negative = falling
  rainDaysNext14: number;      // from Open-Meteo daily precipitation_sum > 2mm
  urgency: 'now' | '2weeks' | 'flexible';
  priceAboveMSPPct: number;    // ((currentPrice - msp) / msp) * 100 — can be negative
  storageCostPerDay: number;   // ₹/quintal/day
  quantity: number;            // quintals
  cropType: string;
  currentPrice: number;        // modal price avg across mandis
}

export interface RuleOutput {
  decision: 'SELL_NOW' | 'HOLD_7_DAYS' | 'HOLD_14_DAYS' | 'PARTIAL_SELL';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_price_min: number;
  expected_price_max: number;
  hindi_reason: string;
  risk_note: string;
  net_score: number;           // expose this so hybrid engine can decide whether to call Gemini
  used_rules: boolean;         // always true for this engine
}

// Rain threshold above which crop quality degrades — crop-specific
const RAIN_RISK_THRESHOLD: Record<string, number> = {
  'Paddy':   3,   // wet paddy rejected at MSP procurement
  'Cotton':  4,   // humidity causes 2-3% weekly depreciation
  'Maize':   3,   // aflatoxin risk
  'Wheat':   7,   // stable in dry storage, high threshold
  'Mustard': 7,
  'Bajra':   5,
  'Gram':    6,
  'Barley':  7,
  'Sunflower': 5,
};

export function ruleBasedDecision(inputs: RuleInputs): RuleOutput {
  const {
    arrivalSignal, priceTrend7d, rainDaysNext14, urgency,
    priceAboveMSPPct, storageCostPerDay, quantity, cropType, currentPrice
  } = inputs;

  let sellScore = 0;
  let holdScore = 0;

  // --- SIGNAL 1: Arrival quantity (strongest signal, weight 3) ---
  // High arrivals = oversupply = prices fall in 2-3 days
  if (arrivalSignal === 'ABOVE_NORMAL') sellScore += 3;
  if (arrivalSignal === 'BELOW_NORMAL') holdScore += 3;
  // NORMAL: neutral, slight lean toward sell (time = storage cost)
  if (arrivalSignal === 'NORMAL') sellScore += 1;

  // --- SIGNAL 2: 7-day price trend (weight 2) ---
  if (priceTrend7d > 60)          holdScore += 2;  // strong momentum, keep riding
  else if (priceTrend7d > 20)     holdScore += 1;  // modest uptrend
  else if (priceTrend7d < -60)    sellScore += 2;  // falling fast, cut losses
  else if (priceTrend7d < -20)    sellScore += 1;  // modest downtrend
  // -20 to +20: flat, no signal

  // --- SIGNAL 3: Rain / crop quality risk (weight 2) ---
  const threshold = RAIN_RISK_THRESHOLD[cropType] ?? 5;
  if (rainDaysNext14 > threshold) sellScore += 2;  // quality degrades in storage
  else if (rainDaysNext14 <= 1)   holdScore += 1;  // dry = safe to hold

  // --- SIGNAL 4: MSP buffer (weight 1) ---
  // Well above MSP = safe to wait. Near/below MSP = sell now, floor is here.
  if (priceAboveMSPPct > 10)      holdScore += 1;
  if (priceAboveMSPPct < 2)       sellScore += 2;  // near MSP floor, govt won't let it go lower
  if (priceAboveMSPPct < 0)       sellScore += 1;  // below MSP, sell at MSP procurement instead

  // --- SIGNAL 5: Urgency (weight 3) ---
  if (urgency === 'now')       sellScore += 3;
  if (urgency === '2weeks')    sellScore += 1;
  if (urgency === 'flexible')  holdScore += 1;

  // --- SIGNAL 6: Storage cost vs potential gain (weight 1) ---
  // If holding 7 days costs more than realistic upside, sell
  const storageCost7d = storageCostPerDay * 7 * quantity;
  const realisticUpside7d = priceTrend7d > 0 ? (priceTrend7d * quantity) : 0;
  if (storageCost7d > realisticUpside7d && urgency !== 'flexible') {
    sellScore += 1;
  }

  // --- MAP SCORES TO DECISION ---
  const net = holdScore - sellScore; // positive = lean hold, negative = lean sell

  let decision: RuleOutput['decision'];
  if      (net >= 4)  decision = 'HOLD_14_DAYS';
  else if (net >= 2)  decision = 'HOLD_7_DAYS';
  else if (net <= -3) decision = 'SELL_NOW';
  else                decision = 'PARTIAL_SELL';  // -2 to +1: mixed

  // --- CONFIDENCE based on signal strength ---
  // Will be overridden by staleness penalty later if data is old
  let confidence: RuleOutput['confidence'];
  if (Math.abs(net) >= 4) confidence = 'HIGH';
  else if (Math.abs(net) >= 2) confidence = 'MEDIUM';
  else confidence = 'LOW';  // net = -1, 0, or +1 — genuinely uncertain

  // --- PRICE RANGE ESTIMATE ---
  const trend = priceTrend7d;
  const expected_price_min = Math.round(
    currentPrice + (trend < 0 ? Math.max(trend * 1.5, -200) : 0)
  );
  const expected_price_max = Math.round(
    currentPrice + (trend > 0 ? Math.min(trend * 1.5, 300) : 0)
  );

  // --- HINDI REASON (template-based) ---
  const hindi_reason = buildHindiReason({
    decision, arrivalSignal, priceTrend7d, rainDaysNext14, cropType,
    priceAboveMSPPct, urgency
  });
  const risk_note = buildRiskNote({ decision, cropType, rainDaysNext14, urgency, net });

  return {
    decision, confidence,
    expected_price_min, expected_price_max,
    hindi_reason, risk_note,
    net_score: net,
    used_rules: true
  };
}

// --- HINDI REASON BUILDER ---
// Each sentence maps to a real signal. No hallucination possible.

interface ReasonParams {
  decision: string;
  arrivalSignal: string;
  priceTrend7d: number;
  rainDaysNext14: number;
  cropType: string;
  priceAboveMSPPct: number;
  urgency: string;
}

function buildHindiReason(p: ReasonParams): string {
  const sentences: string[] = [];

  // Sentence 1: Arrival signal
  const arrivalSentence = {
    'ABOVE_NORMAL': 'मंडी में आज आवक सामान्य से ज़्यादा है, जिससे भाव पर दबाव है।',
    'BELOW_NORMAL': 'मंडी में आज आवक सामान्य से कम है — यह भाव के लिए अच्छा संकेत है।',
    'NORMAL':       'मंडी में आज आवक सामान्य है।'
  }[p.arrivalSignal as 'ABOVE_NORMAL' | 'BELOW_NORMAL' | 'NORMAL'] ?? 'आवक की स्थिति सामान्य है।';
  sentences.push(arrivalSentence);

  // Sentence 2: Price trend
  if (p.priceTrend7d > 30) {
    sentences.push(`पिछले 7 दिनों में भाव ₹${Math.round(p.priceTrend7d)} बढ़ा है।`);
  } else if (p.priceTrend7d < -30) {
    sentences.push(`पिछले 7 दिनों में भाव ₹${Math.round(Math.abs(p.priceTrend7d))} गिरा है।`);
  } else {
    sentences.push('पिछले 7 दिनों में भाव लगभग स्थिर रहा है।');     
  }

  // Sentence 3: Weather or MSP context (whichever is more relevant)
  const threshold = RAIN_RISK_THRESHOLD[p.cropType] ?? 5;
  if (p.rainDaysNext14 > threshold) {
    const cropRisk: Record<string, string> = {
      'Paddy':   'गीला धान सरकारी खरीद केंद्र पर अस्वीकृत हो सकता है।',
      'Cotton':  'नमी से कपास की गुणवत्ता घटती है।',
      'Maize':   'नमी में मक्के में aflatoxin का खतरा है।',
    };
    const riskMsg = cropRisk[p.cropType] ?? 'भंडारण में फसल खराब होने का खतरा है।';
    sentences.push(`अगले 14 दिनों में ${p.rainDaysNext14} बारिश के दिन संभव हैं — ${riskMsg}`);
  } else if (p.priceAboveMSPPct < 2) {
    sentences.push(`भाव MSP के बहुत करीब है — सरकारी खरीद केंद्र पर MSP पर बेचना बेहतर हो सकता है।`);
  } else if (p.urgency === 'now') {
    sentences.push('आपको अभी पैसों की ज़रूरूत है — इसे ध्यान में रखते हुए सुझाव दिया गया है।');
  } else {
    sentences.push('मौसम अभी सुरक्षित है।');
  }

  return sentences.join(' ');
}

function buildRiskNote(p: {
  decision: string;
  cropType: string;
  rainDaysNext14: number;
  urgency: string;
  net: number;
}): string {
  if (p.decision === 'SELL_NOW' && p.urgency !== 'now') {
    return 'भाव कल अचानक बदल सकता है — मंडी में जाकर ही फैसला करें।';
  }
  if (p.decision === 'HOLD_14_DAYS' && p.rainDaysNext14 > 4) {
    return `${p.cropType} को 14 दिनों की बारिश में नुकसान हो सकता है।`;
  }
  if (p.decision === 'PARTIAL_SELL') {
    return 'संकेत मिश्रित हैं — आधा बेचकर जोखिम कम करें।';
  }
  if (Math.abs(p.net) <= 1) {
    return 'भाव की स्थिति अनिश्चित है — अपने आढ़ती से भी सलाह लें।';
  }
  return 'मंडी में भाव रोज़ बदलते हैं — 2-3 दिन में स्थिति जाँचते रहें।';
}
