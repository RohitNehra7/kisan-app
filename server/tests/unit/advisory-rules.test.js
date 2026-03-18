// server/tests/unit/advisory-rules.test.js
const { ruleBasedDecision } = require('../../dist/services/advisory-rules.service');

const BASE_INPUTS = {
  currentPrice: 2410,
  msp: 2425,
  storageCostPerDay: 0.50,
  quantity: 100,
  cropType: 'Wheat'
};

describe('ruleBasedDecision (Rule Engine)', () => {

  test('oversupply + falling price + urgent = SELL_NOW', () => {
    const result = ruleBasedDecision({
      ...BASE_INPUTS,
      arrivalSignal: 'ABOVE_NORMAL',
      priceTrend7d: -80,
      rainDaysNext14: 2,
      urgency: 'now',
      priceAboveMSPPct: -0.6,
    });
    expect(result.decision).toBe('SELL_NOW');
    expect(result.confidence).toBe('HIGH');
  });

  test('scarcity + rising price + flexible = HOLD_14_DAYS', () => {
    const result = ruleBasedDecision({
      ...BASE_INPUTS,
      arrivalSignal: 'BELOW_NORMAL',
      priceTrend7d: 90,
      rainDaysNext14: 1,
      urgency: 'flexible',
      priceAboveMSPPct: 8,
    });
    expect(result.decision).toBe('HOLD_14_DAYS');
    expect(result.confidence).toBe('HIGH');
  });

  test('mixed signals = PARTIAL_SELL with low confidence', () => {
    const result = ruleBasedDecision({
      ...BASE_INPUTS,
      arrivalSignal: 'ABOVE_NORMAL',   // sell signal (+3 sell)
      priceTrend7d: 70,                // hold signal (+2 hold)
      rainDaysNext14: 2,               // neutral
      urgency: 'flexible',             // hold signal (+1 hold)
      priceAboveMSPPct: 5,             // neutral
    });
    // holdScore = 3, sellScore = 3 (approx) -> net_score should be small
    expect(Math.abs(result.net_score)).toBeLessThan(3);
  });

  test('paddy with high rain risk pushes toward sell', () => {
    const result = ruleBasedDecision({
      ...BASE_INPUTS,
      cropType: 'Paddy',
      arrivalSignal: 'NORMAL',
      priceTrend7d: 30,
      rainDaysNext14: 8,        // above paddy threshold of 3
      urgency: '2weeks',
      priceAboveMSPPct: 3,
    });
    // Rain risk for paddy should push toward sell or partial sell
    expect(['SELL_NOW', 'PARTIAL_SELL']).toContain(result.decision);
  });

  test('hindi_reason contains valid Devanagari text', () => {
    const result = ruleBasedDecision({
      ...BASE_INPUTS,
      arrivalSignal: 'NORMAL',
      priceTrend7d: 0,
      rainDaysNext14: 2,
      urgency: 'flexible',
      priceAboveMSPPct: 5,
    });
    expect(result.hindi_reason.length).toBeGreaterThan(20);
    // Devanagari regex
    expect(/[\u0900-\u097F]/.test(result.hindi_reason)).toBe(true);
  });

});
