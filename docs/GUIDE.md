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
4. 各画面のスクリーンショットを保存（`docs/screenshots/` に配置）

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
1. https://supabase.com にアクセス
2. 新規プロジェクト作成（プロジェクト名は任意）
3. Supabase Dashboard で「Connect」→「Cursor」ボタンをクリック
4. 表示される指示に従ってCursorに接続
5. Cursorで接続完了を確認

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

### Phase 3: UIを作る

```
@docs/SPEC.md と @docs/DESIGN.md を読み込んで、UIを実装してください。

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
