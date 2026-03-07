import { useQuery } from '@tanstack/react-query';
import { fetchMandiPrices, fetchMandiHistory } from '../services/mandi.service';
import type { MandiPrice, HistoricalPrice } from '../types/mandi.types';

interface UseMandiPricesOptions {
  state?: string;
  commodity?: string;
  limit?: number;
  enabled?: boolean;
}

export function useMandiPrices({
  state,
  commodity,
  limit = 1000,
  enabled = true,
}: UseMandiPricesOptions) {
  return useQuery<MandiPrice[], Error>({
    queryKey: ['mandi-prices', state, commodity, limit],
    queryFn: () => fetchMandiPrices({ state, commodity, limit }),
    staleTime: 1000 * 60 * 30,    // 30 min
    gcTime: 1000 * 60 * 60,       // 1 hour
    retry: 2,
    enabled: enabled && (!!state || !!commodity),
  });
}

export function useMandiHistory(
  market: string,
  commodity: string,
  enabled: boolean = false
) {
  return useQuery<HistoricalPrice[], Error>({
    queryKey: ['mandi-history', market, commodity],
    queryFn: () => fetchMandiHistory(market, commodity),
    staleTime: 1000 * 60 * 60,    // 1 hour
    retry: 1,
    enabled: enabled && !!market && !!commodity,
  });
}
