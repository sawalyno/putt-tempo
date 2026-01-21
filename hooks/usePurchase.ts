// hooks/usePurchase.ts

import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// RevenueCat SDKが追加された後に有効化
// import Purchases, { CustomerInfo } from 'react-native-purchases';

export function usePurchase() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // プレミアム状態を確認（Supabaseから）
  const checkPremiumStatus = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .maybeSingle(); // 行がない場合もエラーにしない

      if (error) throw error;
      // データがない場合は無料プラン
      setIsPremium(data?.plan === 'premium');
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremium(false);
    }
  }, [user]);

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
      
      // 仮実装: Supabaseに直接記録（テスト用）
      if (user) {
        await supabase.rpc('upgrade_subscription', {
          p_user_id: user.id,
          p_plan: 'premium',
          p_platform: Platform.OS,
          p_store_product_id: 'putt_tempo_premium',
          p_store_transaction_id: `test_${Date.now()}`,
        });
        setIsPremium(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 復元処理（RevenueCat SDK追加後に実装）
  const restore = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: RevenueCat SDK実装
      // const { customerInfo } = await Purchases.restorePurchases();
      // const restored = customerInfo.entitlements.active['premium'] !== undefined;
      
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
