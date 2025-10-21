import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.area.mobile',
  appName: 'AREA Mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // For local dev with device/emulator; replace with your LAN IP if needed
    androidScheme: 'https'
  }
};

export default config;
