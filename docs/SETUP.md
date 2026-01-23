# 🔧 セットアップ手順書

このドキュメントでは、Putt Tempoアプリの各種サービス（RevenueCat、AdMob等）のセットアップ手順を説明します。

---

## 📋 目次

- [RevenueCat（課金）のセットアップ](#revenuecat課金のセットアップ)
- [Google AdMob（広告）のセットアップ](#google-admob広告のセットアップ)
- [環境変数の設定](#環境変数の設定)

---

## RevenueCat（課金）のセットアップ

RevenueCatは、App Store / Google Playのアプリ内課金を簡単に実装できるサービスです。Putt Tempoでは、プレミアム機能（¥480買い切り）の購入に使用します。

### 1. RevenueCatアカウント作成

1. https://app.revenuecat.com にアクセス
2. **Sign Up** をクリックしてアカウント作成
3. メールアドレスで認証を完了

### 2. プロジェクト作成

1. RevenueCatダッシュボードにログイン
2. **+ New Project** をクリック
3. プロジェクト名: `Putt Tempo` を入力
4. **Create Project** をクリック

### 3. アプリを追加

#### 3-1. iOSアプリの追加

1. プロジェクト内で **+ Add App** をクリック
2. **Platform**: iOS を選択
3. **App Name**: `Putt Tempo` を入力
4. **Bundle ID**: App Store Connectで設定したBundle IDを入力（例: `com.yourname.putt-tempo`）
5. **Create App** をクリック

#### 3-2. Androidアプリの追加

1. 同じプロジェクト内で **+ Add App** をクリック
2. **Platform**: Android を選択
3. **App Name**: `Putt Tempo` を入力
4. **Package Name**: Google Play Consoleで設定したPackage Nameを入力（例: `com.yourname.putt_tempo`）
5. **Create App** をクリック

### 4. Entitlement（権利）の作成

1. プロジェクト内の **Entitlements** タブを開く
2. **+ New Entitlement** をクリック
3. **Identifier**: `premium` を入力
4. **Display Name**: `Premium` を入力
5. **Create** をクリック

### 5. Product（商品）の作成

#### 5-1. App Store Connectで商品登録（iOS）

1. https://appstoreconnect.apple.com にログイン
2. アプリを選択 → **機能** → **アプリ内課金**
3. **+** をクリック → **非消耗型** を選択
4. 以下の情報を入力:
   - **参照名**: `Putt Tempo Premium`
   - **商品ID**: `putt_tempo_premium`
   - **価格**: ¥480
   - **表示名**: `プレミアム`
   - **説明**: `プレミアム機能をアンロックします。プリセット無制限、10種類のサウンド、広告非表示が利用できます。`
5. **保存** をクリック
6. ステータスを **承認待ち** → **提出** に変更（審査が必要な場合）

#### 5-2. Google Play Consoleで商品登録（Android）

1. https://play.google.com/console にログイン
2. アプリを選択 → **収益化** → **商品** → **アプリ内商品**
3. **商品を作成** をクリック
4. **商品タイプ**: **非消耗型** を選択
5. 以下の情報を入力:
   - **商品ID**: `putt_tempo_premium`
   - **名前**: `プレミアム`
   - **説明**: `プレミアム機能をアンロックします。プリセット無制限、10種類のサウンド、広告非表示が利用できます。`
   - **価格**: ¥480
6. **保存** をクリック
7. **アクティブ** に変更

### 6. RevenueCatでProductを連携

#### 6-1. iOS Productの連携

1. RevenueCatダッシュボード → **Products** タブ
2. iOSアプリを選択
3. **+ Add Product** をクリック
4. **Product Identifier**: `putt_tempo_premium` を入力
5. **Store Product ID**: App Store Connectで作成した商品IDを選択
6. **Entitlement**: `premium` を選択
7. **Add Product** をクリック

#### 6-2. Android Productの連携

1. RevenueCatダッシュボード → **Products** タブ
2. Androidアプリを選択
3. **+ Add Product** をクリック
4. **Product Identifier**: `putt_tempo_premium` を入力
5. **Store Product ID**: Google Play Consoleで作成した商品IDを選択
6. **Entitlement**: `premium` を選択
7. **Add Product** をクリック

### 7. Offering（オファリング）の作成

1. RevenueCatダッシュボード → **Offerings** タブ
2. **+ New Offering** をクリック
3. **Identifier**: `default` を入力
4. **Display Name**: `Default Offering` を入力
5. **Packages** セクションで **+ Add Package** をクリック
6. **Identifier**: `premium` を入力
7. **Product**: `putt_tempo_premium` を選択
8. **Save** をクリック
9. Offeringを **Active** に設定

### 8. API Keyの取得

1. RevenueCatダッシュボード → **Settings** → **API Keys**
2. **Public API Keys** セクションで以下をコピー:
   - **iOS API Key** (例: `appl_xxxxxxxxxxxxx`)
   - **Android API Key** (例: `goog_xxxxxxxxxxxxx`)

### 9. 環境変数に設定

`.env` ファイルを作成（または既存のファイルに追加）:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxx
```

**注意**: `.env` ファイルは `.gitignore` に追加して、Gitにコミットしないようにしてください。

### 10. テスト購入の設定

#### 10-1. iOS（Sandbox テスター）

1. App Store Connect → **ユーザーとアクセス** → **サンドボックステスター**
2. **+** をクリックしてテスト用アカウントを作成
3. デバイスで **設定** → **App Store** → **サンドボックスアカウント** でログイン

#### 10-2. Android（ライセンステスト）

1. Google Play Console → **設定** → **ライセンステスト**
2. テスト用のGmailアカウントを追加
3. そのアカウントでデバイスにログイン

### 11. 動作確認

1. アプリをビルドして実機で実行
2. プレミアム画面で **今すぐアップグレード** ボタンをタップ
3. ストアの購入UIが表示されることを確認
4. テスト購入を実行
5. 購入後、アプリ内でプレミアム機能が有効になることを確認

---

## Google AdMob（広告）のセットアップ

AdMobは、アプリ内に広告を表示するためのサービスです。Putt Tempoでは、ホーム画面下部にバナー広告を表示します。

### 1. AdMobアカウント作成

1. https://admob.google.com にアクセス
2. Googleアカウントでログイン
3. **アプリを追加** をクリック

### 2. アプリの登録

#### 2-1. iOSアプリの登録

1. **プラットフォーム**: iOS を選択
2. **アプリ名**: `Putt Tempo` を入力
3. **Bundle ID**: App Store Connectで設定したBundle IDを入力
4. **登録** をクリック

#### 2-2. Androidアプリの登録

1. **プラットフォーム**: Android を選択
2. **アプリ名**: `Putt Tempo` を入力
3. **パッケージ名**: Google Play Consoleで設定したPackage Nameを入力
4. **登録** をクリック

### 3. 広告ユニットの作成

#### 3-1. バナー広告ユニット

1. アプリを選択 → **広告ユニット** → **広告ユニットを追加**
2. **広告形式**: **バナー** を選択
3. **広告ユニット名**: `Putt Tempo Banner` を入力
4. **作成** をクリック
5. **広告ユニットID** をコピー（例: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`）

### 4. App IDの取得

1. AdMobダッシュボード → **アプリ** タブ
2. 各アプリの **App ID** をコピー:
   - **iOS App ID** (例: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
   - **Android App ID** (例: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

### 5. app.config.tsに設定

`app.config.ts` の `extra` セクションに追加:

```typescript
extra: {
  // AdMob App ID
  admobBannerIdAndroid: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  admobBannerIdIos: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
}
```

### 6. テスト広告の設定

開発中は、AdMobのテスト広告IDを使用します（実装済み）。

---

## 環境変数の設定

### .envファイルの作成

プロジェクトルートに `.env` ファイルを作成:

```bash
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxx

# その他の環境変数（必要に応じて）
```

### .gitignoreの確認

`.env` が `.gitignore` に含まれていることを確認:

```
# .env
.env
.env.local
.env.*.local
```

### 環境変数の読み込み

Expoでは、`EXPO_PUBLIC_` プレフィックスが付いた環境変数が自動的に `process.env` に読み込まれます。

`app.config.ts` で使用:

```typescript
extra: {
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
}
```

---

## チェックリスト

### RevenueCat
- [ ] RevenueCatアカウント作成
- [ ] プロジェクト作成
- [ ] iOS/Androidアプリ追加
- [ ] Entitlement (`premium`) 作成
- [ ] App Store Connectで商品登録
- [ ] Google Play Consoleで商品登録
- [ ] RevenueCatでProduct連携
- [ ] Offering作成・有効化
- [ ] API Key取得
- [ ] 環境変数設定
- [ ] テスト購入確認

### AdMob
- [ ] AdMobアカウント作成
- [ ] iOS/Androidアプリ登録
- [ ] バナー広告ユニット作成
- [ ] App ID取得
- [ ] app.config.tsに設定
- [ ] テスト広告表示確認

---

## トラブルシューティング

### RevenueCat

**問題**: 購入が完了しない
- **解決策**: Sandbox テスター（iOS）またはライセンステスト（Android）が正しく設定されているか確認

**問題**: API Keyエラー
- **解決策**: 環境変数が正しく設定され、アプリを再起動したか確認

**問題**: Productが見つからない
- **解決策**: RevenueCatダッシュボードでProductが正しく連携され、OfferingがActiveになっているか確認

### AdMob

**問題**: 広告が表示されない
- **解決策**: App IDが正しく設定され、広告ユニットIDが正しいか確認。開発中はテスト広告IDを使用

---

## 参考リンク

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Google AdMob Documentation](https://developers.google.com/admob)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
