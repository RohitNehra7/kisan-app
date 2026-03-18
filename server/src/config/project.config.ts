/**
 * PROJECT CONFIGURATION
 * Centralized business rules and priority lists to prevent hardcoding in services.
 */

export const PROJECT_CONFIG = {
  // States that receive priority processing in sync and UI
  PRIORITY_STATES: ["Haryana", "Punjab"],

  // Major mandis used for arbitrage calculations
  ARBITRAGE_TARGET_DISTRICTS: [
    "Karnal", "Hisar", "Rohtak", "Sirsa", "Ambala", "Kaithal", "Panipat", "Rewari"
  ],

  // Emergency fallback prices used only if DB and OGD API are both unreachable
  FALLBACK_MODAL_PRICES: {
    "Wheat": 2425,
    "Paddy": 2300,
    "Mustard": 5950,
    "Bajra": 2625,
    "Cotton": 7121,
    "Default": 2100
  } as Record<string, number>,

  // District Coordinates for Mandi Navigator (Haversine Distance)
  DISTRICT_COORDS: {
    'Karnal':       { lat: 29.6857, lon: 76.9905 },
    'Kaithal':      { lat: 29.8014, lon: 76.3998 },
    'Hisar':        { lat: 29.1492, lon: 75.7217 },
    'Ambala':       { lat: 30.3782, lon: 76.7767 },
    'Kurukshetra':  { lat: 29.9695, lon: 76.8783 },
    'Sirsa':        { lat: 29.5330, lon: 75.0166 },
    'Rohtak':       { lat: 28.8955, lon: 76.6066 },
    'Bhiwani':      { lat: 28.7975, lon: 76.1322 },
    'Jind':         { lat: 29.3159, lon: 76.3145 },
    'Panipat':      { lat: 29.3909, lon: 76.9635 },
    'Sonipat':      { lat: 28.9288, lon: 77.0147 },
    'Fatehabad':    { lat: 29.5144, lon: 75.4548 },
    'Yamunanagar':  { lat: 30.1290, lon: 77.2674 },
    'Rewari':       { lat: 28.1985, lon: 76.6171 },
    'Gurgaon':      { lat: 28.4595, lon: 77.0266 },
    'Faridabad':    { lat: 28.4089, lon: 77.3178 },
    'Mewat':        { lat: 28.1472, lon: 77.0067 },
    'Jhajar':       { lat: 28.6061, lon: 76.6566 },
    'Panchkula':    { lat: 30.6942, lon: 76.8606 },
    'Palwal':       { lat: 28.1487, lon: 77.3320 },
    'Charkhi Dadri': { lat: 28.5921, lon: 76.2653 },
    'Mahendragarh': { lat: 28.2619, lon: 76.1483 },
  } as Record<string, { lat: number, lon: number }>
};
