// hooks/usePurchase.ts - ローカルベースの課金管理（React Query使用）

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getIsPremium, setIsPremium as saveIsPremium } from '@/lib/storage';

// RevenueCat SDKが追加された後に有効化
// import Purchases, { CustomerInfo } from 'react-native-purchases';

const PREMIUM_QUERY_KEY = ['premium_status'];

export function usePurchase() {
  const queryClient = useQueryClient();

  // プレミアム状態をReact Queryで管理
  const { data: isPremium = false, isLoading: isChecking } = useQuery({
    queryKey: PREMIUM_QUERY_KEY,
    queryFn: async () => {
      const premium = await getIsPremium();
      return premium;
    },
    staleTime: 1000 * 60, // 1分
  });

  // 購入処理（RevenueCat SDK追加後に実装）
  const purchase = useCallback(async () => {
    try {
      // TODO: RevenueCat SDK実装
      // const offerings = await Purchases.getOfferings();
      // const premiumPackage = offerings.current?.availablePackages[0];
      // if (!premiumPackage) throw new Error('Package not found');
      // const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
      
      // 仮実装: ローカルに保存（テスト用）
      await saveIsPremium(true);
      
      // キャッシュを即座に更新
      queryClient.setQueryData(PREMIUM_QUERY_KEY, true);
      
      return true;
    } catch (error) {
      console.log('Purchase failed:', error);
      throw error;
    }
  }, [queryClient]);

  // 復元処理（RevenueCat SDK追加後に実装）
  const restore = useCallback(async () => {
    try {
      // TODO: RevenueCat SDK実装
      // const { customerInfo } = await Purchases.restorePurchases();
      // const restored = customerInfo.entitlements.active['premium'] !== undefined;
      
      // 仮実装: キャッシュを再取得
      await queryClient.invalidateQueries({ queryKey: PREMIUM_QUERY_KEY });
      return isPremium;
    } catch (error) {
      console.log('Restore failed:', error);
      throw error;
    }
  }, [queryClient, isPremium]);

  // 無料プランに戻す（開発・テスト用）
  const resetToFree = useCallback(async () => {
    await saveIsPremium(false);
    // キャッシュを即座に更新
    queryClient.setQueryData(PREMIUM_QUERY_KEY, false);
  }, [queryClient]);

  return {
    isPremium,
    isLoading: isChecking,
    purchase,
    restore,
    resetToFree,
  };
}

export function usePremiumStatus() {
  const { isPremium } = usePurchase();
  return { isPremium };
}
