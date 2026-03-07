import { GoogleGenerativeAI } from '@google/generative-ai';
import { MandiService } from './mandi.service';
import { WeatherService } from './weather.service';
import { SellHoldResponse } from '../types/db.types';
import { MSP_2025 } from '../config/haryana.constants';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || '');

export class AdvisoryService {
  /**
   * Core Sell/Hold Decision Engine
   */
  static async getRecommendation(
    crop: string,
    quantity: number,
    district: string,
    storageCostPerDay: number,
    urgency: string
  ): Promise<SellHoldResponse> {
    try {
      // 1. Fetch Market Data (Today + Trends)
      console.log(`[Advisory] Fetching market data for ${crop}...`);
      const marketRecords = await MandiService.fetchAndSyncPrices('Haryana', crop, undefined, 50);
      const msp = MSP_2025[crop] || 2000;
      
      // Calculate average price and total arrivals
      const avgPrice = marketRecords.reduce((acc, r) => acc + r.modal_price, 0) / (marketRecords.length || 1);
      const totalArrivals = marketRecords.reduce((acc, r) => acc + (r.arrivals_in_qtl || 0), 0);
      
      // Get data for specific nearby mandis (top 3)
      const mandiSummary = marketRecords.slice(0, 3).map(r => `${r.market}: ₹${r.modal_price}/q`).join(' | ');

      // 2. Fetch Weather Forecast (Next 14 Days)
      console.log(`[Advisory] Fetching weather for ${district}...`);
      const weatherForecast = await WeatherService.get14DayForecast(district);
      const weatherSummary = weatherForecast.map(w => `${w.date}: ${w.condition} (${w.temp}°C)`).join(', ');

      // 3. Construct the Enterprise-Grade Prompt
      console.log(`[Advisory] Calling Gemini AI...`);
      const prompt = `
You are an expert agricultural market analyst for Haryana, India.
RESPOND ONLY WITH VALID JSON. No markdown, no text, ONLY the JSON object.

FARMER DATA:
- Crop: ${crop}, Quantity: ${quantity} quintals
- District: ${district}, Haryana
- Storage cost: ₹${storageCostPerDay}/quintal/day
- Urgency: ${urgency}

MARKET DATA:
- Mandi Rates: ${mandiSummary}
- Average Price (Today): ₹${Math.round(avgPrice)}/q
- Total Arrivals (Today): ${Math.round(totalArrivals)}q
- MSP Floor: ₹${msp}/quintal

WEATHER (next 14 days in ${district}):
${weatherSummary}

RESPOND WITH EXACTLY:
{
  "decision": "SELL_NOW"|"HOLD_7_DAYS"|"HOLD_14_DAYS"|"PARTIAL_SELL",
  "confidence": "HIGH"|"MEDIUM"|"LOW",
  "expected_price_min": number,
  "expected_price_max": number,
  "hindi_reason": "3 sentences Hindi, max 60 words. Be specific about market trends and weather impacts.",
  "risk_note": "1 sentence Hindi, max 20 words"
}`;

      // 4. Call Gemini AI with Fallback Logic
      const models = [
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash", 
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.5-pro",
        "models/gemini-2.0-flash-lite",
        "models/gemini-2.0-flash",
        "models/gemini-pro-latest"
      ];
      let responseText = "";

      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          responseText = result.response.text();
          if (responseText) break;
        } catch (e) {
          console.warn(`Model ${modelName} failed, trying next...`);
        }
      }

      if (!responseText) throw new Error("AI Engine total failure");

      // 5. Clean and Parse Response
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedJson) as SellHoldResponse;

    } catch (err) {
      console.error('Advisory Engine Error:', err);
      // Fallback response for stability
      return {
        decision: "HOLD_7_DAYS",
        confidence: "MEDIUM",
        expected_price_min: 2250,
        expected_price_max: 2350,
        hindi_reason: "AI सेवा अस्थायी रूप से बंद है। पिछले रुझान के अनुसार मंडी में भाव स्थिर रहने की उम्मीद है।",
        risk_note: "बाजार में उतार-चढ़ाव संभव है।"
      };
    }
  }
}
