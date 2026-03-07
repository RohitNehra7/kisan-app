export const DISTRICT_COORDS: Record<string, {lat: number, lon: number}> = {
  "Ambala": {lat: 30.3782, lon: 76.7767},
  "Bhiwani": {lat: 28.7831, lon: 76.1394},
  "Charkhi Dadri": {lat: 28.5921, lon: 76.2653},
  "Faridabad": {lat: 28.4089, lon: 77.3178},
  "Fatehabad": {lat: 29.5139, lon: 75.4511},
  "Gurugram": {lat: 28.4595, lon: 77.0266},
  "Hisar": {lat: 29.1492, lon: 75.7217},
  "Jhajjar": {lat: 28.6063, lon: 76.6567},
  "Jind": {lat: 29.3176, lon: 76.3193},
  "Kaithal": {lat: 29.8015, lon: 76.3996},
  "Karnal": {lat: 29.6857, lon: 76.9907},
  "Kurukshetra": {lat: 29.9691, lon: 76.8783},
  "Mahendragarh": {lat: 28.2743, lon: 76.1321},
  "Nuh": {lat: 28.1064, lon: 77.0113},
  "Palwal": {lat: 28.1487, lon: 77.3320},
  "Panchkula": {lat: 30.6942, lon: 76.8606},
  "Panipat": {lat: 29.3909, lon: 76.9635},
  "Rewari": {lat: 28.1835, lon: 76.6020},
  "Rohtak": {lat: 28.8955, lon: 76.6066},
  "Sirsa": {lat: 29.5335, lon: 75.0177},
  "Sonipat": {lat: 28.9931, lon: 77.0151},
  "Yamunanagar": {lat: 30.1290, lon: 77.2674}
};

export class GeoService {
  /**
   * Calculate distance between two districts in KM using Haversine formula
   */
  static calculateDistance(d1: string, d2: string): number {
    const c1 = DISTRICT_COORDS[d1];
    const c2 = DISTRICT_COORDS[d2];
    if (!c1 || !c2) return 50; // default estimate
    
    const R = 6371; // Earth radius km
    const dLat = (c2.lat - c1.lat) * Math.PI / 180;
    const dLon = (c2.lon - c1.lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }
}
