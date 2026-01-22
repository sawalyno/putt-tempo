import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

interface BannerAdProps {
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
}

// Expo Goかどうかを判定
const isExpoGo = Constants.appOwnership === 'expo';

// ネイティブモジュールを条件付きでロード（Expo Goではロードしない）
let GoogleBannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = { BANNER: 'test-banner-id' };
let adsAvailable = false;

if (!isExpoGo) {
  try {
    const ads = require('react-native-google-mobile-ads');
    GoogleBannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
    TestIds = ads.TestIds;
    adsAvailable = true;
  } catch (e) {
    console.log('Google Mobile Ads not available');
  }
}

// EASビルド対応: extraの取得
const getExtra = () => {
  // expoConfig（開発時）またはmanifest/manifest2（EASビルド時）から取得
  return (
    Constants.expoConfig?.extra ||
    Constants.manifest?.extra ||
    (Constants.manifest2?.extra as { expoClient?: { extra?: Record<string, unknown> } })?.expoClient?.extra ||
    {}
  );
};

// 広告ユニットID取得
const getAdUnitId = (): string => {
  // 開発環境ではテスト用IDを使用
  if (__DEV__) {
    return TestIds.BANNER;
  }
  
  // 本番環境では実際の広告ユニットIDを使用
  const extra = getExtra();
  
  if (Platform.OS === 'ios') {
    return (extra?.admobBannerIdIos as string) || TestIds.BANNER;
  }
  return (extra?.admobBannerIdAndroid as string) || TestIds.BANNER;
};

/**
 * モック用バナー広告コンポーネント（Expo Go用）
 */
function MockBannerAd({ onAdLoaded }: BannerAdProps) {
  useEffect(() => {
    // モックでもonAdLoadedを呼び出してレイアウト確認可能に
    onAdLoaded?.();
  }, [onAdLoaded]);

  return (
    <View style={styles.mockContainer}>
      <Text style={styles.mockText}>広告</Text>
      <Text style={styles.mockSubText}>Development Buildで実際の広告が表示されます</Text>
    </View>
  );
}

/**
 * バナー広告コンポーネント
 * 
 * - Expo Go: モック表示（レイアウト確認用）
 * - Development Build / Production Build: 実際の広告表示
 * - 広告SDKが利用不可: モック表示にフォールバック
 */
export function BannerAd({ onAdLoaded, onAdFailedToLoad }: BannerAdProps) {
  const [adLoadFailed, setAdLoadFailed] = useState(false);

  // Expo GoまたはSDKが利用不可の場合はモックUIを表示
  if (isExpoGo || !adsAvailable || !GoogleBannerAd) {
    return <MockBannerAd onAdLoaded={onAdLoaded} />;
  }

  // 広告ロード失敗時はモック表示
  if (adLoadFailed) {
    return <MockBannerAd onAdLoaded={onAdLoaded} />;
  }

  const adUnitId = getAdUnitId();

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
          onAdLoaded?.();
        }}
        onAdFailedToLoad={(error: Error) => {
          console.error('Banner ad failed to load:', error);
          setAdLoadFailed(true);
          onAdFailedToLoad?.(error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  mockContainer: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#555',
    minWidth: 320,
    minHeight: 50,
  },
  mockText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mockSubText: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
});
