# 📱 AI活用スマホアプリ開発：完全手順書

この手順書は、AI（Cursor/Claude/Stitch）を最大限に活用して、どんなアプリでも完成させるための実践ガイドです。技術スタックは固定し、アイデアから公開まで一貫した流れで進めます。

---

## 📑 目次

- [🏗️ STEP 1：仕様を詰める](#️-step-1仕様を詰める)
- [🛠️ STEP 2：プロジェクトを作る](#️-step-2プロジェクトを作る)
- [📋 STEP 3：開発ルールとNativeWindを設定する](#-step-3開発ルールとnativewindを設定する)
- [🎨 STEP 4：UIデザインを作る](#-step-4uiデザインを作る)
  - [4-1. Stitch用デザインプロンプトを生成する](#4-1-stitch用デザインプロンプトを生成する)
  - [4-2. Google Stitchでデザインを生成する](#4-2-google-stitchでデザインを生成する)
  - [4-3. DESIGN.mdを自動生成する](#4-3-designmdを自動生成する)
  - [4-4. ファイル構成の確認](#4-4-ファイル構成の確認)
- [📋 STEP 4.5：タスク管理をセットアップする](#-step-45タスク管理をセットアップする)
- [🔗 STEP 5：SupabaseとCursorを連携](#-step-5supabaseとcursorを連携)
- [🔧 STEP 6：SupabaseをCursorから設定](#-step-6supabaseをcursorから設定)
- [🚀 STEP 7：アプリを実装する](#-step-7アプリを実装する)
  - [Phase 1: 基盤を作る](#phase-1-基盤を作る)
  - [Phase 2: データ層を作る](#phase-2-データ層を作る)
  - [Phase 3: UIを作る](#phase-3-uiを作る)
  - [Phase 4: 広告を実装する](#phase-4-広告を実装する)
- [📱 STEP 8：動作確認する](#-step-8動作確認する)
- [🎨 STEP 9：デザインを調整する](#-step-9デザインを調整する)
- [📦 STEP 10：ストア申請準備](#-step-10ストア申請準備)
  - [10.1 アプリアイコン作成](#101-アプリアイコン作成)
  - [10.2 スプラッシュ画面作成](#102-スプラッシュ画面作成)
  - [10.3 プライバシーポリシー作成・公開](#103-プライバシーポリシー作成公開)
  - [10.4 ストア説明文作成](#104-ストア説明文作成)
  - [10.5 スクリーンショット撮影](#105-スクリーンショット撮影)
  - [10.6 app.config.ts 最終確認](#106-appconfigts-最終確認)
- [🚢 STEP 11：ビルドして提出](#-step-11ビルドして提出)
- [✅ 完了チェックリスト](#-完了チェックリスト)
- [🆘 困ったときは](#-困ったときは)
- [💡 この手順の利点](#-この手順の利点)

**技術スタック（固定）**
- Frontend: Expo Router, NativeWind v4, TypeScript
- Backend: Supabase (Auth, Database, RPC)
- UI生成: Google Stitch
- 開発環境: Cursor + Claude Code（Opus使用可能）
- バージョン管理: GitHub

**開発者情報**
- お問い合わせメールアドレス: sawalyno@gmail.com
- アプリ内サポート連絡先、プライバシーポリシー、ストア掲載情報にはこのアドレスを使用する

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

1. **機能を詰める**
   - Claudeが提案した機能リストを見る
   - 「この機能は不要」「こういう機能も追加したい」と伝える
   - 機能が確定するまで繰り返す

2. **データ構造を詰める**
   ```
   機能が固まりました。
   次に、必要なテーブル構造を提案してください。
   ```
   - Claudeの提案を見て、カラムの追加・削除を相談
   - リレーションシップの確認

3. **サーバー側ロジックを詰める**
   ```
   どの処理をSupabase RPCで実装すべきですか？
   それぞれのRPC関数の仕様を教えてください。
   ```

4. **細かい仕様を詰める**
   - 認証方式（匿名 or メール）
   - エラーハンドリング
   - 制約事項（制限、上限など）

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

### 仕様書の例（おみくじアプリの場合）

```markdown
# おみくじアプリ仕様書

## 1. 機能要件
- 1日1回おみくじを引ける
- 過去の結果を履歴として閲覧できる
- 匿名認証でデータを永続化

## 2. データ構造
### fortunes テーブル
| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | uuid | PK | 一意識別子 |
| user_id | uuid | FK → auth.users | ユーザーID |
| result | text | NOT NULL | 運勢（大吉〜凶） |
| message | text | NOT NULL | おみくじメッセージ |
| drawn_at | date | NOT NULL | 引いた日付 |

## 3. サーバー側ロジック（RPC）
### draw_fortune()
- 今日すでに引いている場合はエラー
- ランダムに運勢を決定して保存
- 結果を返却

## 4. 認証方式
匿名認証（signInAnonymously）

## 5. エラーハンドリング
- ALREADY_DRAWN: 本日はすでに引いています
- NETWORK_ERROR: 通信エラー

## 6. 制約事項
- 1日1回のみ引ける
- 履歴は最新100件まで表示
```

### 成果物
Claudeが出力した仕様書を `docs/SPEC.md` として保存（後でプロジェクトに配置）。

---

## 🛠️ STEP 2：プロジェクトを作る

### やること
ターミナルで以下を順番に実行。

```bash
# 1. Expoプロジェクト作成
npx create-expo-app@latest my-app --template tabs

# 2. プロジェクトに移動
cd my-app

# 3. 必要なパッケージをインストール（バージョン指定に注意）
npm install nativewind@^4.0.0 tailwindcss@^3.4.0 @supabase/supabase-js @tanstack/react-query lucide-react-native react-native-svg

# 4. Tailwind設定ファイル生成
npx tailwindcss init

# 5. Gitリポジトリ初期化
git init
git add .
git commit -m "Initial commit"

# 6. Cursorでプロジェクトを開く
cursor .
```

### やること（続き）
`docs` フォルダを作成し、必要なファイルを配置。

```bash
mkdir docs
# SPEC.md を docs/ に配置
# この手順書も docs/GUIDE.md として保存
```

### GitHub連携（複数端末で開発する場合）

#### 初回セットアップ（メイン端末）

**事前準備（初回のみ）**
```bash
# GitHub CLIをインストール（まだの場合）
# Mac
brew install gh

# Windows
winget install GitHub.cli

# GitHub認証（初回のみ）
gh auth login
# → ブラウザが開くので、GitHubにログインして認証
```

**Cursorからリポジトリ作成**

Cursor Composer（Cmd/Ctrl + I）で以下を入力：
```
GitHubにプライベートリポジトリを作成して、コードをプッシュしてください。
リポジトリ名: my-app
```

Cursorが以下を実行してくれます：
```bash
gh repo create my-app --private --source=. --push
```

これだけでGitHubリポジトリの作成・連携・プッシュが完了します。

#### 別端末でのセットアップ

Cursorで新規ウィンドウを開き、Composerで以下を入力：
```
以下のGitHubリポジトリをクローンして、セットアップしてください。
https://github.com/あなたのユーザー名/my-app
```

Cursorが以下を実行してくれます：
```bash
git clone https://github.com/あなたのユーザー名/my-app.git
cd my-app
npm install
```

その後、`.env` ファイルを手動で作成：
```bash
cp .env.example .env
# ※ Supabaseの値を入力する
```

#### 日々の開発フロー

Cursor Composerで簡単に操作できます：

```
# 作業開始時
最新のコードをpullしてください

# 作業終了時
変更をコミットしてプッシュしてください。メッセージ: 〇〇機能を実装
```

または手動で：
```bash
git pull                           # 作業開始時
git add . && git commit -m "内容" && git push  # 作業終了時
```

#### ⚠️ 注意事項
- `.env` ファイルはGitにプッシュされません（セキュリティのため）
- 各端末で `.env` ファイルを個別に作成してください
- `node_modules` もプッシュされないので、クローン後は `npm install` が必要です

---

## 📋 STEP 3：開発ルールとNativeWindを設定する

### Cursorのモデル設定

Cursor Settings → Models で以下をONにする：

| モデル | ON/OFF | 用途 |
|--------|--------|------|
| **Opus 4.5** | ✅ ON | 複雑なタスク・設計 |
| **Sonnet 4.5** | ✅ ON | 日常のコーディング |

### 使い分けの目安

| 用途 | 推奨モデル | 理由 |
|------|-----------|------|
| 日常的なコーディング | Sonnet 4.5 | コスパ良い |
| 複雑な設計・難問 | Opus 4.5 | 高性能 |

### ⚠️ Cursorのプラン

| プラン | 料金 | 特徴 |
|--------|------|------|
| **Free** | 無料 | 制限あり |
| **Pro** | $20/月 | 月500回の高速リクエスト、Opus使用可能 |

**→ 本格的な開発には Pro プラン ($20/月) を推奨**

### やること
Cursor Composer（Cmd/Ctrl + I）を開いて、以下のプロンプトを入力。

### プロンプト
```
プロジェクトの開発ルールとNativeWind v4のセットアップを完了させてください。

1. .cursorrules ファイルを作成
内容:
- 技術スタック: Expo Router, NativeWind v4, TypeScript Strict, React Query, Supabase
- コーディング規約: 関数コンポーネント、カスタムフック、エラーハンドリング必須
- 重要な制約: サーバーロジックはRPC実装、APIキーは環境変数、@docs/SPEC.md を参照

2. .env.example ファイルを作成
内容:
- EXPO_PUBLIC_SUPABASE_URL=
- EXPO_PUBLIC_SUPABASE_ANON_KEY=

3. .gitignore に .env を追加

4. NativeWind v4 のセットアップ
- tailwind.config.js の content 設定（app/**/*.tsx, components/**/*.tsx）
- global.css の作成（@tailwind base; @tailwind components; @tailwind utilities;）
- metro.config.js の設定（withNativeWind wrapper）
- babel.config.js への nativewind/babel プリセット追加
- app/_layout.tsx で global.css をインポート

上記を全て実装してください。
```

### やること（続き）
```bash
git add .cursorrules .env.example .gitignore docs/ tailwind.config.js global.css metro.config.js babel.config.js
git commit -m "Add development rules, NativeWind setup, and specifications"
```

---

## 🎨 STEP 4：UIデザインを作る

このステップでは、AIを使って**Stitch用デザインプロンプト**と**DESIGN.md**を自動生成します。

### 4-1. Stitch用デザインプロンプトを生成する

Claude（claude.ai）に以下のプロンプトを投げて、Stitch用のプロンプトを作ってもらいます。

#### プロンプト（そのままコピーして使用）
````
@docs/SPEC.md を読み込んで、Google Stitch用のUIデザインプロンプトを作成してください。

## 出力形式
以下の構成でMarkdown形式で出力してください。Google Stitchにそのまま貼り付けられる形式にしてください。

## 必須セクション

### 1. アプリ概要
- アプリの目的と特徴を簡潔に説明

### 2. 必要な画面構成
各画面について以下を含める：
- 画面名と目的
- ASCII図でレイアウト構成を視覚化（例↓）
```
┌─────────────────────────┐
│      ヘッダー            │
├─────────────────────────┤
│      メインコンテンツ     │
├─────────────────────────┤
│      フッター/タブバー    │
└─────────────────────────┘
```
- 各UI要素の詳細（サイズ、色、状態変化）

### 3. デザイン要件
- デザインシステム（Material Design 3準拠）
- カラーパレット（Primary/Secondary/Accent/運勢別など、HEXコードで指定）
- タイポグラフィ（フォント、サイズ、ウェイト）
- スペーシング（8dpグリッド）
- Elevation（影のレベル）
- 角丸（Corner Radius）

### 4. アニメーション仕様
各アニメーションについて：
- トリガー（何をしたら動くか）
- 動作（どう動くか、具体的な値）
- 実装詳細（イージング、所要時間）

### 5. 操作フロー
ユーザーの操作を時系列で記述（矢印で接続）
```
操作A
  ↓
【システム】処理B
  ↓
画面Cに遷移
```

### 6. レスポンシブデザイン
- 画面サイズ別の対応
- セーフエリア対応（iOS/Android）

### 7. アクセシビリティ
- コントラスト比
- タップターゲットサイズ
- スクリーンリーダー対応

### 8. デザイントークン（JSON形式）
```json
{
  "colors": { ... },
  "spacing": { ... },
  "radius": { ... },
  "elevation": { ... },
  "typography": { ... },
  "animation": { ... }
}
```

### 9. 絵柄/アイコンデザイン詳細（該当する場合）
- 各アイコンの形状、色、サイズ

### 10. 効果音仕様（該当する場合）
- 効果音リスト、形式、仕様

### 11. 状態別デザイン
- エラー状態
- ローディング状態
- 空状態（Empty State）
- 成功状態のフィードバック

### 12. マイクロインタラクション
- ボタン押下、タブ切り替え、スライダー操作など

### 13. 実装時の注意事項
- パフォーマンス
- Dark Mode対応
- 画像アセット仕様

出力ファイル名: `docs/STITCH_PROMPT.md`
````

#### 成果物
Claudeが出力したプロンプトを `docs/STITCH_PROMPT.md` として保存。

---

### 4-2. Google Stitchでデザインを生成する

1. Google Stitch (https://stitch.google.com) にアクセス
2. `docs/STITCH_PROMPT.md` の内容を貼り付けて実行
3. Stitchが生成したプレビューを確認
4. 各画面のスクリーンショットを保存（`docs/screenshots/` に配置）

---

### 4-3. DESIGN.mdを自動生成する

Stitchで生成されたデザインを確認したら、Claude（claude.ai）に以下のプロンプトを投げて `DESIGN.md` を生成します。

#### プロンプト（そのままコピーして使用）
````
@docs/SPEC.md と @docs/STITCH_PROMPT.md を読み込んで、開発者向けの `docs/DESIGN.md` を作成してください。

## 出力形式
Markdown形式で、以下の構成で出力してください。

## 必須セクション

### 1. デザイン概要
- デザインコンセプト
- 参考にしたモチーフ

### 2. カラーシステム
STITCH_PROMPT.mdから抽出し、以下の形式で整理：

```typescript
// constants/colors.ts として使用可能な形式
export const colors = {
  primary: '#1a237e',
  secondary: '#283593',
  // ... 全色をリスト
};
```

### 3. タイポグラフィシステム
NativeWind/Tailwindで使用可能な形式：

```typescript
// constants/typography.ts
export const typography = {
  displayLarge: 'text-5xl font-bold',
  headlineLarge: 'text-3xl font-bold',
  // ...
};
```

### 4. スペーシング・レイアウト
- 8dpグリッドシステムの値
- 各コンポーネントのマージン・パディング

### 5. コンポーネント仕様
各コンポーネントについて：
- コンポーネント名
- NativeWindクラス（className）
- 状態別スタイル（通常/押下/無効）
- アニメーション（React Native Animated/Reanimatedで実装可能な形式）

例：
```typescript
// components/PrimaryButton の仕様
{
  className: 'bg-red-600 px-8 py-4 rounded-lg',
  activeClassName: 'scale-95 bg-red-700',
  disabledClassName: 'bg-gray-400 opacity-50',
  animation: {
    type: 'scale',
    duration: 50,
    toValue: 0.95,
  }
}
```

### 6. 画面別レイアウト仕様
各画面について：
- 画面名
- ファイルパス（app/(tabs)/xxx.tsx）
- レイアウト構造（親子関係）
- 使用コンポーネント一覧

### 7. アニメーション実装ガイド
React Native Animated または Reanimated 3 で実装可能な形式：

```typescript
// animations/reelSpin.ts
export const reelSpinConfig = {
  duration: 100, // ms per item
  easing: Easing.linear,
  blur: 4, // dp
};
```

### 8. アイコン・画像アセット一覧
| アセット名 | サイズ | 形式 | 保存先 |
|-----------|--------|------|--------|
| icon-seven | 60x60dp | SVG | assets/icons/ |
| ... | | | |

### 9. 効果音アセット一覧（該当する場合）
| 効果音名 | 長さ | 形式 | 保存先 |
|---------|------|------|--------|
| lever | 0.2s | MP3 | assets/sounds/ |
| ... | | | |

### 10. 実装チェックリスト
- [ ] カラー定数を定義した
- [ ] タイポグラフィ定数を定義した
- [ ] 各コンポーネントを実装した
- [ ] アニメーションを実装した
- [ ] アセットを配置した

出力ファイル名: `docs/DESIGN.md`
````

#### 成果物
Claudeが出力したデザインドキュメントを `docs/DESIGN.md` として保存。

---

### 4-4. ファイル構成の確認

この時点で `docs/` フォルダには以下のファイルがあるはず：

```
docs/
├── SPEC.md           # アプリ仕様書（STEP 1で作成）
├── STITCH_PROMPT.md  # Stitch用デザインプロンプト（4-1で作成）
├── DESIGN.md         # 開発者向けデザインドキュメント（4-3で作成）
└── screenshots/      # Stitchのスクリーンショット（4-2で保存）
    ├── home.png
    ├── result.png
    └── ...
```

### コミット
```bash
git add docs/
git commit -m "Add UI design specifications (STITCH_PROMPT.md, DESIGN.md)"
```

---

### 💡 補足：DESIGN.md の活用方法

DESIGN.md は STEP 7（UI実装）で以下のように活用されます：

1. **Cursor Composer** が `@docs/DESIGN.md` を参照
2. カラー定数やタイポグラフィをそのままコピー
3. コンポーネント仕様に従って実装
4. アニメーション設定をそのまま使用

これにより、Stitchのデザインを忠実に再現できます。

---

## 📋 STEP 4.5：タスク管理をセットアップする

### やること
開発を効率的に進めるため、タスクを分割して管理します。

### タスク管理ファイルの作成

Cursor Composer（Cmd/Ctrl + I）で以下を入力：

```
@docs/SPEC.md を読み込んで、開発タスクを分割してください。

## 出力形式
以下のファイルを作成してください：

### 1. docs/tasks/PROGRESS.md（進捗管理ファイル）
全タスクの一覧と進捗状況を管理：

```markdown
# 開発進捗管理

## 概要
- プロジェクト名: [アプリ名]
- 開始日: YYYY-MM-DD
- 目標完了日: YYYY-MM-DD

## 進捗サマリー
| フェーズ | タスク数 | 完了 | 進捗率 |
|---------|---------|------|--------|
| Phase 1: 基盤 | 4 | 0 | 0% |
| Phase 2: データ層 | 5 | 0 | 0% |
| Phase 3: UI | 6 | 0 | 0% |
| Phase 4: 広告 | 4 | 0 | 0% |
| Phase 5: リリース準備（ドキュメント） | 4 | 0 | 0% |
| Phase 6: ストアアセット | 2 | 0 | 0% |
| Phase 7: AdMob設定 | 3 | 0 | 0% |
| Phase 8: ビルド | 2 | 0 | 0% |
| Phase 9: Google Play Console設定（Android） | 3 | 0 | 0% |
| Phase 10: 内部テスト（Android） | 4 | 0 | 0% |
| Phase 11: 本番リリース（Android） | 4 | 0 | 0% |
| Phase 12: App Store Connect設定（iOS） | 3 | 0 | 0% |
| Phase 13: TestFlight内部テスト（iOS） | 4 | 0 | 0% |
| Phase 14: 本番リリース（iOS） | 4 | 0 | 0% |
| **合計** | **52** | **0** | **0%** |

## タスク一覧
| ID | タスク名 | ファイル | 状態 | 担当 | 備考 |
|----|---------|----------|------|------|------|
| task1 | Supabaseクライアント作成 | [task1.md](task1.md) | 🔴 未着手 | - | - |
| task2 | 認証実装 | [task2.md](task2.md) | 🔴 未着手 | - | - |
| ... | ... | ... | ... | ... | ... |

## 状態の凡例
- 🔴 未着手
- 🟡 作業中
- 🟢 完了
- ⏸️ 保留
- ❌ キャンセル
```

### 2. docs/tasks/task1.md〜taskN.md（個別タスクファイル）
各タスクの詳細を記述：

```markdown
# Task 1: Supabaseクライアント作成

## 概要
- **フェーズ**: Phase 1: 基盤
- **優先度**: 高
- **見積時間**: 30分
- **依存タスク**: なし

## 目的
Supabaseとの接続を確立するクライアントを作成する

## 実装内容
1. lib/supabase.ts を作成
2. 環境変数から接続情報を読み込み
3. Supabaseクライアントをエクスポート

## 完了条件
- [ ] lib/supabase.ts が作成されている
- [ ] 環境変数（EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY）を使用している
- [ ] エラーハンドリングが実装されている

## 参照
- @docs/SPEC.md の認証方式セクション

## 作業ログ
| 日時 | 作業内容 | 結果 |
|------|---------|------|
| - | - | - |

## メモ
（作業中の気づきや注意点をここに記録）
```

## タスク分割の基準
- 1タスク = 30分〜2時間で完了できる粒度
- 依存関係を明確にする
- 完了条件をチェックリスト形式で記述

各フェーズごとにタスクを作成してください。
```

### 3. 画像生成タスクのガイドライン

アプリアイコン、フィーチャーグラフィック、スプラッシュスクリーンなど、画像生成が必要なタスクには**AI画像生成用プロンプト**を必ず含めてください。

```markdown
## AI画像生成プロンプト

### プロンプト（英語版 - 推奨）
```
[詳細な英語プロンプト]
- サイズ指定（例: 1024x1024 pixels）
- デザイン要素の詳細
- カラーパレット（HEXコード付き）
- スタイル指定
- 含めない要素（例: NO text）
```

### プロンプト（日本語版）
```
[日本語プロンプト]
```

### 代替プロンプト（シンプル版）
```
[短いシンプルなプロンプト]
```

## 推奨ツール
- **Midjourney**: `--ar X:Y` パラメータ
- **DALL-E 3**: サイズ指定方法
- **Leonardo.ai**: アスペクト比設定

## 生成後の調整
1. サイズ調整手順
2. 形式変換（PNG等）
3. 品質チェック項目
```

#### 画像タスクの例
- アプリアイコン（1024x1024）→ task20.md
- フィーチャーグラフィック（1024x500）→ task25.md
- スプラッシュスクリーン（各種サイズ）
- App Storeスクリーンショット（必要に応じて加工）

### ディレクトリ構造

タスク管理ファイルを配置後：
```
docs/
├── SPEC.md
├── STITCH_PROMPT.md
├── DESIGN.md
├── screenshots/
└── tasks/
    ├── PROGRESS.md      # 進捗管理（メイン）
    ├── task1.md         # 個別タスク
    ├── task2.md
    ├── task3.md
    └── ...
```

### タスクの進め方

#### 1. 作業開始時
```
@docs/tasks/PROGRESS.md を確認して、次に着手すべきタスクを教えてください。
依存関係を考慮して、今すぐ開始できるタスクを提案してください。
```

#### 2. タスク着手時
```
@docs/tasks/task1.md の実装を開始します。
タスクの状態を「🟡 作業中」に更新してください。
```

#### 3. タスク完了時
```
@docs/tasks/task1.md の実装が完了しました。
- 完了条件をチェック
- 状態を「🟢 完了」に更新
- 作業ログに記録
- PROGRESS.md の進捗率を更新
してください。
```

### 進捗確認

いつでも以下で進捗を確認できます：
```
@docs/tasks/PROGRESS.md を読み込んで、現在の進捗状況をサマリーで教えてください。
残りのタスクと推定完了時間も教えてください。
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
5. Cursorで接続完了を確認（左下にSupabaseアイコンが表示される）

---

## 🔧 STEP 6：SupabaseをCursorから設定

### やること
Cursor Composer（Cmd/Ctrl + I）を開いて、以下のプロンプトを入力。

### プロンプト
```
@docs/SPEC.md を読み込んで、Supabaseのセットアップを完了させてください。

実行内容:
1. 仕様書に記載されている全てのテーブルを作成
2. 初期データがあれば投入
3. サーバー側ロジックをSupabase RPC関数として実装
4. RLSポリシーを適切に設定（⚠️ セキュリティ上非常に重要）
5. 認証方式を有効化（匿名 or メールアドレス）

Supabase MCPを使って、上記を全て実行してください。
完了したら実行内容を報告してください。
```

### ⚠️ RLS（Row Level Security）の重要性
RLSはSupabaseのセキュリティの要です。適切に設定しないと、他のユーザーのデータが見えてしまう可能性があります。必ず以下を確認してください：

- 全テーブルでRLSが有効化されている
- 適切なポリシーが設定されている（例: `auth.uid() = user_id`）

### 確認
実行完了後、Cursor Chatで以下を確認。

```
Supabaseのテーブル一覧とRLSポリシーを表示してください。
```

仕様書通りのテーブルとRLSポリシーが表示されればOK。

### .envファイルの作成
Cursorに以下を指示。

```
Supabaseの接続情報を .env ファイルに出力してください。

内容:
EXPO_PUBLIC_SUPABASE_URL=[プロジェクトURL]
EXPO_PUBLIC_SUPABASE_ANON_KEY=[anon key]
```

---

## 🚀 STEP 7：アプリを実装する

### やること
Cursor Composer（Cmd/Ctrl + I）を開いて、実装を進めます。

### ⚠️ 推奨：段階的な実装
一度に全てを実装させると、Cursorが途中で止まったり品質が下がることがあります。以下の3フェーズに分けて進めることを推奨します。

---

### Phase 1: 基盤を作る

#### タスク管理の確認
まず、Phase 1のタスクを確認：
```
@docs/tasks/PROGRESS.md でPhase 1のタスク一覧を確認してください。
最初に着手すべきタスクを教えてください。
```

#### 実装
```
@docs/SPEC.md と @.cursorrules を読み込んで、アプリの基盤を作成してください。

実装内容:
1. Supabaseクライアント作成 (lib/supabase.ts)
2. 認証の実装（仕様書通りの認証方式）
3. 認証状態を管理するContext (contexts/AuthContext.tsx)
4. app/_layout.tsx で認証Providerをラップ

ディレクトリ構造:
lib/
  supabase.ts
contexts/
  AuthContext.tsx
app/
  _layout.tsx

完了したら、該当するタスクファイルの状態を「🟢 完了」に更新してください。
```

#### 進捗更新とコミット
```bash
git add .
git commit -m "Phase 1: Setup Supabase client and auth"
```

```
@docs/tasks/PROGRESS.md を更新して、Phase 1の進捗率を100%にしてください。
```

---

### Phase 2: データ層を作る

#### タスク管理の確認
```
@docs/tasks/PROGRESS.md でPhase 2のタスク一覧を確認してください。
依存関係を考慮して、着手可能なタスクを教えてください。
```

#### 実装
```
@docs/SPEC.md を読み込んで、データ層を実装してください。

実装内容:
1. 必要なカスタムフック作成（React Query使用）
   - Supabase RPCの呼び出し
   - エラーハンドリング実装
2. 型定義ファイル作成 (types/index.ts)

ディレクトリ構造:
hooks/
  [カスタムフック].ts
types/
  index.ts

完了したら、該当するタスクファイルの状態を「🟢 完了」に更新してください。
```

#### 進捗更新とコミット
```bash
git add .
git commit -m "Phase 2: Add data layer with React Query hooks"
```

```
@docs/tasks/PROGRESS.md を更新して、Phase 2の進捗率を100%にしてください。
```

---

### Phase 3: UIを作る

#### タスク管理の確認
```
@docs/tasks/PROGRESS.md でPhase 3のタスク一覧を確認してください。
UI実装は複数タスクに分かれているので、順番を教えてください。
```

#### 実装
```
@docs/SPEC.md と @docs/DESIGN.md を読み込んで、UIを実装してください。

添付: docs/screenshots/ 内のスクリーンショット画像

## 実装手順

### Step 1: 定数ファイルの作成
DESIGN.md の「カラーシステム」と「タイポグラフィシステム」をそのままコピーして作成：
- constants/colors.ts
- constants/typography.ts
- constants/spacing.ts
- constants/animations.ts

### Step 2: 共通コンポーネントの作成
DESIGN.md の「コンポーネント仕様」に従って作成：
- components/ 配下に各コンポーネント
- className は DESIGN.md に記載の NativeWind クラスを使用
- アニメーションは DESIGN.md の設定値を使用

### Step 3: 画面の実装
DESIGN.md の「画面別レイアウト仕様」に従って作成：
- app/(tabs)/ 配下に各画面
- レイアウト構造は DESIGN.md に従う
- 使用コンポーネントは Step 2 で作成したものを使用

### Step 4: アニメーションの実装
DESIGN.md の「アニメーション実装ガイド」に従って作成：
- React Native Reanimated 3 を使用（推奨）
- または React Native Animated
- 設定値は DESIGN.md の値をそのまま使用

## ディレクトリ構造
```
constants/
  colors.ts
  typography.ts
  spacing.ts
  animations.ts
components/
  [各UIコンポーネント].tsx
app/
  (tabs)/
    [各画面].tsx
  _layout.tsx
```

## 重要事項
- DESIGN.md の値を勝手に変更しない
- スクリーンショットと見比べながら忠実に再現
- NativeWind v4 の className を正しく使用
- アニメーションは 60FPS を維持

各Stepを完了するごとに、該当するタスクファイルの状態を「🟢 完了」に更新してください。
```

#### 進捗更新とコミット
```bash
git add .
git commit -m "Phase 3: Implement UI screens and components"
```

```
@docs/tasks/PROGRESS.md を更新して、Phase 3の進捗率を100%にしてください。
```

---

### Phase 4: 広告を実装する

#### タスク管理の確認
```
@docs/tasks/PROGRESS.md でPhase 4のタスク一覧を確認してください。
広告実装のタスクを順番に教えてください。
```

#### 事前準備：AdMobアカウント作成
1. https://admob.google.com にアクセス
2. Googleアカウントでログイン
3. AdMobアカウントを作成
4. 新しいアプリを登録（iOS / Android それぞれ）
5. 広告ユニットを作成：
   - **バナー広告**用のユニットID
   - **リワード広告**用のユニットID

#### ライブラリインストール

Cursor Composerで以下を入力：
```
広告用のライブラリをインストールしてください。
react-native-google-mobile-ads を使用します。
```

Cursorが実行するコマンド：
```bash
npx expo install react-native-google-mobile-ads
```

#### app.config.ts に AdMob設定を追加

Cursor Composerで以下を入力：
```
app.config.ts にAdMobの設定を追加してください。

iOS App ID: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
Android App ID: ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ

※ 開発中はテスト用IDを使用してください。
```

#### 広告コンポーネントの実装

Cursor Composerで以下を入力：
```
広告機能を実装してください。

1. バナー広告コンポーネント (components/ads/BannerAd.tsx)
   - 画面下部（タブバーの上）に表示
   - サイズ: 320x50

2. リワード広告フック (hooks/useRewardAd.ts)
   - 動画視聴完了で報酬を付与
   - 報酬: おみくじを追加で1回引ける

3. 広告の表示ロジック
   - バナー: ホーム画面に常時表示
   - リワード: 「もう1回引く」ボタンで表示

テスト用広告IDを使用してください：
- バナー: ca-app-pub-3940256099942544/6300978111
- リワード: ca-app-pub-3940256099942544/5224354917

ディレクトリ構造:
components/
  ads/
    BannerAd.tsx
hooks/
  useRewardAd.ts
```

#### .env に広告IDを追加

```
# .env に追加（本番用IDに置き換え）
EXPO_PUBLIC_ADMOB_BANNER_ID_IOS=ca-app-pub-xxxxx/xxxxx
EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID=ca-app-pub-xxxxx/xxxxx
EXPO_PUBLIC_ADMOB_REWARD_ID_IOS=ca-app-pub-xxxxx/xxxxx
EXPO_PUBLIC_ADMOB_REWARD_ID_ANDROID=ca-app-pub-xxxxx/xxxxx
```

#### ⚠️ 広告実装の注意事項

| 注意点 | 説明 |
|--------|------|
| **テスト広告ID** | 開発中は必ずテスト用IDを使用。本番IDでテストするとアカウント停止のリスク |
| **Expo Go非対応** | 広告はExpo Goでは動作しない。Development Buildが必要 |
| **広告の間隔** | インタースティシャルは連続表示NG。ユーザー体験を損なわない |
| **審査** | ストア申請前にAdMobの審査も通す必要あり |

#### 広告IDの自動切り替え

広告コンポーネント（`BannerAd.tsx`、`useRewardAd.ts`）は、ビルド環境に応じて広告IDを**自動的に切り替え**ます。

| ビルド環境 | `__DEV__` | 使用される広告ID |
|-----------|-----------|-----------------|
| Development Build | `true` | テスト広告ID（Google提供） |
| Production Build | `false` | 本番広告ID（`app.config.ts`のextraから取得） |

**仕組み:**
```typescript
const getAdUnitId = (): string => {
  if (__DEV__) {
    return TestIds.BANNER; // テスト広告ID
  }
  // 本番環境では app.config.ts の extra から取得
  const extra = Constants.expoConfig?.extra;
  return extra?.admobBannerIdAndroid || TestIds.BANNER;
};
```

**重要:**
- **手動での切り替えは不要**です。ビルドプロファイル（development/production）に応じて自動判定されます
- Production Buildをストアにアップロードすれば、実際の広告が表示されます
- **Expo Goでは広告コンポーネントがエラーになります**（`react-native-google-mobile-ads`非対応のため）
- 広告のテストは必ずDevelopment Build以降で行ってください

#### Development Build の作成

広告はExpo Goでは動作しないため、Development Buildを作成してテストする必要があります。

##### 1. EAS CLIのセットアップ

EAS CLIがインストールされていることを確認：
```bash
# EAS CLIのバージョン確認
eas --version

# インストールされていない場合
npm install -g eas-cli

# Expoアカウントにログイン
eas login

# ログイン確認
eas whoami
```

##### 2. expo-dev-clientのインストール

Cursor Composerで以下を入力：
```
expo-dev-clientをインストールしてください。
```

Cursorが実行するコマンド：
```bash
npx expo install expo-dev-client
```

##### 3. EASビルド設定

eas.jsonが存在しない場合は作成：
```bash
eas build:configure
```

eas.jsonの内容を確認（以下のような設定になっていればOK）：
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

##### 4. Development Buildのビルド

**iOS の場合：**
```bash
eas build --profile development --platform ios
```

**Android の場合：**
```bash
eas build --profile development --platform android
```

⏱️ **ビルド時間**: 5〜15分程度かかります。

ビルドの進捗は以下で確認できます：
- ターミナルに表示されるURL
- https://expo.dev のダッシュボード

##### 5. ビルド後のインストール

ビルド完了後、インストール方法が表示されます。

**iOS の場合：**
1. EASダッシュボードまたはターミナルに表示されるQRコードをスキャン
2. または、TestFlight経由でインストール（Apple Developer登録が必要）

**Android の場合：**
1. QRコードをスキャンしてAPKをダウンロード
2. または、ダウンロードリンクからAPKを取得してインストール
3. 「提供元不明のアプリ」を許可する必要がある場合があります

##### 6. Development Buildで開発サーバーを起動

Development Buildをインストールしたら、以下のコマンドで開発サーバーを起動：

```bash
npx expo start --dev-client
```

スマホのDevelopment Buildアプリを開き、開発サーバーに接続します。

##### 7. 広告テストの確認

Development Buildで以下を確認：

| 確認項目 | 期待する動作 |
|---------|-------------|
| バナー広告 | ホーム画面下部に「Test Ad」と表示される |
| リワード広告 | ボタンタップで動画広告が再生される |
| リワード報酬 | 動画視聴完了後、おみくじが追加で引ける |
| エラーハンドリング | 広告読み込み失敗時もアプリがクラッシュしない |

**テスト広告の見分け方：**
- テスト広告には「Test Ad」「Test Mode」などのラベルが表示されます
- これが表示されていれば、テスト用IDが正しく設定されています

##### 8. 進捗更新とコミット

動作確認後にコミット：
```bash
git add .
git commit -m "Phase 4: Add AdMob banner and reward ads"
```

タスク管理ファイルを更新：
```
@docs/tasks/PROGRESS.md を更新して、Phase 4の進捗率を100%にしてください。
広告関連のタスクファイルの状態も「🟢 完了」に更新してください。
```

#### ⚠️ 本番リリース前の注意

本番リリース前に以下を必ず行ってください：

1. **AdMob審査を通す**: AdMobダッシュボードでアプリの審査を申請
2. **本番用IDに置き換え**: app.config.tsのテスト用IDを本番用に変更
3. **テスト**: 本番用IDでも広告が表示されることを確認（実機で短時間のみ）

---

## 📱 STEP 8：動作確認する

### やること
```bash
# 開発サーバー起動
npx expo start
```

スマホでExpo Goアプリを開き、QRコードをスキャン。

### Expo Go の制限事項
Expo Goでは一部のネイティブ機能（カメラ、プッシュ通知など）が制限されています。これらの機能を使う場合は、Development Buildを検討してください：

```bash
# Development Build（ネイティブ機能が必要な場合）
npx expo install expo-dev-client
eas build --profile development --platform ios
# または android
```

### 確認項目（一般的なチェック）
- [ ] アプリが起動する
- [ ] 各画面が表示される
- [ ] データの作成・読み取り・更新・削除ができる
- [ ] エラーハンドリングが適切に動作する
- [ ] アニメーションが滑らかに動く

### 確認項目（広告）
- [ ] バナー広告が画面下部に表示される
- [ ] リワード広告が再生できる
- [ ] リワード視聴後に追加でおみくじが引ける
- [ ] 広告が表示されない場合もアプリがクラッシュしない

**注意**: 広告のテストはDevelopment Buildで行ってください（Expo Go非対応）。

### 不具合があったら
Cursor Composerで修正依頼。

```
[具体的な不具合内容を記載]

例:
- ボタンを押しても反応しません
- データが保存されません
- エラーメッセージが表示されます

コンソールには以下のエラーが出ています:
[エラー内容をコピペ]

@docs/SPEC.md の仕様に従って修正してください。
```

---

## 🎨 STEP 9：デザインを調整する

### やること
Stitchのデザインと実装を見比べて、気になる部分をCursorに伝える。

### プロンプト例
```
@docs/DESIGN.md のスクリーンショット画像を見てください。

現在の実装と比較して以下が違います:
[具体的な差異を箇条書き]

例:
- ボタンの角丸が足りない
- 余白が狭い
- アニメーションの速度が速すぎる
- 色が微妙に違う

Stitchのデザインに合わせて修正してください。
```

```bash
git add .
git commit -m "UI improvements"
```

---

## 📦 STEP 10：ストア申請準備

### 概要
ストア申請に必要なアセットとドキュメントを準備します。

### 作成するファイル

| ファイル | 説明 |
|---------|------|
| `assets/images/icon.png` | アプリアイコン (1024x1024) |
| `assets/images/adaptive-icon.png` | Android用アダプティブアイコン |
| `assets/images/splash-icon.png` | スプラッシュ画面 |
| `docs/PRIVACY_POLICY.md` | プライバシーポリシー |
| `docs/TERMS_OF_SERVICE.md` | 利用規約 |
| `docs/STORE_LISTING.md` | ストア説明文 |
| `docs/SCREENSHOT_GUIDE.md` | スクリーンショット作成ガイド |

### 10.1 アプリアイコン作成

**要件:**
- サイズ: 1024x1024 PNG（iOS App Store用）
- 512x512 PNG（Google Play用）
- 透過なし、角丸なし（ストアで自動適用）

**デザインポイント:**
- パチスロの「7」シンボル
- おみくじ要素（大吉札、絵馬など）
- 和風デザイン（桜、金色）
- 視認性の高いシンプルな構成

### 10.2 スプラッシュ画面作成

**要件:**
- サイズ: 2732x2732 PNG
- 背景色をアプリテーマに合わせる

### 10.3 プライバシーポリシー作成・公開

#### 10.3.1 HTMLファイルの生成

Cursor Composerで以下を入力：
```
プライバシーポリシーと利用規約のHTMLファイルを作成してください。

出力先: docs/privacy-site/
- index.html（トップページ）
- privacy-policy.html（プライバシーポリシー）
- terms-of-service.html（利用規約）

デザイン:
- アプリのテーマカラーに合わせる
- レスポンシブ対応
- 日本語で記述
```

#### 10.3.2 専用リポジトリの作成（推奨）

メインリポジトリをPrivateのまま維持するため、プライバシーポリシー専用のPublicリポジトリを作成します。

**Step 1: GitHubで新規リポジトリ作成**
1. https://github.com/new にアクセス
2. 以下を入力：
   - **Repository name**: `[アプリ名]-privacy-site`
   - **Description**: [アプリ名] - プライバシーポリシー・利用規約
   - **Public** を選択 ✅
   - **Add a README file** にチェック
3. **Create repository** をクリック

**Step 2: HTMLファイルをアップロード**
1. 作成したリポジトリページで **Add file** → **Upload files**
2. `docs/privacy-site/` 内の3つのHTMLファイルをドラッグ&ドロップ：
   - `index.html`
   - `privacy-policy.html`
   - `terms-of-service.html`
3. **Commit changes** をクリック

**Step 3: GitHub Pagesを有効化**
1. リポジトリの **Settings** タブ
2. 左サイドバーの **Pages** をクリック
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` / `/ (root)` を選択
5. **Save** をクリック

**Step 4: URLを確認（1-2分後）**

公開URL:
```
https://[username].github.io/[アプリ名]-privacy-site/
```

個別ページURL:
```
プライバシーポリシー: https://[username].github.io/[アプリ名]-privacy-site/privacy-policy.html
利用規約: https://[username].github.io/[アプリ名]-privacy-site/terms-of-service.html
```

#### 10.3.3 HTMLファイルの更新

公開後、以下の項目を実際の値に変更：

| 項目 | 変更内容 |
|------|---------|
| メールアドレス | `your-email@example.com` → 実際の連絡先 |
| App Store URL | 公開後のURL |
| Google Play URL | 公開後のURL |

変更後、GitHubリポジトリに再アップロードしてください。

#### 10.3.4 ストア申請用URLのメモ

以下のURLをストア申請時に使用：
```
プライバシーポリシーURL: https://[username].github.io/[アプリ名]-privacy-site/privacy-policy.html
サポートURL: https://[username].github.io/[アプリ名]-privacy-site/
```

### 10.4 ストア説明文作成

**参照:** `docs/STORE_LISTING.md`

**含める内容:**
- アプリ名・サブタイトル
- 短い説明（80文字以内）
- 詳細な説明（4000文字以内）
- キーワード
- スクリーンショットキャプション

### 10.5 スクリーンショット撮影

**参照:** `docs/SCREENSHOT_GUIDE.md`

**必要なスクリーンショット:**
1. ホーム画面（リール停止状態）
2. リール回転中
3. 大吉結果モーダル
4. 履歴画面
5. 設定画面

### 10.6 app.config.ts 最終確認

**本番用に更新が必要な項目:**

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "パチスロおみくじ",
  slug: "slot-omikuji",
  version: "1.0.0",
  icon: "./assets/images/icon.png",
  splash: {
    image: "./assets/images/splash-icon.png",
    backgroundColor: "#1A1A2E"
  },
  ios: {
    bundleIdentifier: "com.yourcompany.slotomikuji", // ← 実際の値に変更
    buildNumber: "1",
    config: {
      googleMobileAdsAppId: "ca-app-pub-XXXX~YYYY" // ← 本番ID
    }
  },
  android: {
    package: "com.yourcompany.slotomikuji", // ← 実際の値に変更
    versionCode: 1,
    config: {
      googleMobileAdsAppId: "ca-app-pub-XXXX~ZZZZ" // ← 本番ID
    }
  },
  plugins: [
    "expo-router"
  ]
});
```

4. プライバシーポリシーを作成して公開（GitHub Pages等）
5. 利用規約を作成（必要に応じて）

```bash
git add .
git commit -m "Prepare for release"
git tag v1.0.0
```

---

## 🚢 STEP 11：ビルドして提出

### やること

#### EAS設定
```bash
# EAS CLI インストール
npm install -g eas-cli

# ログイン
eas login

# ビルド設定（eas.json が生成される）
eas build:configure
```

#### eas.json の確認・編集
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

#### versionCode の更新（アップデートリリース時）

Google Play にアップデート版をアップロードする際は、**versionCode を必ず増やす必要があります**。
一度使用した versionCode は再利用できません。

**更新場所**: `app.config.ts` の android セクション

```typescript
android: {
  // ...
  versionCode: 7,  // ← 前回より大きい数値に更新
  // ...
},
```

| 状況 | versionCode |
|------|-------------|
| 初回リリース | 1〜5（過去に使用済み） |
| 現在 | 7 |
| 次回リリース時 | 8 に更新 |

**エラー例**: 
```
バージョン コード X はすでに使用されています。別のバージョン コードをお試しください。
```
→ versionCode を増やして再ビルドしてください。

#### ビルド実行
```bash
# iOSビルド
eas build --platform ios --profile production

# Androidビルド
eas build --platform android --profile production
```

ビルド完了後、ダウンロードリンクが表示される。

### ストア提出（手動アップロード）

ビルド完了後、以下の手順でストアに提出します。

1. **ビルド完了通知のリンク**または **[Expo ダッシュボード](https://expo.dev)** からビルドファイルをダウンロード
   - iOS: `.ipa` ファイル
   - Android: `.aab` ファイル

2. 各ストアコンソールに手動でアップロード

### ストアコンソールでの作業

#### Google Play Console（Android）

##### 1. アプリを作成（初回のみ）

1. [Google Play Console](https://play.google.com/console) にログイン
2. 「**アプリを作成**」をクリック
3. 以下を入力：
   - アプリ名: パチスロおみくじ
   - デフォルトの言語: 日本語
   - アプリまたはゲーム: アプリ
   - 無料または有料: 無料
4. デベロッパー ポリシーに同意 → 「**作成**」

##### 2. ダッシュボードの必須タスクを完了

アプリ作成後、ダッシュボードに表示される**すべてのタスク**を完了させます：

| タスク | 場所 | 設定内容 |
|--------|------|----------|
| アプリのアクセス権 | ポリシー → アプリのアクセス権 | 「制限なし」を選択 |
| 広告 | ポリシー → 広告 | 「はい、広告が含まれています」 |
| コンテンツのレーティング | ポリシー → コンテンツのレーティング | アンケートに回答（軽度のシミュレートされたギャンブル） |
| ターゲット ユーザー | ポリシー → ターゲット ユーザー | 13歳以上を選択 |
| ニュースアプリ | ポリシー → ニュースアプリ | 「いいえ」 |
| データ セーフティ | ポリシー → データ セーフティ | 下記参照 |
| 政府機関向けアプリ | ポリシー → 政府機関向けアプリ | 「いいえ」 |
| 金融機能 | ポリシー → 金融機能 | 「いいえ」 |

**データセーフティの設定例**:
- データを収集または共有していますか？ → はい
- 収集するデータの種類 → デバイスまたはその他の ID（広告ID）
- データは暗号化されていますか？ → はい
- ユーザーはデータの削除をリクエストできますか？ → はい

##### 3. ストアの掲載情報を入力

**場所**: 成長 → ストアの掲載情報 → メインのストア掲載情報

| 項目 | 必須 | 内容 |
|------|------|------|
| アプリ名 | ✅ | パチスロおみくじ |
| 短い説明 | ✅ | 80文字以内 |
| 詳しい説明 | ✅ | 4000文字以内 |
| アプリのアイコン | ✅ | 512x512 PNG |
| フィーチャー グラフィック | ✅ | 1024x500 PNG |
| スクリーンショット | ✅ | スマートフォン用 2〜8枚 |

##### 4. 内部テストでリリース

**場所**: テスト → 内部テスト

1. 「**新しいリリースを作成**」をクリック
2. AAB ファイルをアップロード（`eas submit` で自動アップロード済みの場合は選択）
3. リリース名とリリースノートを入力
4. 「**リリースのレビュー**」→「**内部テストとして公開開始**」

**テスターを追加**:
1. 「テスター」タブをクリック
2. 「**メーリング リストを作成**」
3. リスト名を入力し、テスターのGoogleアカウント（メールアドレス）を追加
4. 保存後、テスト用リンクをコピーしてテスターに共有

##### 5. 製品版として公開

内部テストで動作確認後：

1. **方法A**: テスト → 内部テスト → 該当リリースの「**製品版にプロモート**」
2. **方法B**: リリース → 製品版 → 「新しいリリースを作成」→ 同じAABを選択

3. リリースノートを入力
4. 「**リリースのレビュー**」
5. 「**製品版として公開を開始**」→ 審査開始

> 💡 **ヒント**: ダッシュボードの必須タスクがすべて完了していないと、製品版として公開できません。

#### App Store Connect（iOS）

1. **[App Store Connect](https://appstoreconnect.apple.com)** にログイン
2. **アプリ情報の入力**
   - アプリ名、サブタイトル、説明文
   - キーワード、サポートURL、プライバシーポリシーURL
   - スクリーンショット（6.7インチ、6.5インチ、5.5インチなど）
3. **App Review情報**
   - 連絡先情報
   - デモアカウント（必要な場合）
4. **審査に提出**
   - 「審査へ提出」をクリック

#### 審査期間の目安

| プラットフォーム | 審査期間 |
|------------------|----------|
| Google Play | 数時間〜数日 |
| App Store | 24時間〜数日 |

> ⚠️ **注意**: プライバシーポリシーは事前に公開しておく必要があります（GitHub Pages等）

---

## ✅ 完了チェックリスト

### セットアップ
- [ ] STEP 1-11 を順番に実行した
- [ ] `docs/SPEC.md` に仕様が明確に記載されている
- [ ] `docs/STITCH_PROMPT.md` を生成し、Stitchでデザインを確認した
- [ ] `docs/DESIGN.md` を生成し、実装に活用した
- [ ] GitHubリポジトリを作成し、コードをプッシュした
- [ ] NativeWind v4 が正しくセットアップされている

### タスク管理
- [ ] `docs/tasks/PROGRESS.md` が作成されている
- [ ] 各フェーズのタスクファイル（task1.md〜）が作成されている
- [ ] 全タスクの状態が「🟢 完了」になっている
- [ ] PROGRESS.mdの進捗率が100%になっている

### 機能実装
- [ ] RLSポリシーが適切に設定されている
- [ ] 広告（バナー・リワード）が正常に動作する
- [ ] 実機でアプリが正常に動作する
- [ ] 全ての機能が仕様書通りに実装されている
- [ ] エラーハンドリングが適切に動作する
- [ ] デザインがStitchのイメージ通りに仕上がっている

### ストアアセット
- [ ] スクリーンショットを撮影した（スマホ用2-8枚）
- [ ] フィーチャーグラフィックを作成した（1024x500）

### AdMob
- [ ] AdMobでアプリを登録した
- [ ] 広告ユニットID（バナー・リワード）を取得した
- [ ] テストデバイスを登録した（推奨）

### Google Play Console（Android）
- [ ] アプリを作成した
- [ ] ポリシー設定を完了した（広告、レーティング、データセーフティ）
- [ ] ストア掲載情報を入力した

### 内部テスト（Android）
- [ ] AABをアップロードした
- [ ] テスターを招待した
- [ ] 動作検証を完了した（広告表示、ログイン保持、各機能）
- [ ] バグを修正した（必要に応じて）

### 本番リリース（Android）
- [ ] 製品版にプロモートした
- [ ] 審査に提出した
- [ ] 審査を通過した
- [ ] Google Playで公開を確認した

### App Store Connect（iOS）
- [ ] アプリを作成した
- [ ] アプリ情報を入力した（説明文、キーワード、サポートURL）
- [ ] スクリーンショットをアップロードした（各サイズ）

### TestFlight内部テスト（iOS）
- [ ] IPAをアップロードした
- [ ] 内部テスターを招待した
- [ ] 動作検証を完了した
- [ ] バグを修正した（必要に応じて）

### 本番リリース（iOS）
- [ ] 審査に提出した
- [ ] 審査を通過した
- [ ] App Storeで公開を確認した

---

## 🆘 困ったときは

### 仕様が曖昧で進められない
```
Claudeに以下を投げる:

「@docs/SPEC.md の [具体的な箇所] が曖昧です。
以下の観点で詳細化してください:
- [質問1]
- [質問2]」
```

### エラーが出た
```
Cursorで @codebase を選択して以下を入力:

「以下のエラーが出ています。
@docs/SPEC.md の仕様に従って修正してください。

[エラーメッセージをコピペ]」
```

### デザインが思った通りにならない
```
「@docs/DESIGN.md のスクリーンショットと比較して、
[具体的にどこが違うか] を修正してください。」
```

### Supabase RPCが動かない
```
Cursorで以下を確認:

「Supabase RPCの実装を確認してください。
@docs/SPEC.md のロジックと一致していますか？
RLSポリシーも確認してください。」
```

### NativeWindのスタイルが効かない
```
「NativeWindのセットアップを確認してください。
以下を点検してください:
- tailwind.config.js の content 設定
- metro.config.js の withNativeWind 設定
- babel.config.js の nativewind/babel プリセット
- global.css のインポート」
```

### 広告が表示されない
```
「広告の実装を確認してください。
以下を点検してください:
- app.config.ts の AdMob App ID 設定
- 広告ユニットIDが正しいか
- Development Build でテストしているか（Expo Goでは動作しない）
- ネットワーク接続があるか」
```

### リワード広告の報酬が付与されない
```
「リワード広告のコールバック処理を確認してください。
onUserEarnedReward イベントで報酬付与のロジックが
正しく実装されているか確認してください。」
```

### タスクの進捗が分からなくなった
```
@docs/tasks/PROGRESS.md を読み込んで、以下を教えてください：
- 現在の全体進捗率
- 未完了のタスク一覧
- 次に着手すべきタスク（依存関係を考慮）
```

### タスクの依存関係でブロックされている
```
@docs/tasks/PROGRESS.md を確認して、
[タスク名]がブロックされている原因を特定してください。
依存タスクの完了状況を確認し、解決策を提案してください。
```

### タスクの粒度が大きすぎる
```
@docs/tasks/[タスクファイル名].md の内容を確認して、
このタスクをより小さなサブタスクに分割してください。
1タスク = 30分〜2時間で完了できる粒度にしてください。
```

---

## 💡 この手順の利点

1. **技術スタックが固定** - 迷わない、調べる時間が不要
2. **AIにタスクを丸投げ** - コードを書かなくても進む
3. **段階的に確認** - 各STEPとPhaseで動作確認できる
4. **デザイン品質が高い** - Stitchで洗練されたUIが手に入る
5. **拡張性が高い** - 後から機能追加しやすい構造
6. **セキュリティを意識** - RLSの重要性を明示
7. **複数端末で開発可能** - GitHub連携でどこからでも作業できる
8. **タスク管理で進捗可視化** - 何が終わって何が残っているか一目瞭然
9. **中断・再開が容易** - タスクファイルで作業状態を引き継げる

この手順を使えば、どんなアプリでもAIの力で完成します！🚀