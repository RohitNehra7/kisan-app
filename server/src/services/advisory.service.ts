import { GoogleGenerativeAI } from '@google/generative-ai';
import { MandiService } from './mandi.service';
import { WeatherService } from './weather.service';
import { SellHoldResponse, MandiRecord } from '../types';
import { MSP_2025 } from '../config/haryana.constants';
import { supabase } from '../config/supabase';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || '');

interface MandiDataSummary {
  records: MandiRecord[];
  dataAgeDays: number;
  mostRecentDate: string;
  avg7dArrivals: number;
  todayArrivals: number;
  arrivalSignal: 'ABOVE_NORMAL' | 'NORMAL' | 'BELOW_NORMAL';
  modalPriceAvg: number;
  trend7d: number;
}

export class AdvisoryService {
  /**
   * Core Sell/Hold Decision Engine (Phase 0 Spec)
   */
  static async getRecommendation(
    crop: string,
    quantity: number,
    district: string,
    storageCostPerDay: number,
    urgency: string
  ): Promise<SellHoldResponse> {
    try {
      // 1. Fetch Market Data + Arrivals
      console.log(`[Advisory] Collecting market signals for ${crop} in ${district}...`);
      const mandiSummary = await this.getMandiDataSummary(district, crop);
      
      // 2. Fetch MSP from DB
      const msp = await this.getMSPFromDB(crop);

      // 3. Fetch Weather Summary
      console.log(`[Advisory] Analysing weather for ${district}...`);
      const weatherSummary = await this.getWeatherNaturalLanguageSummary(district, crop);

      // 4. Construct Prompt
      const prompt = this.buildGeminiPrompt({
        crop, quantity, district, urgency, storageCostPerDay,
        mandiData: mandiSummary,
        msp,
        weatherSummary
      });

      // 5. Call AI
      console.log(`[Advisory] Consulting Gemini for final decision...`);
      let aiResponse = await this.callGemini(prompt);

      // 6. Apply Staleness Penalty
      const finalResponse = this.applyStalenessPenalty(aiResponse, mandiSummary.dataAgeDays);

      // 7. Log to DB (Background)
      this.logRecommendation(crop, quantity, district, finalResponse, mandiSummary, weatherSummary);

      return {
        ...finalResponse,
        mandis_checked: mandiSummary.records.map(r => r.market),
        arrival_signal: mandiSummary.arrivalSignal,
      };

    } catch (err: any) {
      console.error('Advisory Engine Total Failure:', err.message);
      return {
        decision: "HOLD_7_DAYS",
        confidence: "LOW",
        expected_price_min: 2250,
        expected_price_max: 2350,
        hindi_reason: "AI सेवा अस्थायी रूप से बंद है। कृपया अपने नजदीकी आढ़ती से सलाह लें।",
        risk_note: "बाजार में उतार-चढ़ाव संभव है।",
        data_freshness: "पुराना भाव",
        data_age_days: 2,
        stale_disclaimer: "सर्वर कनेक्टिविटी की समस्या।"
      };
    }
  }

  private static async getMandiDataSummary(district: string, crop: string): Promise<MandiDataSummary> {
    const records = await MandiService.fetchAndSyncPrices('Haryana', crop, undefined, 50);
    const districtRecords = records.filter(r => r.district.toLowerCase().includes(district.toLowerCase()));
    
    if (districtRecords.length === 0) throw new Error('No mandi data for this district');

    // Group by market and get latest
    const latestByMandi = Array.from(new Map(districtRecords.map(r => [r.market, r])).values());
    
    const parseDate = (d: string) => {
      const parts = d.split('/');
      const day = parseInt(parts[0] || '1') || 1;
      const month = parseInt(parts[1] || '1') || 1;
      const year = parseInt(parts[2] || '2026') || 2026;
      return new Date(year, month - 1, day);
    };

    const sortedByDate = [...latestByMandi].sort((a, b) => 
      parseDate(b.arrival_date).getTime() - parseDate(a.arrival_date).getTime()
    );

    const mostRecentDateStr = (sortedByDate.length > 0 && sortedByDate[0])
      ? sortedByDate[0].arrival_date 
      : new Date().toLocaleDateString('en-GB');

    const today = new Date();
    today.setHours(0,0,0,0);
    const arrival = parseDate(mostRecentDateStr);
    arrival.setHours(0,0,0,0);
    const dataAgeDays = Math.floor((today.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));

    const avg7dArrivals = await MandiService.getAvg7dArrivals(district, crop);
    const todayArrivals = latestByMandi.reduce((sum, r) => sum + (r.arrivals_in_qtl || 0), 0);
    
    let arrivalSignal: 'ABOVE_NORMAL' | 'NORMAL' | 'BELOW_NORMAL' = 'NORMAL';
    if (avg7dArrivals > 0) {
      const ratio = todayArrivals / avg7dArrivals;
      if (ratio > 1.3) arrivalSignal = 'ABOVE_NORMAL';
      else if (ratio < 0.7) arrivalSignal = 'BELOW_NORMAL';
    }

    const modalPriceAvg = latestByMandi.reduce((sum, r) => sum + r.modal_price, 0) / latestByMandi.length;

    return {
      records: latestByMandi,
      dataAgeDays,
      mostRecentDate: mostRecentDateStr,
      avg7dArrivals,
      todayArrivals,
      arrivalSignal,
      modalPriceAvg,
      trend7d: 0 // Placeholder until history backfill is fully used
    };
  }

  private static async getMSPFromDB(crop: string): Promise<number> {
    try {
      const { data } = await supabase
        .from('msp_values')
        .select('msp_per_quintal')
        .eq('commodity', crop)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data?.msp_per_quintal || MSP_2025[crop] || 2000;
    } catch (e) {
      return MSP_2025[crop] || 2000;
    }
  }

  private static async getWeatherNaturalLanguageSummary(district: string, crop: string): Promise<string> {
    const weather = await WeatherService.getFullWeather({ district });
    if (!weather) return "मौसम डेटा उपलब्ध नहीं है।";

    const totalRain = weather.forecast.reduce((acc, curr) => acc + (curr.precipProb > 30 ? 1 : 0), 0);
    const maxTemp = Math.max(...weather.forecast.map(f => f.temp));

    return `अगले 14 दिन: ${totalRain} दिन बारिश की संभावना, अधिकतम तापमान ${maxTemp}°C. ${totalRain > 3 ? 'बारिश का जोखिम मध्यम है।' : 'मौसम शुष्क रहने की उम्मीद है।'}`;
  }

  private static buildGeminiPrompt(params: any): string {
    const { crop, quantity, district, urgency, storageCostPerDay, mandiData, msp, weatherSummary } = params;
    
    const mandiLines = mandiData.records
      .map((r: any) => `- ${r.market}: ₹${r.modal_price}/q | आवक: ${r.arrivals_in_qtl}q`)
      .join('\n');

    return `You are an expert agricultural commodity market analyst for Haryana, India.
RESPOND ONLY WITH VALID JSON. No markdown, no preamble. JSON only.

किसान की स्थिति:
- फसल: ${crop} | मात्रा: ${quantity} क्विंटल
- जिला: ${district}, Haryana | भंडारण लागत: ₹${storageCostPerDay}/क्विंटल/दिन
- जरूरत: ${urgency}

मंडी डेटा (${mandiData.dataAgeDays === 0 ? 'आज' : mandiData.dataAgeDays === 1 ? 'कल' : `${mandiData.dataAgeDays} दिन पुराना`}):
${mandiLines}
- आज की कुल आवक: ${mandiData.todayArrivals}q | 7-दिन औसत: ${mandiData.avg7dArrivals}q → ${mandiData.arrivalSignal}
- MSP सीमा: ₹${msp}/q

मौसम (${district}):
${weatherSummary}

RESPOND WITH EXACTLY THIS JSON (no other text):
{
  "decision": "SELL_NOW" | "HOLD_7_DAYS" | "HOLD_14_DAYS" | "PARTIAL_SELL",
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "expected_price_min": number,
  "expected_price_max": number,
  "hindi_reason": "3 sentences in Hindi, max 60 words total",
  "risk_note": "1 sentence in Hindi, max 20 words"
}`;
  }

  private static async callGemini(prompt: string): Promise<any> {
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text.replace(/```json|```/g, '').trim());
      } catch (e) {
        continue;
      }
    }
    throw new Error("AI total failure");
  }

  private static applyStalenessPenalty(response: any, days: number): any {
    if (days === 0) return { ...response, data_freshness: 'आज का भाव', data_age_days: 0 };
    if (days === 1) return { ...response, confidence: 'MEDIUM', data_freshness: 'कल का भाव', data_age_days: 1 };
    return {
      ...response,
      confidence: 'LOW',
      data_freshness: 'पुराना भाव',
      data_age_days: days,
      stale_disclaimer: 'भाव पुराना है — यह सुझाव अनुमान है, पक्का नहीं।'
    };
  }

  private static async logRecommendation(crop: string, qty: number, dist: string, res: any, mandi: any, weather: string) {
    if (!supabase) return;
    try {
      await supabase.from('sell_hold_recommendations').insert({
        crop, quantity: qty, district: dist,
        decision: res.decision,
        confidence: res.confidence,
        expected_price_min: res.expected_price_min,
        expected_price_max: res.expected_price_max,
        hindi_reason: res.hindi_reason,
        risk_note: res.risk_note,
        arrival_signal: mandi.arrivalSignal,
        data_age_days: mandi.dataAgeDays,
        mandi_data: mandi.records,
        weather_data: { summary: weather }
      });
    } catch (e) {}
  }
}
