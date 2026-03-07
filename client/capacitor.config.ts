import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kisanniti.app',
  appName: 'KisanNiti - किसान नीति',
  webDir: 'build',
  server: { androidScheme: 'https' },
  plugins: {
    SplashScreen: { launchShowDuration: 2000, backgroundColor: '#1B5E20' },
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] }
  }
};

export default config;
