# Task 24: AdMob設定・広告表示

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task24 |
| フェーズ | Phase 9: 広告（AdMob） |
| 所要時間 | 1時間 |
| 依存タスク | なし |

## 目的
AdMobの設定を完了し、バナー広告を表示する。

## 設定箇所

### app.config.ts
```typescript
export default {
  // ...
  ios: {
    // ...
    config: {
      googleMobileAdsAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',
    },
  },
  android: {
    // ...
    config: {
      googleMobileAdsAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY',
    },
  },
  extra: {
    adUnitIds: {
      banner: {
        ios: __DEV__ 
          ? 'ca-app-pub-3940256099942544/2934735716' // テスト用
          : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
        android: __DEV__
          ? 'ca-app-pub-3940256099942544/6300978111' // テスト用
          : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
      },
    },
  },
};
```

### components/ads/BannerAd.tsx
- 既存のコンポーネントを実際の広告ユニットIDで動作するよう更新

## 完了条件
- [ ] AdMobでアプリが登録されている
- [ ] 広告ユニットIDが取得されている
- [ ] app.config.ts に設定が追加されている
- [ ] テスト広告が表示される
- [ ] プレミアムユーザーには広告が表示されない

## 注意事項
- 開発中はテスト広告IDを使用すること
- 本番広告IDでテストクリックすると規約違反
