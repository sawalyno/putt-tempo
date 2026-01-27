# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Putt Tempo - ゴルフパッティング練習用メトロノームアプリ（Expo/React Native）

## 開発コマンド

```bash
# 開発サーバー起動（Expo Go）
npm start

# プラットフォーム指定起動
npm run ios
npm run android

# Development Build作成（広告・課金テスト用）
eas build --profile development --platform android
eas build --profile development --platform ios

# Production Build
eas build --profile production --platform android
```

**注意**: テスト・lint用スクリプトは未設定。ビルドはEASで管理。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Expo 54 / React Native 0.81 |
| ルーティング | Expo Router 6（ファイルベース） |
| スタイリング | NativeWind v4 + Tailwind CSS |
| 状態管理 | React Query (@tanstack/react-query) |
| バックエンド | Supabase |
| 課金 | RevenueCat SDK |
| 広告 | Google Mobile Ads (AdMob) |
| アニメーション | React Native Reanimated |

## アーキテクチャ

### ディレクトリ構造

```
app/                  # Expo Router画面（ファイルベースルーティング）
├── (tabs)/          # タブナビゲーター
│   ├── index.tsx    # メトロノーム画面
│   ├── presets.tsx  # プリセット管理
│   ├── stats.tsx    # 統計・履歴
│   └── settings.tsx # 設定
├── presets/edit.tsx # プリセット編集
└── premium.tsx      # プレミアム画面

components/           # 再利用コンポーネント
├── ads/             # 広告（BannerAd）
└── ui/              # 基盤UI（Card, Button, Slider等）

hooks/                # カスタムフック
├── useMetronome.ts  # メトロノームコアロジック
├── usePresets.ts    # プリセット取得（React Query）
├── usePurchase.ts   # RevenueCat課金処理
└── useSoundPlayer.ts

lib/                  # ユーティリティ
├── storage.ts       # AsyncStorageラッパー
├── purchases.ts     # RevenueCat API
└── queryClient.ts   # React Query設定

types/index.ts        # 全型定義
constants/            # アプリ定数（プリセット、サウンド、カラー等）
```

### メトロノームシステム

4フェーズサイクル: `address`(1秒) → `takeBack` → `impact` → `interval`
- BPM範囲: 30-200
- カスタマイズ可能なback/forwardレシオ
- 出力モード: サウンド / バイブレーション / 両方

### プリセットシステム

- 4つのデフォルトプリセット（距離別）
- カスタムプリセット: Free=3個、Premium=100個
- ローカルストレージ（AsyncStorage）+ React Queryキャッシュ

### 収益化

- RevenueCat: サブスクリプション管理（entitlement: "premium"）
- AdMob: バナー広告（フリープラン）
- プレミアムでサウンド種類・プリセット数が拡張

## 重要な実装パターン

### Expo Go判定によるモック切り替え

ネイティブモジュール（広告、RevenueCat）はExpo Goで動作しない。条件付きrequireでフォールバック:

```typescript
const isExpoGo = Constants.appOwnership === 'expo';

let GoogleBannerAd: any = null;
if (!isExpoGo) {
  try {
    const ads = require('react-native-google-mobile-ads');
    GoogleBannerAd = ads.BannerAd;
  } catch (e) {}
}
```

### getExtraパターン

EASビルドで`Constants.expoConfig?.extra`が取得できない場合のフォールバック:

```typescript
const getExtra = () => {
  return Constants.expoConfig?.extra ||
         Constants.manifest?.extra ||
         Constants.manifest2?.extra || {};
};
```

### 環境分岐

```typescript
const adUnitId = __DEV__ ? TestIds.BANNER : extra?.admobBannerAndroid;
```

## コーディング規約

- **関数コンポーネントのみ**（クラスコンポーネント禁止）
- **React Query**でデータフェッチング（直接DB接続禁止、RPC使用）
- **TypeScript strict**モード
- **60FPS**維持（React.memo, useMemo, useCallback適切使用）
- **Reanimated**: モジュールトップレベルでのEasing使用禁止（コンポーネント内で使用）

## シェル環境（Windows PowerShell）

```bash
# NG: && は使用不可
git add . && git commit -m "message"

# OK: 個別実行
git add .
git commit -m "message"

# 括弧を含むパスはクォート
git add "app/(tabs)/index.tsx"
```

## 環境変数

`.env`に設定:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
```

## 参照ドキュメント

- `docs/CODING_STYLE.md` - 詳細コーディング規約
- `docs/SPEC.md` - アプリケーション仕様書
- `docs/GUIDE.md` - 開発ガイド
