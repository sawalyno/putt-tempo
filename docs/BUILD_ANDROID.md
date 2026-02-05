# Android ビルド手順（EAS Build）

## 前提

- Node.js と npm が入っていること
- [Expo](https://expo.dev) アカウントで `eas login` 済みであること

## 1. アイコン（初回 or 差し替え時）

プレースホルダーでよい場合:

```bash
node scripts/generate-placeholder-icons.js
```

本番用は task25 / task26 のアイコン・スプラッシュに差し替えてください。

## 2. Android ビルド

**必ず自分のターミナルで実行してください。** 初回は Android キーストア生成のため対話入力が必要です。

```bash
cd c:\project\putt-tempo
npx eas-cli build --platform android --profile preview
```

- **「Generate a new Android Keystore?」** → **Y** を選択（Expo がキーストアを生成・管理）
- ビルドは Expo のクラウドで実行され、完了後にダウンロード用 URL が表示されます

## 3. プロファイルの違い（eas.json）

| プロファイル   | 用途           | 成果物 |
|----------------|----------------|--------|
| `preview`     | 社内テスト用   | APK（内部配布向け） |
| `development`  | 開発用（expo-dev-client） | 開発用ビルド |
| `production`  | ストア提出用   | AAB（Google Play 用） |

ストア提出用:

```bash
npx eas-cli build --platform android --profile production
```

## 4. よくあるエラー

- **「EAS project not configured」**  
  → `npx eas-cli init` を実行（既に実行済みの場合は不要）

- **「Generate a new Android Keystore?」で止まる**  
  → 対話モードが必要なため、必ず自分のターミナルで `eas build` を実行する

- **アイコンがない**  
  → `node scripts/generate-placeholder-icons.js` でプレースホルダーを生成する
