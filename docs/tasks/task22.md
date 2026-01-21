# Task 22: RevenueCat SDK導入・設定

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task22 |
| フェーズ | Phase 8: 課金（RevenueCat） |
| 所要時間 | 1時間 |
| 依存タスク | なし |

## 目的
RevenueCat SDKを導入し、基本設定を行う。

## 必要なパッケージ
```bash
npx expo install react-native-purchases
```

## RevenueCat設定項目

| 項目 | 設定値 |
|------|--------|
| Product Type | Non-Consumable（非消耗型・買い切り） |
| Entitlement ID | `premium` |
| Product ID (iOS) | `putt_tempo_premium` |
| Product ID (Android) | `putt_tempo_premium` |

## 実装

### lib/purchases.ts
```typescript
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  ios: 'appl_xxxxx', // RevenueCat iOS API Key
  android: 'goog_xxxxx', // RevenueCat Android API Key
};

export async function initializePurchases(userId?: string) {
  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  
  await Purchases.configure({
    apiKey,
    appUserID: userId,
  });
}

export async function isPremium(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    return false;
  }
}
```

## 完了条件
- [ ] react-native-purchases がインストールされている
- [ ] RevenueCatダッシュボードでプロジェクトが作成されている
- [ ] API Keyが取得されている
- [ ] lib/purchases.ts が実装されている
- [ ] アプリ起動時に初期化が呼ばれる

## 注意事項
- API Keyは環境変数で管理すること
- App Store Connect / Google Play Console での商品登録も必要
