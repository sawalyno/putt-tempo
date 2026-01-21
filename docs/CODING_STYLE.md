# コーディングスタイルガイド

このドキュメントは、プロジェクトのコーディング規約と実装ガイドラインを定義します。

---

## 技術スタック

| カテゴリ | 技術 | 備考 |
|---------|------|------|
| ルーティング | Expo Router | ファイルベースルーティング |
| スタイリング | NativeWind v4 | Tailwind CSS for React Native |
| 型システム | TypeScript Strict | 厳密な型チェック |
| 状態管理 | React Query | @tanstack/react-query |
| バックエンド | Supabase | 認証、データベース、RPC |
| アニメーション | React Native Reanimated 3 | 推奨 |

---

## コーディング規約

### コンポーネント
- **関数コンポーネントのみ使用**（クラスコンポーネントは使用しない）
- コンポーネントは小さく、**単一責任の原則**に従う
- **型安全性を最優先**する

### カスタムフック
- ロジックの分離と再利用性を重視
- React Queryを使用したデータフェッチング

### エラーハンドリング
- **すべての非同期処理でエラーハンドリングを実装**
- ユーザーフレンドリーなエラーメッセージを表示

### パフォーマンス
- `React.memo`、`useMemo`、`useCallback`の適切な使用
- アニメーションは**60FPS**を維持すること

---

## 重要な制約

### サーバーロジック
- **RPC実装を使用**（クライアントから直接データベースにアクセスしない）

### APIキー
- 環境変数（`EXPO_PUBLIC_*`）を使用
- `.env`ファイルに保存

### RLSセキュリティ
- **全テーブルでRow Level Securityを有効化必須**
- 適切なポリシー設定（例: `auth.uid() = user_id`）
- RLSなしでの本番デプロイは禁止

---

## EASビルド環境での設定取得

### getExtraパターン（推奨）

`Constants.expoConfig?.extra`はEASプロダクションビルドで取得できない場合がある。
複数ソースからフォールバック取得するパターンを使用する:

```typescript
import Constants from 'expo-constants';

const getExtra = () => {
  return Constants.expoConfig?.extra || 
         Constants.manifest?.extra || 
         Constants.manifest2?.extra ||
         {};
};

const extra = getExtra();
const supabaseUrl = extra?.supabaseUrl as string;
```

**適用箇所**: `lib/supabase.ts`, `components/ads/BannerAd.tsx`, `hooks/useRewardAd.ts`

---

## 環境分岐パターン

### `__DEV__`フラグの使用

開発環境と本番環境で動作を分ける場合は`__DEV__`フラグを使用する:

```typescript
// 広告IDの切り替え
const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : extra?.admobBannerAndroid as string;

// ログ出力の制御
if (__DEV__) {
  console.log('Debug info:', data);
}
```

**注意**: `__DEV__`はビルド時に決定される。Development Buildでも`__DEV__`は`true`になる。

---

## Supabase設定

### セッション永続化（必須）

ログイン状態をアプリ再起動後も保持するには`AsyncStorage`を設定する:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: AsyncStorage,  // これがないとアプリ再起動でログアウトされる
  },
});
```

**依存パッケージ**: `@react-native-async-storage/async-storage`

---

## ディレクトリ構造

```
├── lib/            → Supabaseクライアント (supabase.ts)
├── contexts/       → Context (AuthContext.tsx)
├── hooks/          → カスタムフック (React Query使用)
├── types/          → 型定義 (index.ts)
├── constants/      → 定数 (colors.ts, typography.ts, spacing.ts, animations.ts)
├── components/     → UIコンポーネント
│   └── ads/        → 広告コンポーネント (BannerAd.tsx)
├── app/
│   ├── (tabs)/     → 画面コンポーネント
│   └── _layout.tsx → ルートレイアウト
└── docs/           → ドキュメント
```

---

## NativeWind v4 ガイドライン

### 必須設定

| ファイル | 設定内容 |
|----------|----------|
| `tailwind.config.js` | contentに `app/**/*.tsx`, `components/**/*.tsx` を設定 |
| `metro.config.js` | `withNativeWind` wrapper 必須 |
| `babel.config.js` | `nativewind/babel` プリセット追加 |
| `app/_layout.tsx` | `global.css` をインポート |

### className
- `docs/DESIGN.md`に記載の値を使用

---

## 段階的実装（Phase分け）

一度に全て実装せず、以下のPhaseに分けて実装する:

| Phase | 内容 |
|-------|------|
| Phase 1 | 基盤（Supabaseクライアント、認証、AuthContext） |
| Phase 2 | データ層（React Queryフック、型定義） |
| Phase 3 | UI（定数、コンポーネント、画面、アニメーション） |
| Phase 4 | 広告（AdMob実装） |

---

## 広告実装の注意事項

### 基本ルール
- 開発中は**必ずテスト用広告IDを使用**（本番IDでのテストはアカウント停止リスク）
- **Expo Go非対応**: Development Buildでテスト必須
- インタースティシャル広告の連続表示NG

### 開発環境の制約

| 環境 | ネイティブモジュール | 広告テスト | 備考 |
|------|---------------------|-----------|------|
| Expo Go | ❌ 動作しない | モック表示 | react-native-google-mobile-ads等は非対応 |
| Development Build | ✅ 動作する | ✅ | `eas build --profile development` で作成 |
| Production Build | ✅ 動作する | ✅ | `eas build --profile production` で作成 |

### Expo Go判定によるモック切り替え

Expo Goではネイティブモジュールが動作しないため、**条件付きrequire**でモジュールのロード自体をスキップする:

```typescript
import Constants from 'expo-constants';

// Expo Goかどうかを判定
const isExpoGo = Constants.appOwnership === 'expo';

// ⚠️ 重要: importではなく条件付きrequireを使用
// importはファイル読み込み時に実行されるため、Expo Goでクラッシュする
let GoogleBannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = { BANNER: 'test-banner-id' };

if (!isExpoGo) {
  try {
    const ads = require('react-native-google-mobile-ads');
    GoogleBannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
    TestIds = ads.TestIds;
  } catch (e) {
    console.log('Google Mobile Ads not available');
  }
}

export function BannerAd() {
  // Expo Goの場合はモックUIを表示
  if (isExpoGo) {
    return <MockBannerAd />;
  }

  // Development Build / Production Build では実際の広告を表示
  return <GoogleBannerAd ... />;
}
```

**ポイント**:
- `import`文はファイル読み込み時に即座に実行される → Expo Goでクラッシュ
- `require`は条件付きで実行可能 → Expo Goではスキップできる
- `try-catch`で安全にフォールバック

**メリット**:
- Expo Goでもアプリがクラッシュしない
- レイアウト確認が可能
- 本番ビルドでは自動的に実際の広告が表示される

### テスト用広告ID（Google提供）

| 広告タイプ | ID |
|-----------|-----|
| バナー | `ca-app-pub-3940256099942544/6300978111` |
| リワード | `ca-app-pub-3940256099942544/5224354917` |

### 広告ID切り替えの実装例

```typescript
import { TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.BANNER 
  : (extra?.admobBannerAndroid as string);
```

---

## UIデザイン実装の原則

- `DESIGN.md`の値を勝手に変更しない
- スクリーンショットと見比べながら忠実に再現
- カラー定数・タイポグラフィは`constants/`に定義
- アニメーションは60FPSを維持すること
- `DESIGN.md`のアニメーション設定値をそのまま使用

---

## リリース時の注意事項

### versionCodeの更新（必須）

Google Play Consoleにアップデートをアップロードする際は、**必ずversionCodeをインクリメント**する:

```typescript
// app.config.ts
android: {
  versionCode: 10,  // 前回が9なら10に更新
  // ...
}
```

| 項目 | 説明 |
|------|------|
| versionCode | 整数値。アップデート毎に+1（Google Play内部管理用） |
| version | ユーザーに表示されるバージョン（例: "1.0.1"） |

**エラー例**: 「バージョン コード X はすでに使用されています」→ versionCodeを更新していない

---

## 参照ドキュメント

- [SPEC.md](SPEC.md) - アプリケーション仕様書
- [DESIGN.md](DESIGN.md) - UIデザイン仕様書
- [GUIDE.md](GUIDE.md) - 開発ガイド
- [tasks/PROGRESS.md](tasks/PROGRESS.md) - タスク進捗管理
