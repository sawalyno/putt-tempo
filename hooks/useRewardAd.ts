import { useState, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

interface UseRewardAdOptions {
  onRewardEarned?: (reward: { type: string; amount: number }) => void;
  onAdClosed?: () => void;
  onError?: (error: Error) => void;
}

interface UseRewardAdReturn {
  isLoaded: boolean;
  isLoading: boolean;
  isShowing: boolean;
  error: Error | null;
  showAd: () => Promise<boolean>;
  loadAd: () => void;
  isExpoGo: boolean;
}

// Expo Goかどうかを判定
const isExpoGo = Constants.appOwnership === 'expo';

// ネイティブモジュールを条件付きでロード（Expo Goではロードしない）
let RewardedAd: any = null;
let RewardedAdEventType: any = { LOADED: 'loaded', EARNED_REWARD: 'earned_reward' };
let TestIds: any = { REWARDED: 'test-rewarded-id' };
let AdEventType: any = { CLOSED: 'closed', ERROR: 'error' };

if (!isExpoGo) {
  try {
    const ads = require('react-native-google-mobile-ads');
    RewardedAd = ads.RewardedAd;
    RewardedAdEventType = ads.RewardedAdEventType;
    TestIds = ads.TestIds;
    AdEventType = ads.AdEventType;
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
    return TestIds.REWARDED;
  }
  
  // 本番環境では実際の広告ユニットIDを使用
  const extra = getExtra();
  
  if (Platform.OS === 'ios') {
    return (extra?.admobRewardIdIos as string) || TestIds.REWARDED;
  }
  return (extra?.admobRewardIdAndroid as string) || TestIds.REWARDED;
};

/**
 * Expo Go用モックリワード広告フック
 */
function useMockRewardAd(options: UseRewardAdOptions = {}): UseRewardAdReturn {
  const { onRewardEarned, onAdClosed } = options;
  const [isShowing, setIsShowing] = useState(false);

  const showAd = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsShowing(true);
      Alert.alert(
        'リワード広告（モック）',
        'Development Buildで実際の広告が表示されます\n\n報酬を受け取りますか？',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
            onPress: () => {
              setIsShowing(false);
              onAdClosed?.();
              resolve(false);
            },
          },
          {
            text: '報酬を受け取る',
            onPress: () => {
              onRewardEarned?.({ type: 'mock_reward', amount: 1 });
              setIsShowing(false);
              onAdClosed?.();
              resolve(true);
            },
          },
        ]
      );
    });
  }, [onRewardEarned, onAdClosed]);

  const loadAd = useCallback(() => {
    // モックなので何もしない
  }, []);

  return {
    isLoaded: true, // モックは常にロード済み
    isLoading: false,
    isShowing,
    error: null,
    showAd,
    loadAd,
    isExpoGo: true,
  };
}

/**
 * リワード広告フック
 * 
 * - Expo Go: モックダイアログで報酬付与をシミュレート
 * - Development Build / Production Build: 実際の広告表示
 */
export function useRewardAd(options: UseRewardAdOptions = {}): UseRewardAdReturn {
  // Expo Goの場合はモック版を使用
  const mockResult = useMockRewardAd(options);
  if (isExpoGo) {
    return mockResult;
  }

  const { onRewardEarned, onAdClosed, onError } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);
  const [pendingResolve, setPendingResolve] = useState<((value: boolean) => void) | null>(null);

  // 広告インスタンスを作成
  const createAd = useCallback(() => {
    const adUnitId = getAdUnitId();
    const ad = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    return ad;
  }, []);

  // 広告をロード
  const loadAd = useCallback(() => {
    if (isLoading || isLoaded) return;

    setIsLoading(true);
    setError(null);

    const ad = createAd();
    
    // イベントリスナーを設定
    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Rewarded ad loaded');
      setIsLoaded(true);
      setIsLoading(false);
    });

    const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('Reward earned:', reward);
      onRewardEarned?.({ type: reward.type, amount: reward.amount });
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Rewarded ad closed');
      setIsShowing(false);
      setIsLoaded(false);
      onAdClosed?.();
      
      // Promiseを解決（報酬が付与された場合はtrue）
      if (pendingResolve) {
        pendingResolve(true);
        setPendingResolve(null);
      }
      
      // クリーンアップ
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (err) => {
      console.error('Rewarded ad error:', err);
      setError(err);
      setIsLoading(false);
      setIsShowing(false);
      onError?.(err);
      
      if (pendingResolve) {
        pendingResolve(false);
        setPendingResolve(null);
      }
    });

    setRewardedAd(ad);
    ad.load();
  }, [isLoading, isLoaded, createAd, onRewardEarned, onAdClosed, onError, pendingResolve]);

  // 広告を表示
  const showAd = useCallback(async (): Promise<boolean> => {
    if (!isLoaded || !rewardedAd) {
      console.warn('Rewarded ad not loaded yet');
      // 広告がロードされていない場合はロードを試みる
      loadAd();
      return false;
    }

    return new Promise((resolve) => {
      setPendingResolve(() => resolve);
      setIsShowing(true);
      rewardedAd.show();
    });
  }, [isLoaded, rewardedAd, loadAd]);

  // 初回マウント時に広告をロード
  useEffect(() => {
    loadAd();
  }, []);

  return {
    isLoaded,
    isLoading,
    isShowing,
    error,
    showAd,
    loadAd,
    isExpoGo: false,
  };
}
