export interface FeatureFlags {
  enableLiveMandiPulse: boolean;
  enableAdvisoryEngine: boolean;
  enableWeatherDashboard: boolean;
  enableFarmerForum: boolean;
}

const devFlags: FeatureFlags = {
  enableLiveMandiPulse: false,
  enableAdvisoryEngine: true,
  enableWeatherDashboard: true,
  enableFarmerForum: true,
};

const prodFlags: FeatureFlags = {
  enableLiveMandiPulse: false,
  enableAdvisoryEngine: false,
  enableWeatherDashboard: true,
  enableFarmerForum: true,
};

export const FEATURES = process.env.NODE_ENV === 'production' ? prodFlags : devFlags;
