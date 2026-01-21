# Expo + Supabase + NativeWind テンプレート

Expo Router、Supabase、NativeWind v4、AdMobを統合したReact Nativeアプリのテンプレートです。

## 🚀 特徴

- **Expo Router** - ファイルベースルーティング
- **NativeWind v4** - Tailwind CSSスタイリング
- **Supabase** - 認証、データベース
- **React Query** - データフェッチング・キャッシング
- **AdMob** - バナー広告、リワード広告（Expo Go対応モック含む）
- **TypeScript** - 型安全な開発

## 📦 含まれるもの

### 基盤
- 認証Context（匿名認証、メール認証対応）
- Supabaseクライアント設定（AsyncStorageでセッション永続化）
- React Query設定

### コンポーネント
- バナー広告（Expo Goではモック表示）
- リワード広告フック（Expo Goではモックダイアログ）
- UIコンポーネント（Card, Button, Slider, Switch）

### 画面
- ホーム（プレースホルダー）
- 履歴（プレースホルダー）
- 設定（認証状態表示、ログアウト）

### ドキュメント
- 開発ガイド（GUIDE.md）
- コーディング規約（CODING_STYLE.md）
- 仕様書テンプレート（SPEC.md）
- ストア掲載情報テンプレート（STORE_LISTING.md）

## 🔧 セットアップ

### 1. テンプレートから作成

```bash
# GitHub CLIで作成
gh repo create your-app-name --template your-username/expo-supabase-template --private --clone
cd your-app-name

# または手動でクローン
git clone https://github.com/your-username/expo-supabase-template.git your-app-name
cd your-app-name
rm -rf .git
git init
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

```bash
cp .env.example .env
```

`.env`を編集:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. app.config.tsをカスタマイズ

以下の項目を変更:
- `name` - アプリ名
- `slug` - URLスラッグ
- `package` / `bundleIdentifier` - パッケージ名
- AdMob App ID、広告ユニットID

### 5. 開発サーバーを起動

```bash
# Expo Go用
npm start

# Development Build用（広告テスト）
eas build --profile development --platform android
```

## 📁 ディレクトリ構造

```
├── app/
│   ├── (tabs)/           # タブ画面
│   │   ├── index.tsx     # ホーム
│   │   ├── history.tsx   # 履歴
│   │   └── settings.tsx  # 設定
│   └── _layout.tsx       # ルートレイアウト
├── components/
│   ├── ads/              # 広告コンポーネント
│   └── ui/               # UIコンポーネント
├── contexts/
│   └── AuthContext.tsx   # 認証Context
├── hooks/                # カスタムフック
├── lib/
│   ├── supabase.ts       # Supabaseクライアント
│   └── queryClient.ts    # React Query設定
├── types/                # 型定義
├── constants/            # 定数（カラー等）
└── docs/                 # ドキュメント
```

## 📖 ドキュメント

- [開発ガイド](docs/GUIDE.md) - 開発手順の詳細
- [コーディング規約](docs/CODING_STYLE.md) - コーディングルール
- [仕様書テンプレート](docs/SPEC.md) - アプリ仕様書
- [ストア掲載情報](docs/STORE_LISTING.md) - ストア説明文テンプレート

## 🎯 次のステップ

1. `docs/SPEC.md`にアプリの仕様を記載
2. Supabaseでテーブルを作成
3. `types/index.ts`に型を定義
4. `hooks/`にデータ取得フックを作成
5. 画面を実装
6. AdMob IDを設定
7. アイコン・スプラッシュを作成
8. ストア申請

## 📄 ライセンス

MIT
