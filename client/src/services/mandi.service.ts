import axios from 'axios';
import { API_BASE } from './api';
import type { MandiPrice, HistoricalPrice } from '../types/mandi.types';

interface FetchMandiPricesParams {
  state?: string;
  commodity?: string;
  market?: string;
  limit?: number;
}

export const fetchMandiPrices = async ({
  state,
  commodity,
  market,
  limit = 1000,
}: FetchMandiPricesParams): Promise<MandiPrice[]> => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/mandi/prices`, {
      params: { state, commodity, market, limit },
    });
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error ?? 'Failed to fetch mandi prices');
    }
    throw error;
  }
};

export const fetchMandiHistory = async (
  market: string,
  commodity: string
): Promise<HistoricalPrice[]> => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/mandi/history`, {
      params: { market, commodity },
    });
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error ?? 'Failed to fetch history');
    }
    throw error;
  }
};

export const fetchStates = async (): Promise<string[]> => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/mandi/metadata/states`);
    return data.data;
  } catch (error) {
    console.error('Failed to fetch states', error);
    return ["Haryana", "Punjab", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh"];
  }
};

export const fetchMarkets = async (state: string): Promise<string[]> => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/mandi/metadata/markets`, {
      params: { state },
    });
    return data.data;
  } catch (error) {
    console.error('Failed to fetch markets', error);
    return [];
  }
};

export const fetchCommodities = async (state: string, market: string): Promise<string[]> => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/mandi/metadata/commodities`, {
      params: { state, market },
    });
    return data.data;
  } catch (error) {
    console.error('Failed to fetch commodities', error);
    return [];
  }
};
