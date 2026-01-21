# Task 23: 購入・復元処理実装

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task23 |
| フェーズ | Phase 8: 課金（RevenueCat） |
| 所要時間 | 1.5時間 |
| 依存タスク | task22（RevenueCat導入） |

## 目的
プレミアム購入と復元処理を実装する。

## 実装

### hooks/usePurchase.ts
```typescript
import { useState, useCallback, useEffect } from 'react';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function usePurchase() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // プレミアム状態を確認
  const checkPremiumStatus = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setIsPremium(customerInfo.entitlements.active['premium'] !== undefined);
    } catch (error) {
      console.error('Failed to check premium status:', error);
    }
  }, []);

  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);

  // 購入処理
  const purchase = useCallback(async () => {
    setIsLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const premiumPackage = offerings.current?.availablePackages[0];
      
      if (!premiumPackage) {
        throw new Error('Package not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
      
      if (customerInfo.entitlements.active['premium']) {
        setIsPremium(true);
        
        // Supabaseにも記録
        if (user) {
          await supabase.rpc('upgrade_subscription', {
            p_user_id: user.id,
            p_plan: 'premium',
            p_platform: Platform.OS,
            p_store_product_id: premiumPackage.product.identifier,
            p_store_transaction_id: customerInfo.originalPurchaseDate || '',
          });
        }
        
        return true;
      }
      return false;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase failed:', error);
        throw error;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 復元処理
  const restore = useCallback(async () => {
    setIsLoading(true);
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const restored = customerInfo.entitlements.active['premium'] !== undefined;
      setIsPremium(restored);
      return restored;
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
```

## 完了条件
- [ ] hooks/usePurchase.ts が実装されている
- [ ] 購入処理が動作する
- [ ] 復元処理が動作する
- [ ] プレミアム状態が正しく取得できる
- [ ] Supabaseに購入情報が記録される
- [ ] エラーハンドリングが適切

## テスト方法
| 環境 | 方法 |
|------|------|
| iOS | Sandbox テスター（App Store Connect で作成） |
| Android | テスト用ライセンス（Google Play Console で設定） |
