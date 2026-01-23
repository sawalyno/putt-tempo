// hooks/usePurchase.ts - ローカルベースの課金管理

import { useState, useCallback, useEffect } from 'react';
import { getIsPremium, setIsPremium as saveIsPremium } from '@/lib/storage';

// RevenueCat SDKが追加された後に有効化
// import Purchases, { CustomerInfo } from 'react-native-purchases';

export function usePurchase() {
  const [isPremium, setIsPremiumState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // プレミアム状態を確認（ローカルストレージから）
  const checkPremiumStatus = useCallback(async () => {
    try {
      const premium = await getIsPremium();
      setIsPremiumState(premium);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremiumState(false);
    }
  }, []);

  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);

  // 購入処理（RevenueCat SDK追加後に実装）
  const purchase = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: RevenueCat SDK実装
      // const offerings = await Purchases.getOfferings();
      // const premiumPackage = offerings.current?.availablePackages[0];
      // if (!premiumPackage) throw new Error('Package not found');
      // const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
      
      // 仮実装: ローカルに保存（テスト用）
      await saveIsPremium(true);
      setIsPremiumState(true);
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 復元処理（RevenueCat SDK追加後に実装）
  const restore = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: RevenueCat SDK実装
      // const { customerInfo } = await Purchases.restorePurchases();
      // const restored = customerInfo.entitlements.active['premium'] !== undefined;
      
      // 仮実装: 現在の状態を返す
      await checkPremiumStatus();
      return isPremium;
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [checkPremiumStatus, isPremium]);

  return {
    isPremium,
    isLoading,
    purchase,
    restore,
    checkPremiumStatus,
  };
}

export function usePremiumStatus() {
  const { isPremium } = usePurchase();
  return { isPremium };
}
