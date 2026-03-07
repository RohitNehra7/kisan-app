export const CROP_SYNONYMS: Record<string, string[]> = {
  'Wheat': ['wheat', 'gehu', 'gehun', 'गेहूं', 'गेहूँ'],
  'Paddy': ['paddy', 'dhan', 'dhaan', 'धान'],
  'Mustard': ['mustard', 'sarson', 'sarso', 'rai', 'सरसों'],
  'Bajra': ['bajra', 'millet', 'pearl millet', 'बाजरा'],
  'Cotton': ['cotton', 'kapas', 'rui', 'कपास'],
  'Maize': ['maize', 'makka', 'makkai', 'corn', 'मक्का'],
  'Sugarcane': ['sugarcane', 'ganna', 'गन्ना'],
  'Sunflower': ['sunflower', 'surajmukhi', 'सूरजमुखी'],
  'Barley': ['barley', 'jau', 'जौ'],
  'Gram': ['gram', 'chana', 'channa', 'चना'],
  'Potato': ['potato', 'aaloo', 'aalu', 'आलू'],
  'Onion': ['onion', 'pyaj', 'pyaaj', 'प्याज'],
  'Tomato': ['tomato', 'tamatar', 'टमाटर']
};

export function getEnglishCommodity(input: string): string {
  const term = input.toLowerCase().trim();
  for (const [english, synonyms] of Object.entries(CROP_SYNONYMS)) {
    if (synonyms.some(s => s.toLowerCase() === term || term.includes(s.toLowerCase()))) {
      return english;
    }
  }
  return input; // Return original if no mapping found
}
