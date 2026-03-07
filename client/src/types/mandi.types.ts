export interface MandiPrice {
  commodity: string;
  market: string;
  variety: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrivals_in_qtl?: number;
  arrival_date: string;
  state: string;
  district: string;
}

export interface HistoricalPrice {
  arrival_date: string;
  modal_price: number;
  arrivals_in_qtl?: number;
}

export type UnitType = 'quintal' | 'maund' | 'kg';
