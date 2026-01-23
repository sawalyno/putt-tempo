// hooks/usePurchase.ts - 課金管理（RevenueCat + ローカルフォールバック）

import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { getIsPremium, setIsPremium as saveIsPremiumLocal } from '@/lib/storage';
import {
  initializePurchases,
  checkPremiumStatus as checkPremiumStatusRC,
  purchasePremium as purchasePremiumRC,
  restorePurchases as restorePurchasesRC,
  hasApiKey,
  isPurchasesInitialized,
} from '@/lib/purchases';

const PREMIUM_QUERY_KEY = ['premium_status'];

export function usePurchase() {
  const queryClient = useQueryClient();
  const isRevenueCatConfigured = hasApiKey();

  // RevenueCat初期化
  useEffect(() => {
    if (isRevenueCatConfigured) {
      initializePurchases();
    }
  }, [isRevenueCatConfigured]);

  // プレミアム状態をReact Queryで管理
  const { data: isPremium = false, isLoading: isChecking, refetch } = useQuery({
    queryKey: PREMIUM_QUERY_KEY,
    queryFn: async () => {
      // RevenueCatが設定されている場合はそちらを使用
      if (isRevenueCatConfigured && isPurchasesInitialized()) {
        const premium = await checkPremiumStatusRC();
        // ローカルにもバックアップ保存
        await saveIsPremiumLocal(premium);
        return premium;
      }
      
      // フォールバック: ローカルストレージを使用
      const premium = await getIsPremium();
      return premium;
    },
    staleTime: 1000 * 60, // 1分
  });

  // 購入処理
  const purchase = useCallback(async () => {
    try {
      // RevenueCatが設定されている場合
      if (isRevenueCatConfigured && isPurchasesInitialized()) {
        const result = await purchasePremiumRC();
        
        if (result.success) {
          // ローカルにもバックアップ保存
          await saveIsPremiumLocal(true);
          // キャッシュを即座に更新
          queryClient.setQueryData(PREMIUM_QUERY_KEY, true);
          return true;
        }
        
        // ユーザーキャンセルの場合はエラーを投げない
        return false;
      }
      
      // フォールバック: ローカルに保存（テスト用）
      await saveIsPremiumLocal(true);
      queryClient.setQueryData(PREMIUM_QUERY_KEY, true);
      return true;
    } catch (error: any) {
      // ユーザーキャンセルは静かに処理
      if (error?.userCancelled) {
        return false;
      }
      console.log('Purchase failed:', error);
      throw error;
    }
  }, [queryClient, isRevenueCatConfigured]);

  // 復元処理
  const restore = useCallback(async () => {
    try {
      // RevenueCatが設定されている場合
      if (isRevenueCatConfigured && isPurchasesInitialized()) {
        const result = await restorePurchasesRC();
        
        // ローカルにもバックアップ保存
        await saveIsPremiumLocal(result.isPremium);
        // キャッシュを更新
        queryClient.setQueryData(PREMIUM_QUERY_KEY, result.isPremium);
        
        return result.isPremium;
      }
      
      // フォールバック: キャッシュを再取得
      await refetch();
      return isPremium;
    } catch (error) {
      console.log('Restore failed:', error);
      throw error;
    }
  }, [queryClient, isPremium, refetch, isRevenueCatConfigured]);

  // 無料プランに戻す（開発・テスト用）
  const resetToFree = useCallback(async () => {
    await saveIsPremiumLocal(false);
    queryClient.setQueryData(PREMIUM_QUERY_KEY, false);
  }, [queryClient]);

  return {
    isPremium,
    isLoading: isChecking,
    purchase,
    restore,
    resetToFree,
    isRevenueCatConfigured,
  };
}

export function usePremiumStatus() {
  const { isPremium } = usePurchase();
  return { isPremium };
}
