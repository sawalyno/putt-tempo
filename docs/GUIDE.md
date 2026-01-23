# 📱 AI活用スマホアプリ開発：完全手順書

この手順書は、AI（Cursor/Claude）を最大限に活用して、どんなアプリでも完成させるための実践ガイドです。**テンプレートプロジェクト**をベースに、アイデアから公開まで一貫した流れで進めます。

---

## 📑 目次

- [🏗️ STEP 1：仕様を詰める](#️-step-1仕様を詰める)
- [🛠️ STEP 2：テンプレートからプロジェクトを作成](#️-step-2テンプレートからプロジェクトを作成)
- [📋 STEP 3：プロジェクトをカスタマイズ](#-step-3プロジェクトをカスタマイズ)
- [🎨 STEP 4：UIデザインを作る](#-step-4uiデザインを作る)
- [📋 STEP 4.5：タスク管理をセットアップする](#-step-45タスク管理をセットアップする)
- [🔗 STEP 5：SupabaseとCursorを連携](#-step-5supabaseとcursorを連携)
- [🔧 STEP 6：SupabaseをCursorから設定](#-step-6supabaseをcursorから設定)
- [🚀 STEP 7：アプリを実装する](#-step-7アプリを実装する)
- [📱 STEP 8：動作確認する](#-step-8動作確認する)
- [🎨 STEP 9：デザインを調整する](#-step-9デザインを調整する)
- [💳 STEP 9.5：課金（RevenueCat）を設定する](#-step-95課金revenuecatを設定する)
- [📦 STEP 10：ストア申請準備](#-step-10ストア申請準備)
- [🚢 STEP 11：ビルドして提出](#-step-11ビルドして提出)
- [✅ 完了チェックリスト](#-完了チェックリスト)
- [🆘 困ったときは](#-困ったときは)

---

## 🎁 テンプレートに含まれるもの

このテンプレートには以下が**事前にセットアップ済み**です：

| カテゴリ | 内容 |
|---------|------|
| **認証** | Supabaseクライアント、AuthContext（匿名認証対応） |
| **状態管理** | React Query設定済み |
| **広告** | バナー広告・リワード広告コンポーネント（Expo Goモック対応） |
| **スタイリング** | NativeWind v4 設定済み |
| **定数** | カラー、スペーシング、タイポグラフィ、アニメーション |
| **フック** | useUserSettings, useRewardAd 等 |
| **ドキュメント** | SPEC.md, CODING_STYLE.md テンプレート |

**技術スタック（固定）**
- Frontend: Expo Router, NativeWind v4, TypeScript
- Backend: Supabase (Auth, Database, RPC)
- 状態管理: React Query
- 広告: Google AdMob
- 開発環境: Cursor + Claude

---

## 🏗️ STEP 1：仕様を詰める

### やること
Claude（claude.ai）とチャットしながら、アプリの仕様を固めていく。

### 初回プロンプト
```
私は以下のようなアプリを作りたいです：

[ここにアプリのアイデアを自由に書く]
例:
- 毎日おみくじが引けるアプリ
- 家計簿アプリ
- 読書記録アプリ
- タスク管理アプリ

技術スタック（固定）:
- Frontend: Expo Router, NativeWind v4, TypeScript
- Backend: Supabase (Auth, Database, RPC)

一緒にアプリの仕様を詰めていきたいです。
まず、このアプリに必要な機能を提案してください。
```

### 壁打ちの進め方
Claudeとやり取りしながら以下を決めていく：

1. **機能を詰める** - 必要な機能リストを確定
2. **データ構造を詰める** - テーブル設計を確定
3. **サーバー側ロジックを詰める** - RPC関数の仕様を確定
4. **細かい仕様を詰める** - 認証方式、エラーハンドリング、制約事項

### 仕様書を出力してもらう
仕様が固まったら、最後にClaudeに依頼：

```
ありがとうございます。仕様が固まりました。

これまでの会話を元に、以下の形式で仕様書を作成してください：

# アプリ仕様書

## 1. 機能要件
[確定した機能リスト]

## 2. データ構造
[テーブル定義：カラム名、データ型、制約、リレーション]

## 3. サーバー側ロジック（RPC）
[各RPC関数の詳細仕様]

## 4. 認証方式
[採用する認証方式とその理由]

## 5. エラーハンドリング
[想定されるエラーと対処方法]

## 6. 制約事項
[アプリの制限事項]

markdown形式で、開発者が実装に迷わない詳細度で出力してください。
```

### 成果物
Claudeが出力した仕様書を `docs/SPEC.md` として保存（後でプロジェクトに配置）。

---

## 🛠️ STEP 2：テンプレートからプロジェクトを作成

### やること
テンプレートリポジトリからプロジェクトを作成します。

### 方法1: GitHub CLIを使う（推奨）

```bash
# テンプレートから新規リポジトリを作成
gh repo create my-app --template your-username/expo-supabase-template --private --clone

# プロジェクトに移動
cd my-app

# 依存パッケージをインストール
npm install

# Cursorで開く
cursor .
```

### 方法2: 手動でクローン

```bash
# テンプレートをクローン
git clone https://github.com/your-username/expo-supabase-template.git my-app

# プロジェクトに移動
cd my-app

# Git履歴をリセット
rm -rf .git
git init

# 依存パッケージをインストール
npm install

# 初回コミット
git add .
git commit -m "Initial commit from template"

# Cursorで開く
cursor .
```

### 環境変数の設定

```bash
# .env.exampleをコピー
cp .env.example .env

# .envを編集してSupabaseの値を入力
```

---

## 📋 STEP 3：プロジェクトをカスタマイズ

### やること
テンプレートをアプリに合わせてカスタマイズします。

### 3-1. app.config.ts を編集

Cursor Composerで以下を入力：
```
app.config.ts を以下の内容でカスタマイズしてください：

- アプリ名: [あなたのアプリ名]
- slug: [your-app-slug]
- bundleIdentifier (iOS): com.yourname.yourapp
- package (Android): com.yourname.yourapp
```

### 3-2. package.json の name を変更

```
package.json の name を "your-app-name" に変更してください。
```

### 3-3. docs/SPEC.md を配置

STEP 1で作成した仕様書を `docs/SPEC.md` に配置（上書き）。

### 3-4. 定数ファイルをカスタマイズ（必要に応じて）

アプリのテーマに合わせてカラー等を変更：
- `constants/Colors.ts` - カラーパレット
- `constants/typography.ts` - フォント設定

### コミット
```bash
git add .
git commit -m "Customize template for my-app"
```

---

## 🎨 STEP 4：UIデザインを作る

### 4-1. Stitch用デザインプロンプトを生成する

Claude（claude.ai）に以下のプロンプトを投げて、Stitch用のプロンプトを作ってもらいます。

```
@docs/SPEC.md を読み込んで、Google Stitch用のUIデザインプロンプトを作成してください。

出力ファイル名: docs/STITCH_PROMPT.md
```

### 4-2. Google Stitchでデザインを生成する

1. Google Stitch (https://stitch.google.com) にアクセス
2. `docs/STITCH_PROMPT.md` の内容を貼り付けて実行
3. Stitchが生成したプレビューを確認
4. 各画面のスクリーンショットを保存（`docs/mock/` に配置）

### 4-3. DESIGN.mdを自動生成する

Claude（claude.ai）に以下のプロンプトを投げて `DESIGN.md` を生成します。

```
@docs/SPEC.md と @docs/STITCH_PROMPT.md を読み込んで、開発者向けの docs/DESIGN.md を作成してください。

NativeWindで使用可能な形式でカラー、タイポグラフィ、コンポーネント仕様を出力してください。
```

### コミット
```bash
git add docs/
git commit -m "Add UI design specifications"
```

---

## 📋 STEP 4.5：タスク管理をセットアップする

### やること
開発を効率的に進めるため、タスクを分割して管理します。

### タスク管理ファイルの作成

Cursor Composerで以下を入力：

```
@docs/SPEC.md を読み込んで、開発タスクを分割してください。

以下のファイルを作成してください：
1. docs/tasks/PROGRESS.md（進捗管理ファイル）
2. docs/tasks/task1.md〜taskN.md（個別タスクファイル）

タスク分割の基準:
- 1タスク = 30分〜2時間で完了できる粒度
- 依存関係を明確にする
- 完了条件をチェックリスト形式で記述
```

### コミット
```bash
git add docs/tasks/
git commit -m "Add task management files"
```

---

## 🔗 STEP 5：SupabaseとCursorを連携

### やること

#### 5-1. Supabaseプロジェクト作成
1. https://supabase.com にアクセス
2. 新規プロジェクト作成（**1アプリ = 1プロジェクト**を推奨）
3. プロジェクト作成後、**Project Settings** → **General** で **Reference ID** を確認・控えておく

#### 5-2. グローバルMCP設定（初回のみ）

**Access Tokenの取得:**
1. Supabase Dashboard → **Account Settings**（右上アイコン）→ **Access Tokens**
2. **Generate new token** をクリック
3. 生成されたトークンをコピー

**MCP設定ファイルの作成:**

Windows: `%USERPROFILE%\.cursor\mcp.json`
Mac/Linux: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "YOUR_ACCESS_TOKEN_HERE"
      ]
    }
  }
}
```

#### 5-3. プロジェクト単位のMCP設定（各プロジェクトで実施）

プロジェクトルートに `.cursor/mcp.json` を作成：

```
your-app/
  └── .cursor/
        └── mcp.json
```

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref",
        "YOUR_PROJECT_REF_HERE"
      ]
    }
  }
}
```

**`YOUR_PROJECT_REF_HERE`** を Supabase Dashboard の **Reference ID** に置き換えてください。

> 💡 **ポイント**: グローバル設定にAccess Token、プロジェクト設定にProject Refを分けることで、セキュリティを保ちつつプロジェクトごとに切り替えできます。

#### 5-4. 接続確認
1. **Cursorを再起動**
2. Composerで `@supabase` と入力してMCPが認識されることを確認
3. `list_tables` などのコマンドが使えることを確認

---

## 🔧 STEP 6：SupabaseをCursorから設定

### やること
Cursor Composerを開いて、以下のプロンプトを入力。

```
@docs/SPEC.md を読み込んで、Supabaseのセットアップを完了させてください。

実行内容:
1. 仕様書に記載されている全てのテーブルを作成
2. 初期データがあれば投入
3. サーバー側ロジックをSupabase RPC関数として実装
4. RLSポリシーを適切に設定（⚠️ セキュリティ上非常に重要）
5. 認証方式を有効化（匿名 or メールアドレス）

Supabase MCPを使って、上記を全て実行してください。
```

### .envファイルの設定

Cursorに以下を指示：
```
Supabaseの接続情報を .env ファイルに出力してください。

内容:
EXPO_PUBLIC_SUPABASE_URL=[プロジェクトURL]
EXPO_PUBLIC_SUPABASE_ANON_KEY=[anon key]
```

---

## 🚀 STEP 7：アプリを実装する

### ⚠️ テンプレートの基盤はすでに完成しています

テンプレートには以下が含まれているため、**Phase 1（基盤）は不要**です：
- Supabaseクライアント (`lib/supabase.ts`)
- 認証Context (`contexts/AuthContext.tsx`)
- React Query設定 (`lib/queryClient.ts`)

### Phase 2: データ層を作る

```
@docs/SPEC.md を読み込んで、データ層を実装してください。

実装内容:
1. 必要なカスタムフック作成（React Query使用）
   - 既存の hooks/ を参考に
   - Supabase RPCの呼び出し
2. 型定義ファイル更新 (types/index.ts)

完了したら、該当するタスクファイルの状態を「🟢 完了」に更新してください。
```

### ⚠️ UI実装時の必須確認事項

UI実装タスクを開始する前に、**必ず以下の順序で参照**すること：

#### 1. mockデザインの確認（最優先）
```
docs/mock/
```
- HTMLモックファイルが存在する場合、**これが最も正確なデザイン仕様**
- カラーコード、フォント、スペーシング、エフェクトすべてをmockから取得する
- mockが存在しない画面のみ、ワイヤーフレームを参照する

#### 2. デザインプロンプトの確認
```
docs/STITCH_PROMPT.md
```
- Stitchで生成したUIデザインの詳細仕様
- カラーパレット、タイポグラフィ、コンポーネント仕様が記載

#### 3. タスクファイルのワイヤーフレーム
```
docs/tasks/taskXX.md
```
- ワイヤーフレームは**構造の概要のみ**を示す
- 詳細なビジュアルデザインはmockを優先する

> **重要**: タスクファイルのASCIIワイヤーフレームだけでUI実装を進めてはいけない。mockデザインが存在する場合は必ずそちらを参照すること。

---

### Phase 3: UIを作る

```
@docs/SPEC.md と @docs/DESIGN.md と @docs/mock/ を読み込んで、UIを実装してください。

## 実装手順

### Step 1: 定数ファイルの更新
DESIGN.md に合わせて constants/ 配下のファイルを更新

### Step 2: 共通コンポーネントの作成
components/ 配下に各コンポーネントを作成

### Step 3: 画面の実装
app/(tabs)/ 配下に各画面を作成

### Step 4: アニメーションの実装
React Native Reanimated 3 を使用

完了したら、該当するタスクファイルの状態を「🟢 完了」に更新してください。
```

### Phase 4: 広告を実装する

テンプレートには広告コンポーネントが含まれています：
- `components/ads/BannerAd.tsx`
- `hooks/useRewardAd.ts`

```
広告を画面に配置してください。

1. バナー広告: 必要な画面の下部に <BannerAd /> を配置
2. リワード広告: useRewardAd フックを使用して実装

app.config.ts の AdMob ID は本番リリース前に更新してください。
```

### コミット
```bash
git add .
git commit -m "Implement app features"
```

---

## 📱 STEP 8：動作確認する

### 開発サーバー起動
```bash
npx expo start
```

### Expo Go の制限事項
- **広告はExpo Goでは動作しません**（モック表示されます）
- 広告テストは Development Build が必要

### Development Build の作成（広告テスト用）

```bash
# EAS CLIでログイン
eas login

# Development Build をビルド
eas build --profile development --platform android
# または ios
```

### 確認項目
- [ ] アプリが起動する
- [ ] 各画面が表示される
- [ ] データの作成・読み取り・更新・削除ができる
- [ ] エラーハンドリングが適切に動作する

---

## 🎨 STEP 9：デザインを調整する

```
@docs/DESIGN.md のスクリーンショット画像を見てください。

現在の実装と比較して以下が違います:
[具体的な差異を箇条書き]

Stitchのデザインに合わせて修正してください。
```

---

## 💳 STEP 9.5：課金（RevenueCat）を設定する

アプリ内課金を実装する場合、RevenueCatを使用します（ストア課金のレシート検証・状態管理を肩代わりしてくれます）。

> 重要：**Expo Go では RevenueCat（`react-native-purchases`）は動きません。**  
> 課金の動作確認は **Development Build / TestFlight / 内部テスト** が必要です。

このSTEPは「買い切り（Non‑Consumable / One‑time purchase）」を前提にしています。

### 9.5-1. RevenueCatアカウント作成 → プロジェクト作成

1. `https://app.revenuecat.com` にアクセスしてアカウント作成
2. **New Project** でプロジェクト作成

### 9.5-2. RevenueCatにアプリを追加（iOS / Android）

RevenueCatのプロジェクト内で **Apps & providers**（または Apps）から追加します。

- **iOS**: Bundle ID を入力して追加
- **Android**: Package Name を入力して追加

### 9.5-3. つまずきポイント：ストア連携（資格情報）を先に設定する

RevenueCatは「ストアから商品情報を取り込む」ために、**サーバー側の資格情報連携**が必要です。ここが未設定だと、Products/Offeringsが作れず手順が止まります。

#### iOS（App Store Connect 連携）

1. App Store Connect で **App Store Connect API Key** を作成（`.p8` を取得）
2. RevenueCat側の iOSアプリ設定で **App Store Connect API Key** を登録（Issuer ID / Key ID / `.p8`）

> StoreKit2を使う構成でも、RevenueCat側の「App Store Connect API Key連携」は必要です（商品インポート目的）。

#### Android（Google Play 連携）

1. Google Cloud / Google Play Console で **サービスアカウント（JSON）** を用意
2. RevenueCat側の Androidアプリ設定で **Play service credentials** を登録

> 注意：Google側の権限反映に時間がかかることがあります（数時間〜最大で丸一日程度）。

### 9.5-4. ストアで商品（SKU）を作成

#### iOS（App Store Connect）

1. アプリ → **機能** → **アプリ内課金**
2. **非消耗型（Non‑Consumable）** を作成
3. 例：
   - **Product ID**: `putt_tempo_premium`
   - **価格**: ¥480

#### Android（Google Play Console）

1. アプリ → **収益化** → **商品** → **アプリ内商品**
2. **1回限りの商品（One‑time product）** を作成
3. 例：
   - **Product ID**: `putt_tempo_premium`
   - **価格**: ¥480

### 9.5-5. RevenueCatで商品を取り込む（Import）→ Entitlement/Offeringに紐付ける

1. RevenueCatで **Entitlements** を作成
   - **Identifier**: `premium`（アプリ側コードと一致させる）
2. RevenueCatで **Products** を作成/インポート
   - ストア連携が正しくできていれば **ストアから商品をインポート**できます
3. RevenueCatで **Offerings** を作成し、Packageを追加
   - Offering: `default`（例）
   - Package: **Lifetime**（買い切りの場合、Lifetimeパッケージに紐付けるのが分かりやすい）
4. Offeringを **Current/Active** に設定

### 9.5-6. API Key（Public SDK Key）を取得

RevenueCat → **Project Settings / API Keys** から、各プラットフォームの **Public SDK Key** を取得します。

- iOS: `appl_...`
- Android: `goog_...`

### 9.5-7. Expoの環境変数を設定（このリポジトリの実装に合わせる）

`.env` に追加してから、**開発サーバーを再起動**してください。

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxx
```

> 重要：課金の検証は **Development Build** で行ってください（Expo Go不可）。

### 9.5-8. テスト購入の設定（最短で動かすコツ）

- **iOS**: Sandbox テスターを作成し、TestFlight/実機で購入テスト
- **Android**: 内部テスト（Internal testing）に配布し、ライセンステスターで購入テスト

### 9.5-9. よくある原因（Offeringsがnull / 購入UIが出ない）

- RevenueCat側で **Offerings が Current/Active になっていない**
- RevenueCat側で **ストア資格情報（iOS: ASC API key / Android: Service Account）が未設定**
- ストア側で **商品が未アクティブ / 国・価格未設定 / 対象バージョン未配布**
- **Expo Goで試している**（Development Buildが必要）

### 参考：このリポジトリの実装の読み方（キー参照）

このプロジェクトでは `app.config.ts` の `extra` 経由でキーを読みます（実装: `lib/purchases.ts`）。

```typescript
import Constants from 'expo-constants';

const iosKey = Constants.expoConfig?.extra?.revenueCatIosKey;
const androidKey = Constants.expoConfig?.extra?.revenueCatAndroidKey;
```

### チェックリスト（最低限）

- [ ] iOS/AndroidアプリをRevenueCatに追加した
- [ ] **ストア連携（資格情報）** をRevenueCatに登録した
- [ ] ストア側で商品（SKU）を作成・有効化した
- [ ] RevenueCatでEntitlement `premium` を作成した
- [ ] RevenueCatでOfferingを作成し、**Current/Active** にした
- [ ] Public SDK Key を `.env` に設定した
- [ ] **Development Build** で購入テストした

---

## 📦 STEP 10：ストア申請準備

### 作成するもの

| ファイル | 説明 |
|---------|------|
| `assets/images/icon.png` | アプリアイコン (1024x1024) |
| `assets/images/adaptive-icon.png` | Android用アダプティブアイコン |
| `assets/images/splash-icon.png` | スプラッシュ画面 |
| プライバシーポリシー | GitHub Pages等で公開 |
| ストア説明文 | `docs/STORE_LISTING.md` |

### app.config.ts 最終確認

本番用に以下を更新：
- AdMob App ID（テスト用 → 本番用）
- bundleIdentifier / package
- version / versionCode

---

## 🚢 STEP 11：ビルドして提出

### ビルド実行
```bash
# iOSビルド
eas build --platform ios --profile production

# Androidビルド
eas build --platform android --profile production
```

### ストア提出
1. ビルド完了後、ファイルをダウンロード
2. Google Play Console / App Store Connect にアップロード
3. ストア情報を入力して審査に提出

---

## ✅ 完了チェックリスト

### セットアップ
- [ ] テンプレートからプロジェクトを作成した
- [ ] `docs/SPEC.md` に仕様を記載した
- [ ] app.config.ts をカスタマイズした

### 機能実装
- [ ] Supabaseのテーブル・RPC・RLSを設定した
- [ ] データ層（カスタムフック）を実装した
- [ ] 画面を実装した
- [ ] 広告を配置した

### リリース準備
- [ ] アイコン・スプラッシュを作成した
- [ ] プライバシーポリシーを公開した
- [ ] ストア説明文を作成した
- [ ] app.config.ts を本番用に更新した

### ストア提出
- [ ] Production Build を作成した
- [ ] 各ストアに提出した
- [ ] 審査を通過した

---

## 🆘 困ったときは

### エラーが出た
```
以下のエラーが出ています。
@docs/SPEC.md の仕様に従って修正してください。

[エラーメッセージをコピペ]
```

### デザインが思った通りにならない
```
@docs/DESIGN.md のスクリーンショットと比較して、
[具体的にどこが違うか] を修正してください。
```

### 広告が表示されない
```
広告の実装を確認してください。
- Development Build でテストしていますか？（Expo Goでは動作しません）
- app.config.ts の AdMob App ID は設定されていますか？
```

### タスクの進捗が分からなくなった
```
@docs/tasks/PROGRESS.md を読み込んで、以下を教えてください：
- 現在の全体進捗率
- 未完了のタスク一覧
- 次に着手すべきタスク
```

---

## 💡 この手順の利点

1. **テンプレートで時短** - 基盤構築が不要、すぐに機能実装に着手できる
2. **技術スタックが固定** - 迷わない、調べる時間が不要
3. **AIにタスクを丸投げ** - コードを書かなくても進む
4. **セキュリティを意識** - RLSの重要性を明示
5. **広告実装済み** - Expo Go対応モック付きで開発しやすい

この手順を使えば、どんなアプリでもAIの力で完成します！🚀
