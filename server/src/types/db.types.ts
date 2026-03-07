export interface MandiRecord {
  id?: string;
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
  fetch_timestamp?: string;
}

export interface UserPreference {
  id?: number;
  type: 'commodity' | 'market';
  value: string;
}

export interface WeatherResponse {
  temp: number;
  condition: string;
  district: string;
  is_mock: boolean;
}

export interface ApiResponse<T> {
  source: string;
  count?: number;
  records: T[];
  updatedAt?: string;
}

export interface SellHoldResponse {
  decision: "SELL_NOW" | "HOLD_7_DAYS" | "HOLD_14_DAYS" | "PARTIAL_SELL";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  expected_price_min: number;
  expected_price_max: number;
  hindi_reason: string;
  risk_note: string;
}
