export interface MandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrivals_in_qtl?: number;
}

export interface HistoricalPrice {
  arrival_date: string;
  modal_price: number;
  arrivals_in_qtl?: number;
}

export interface SellHoldRequest {
  crop: string;
  quantity: number;
  district: string;
  storageCostPerDay: number;
  urgency: 'now' | '2weeks' | 'flexible';
}

export interface SellHoldRecommendation {
  decision: "SELL_NOW" | "HOLD_7_DAYS" | "HOLD_14_DAYS" | "PARTIAL_SELL";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  expected_price_min: number;
  expected_price_max: number;
  hindi_reason: string;
  risk_note: string;
}
