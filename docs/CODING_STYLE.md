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
| アニメーション | React Native Animated / Reanimated | 用途に応じて選択（後述） |

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

## アニメーション実装の注意事項

### React Native Reanimated vs 標準 Animated API

| 状況 | 推奨API | 理由 |
|------|---------|------|
| 単純なアニメーション（フェード、スケール等） | 標準 Animated API | 安定性が高い |
| ジェスチャー連携 | Reanimated | ネイティブスレッドで動作 |
| 複雑なタイミング制御で問題発生時 | 標準 Animated API | フォールバック先として |

### Reanimated使用時の禁止事項

**モジュールトップレベルでのEasing使用禁止**:

```typescript
// ❌ NG: モジュール読み込み時にReanimatedが未初期化でエラー
import { Easing } from 'react-native-reanimated';

export const fadeConfig = {
  duration: 300,
  easing: Easing.inOut(Easing.ease),  // ← ここでクラッシュ
};

// ✅ OK: 使用箇所で直接インポート・使用
export const fadeConfig = {
  duration: 300,
  // easing は使用箇所で設定
};

// コンポーネント内で
import { Easing, withTiming } from 'react-native-reanimated';
position.value = withTiming(0, { 
  duration: fadeConfig.duration,
  easing: Easing.inOut(Easing.ease) 
});
```

### 標準 Animated API の使用例

Reanimatedで問題が発生する場合のフォールバック:

```typescript
import { Animated } from 'react-native';

const position = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(position, {
    toValue: targetValue,
    duration: 300,
    useNativeDriver: true,  // パフォーマンスのため必須
  }).start();
}, [targetValue]);
```

---

## Hooks実装のアンチパターン

### useCallback内のローカル変数問題

**問題**: `useCallback`内のローカル変数は、関数再作成時にリセットされる

```typescript
// ❌ NG: isBackは関数再作成のたびにtrueにリセット
const runMetronome = useCallback(() => {
  let isBack = true;  // ← 毎回リセットされる
  
  const tick = () => {
    const phase = isBack ? 'back' : 'forward';
    isBack = !isBack;
    setTimeout(tick, duration);
  };
  tick();
}, [dependencies]);  // dependenciesが変わるとisBackがリセット

// ✅ OK: useRefで関数再作成をまたいで状態を保持
const isBackRef = useRef(true);

const runMetronome = useCallback(() => {
  const tick = () => {
    const phase = isBackRef.current ? 'back' : 'forward';
    isBackRef.current = !isBackRef.current;
    setTimeout(tick, duration);
  };
  tick();
}, [dependencies]);
```

### useEffectの無限ループ問題

**問題**: 依存配列に関数を含めると、状態更新→再レンダリング→関数再作成→useEffect発火→状態更新...の無限ループが発生

```typescript
// ❌ NG: runMetronomeが依存配列に含まれ、setCurrentPhaseで再レンダリング→無限ループ
const runMetronome = useCallback(() => {
  setCurrentPhase(phase);  // ← 状態更新でコンポーネント再レンダリング
}, [playFeedback, onTick]);  // ← これらが変わるとrunMetronome再作成

useEffect(() => {
  if (isPlaying) {
    runMetronome();  // ← 毎回呼ばれて無限ループ
  }
}, [runMetronome]);  // ← runMetronomeが依存配列にある

// ✅ OK: 関数を依存配列から除外、必要な値のみ依存
useEffect(() => {
  if (isPlayingRef.current) {
    // インラインで処理を記述
    const tick = () => { /* ... */ };
    tick();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [bpm, backRatio, forwardRatio]);  // 値のみ依存
```

### useRefを使うべき場面

| 場面 | useState | useRef |
|------|----------|--------|
| UIに反映する状態 | ✅ | ❌ |
| 再レンダリング不要な内部状態 | ❌ | ✅ |
| useCallback内で保持する変数 | ❌ | ✅ |
| タイマーID、インターバルID | ❌ | ✅ |
| 前回の値との比較用 | ❌ | ✅ |

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

## UI実装の優先順序（重要）

UI実装時は**必ず以下の順序で参照**すること：

| 優先度 | 参照元 | 用途 |
|--------|--------|------|
| 1位 | `docs/mock/*.html` | 最も正確なデザイン仕様。カラー、フォント、スペーシング、エフェクトすべてをここから取得 |
| 2位 | `docs/STITCH_PROMPT.md` | デザインプロンプト。mockがない場合の参照 |
| 3位 | `docs/tasks/taskXX.md` | ASCIIワイヤーフレーム。**構造の概要のみ**。詳細はmockを優先 |

> ⚠️ **禁止事項**: タスクファイルのASCIIワイヤーフレームだけでUI実装を進めてはいけない

---

## Supabaseコーディング規約

### RPC関数の命名規則

- スネークケース使用: `initialize_user`, `save_practice_session`
- 接頭辞パターン: 
  - `get_*` - 取得系
  - `save_*` - 保存系
  - `check_*` - 確認系
  - `upgrade_*` - アップグレード系

### `.maybeSingle()` vs `.single()` の使い分け

```typescript
// ❌ NG: レコードが存在しない可能性がある場合に.single()を使用
const { data } = await supabase
  .from('subscriptions')
  .select()
  .eq('user_id', userId)
  .single();  // ← レコードがないとエラー

// ✅ OK: 新規ユーザーなどレコードがない可能性がある場合
const { data } = await supabase
  .from('subscriptions')
  .select()
  .eq('user_id', userId)
  .maybeSingle();  // ← レコードがなくてもnullを返す（エラーにならない）
```

| メソッド | 結果が0件の場合 | 使用場面 |
|----------|-----------------|----------|
| `.single()` | エラー発生 | 必ず1件存在する場合 |
| `.maybeSingle()` | `null`を返す | 0件または1件の場合 |

---

## React Native Reanimated の注意事項

### `transformOrigin` の手動計算

React Native Reanimatedでは`transformOrigin`が直接サポートされていないため、回転の支点を変更したい場合は手動で計算する必要がある：

```typescript
// 振り子アニメーション例：上端を支点として回転
const PENDULUM_HEIGHT = 120;
const MAX_ANGLE = 25;

const animatedStyle = useAnimatedStyle(() => {
  const angleRad = (rotation.value * Math.PI) / 180;
  
  // 支点（上端中央）からの相対位置を計算
  const translateX = Math.sin(angleRad) * (PENDULUM_HEIGHT / 2);
  const translateY = (1 - Math.cos(angleRad)) * (PENDULUM_HEIGHT / 2);
  
  return {
    transform: [
      { translateX },
      { translateY },
      { rotate: `${rotation.value}deg` },
    ],
  };
});
```

**ポイント**:
- `translateX`と`translateY`で回転前に位置を補正
- 三角関数で支点からの相対移動量を計算
- この順序でtransformを適用: translateX → translateY → rotate

### babel.config.js への追加（必須）

```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],  // ← 必須
  };
};
```

---

## アセットファイルの安全なロード

### サウンドファイルが存在しない場合のフォールバック

```typescript
// lib/soundPlayer.ts
const SOUND_FILES: { [key: string]: any } = {
  click: require('@/assets/sounds/click.mp3'),
  // ... other sounds
};

export class SoundPlayer {
  async loadSound(soundId: string): Promise<void> {
    const file = SOUND_FILES[soundId];
    if (!file) {
      console.warn(`Sound file not found: ${soundId}`);
      return;  // エラーにせず静かに失敗
    }
    // ... ロード処理
  }
}
```

**原則**: 
- アセットが存在しない場合はクラッシュさせない
- 開発中は`console.warn`で通知
- 本番では静かに失敗してUXを維持

---

## 広告SDK可用性の堅牢な処理

AdMob SDKが利用できない場合（Expo Go、初期化失敗）のフォールバック：

```typescript
// components/ads/BannerAd.tsx
const [adsAvailable, setAdsAvailable] = useState(false);
const [adLoadFailed, setAdLoadFailed] = useState(false);

useEffect(() => {
  // SDKが利用可能かチェック
  if (!isExpoGo && GoogleBannerAd) {
    setAdsAvailable(true);
  }
}, []);

if (!adsAvailable || adLoadFailed) {
  return <MockBannerAd />;  // フォールバックUI
}

return (
  <GoogleBannerAd
    onAdFailedToLoad={() => setAdLoadFailed(true)}
    // ...
  />
);
```

---

## 定数定義の規約

### ID命名規則

```typescript
// ✅ 推奨: ケバブケースでカテゴリ-名前
const DEFAULT_PRESETS = [
  { id: 'default-standard', name: 'スタンダード' },
  { id: 'default-slow', name: 'ロングパット' },
  { id: 'default-fast', name: 'ショートパット' },
];

const SOUND_DEFINITIONS = [
  { id: 'click', name: 'クリック' },
  { id: 'electronic', name: 'エレクトロニック' },
];
```

### 一貫したプロパティ名の使用

```typescript
// ❌ NG: 同じ概念に異なるプロパティ名
SOUND_DEFINITIONS.map(sound => sound.type)  // type?
<Text key={sound.type}>{sound.name}</Text>  // type?

// ✅ OK: 一貫してidを使用
SOUND_DEFINITIONS.map(sound => sound.id)
<Text key={sound.id}>{sound.name}</Text>
```

**確認事項**: 型定義（`types/index.ts`）とコンポーネントで同じプロパティ名を使用しているか

---

## 現実的なデフォルト値の設定

### パッティングテンポの例

```typescript
// constants/presets.ts
// 実際のパッティングテンポに基づいた設定
// - ロングパット（3m+）: 約2秒サイクル → 30 BPM
// - ミドルパット（1-3m）: 約1.5秒サイクル → 40 BPM
// - ショートパット（1m以下）: 約1.2秒サイクル → 50 BPM

export const DEFAULT_PRESETS: DefaultPreset[] = [
  { id: 'default-standard', bpm: 40, description: 'ミドルパット（1-3m）' },
  { id: 'default-slow', bpm: 30, description: 'ロングパット（3m以上）' },
  { id: 'default-fast', bpm: 50, description: 'ショートパット（1m以下）' },
];
```

**原則**: 
- 適当な値ではなく実際のユースケースに基づいた値を設定
- デフォルト値の根拠をコメントで記載

---

## ヘッダースタイリングの一貫性

全画面で統一されたヘッダースタイルを使用：

```typescript
// ✅ 推奨: シンプルなヘッダー構造
<View style={[styles.header, { paddingTop: insets.top + 16 }]}>
  <Text style={styles.headerTitle}>画面タイトル</Text>
</View>

// ❌ 非推奨: 画面ごとに異なるヘッダー構造
<BlurView>
  <SafeAreaView>
    <View style={styles.header}>
      {/* ... */}
    </View>
  </SafeAreaView>
</BlurView>
```

---

## メトロノームロジックの実装パターン

### タイミング計算

```typescript
// サイクル時間の計算
const cycleDuration = (60 / bpm) * 1000;  // ms

// バック/フォワード時間の比率計算
const totalRatio = backRatio + forwardRatio;
const backDuration = cycleDuration * (backRatio / totalRatio);
const forwardDuration = cycleDuration * (forwardRatio / totalRatio);
```

### フェーズ管理

```typescript
// useRefでフェーズ状態を管理（再レンダリング回避）
const phaseRef = useRef<'back' | 'forward'>('back');
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const tick = () => {
  const isBack = phaseRef.current === 'back';
  const duration = isBack ? backDuration : forwardDuration;
  
  playFeedback(phaseRef.current);
  phaseRef.current = isBack ? 'forward' : 'back';
  
  timeoutRef.current = setTimeout(tick, duration);
};
```

---

## 参照ドキュメント

- [SPEC.md](SPEC.md) - アプリケーション仕様書
- [DESIGN.md](DESIGN.md) - UIデザイン仕様書
- [GUIDE.md](GUIDE.md) - 開発ガイド
- [tasks/PROGRESS.md](tasks/PROGRESS.md) - タスク進捗管理
