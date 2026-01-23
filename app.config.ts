import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Putt Tempo',
  slug: 'putt-tempo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'putt-tempo',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#121212',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourname.putt-tempo', // TODO: バンドルIDを変更
    config: {
      googleMobileAdsAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // TODO: AdMob App ID
    },
    infoPlist: {
      UIBackgroundModes: ['audio'], // バックグラウンドオーディオ
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#121212',
    },
    package: 'com.yourname.putt_tempo', // TODO: パッケージ名を変更
    versionCode: 1,
    config: {
      googleMobileAdsAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // TODO: AdMob App ID
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
        androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // TODO: AdMob App ID
        iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // TODO: AdMob App ID
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // RevenueCat API Keys
    revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
    revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
    // AdMob広告ユニットID（本番用はここに設定、開発時はテストIDが使用される）
    admobBannerIdAndroid: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // TODO: バナー広告ID
    admobBannerIdIos: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // TODO: バナー広告ID
  },
});
