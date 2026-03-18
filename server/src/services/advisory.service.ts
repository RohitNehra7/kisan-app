import { GoogleGenerativeAI } from '@google/generative-ai';
import { MandiService } from './mandi.service';
import { WeatherService } from './weather.service';
import { SellHoldResponse, MandiRecord } from '../types';
import { MSP_2025, HARYANA_MANDIS } from '../config/haryana.constants';
import { supabase } from '../config/supabase';
import { ruleBasedDecision, RuleInputs, RuleOutput } from './advisory-rules.service';
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
   * Hybrid Advisory Engine (Phase 1)
   */
  static async getRecommendation(
    crop: string,
    quantity: number,
    district: string,
    storageCostPerDay: number,
    urgency: 'now' | '2weeks' | 'flexible'
  ): Promise<SellHoldResponse> {
    try {
      // 1. Fetch Market Data + Arrivals
      console.log(`[Advisory] Collecting market signals for ${crop} in ${district}...`);
      const mandiSummary = await this.getMandiDataSummary(district, crop);
      
      // 2. Fetch MSP from DB
      const msp = await this.getMSPFromDB(crop);

      // 3. Fetch Weather structured data
      console.log(`[Advisory] Analysing weather for ${district}...`);
      const weatherFull = await WeatherService.getFullWeather({ district });
      const rainDaysNext14 = weatherFull ? WeatherService.getRainDaysNext14(weatherFull) : 0;
      const weatherSummary = weatherFull
        ? `अगले 14 दिन: ${rainDaysNext14} दिन बारिश की संभावना, अधिकतम तापमान ${weatherFull.todayHigh}°C.`
        : "मौसम डेटा उपलब्ध नहीं है।";

      // 4. Run Rule-Based Engine first (deterministic)
      const ruleInputs: RuleInputs = {
        arrivalSignal: mandiSummary.arrivalSignal,
        priceTrend7d: mandiSummary.trend7d,
        rainDaysNext14,
        urgency,
        priceAboveMSPPct: ((mandiSummary.modalPriceAvg - msp) / msp) * 100,
        storageCostPerDay,
        quantity,
        cropType: crop,
        currentPrice: mandiSummary.modalPriceAvg
      };

      const ruleResult = ruleBasedDecision(ruleInputs);

      // 5. Hybrid Logic: Use rules for clear signals, AI for mixed ones
      let aiResponse: any;
      if (Math.abs(ruleResult.net_score) >= 3) {
        console.log(`[Advisory] Clear signal (net=${ruleResult.net_score}). Using rule engine.`);
        aiResponse = ruleResult;
      } else {
        console.log(`[Advisory] Mixed signal (net=${ruleResult.net_score}). Calling Gemini.`);
        try {
          const prompt = this.buildGeminiPrompt({
            crop, quantity, district, urgency, storageCostPerDay,
            mandiData: mandiSummary,
            msp,
            weatherSummary,
            ruleResult
          });
          aiResponse = await this.callGemini(prompt);
        } catch (err) {
          console.warn('[Advisory] Gemini failed. Falling back to rules.');
          aiResponse = ruleResult;
        }
      }

      // 6. Apply Staleness Penalty
      const finalResponse = this.applyStalenessPenalty(aiResponse, mandiSummary.dataAgeDays);

      // 7. Log to DB (Background)
      this.logRecommendation(crop, quantity, district, finalResponse, mandiSummary, weatherSummary, aiResponse);

      return {
        ...finalResponse,
        mandis_checked: mandiSummary.records.map(r => r.market),
        arrival_signal: mandiSummary.arrivalSignal,
      };

    } catch (err: any) {
      console.error('Advisory Engine Failure:', err.message);
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

  /**
   * Crop Doctor: Identify plant disease using Gemini Vision
   */
  static async analyzePlantDisease(imageBase64: string, cropHint?: string): Promise<any> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are a highly experienced Agricultural Scientist (Crop Doctor) specialized in Indian crops (Wheat, Paddy, Mustard, Cotton).
        Analyze the attached image of a plant/crop.
        
        1. Identify the crop: ${cropHint || 'Detect from image'}
        2. Identify the disease, pest infestation, or nutrient deficiency.
        3. Provide a clear diagnosis in Hindi and English.
        4. Suggest 3 immediate steps for the farmer:
           - One organic/preventative remedy.
           - One chemical remedy (if applicable).
           - One management tip (water, soil, spacing).
        
        IMPORTANT: Your entire response MUST be a valid JSON object with the following structure:
        {
          "crop": "English Name",
          "disease": "English Name",
          "diagnosis_english": "Brief scientific explanation",
          "diagnosis_hindi": "हिंदी में संक्षिप्त वैज्ञानिक व्याख्या",
          "remedies_english": ["Step 1", "Step 2", "Step 3"],
          "remedies_hindi": ["चरण 1", "चरण 2", "चरण 3"],
          "severity": "Low/Medium/High"
        }
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg"
          }
        }
      ]);

      const text = result.response.text();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e: any) {
      console.error('Gemini Vision Error:', e.message);
      throw new Error('AI Doctor was unable to process the image.');
    }
  }

  private static async getMandiDataSummary(district: string, crop: string): Promise<MandiDataSummary> {
    const records = await MandiService.getPricesFromDB('Haryana', crop);
    const districtRecords = records.filter(r => r.district.toLowerCase().includes(district.toLowerCase()));
    
    if (districtRecords.length === 0) throw new Error('No mandi data for this district');

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

    const mostRecentDateStr = sortedByDate[0]?.arrival_date || new Date().toLocaleDateString('en-GB');

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
    const trend7d = await this.getPrice7dTrend(district, crop);

    return {
      records: latestByMandi,
      dataAgeDays,
      mostRecentDate: mostRecentDateStr,
      avg7dArrivals,
      todayArrivals,
      arrivalSignal,
      modalPriceAvg,
      trend7d
    };
  }

  private static async getPrice7dTrend(district: string, crop: string): Promise<number> {
    const mandis = HARYANA_MANDIS[district] ?? [];
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    const isoDate = eightDaysAgo.toISOString().split('T')[0];

    try {
      const { data } = await supabase
        .from('price_history')
        .select('modal_price, arrival_date')
        .in('market', mandis)
        .eq('commodity', crop)
        .gte('arrival_date', isoDate)
        .order('arrival_date', { ascending: true });

      if (!data || data.length < 2) return 0;

      const newest = data[data.length - 1]?.modal_price || 0;
      const oldest = data[0]?.modal_price || 0;
      return Math.round(newest - oldest);
    } catch (e) {
      return 0;
    }
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

  private static buildGeminiPrompt(params: any): string {
    const { crop, quantity, district, urgency, storageCostPerDay, mandiData, msp, weatherSummary, ruleResult } = params;
    const mandiLines = mandiData.records
      .map((r: any) => `- ${r.market}: ₹${r.modal_price}/q | आवक: ${r.arrivals_in_qtl}q`)
      .join('\n');

    return `You are an expert agricultural commodity market analyst for Haryana, India.
RESPOND ONLY WITH VALID JSON. No markdown, no preamble. JSON only.

NOTE: The rule engine scored this as a MIXED SIGNAL case (net_score=${ruleResult.net_score}).
Rule engine tentative decision: ${ruleResult.decision} (LOW confidence).
Your job is to resolve the ambiguity using your deeper reasoning.

किसान की स्थिति:
- फसल: ${crop} | मात्रा: ${quantity} क्विंटल
- जिला: ${district}, Haryana | भंडारण लागत: ₹${storageCostPerDay}/क्विंटल/दिन
- जरूरत: ${urgency}

मंडी डेटा (${mandiData.dataAgeDays === 0 ? 'आज' : mandiData.dataAgeDays === 1 ? 'कल' : `${mandiData.dataAgeDays} दिन पुराना`}):
${mandiLines}
- 7-दिन मूल्य trend: ₹${mandiData.trend7d > 0 ? '+' : ''}${mandiData.trend7d}
- आज की कुल आवक: ${mandiData.todayArrivals}q | 7-दिन औसत: ${mandiData.avg7dArrivals}q → ${mandiData.arrivalSignal}
- MSP सीमा: ₹${msp}/q | वर्तमान भाव MSP से: ${(((mandiData.modalPriceAvg - msp) / msp) * 100).toFixed(1)}%

मौसम (${district}):
${weatherSummary}

RESPOND WITH EXACTLY THIS JSON:
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
      } catch (e) { continue; }
    }
    throw new Error("AI failure");
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

  private static async logRecommendation(crop: string, qty: number, dist: string, res: any, mandi: any, weather: string, aiRes: any) {
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
        weather_data: { summary: weather },
        engine_used: aiRes.used_rules ? 'rules' : 'gemini',
        net_score: aiRes.net_score ?? null
      });
    } catch (e) {}
  }
}
