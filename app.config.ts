import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My App',           // TODO: アプリ名を変更
  slug: 'my-app',           // TODO: スラッグを変更
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',          // TODO: スキームを変更
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0a0a0a',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourname.myapp',  // TODO: バンドルIDを変更
    config: {
      googleMobileAdsAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',  // TODO: AdMob App ID
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0a0a0a',
    },
    package: 'com.yourname.myapp',  // TODO: パッケージ名を変更
    versionCode: 1,
    config: {
      googleMobileAdsAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',  // TODO: AdMob App ID
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',  // TODO: AdMob App ID
        iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',      // TODO: AdMob App ID
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // Supabase設定（.envから読み込み）
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    // AdMob広告ユニットID
    admobBannerIdAndroid: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',    // TODO: バナー広告ID
    admobBannerIdIos: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',        // TODO: バナー広告ID
    admobRewardIdAndroid: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',    // TODO: リワード広告ID
    admobRewardIdIos: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',        // TODO: リワード広告ID
  },
});
