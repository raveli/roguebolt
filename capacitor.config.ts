import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.roguebolt.game',
  appName: 'Rogue Bolt',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },
    ScreenOrientation: {
      // Lock to landscape for gameplay
    },
  },
  ios: {
    // Enable fullscreen (no status bar)
    preferredContentMode: 'mobile',
  },
  android: {
    // Enable immersive mode for fullscreen gameplay
    backgroundColor: '#1a1a2e',
  },
};

export default config;
