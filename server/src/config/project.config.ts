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
    "Wheat": 2350,
    "Paddy": 2300,
    "Mustard": 5950,
    "Bajra": 2600,
    "Cotton": 7100,
    "Default": 2100
  } as Record<string, number>
};
