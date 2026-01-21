# Putt Tempo アプリ仕様書

## 概要

| 項目 | 内容 |
|------|------|
| アプリ名 | Putt Tempo |
| 目的 | ゴルフのパター練習用メトロノームアプリ |
| 技術スタック | Expo Router, NativeWind v4, TypeScript, Supabase |
| ターゲット | iOS / Android |

---

## 1. 機能要件

### 1.1 コア機能

#### メトロノーム再生
- BPM（テンポ）の調整：30〜200 BPM
- バックストローク：フォワードストローク比率の調整：1:1 〜 5:5
- 再生 / 停止の制御
- バックグラウンド再生対応

#### 音声・バイブレーション
- 音声出力とバイブレーションの切り替え
- バイブのみモード対応（練習場での使用を想定）
- 音の種類選択

#### プリセット管理
- デフォルトプリセット（4種、編集不可）
- カスタムプリセットの作成・編集・削除
- お気に入り機能

#### ビジュアルペンダム
- パター風デザインの振り子アニメーション
- ストロークのリズムを視覚的に確認可能

### 1.2 デフォルトプリセット

| 名前 | BPM | 比率（バック:フォワード） | 用途 |
|------|-----|---------------------------|------|
| スタンダード | 85 | 2:1 | 基本練習 |
| ゆっくり | 70 | 2:1 | 初心者・ロングパット |
| 速め | 100 | 2:1 | ショートパット |
| 均等リズム | 85 | 1:1 | チャーシューメン派 |

### 1.3 音の種類

#### 無料（3種）
| ID | 名前 | 説明 |
|----|------|------|
| `click` | クリック | 標準的なクリック音 |
| `electronic` | 電子音 | ピッという電子音 |
| `wood` | ウッド | コッという木の音 |

#### プレミアム追加（+7種）
| ID | 名前 | 説明 |
|----|------|------|
| `metal` | 金属 | カンという金属音 |
| `soft_beep` | ソフトビープ | 柔らかい電子音 |
| `drum_stick` | ドラムスティック | スティック音 |
| `water_drop` | 水滴 | ポタッという水滴音 |
| `spring` | バネ | バネの音 |
| `bell` | ベル | 鈴の音 |
| `silent` | 無音 | バイブ専用 |

### 1.4 練習記録

- セッション単位で自動記録
- 記録項目：使用プリセット、BPM、比率、練習時間、開始/終了日時
- 統計表示：総セッション数、総練習時間、平均練習時間、最も使用したプリセット、日別グラフ

### 1.5 プランと機能制限

| 機能 | 無料 | プレミアム（¥480 買い切り） |
|------|------|---------------------------|
| メトロノーム再生 | ✅ | ✅ |
| BPM調整 | ✅ | ✅ |
| バック:フォワード比率調整 | ✅ | ✅ |
| 音/バイブ切り替え | ✅ | ✅ |
| デフォルトプリセット（4種） | ✅ | ✅ |
| 音の種類 | 3種 | 10種 |
| カスタムプリセット保存 | 3個まで | 無制限（実質100個） |
| 広告 | あり | 非表示 |
| ビジュアルペンダム | シンプル | カスタマイズ可 |

**将来のアップデートで検討:**
- 練習記録・統計（現在は無料で7日間）
- 端末間同期

---

## 2. データ構造

### 2.1 ER図

```
users (Supabase Auth)
  │
  ├── user_profiles (1:1)
  │
  ├── custom_presets (1:N)
  │
  ├── practice_sessions (1:N)
  │
  └── subscriptions (1:1)
```

### 2.2 テーブル定義

#### `user_profiles` - ユーザー設定

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | - | PK, auth.users.id と同一 |
| display_name | text | YES | NULL | 表示名 |
| preferred_sound | text | NO | 'click' | デフォルト音の種類 |
| vibration_enabled | boolean | NO | true | バイブレーション有効 |
| last_used_preset_id | uuid | YES | NULL | 最後に使用したプリセットID |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**制約:**
- PRIMARY KEY (id)
- FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
- FOREIGN KEY (last_used_preset_id) REFERENCES custom_presets(id) ON DELETE SET NULL

**RLS:**
- SELECT: `auth.uid() = id`
- UPDATE: `auth.uid() = id`

---

#### `custom_presets` - カスタムプリセット

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| user_id | uuid | NO | - | 所有ユーザーID |
| name | text | NO | - | プリセット名（最大20文字） |
| bpm | integer | NO | - | テンポ（30〜200） |
| back_ratio | integer | NO | - | バック比率（1〜5） |
| forward_ratio | integer | NO | - | フォワード比率（1〜5） |
| sound_type | text | NO | 'click' | 音の種類 |
| is_favorite | boolean | NO | false | お気に入りフラグ |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**制約:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
- CHECK (char_length(name) <= 20)
- CHECK (bpm >= 30 AND bpm <= 200)
- CHECK (back_ratio >= 1 AND back_ratio <= 5)
- CHECK (forward_ratio >= 1 AND forward_ratio <= 5)
- UNIQUE (user_id, name) -- 同一ユーザー内で名前重複不可

**RLS:**
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

---

#### `practice_sessions` - 練習記録

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| user_id | uuid | NO | - | ユーザーID |
| preset_id | uuid | YES | NULL | 使用したプリセットID |
| preset_name | text | NO | - | プリセット名（スナップショット） |
| bpm | integer | NO | - | 使用したBPM |
| back_ratio | integer | NO | - | バック比率 |
| forward_ratio | integer | NO | - | フォワード比率 |
| duration_seconds | integer | NO | - | 練習時間（秒） |
| started_at | timestamptz | NO | - | 開始日時 |
| ended_at | timestamptz | NO | - | 終了日時 |

**制約:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
- FOREIGN KEY (preset_id) REFERENCES custom_presets(id) ON DELETE SET NULL
- CHECK (duration_seconds >= 10) -- 10秒未満は記録しない
- CHECK (duration_seconds <= 7200) -- 2時間を上限

**RLS:**
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`

**インデックス:**
- CREATE INDEX idx_practice_sessions_user_started ON practice_sessions(user_id, started_at DESC);

---

#### `subscriptions` - 課金情報

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | gen_random_uuid() | PK |
| user_id | uuid | NO | - | ユーザーID（ユニーク） |
| plan | text | NO | 'free' | プラン種別（'free' or 'premium'） |
| platform | text | YES | NULL | 購入プラットフォーム（'ios' or 'android'） |
| store_product_id | text | YES | NULL | ストア商品ID |
| store_transaction_id | text | YES | NULL | ストアトランザクションID |
| purchased_at | timestamptz | YES | NULL | 購入日時 |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

**備考:** 買い切り課金のため `expires_at` は不要。RevenueCat がプレミアム状態を管理するため、このテーブルは主にバックアップ・分析用途。

**制約:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
- UNIQUE (user_id)
- CHECK (plan IN ('free', 'premium'))
- CHECK (platform IS NULL OR platform IN ('ios', 'android', 'web'))

**RLS:**
- SELECT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id` (plan変更はRPC経由のみ)

---

## 3. サーバー側ロジック（RPC）

### 3.1 `initialize_user`

**目的:** 新規ユーザーの初期設定を作成

**引数:**
| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| p_user_id | uuid | YES | ユーザーID |

**処理フロー:**
```sql
BEGIN;
  -- 1. user_profiles 作成
  INSERT INTO user_profiles (id)
  VALUES (p_user_id);
  
  -- 2. subscriptions 作成（freeプラン）
  INSERT INTO subscriptions (user_id, plan)
  VALUES (p_user_id, 'free');
COMMIT;
```

**戻り値:**
```typescript
{ success: boolean }
```

**エラー:**
- ユーザーが既に存在する場合は何もしない（UPSERT的な動作）

---

### 3.2 `save_practice_session`

**目的:** 練習セッションを保存し、ユーザープロフィールを更新

**引数:**
| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| p_user_id | uuid | YES | ユーザーID |
| p_preset_id | uuid | NO | 使用したプリセットID |
| p_preset_name | text | YES | プリセット名 |
| p_bpm | integer | YES | BPM |
| p_back_ratio | integer | YES | バック比率 |
| p_forward_ratio | integer | YES | フォワード比率 |
| p_duration_seconds | integer | YES | 練習時間（秒） |
| p_started_at | timestamptz | YES | 開始日時 |
| p_ended_at | timestamptz | YES | 終了日時 |

**処理フロー:**
```sql
BEGIN;
  -- 1. バリデーション
  IF p_duration_seconds < 10 THEN
    RAISE EXCEPTION 'SESSION_TOO_SHORT';
  END IF;
  
  IF p_duration_seconds > 7200 THEN
    RAISE EXCEPTION 'SESSION_TOO_LONG';
  END IF;

  -- 2. practice_sessions に挿入
  INSERT INTO practice_sessions (
    user_id, preset_id, preset_name, bpm,
    back_ratio, forward_ratio, duration_seconds,
    started_at, ended_at
  ) VALUES (
    p_user_id, p_preset_id, p_preset_name, p_bpm,
    p_back_ratio, p_forward_ratio, p_duration_seconds,
    p_started_at, p_ended_at
  )
  RETURNING id INTO v_session_id;

  -- 3. user_profiles 更新
  UPDATE user_profiles
  SET 
    last_used_preset_id = p_preset_id,
    updated_at = now()
  WHERE id = p_user_id;
COMMIT;
```

**戻り値:**
```typescript
{ session_id: string }
```

---

### 3.3 `get_practice_stats`

**目的:** ユーザーの練習統計を取得（プランに応じた期間制限あり）

**引数:**
| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| p_user_id | uuid | YES | ユーザーID |

**処理フロー:**
```sql
-- 1. プランを取得
SELECT plan INTO v_plan
FROM subscriptions
WHERE user_id = p_user_id;

-- 2. 期間フィルタを設定
IF v_plan = 'free' THEN
  v_start_date := now() - INTERVAL '7 days';
ELSE
  v_start_date := now() - INTERVAL '1 year';
END IF;

-- 3. 集計クエリ
SELECT
  COUNT(*) as total_sessions,
  COALESCE(SUM(duration_seconds), 0) as total_duration_seconds,
  COALESCE(AVG(duration_seconds), 0)::int as average_duration_seconds
FROM practice_sessions
WHERE user_id = p_user_id
  AND started_at >= v_start_date;

-- 4. 最も使用したプリセット
SELECT preset_name
FROM practice_sessions
WHERE user_id = p_user_id
  AND started_at >= v_start_date
GROUP BY preset_name
ORDER BY COUNT(*) DESC
LIMIT 1;

-- 5. 日別統計
SELECT
  DATE(started_at) as date,
  SUM(duration_seconds) as duration_seconds,
  COUNT(*) as session_count
FROM practice_sessions
WHERE user_id = p_user_id
  AND started_at >= v_start_date
GROUP BY DATE(started_at)
ORDER BY date DESC;
```

**戻り値:**
```typescript
{
  total_sessions: number;
  total_duration_seconds: number;
  average_duration_seconds: number;
  most_used_preset: string | null;
  daily_stats: Array<{
    date: string;
    duration_seconds: number;
    session_count: number;
  }>;
}
```

---

### 3.4 `check_preset_limit`

**目的:** プリセット作成前に上限をチェック

**引数:**
| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| p_user_id | uuid | YES | ユーザーID |

**処理フロー:**
```sql
-- 1. プランを取得
SELECT plan INTO v_plan
FROM subscriptions
WHERE user_id = p_user_id;

-- 2. 現在のプリセット数を取得
SELECT COUNT(*) INTO v_current_count
FROM custom_presets
WHERE user_id = p_user_id;

-- 3. 上限チェック
IF v_plan = 'free' THEN
  v_max_count := 3;
  v_can_create := v_current_count < 3;
ELSE
  v_max_count := NULL; -- 無制限
  v_can_create := TRUE;
END IF;
```

**戻り値:**
```typescript
{
  can_create: boolean;
  current_count: number;
  max_count: number | null; // premiumはnull
}
```

---

### 3.5 `upgrade_subscription`

**目的:** 課金情報を更新（買い切り購入時）

**引数:**
| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| p_user_id | uuid | YES | ユーザーID |
| p_plan | text | YES | プラン種別（'premium'） |
| p_platform | text | YES | プラットフォーム（'ios' or 'android'） |
| p_store_product_id | text | YES | ストア商品ID |
| p_store_transaction_id | text | YES | トランザクションID |

**処理フロー:**
```sql
BEGIN;
  INSERT INTO subscriptions (
    user_id, plan, platform,
    store_product_id, store_transaction_id, purchased_at
  ) VALUES (
    p_user_id, p_plan, p_platform,
    p_store_product_id, p_store_transaction_id, now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan = p_plan,
    platform = p_platform,
    store_product_id = p_store_product_id,
    store_transaction_id = p_store_transaction_id,
    purchased_at = COALESCE(subscriptions.purchased_at, now()),
    updated_at = now();
COMMIT;
```

**戻り値:**
```typescript
{ success: boolean }
```

**備考:** 買い切り課金では有効期限（expires_at）が不要。RevenueCat がプレミアム状態を管理するため、このRPCは主にバックアップ・分析用途で使用。アプリ側では RevenueCat SDK の `customerInfo.entitlements.active['premium']` でプレミアム判定を行う。

---

## 4. 認証方式

### 4.1 採用方式

**匿名認証 → メールアドレス昇格方式**

### 4.2 認証フロー

```
┌─────────────────────────────────────────────────────────┐
│                      初回起動                            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              匿名ユーザーとして自動作成                    │
│              （Supabase Anonymous Auth）                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 すぐにアプリ利用可能                       │
│            - メトロノーム再生                             │
│            - プリセット作成（3個まで）                     │
│            - 練習記録（7日間）                            │
└─────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌───────────────────────┐    ┌───────────────────────────┐
│   プレミアム購入希望    │    │     端末間同期希望         │
└───────────────────────┘    └───────────────────────────┘
            │                             │
            └──────────────┬──────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│            メールアドレス登録を促すモーダル                │
│            （Supabase linkIdentity）                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               正規ユーザーに昇格完了                       │
│            - 端末間同期が有効に                           │
│            - プレミアム機能が利用可能                      │
└─────────────────────────────────────────────────────────┘
```

### 4.3 採用理由

| メリット | 説明 |
|----------|------|
| 離脱率低減 | 初回起動時に登録不要で即座に利用開始できる |
| 段階的コミット | ユーザーが価値を感じてから登録を促せる |
| 課金動機 | 同期機能がプレミアムの付加価値になる |
| データ保持 | 匿名時のデータがそのまま引き継がれる |

### 4.4 実装時の注意点

1. **匿名ユーザーの有効期限**
   - Supabaseのデフォルト設定を確認
   - 長期未使用の匿名ユーザーは自動削除される可能性あり

2. **昇格時のエラーハンドリング**
   - 既存メールアドレスとの重複チェック
   - 昇格失敗時のリトライ処理

3. **ローカルデータのマージ**
   - 昇格前のローカルデータと、既存アカウントのデータのマージ戦略を検討

---

## 5. エラーハンドリング

### 5.1 エラーコード体系

```typescript
type ErrorCode =
  // 認証系
  | 'AUTH_ANONYMOUS_FAILED'    // 匿名認証失敗
  | 'AUTH_EMAIL_EXISTS'        // メールアドレス既に登録済み
  | 'AUTH_INVALID_EMAIL'       // メール形式不正
  | 'AUTH_LINK_FAILED'         // アカウント昇格失敗
  
  // プリセット系
  | 'PRESET_LIMIT_REACHED'     // 上限到達（無料3個）
  | 'PRESET_NAME_DUPLICATE'    // 同名プリセット存在
  | 'PRESET_NOT_FOUND'         // プリセットが見つからない
  | 'PRESET_INVALID_BPM'       // BPM範囲外
  | 'PRESET_INVALID_RATIO'     // 比率範囲外
  | 'PRESET_NAME_TOO_LONG'     // プリセット名が長すぎる
  
  // 練習記録系
  | 'SESSION_SAVE_FAILED'      // 保存失敗
  | 'SESSION_TOO_SHORT'        // 記録対象外（10秒未満）
  | 'SESSION_TOO_LONG'         // 記録対象外（2時間超過）
  
  // サブスク系
  | 'SUB_PURCHASE_FAILED'      // 購入失敗
  | 'SUB_RESTORE_FAILED'       // 復元失敗
  | 'SUB_ALREADY_PREMIUM'      // 既にプレミアム
  | 'SUB_EXPIRED'              // 期限切れ
  
  // 通信系
  | 'NETWORK_OFFLINE'          // オフライン
  | 'NETWORK_TIMEOUT'          // タイムアウト
  | 'NETWORK_SERVER_ERROR';    // サーバーエラー
```

### 5.2 エラー表示方法

| エラー種別 | 表示方法 | 自動リトライ | ユーザーアクション |
|-----------|----------|-------------|-------------------|
| 認証系 | モーダル | なし | 手動リトライ / キャンセル |
| プリセット系 | トースト | なし | 入力修正 |
| 練習記録系 | トースト | 3回まで | なし（バックグラウンドで処理） |
| サブスク系 | モーダル | なし | 手動リトライ / サポート連絡 |
| 通信系 | バナー（画面上部） | 復帰時自動 | なし |

### 5.3 オフライン対応

| 機能 | オフライン時の動作 |
|------|-------------------|
| メトロノーム再生 | ✅ 正常動作 |
| ローカルプリセット読み込み | ✅ 正常動作 |
| プリセット作成・編集 | ⏳ ローカル保存 → オンライン復帰時に同期 |
| 練習記録 | ⏳ ローカル保存 → オンライン復帰時に同期 |
| プリセット同期 | ❌ オンライン復帰後に実行 |
| サブスク購入 | ❌ オンライン必須（エラー表示） |

### 5.4 ローカルキュー処理

オフライン時に発生した操作はローカルキューに保存し、オンライン復帰時に順次処理する。

```typescript
interface QueueItem {
  id: string;
  type: 'CREATE_PRESET' | 'UPDATE_PRESET' | 'DELETE_PRESET' | 'SAVE_SESSION';
  payload: object;
  createdAt: Date;
  retryCount: number;
}
```

**処理ルール:**
- 最大リトライ回数: 3回
- リトライ間隔: 5秒、15秒、30秒（指数バックオフ）
- 3回失敗後: エラートーストを表示し、キューから削除

---

## 6. 制約事項

### 6.1 アプリ全体の制約

| 項目 | 最小値 | 最大値 | 備考 |
|------|--------|--------|------|
| BPM | 30 | 200 | - |
| バック比率 | 1 | 5 | - |
| フォワード比率 | 1 | 5 | - |
| プリセット名文字数 | 1 | 20 | - |

### 6.2 プラン別制約

#### 無料プラン

| 項目 | 制限値 |
|------|--------|
| カスタムプリセット | 3個まで |
| 練習記録閲覧 | 過去7日間 |
| 音の種類 | 3種類 |
| 端末間同期 | 不可 |
| 広告 | 表示あり |

#### プレミアムプラン

| 項目 | 制限値 |
|------|--------|
| カスタムプリセット | 100個まで（実質無制限） |
| 練習記録閲覧 | 1年間 |
| 音の種類 | 10種類 |
| 端末間同期 | 可能 |
| 広告 | 非表示 |

### 6.3 セッション記録の条件

| 条件 | 値 | 理由 |
|------|-----|------|
| 最小記録時間 | 10秒以上 | 誤操作・テスト再生を除外 |
| 最大記録時間 | 2時間（7200秒） | 異常値・バッテリー考慮 |

### 6.4 データ保持ポリシー

| データ種別 | 保持期間 |
|-----------|----------|
| 練習記録（無料） | 7日間で自動削除 |
| 練習記録（プレミアム） | 1年間保存後、自動削除 |
| 退会後の全データ | 30日後に完全削除 |
| 匿名ユーザーデータ | 90日間未使用で自動削除 |

### 6.5 API レート制限

| エンドポイント | 制限 |
|---------------|------|
| RPC呼び出し全般 | 60回/分 |
| プリセット操作 | 30回/分 |
| 練習記録保存 | 10回/分 |

---

## 7. 決済方式

### 7.1 採用技術

| 項目 | 内容 |
|------|------|
| 決済サービス | **RevenueCat** |
| 課金方式 | App Store / Google Play のアプリ内課金（IAP） |
| 採用理由 | 実装が簡単、レシート検証自動、$10K/月まで無料 |

### 7.2 料金プラン

| プラン | 価格 | 備考 |
|--------|------|------|
| 無料版 | ¥0 | 広告あり、機能制限 |
| プレミアム（買い切り） | **¥480** | 一度購入で永久利用 |

### 7.3 手数料

| 項目 | 料率 | 備考 |
|------|------|------|
| ストア手数料 | 15% | 小規模開発者プログラム適用時（年収$1M以下） |
| RevenueCat | 0% | 買い切りは手数料なし |

### 7.4 買い切りで解放される機能

| 機能 | 無料 | プレミアム（¥480） |
|------|------|-------------------|
| メトロノーム再生 | ✅ | ✅ |
| BPM・比率調整 | ✅ | ✅ |
| デフォルトプリセット（4種） | ✅ | ✅ |
| 音の種類 | 3種 | **10種** |
| カスタムプリセット | 3個 | **無制限** |
| 広告 | あり | **非表示** |
| ビジュアルペンダム | シンプル | **カスタマイズ可** |

※練習記録・統計、端末間同期は将来のアップデートで検討

### 7.5 購入フロー

```
1. ユーザーが「プレミアムを購入」ボタンをタップ
        ↓
2. RevenueCat SDK が App Store / Google Play に接続
        ↓
3. ストアの購入UIが表示される（¥480）
        ↓
4. ユーザーが支払い完了
        ↓
5. RevenueCat がレシートを検証
        ↓
6. アプリに購入完了を通知
        ↓
7. アプリがプレミアム機能を解放（永久）
```

### 7.6 実装詳細

#### アプリ側（React Native）

```typescript
// RevenueCat 初期化
import Purchases from 'react-native-purchases';

// 起動時に実行
Purchases.configure({ 
  apiKey: Platform.OS === 'ios' 
    ? 'appl_xxxxx' 
    : 'goog_xxxxx' 
});

// 商品情報取得
const getProduct = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages[0]; // プレミアム買い切り
};

// 購入処理（買い切り）
const purchasePremium = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    const premiumPackage = offerings.current?.availablePackages[0];
    
    if (premiumPackage) {
      const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
      if (customerInfo.entitlements.active['premium']) {
        // プレミアム有効化（永久）
        return true;
      }
    }
    return false;
  } catch (e) {
    if (e.userCancelled) {
      // ユーザーがキャンセル
    } else {
      // エラー処理
    }
    return false;
  }
};

// 復元処理（機種変更時など）
const restorePurchases = async () => {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (e) {
    // エラー処理
    return false;
  }
};

// 現在のプレミアム状態確認
const isPremium = async () => {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo.entitlements.active['premium'] !== undefined;
};
```

### 7.7 RevenueCat 設定項目

| 項目 | 設定値 |
|------|--------|
| Product Type | **Non-Consumable**（非消耗型・買い切り） |
| Entitlement ID | `premium` |
| Product ID (iOS) | `putt_tempo_premium` |
| Product ID (Android) | `putt_tempo_premium` |

### 7.8 テスト方法

| 環境 | 方法 |
|------|------|
| iOS | Sandbox テスター（App Store Connect で作成） |
| Android | テスト用ライセンス（Google Play Console で設定） |
| RevenueCat | Debug モードで購入シミュレーション |

---

## 8. 画面設計

### 8.1 画面一覧

| 画面名 | パス | 説明 |
|--------|------|------|
| ホーム | `/` | メトロノーム操作（メイン画面） |
| プリセット一覧 | `/presets` | デフォルト＋カスタムプリセット |
| プリセット作成/編集 | `/presets/edit` | プリセット設定フォーム |
| 統計 | `/stats` | 練習記録・グラフ |
| 設定 | `/settings` | アプリ設定・アカウント |
| プレミアム | `/premium` | サブスク案内・購入（モーダル） |

### 8.2 画面遷移図

```
┌─────────────────────────────────────────────────────────────┐
│                        Tab Navigation                        │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│   ホーム    │  プリセット  │    統計     │      設定         │
│     /       │  /presets   │   /stats    │    /settings      │
└──────┬──────┴──────┬──────┴─────────────┴─────────┬─────────┘
       │             │                              │
       │             ▼                              ▼
       │    ┌────────────────┐             ┌────────────────┐
       │    │ プリセット編集  │             │   プレミアム    │
       │    │ /presets/edit  │             │   /premium     │
       │    └────────────────┘             └────────────────┘
       │
       ▼
  プリセット選択モーダル
  （ホーム画面内）
```

### 8.3 ワイヤーフレーム

#### 8.3.1 ホーム画面 `/`

メトロノームの操作を行うメイン画面。

```
┌─────────────────────────────────────┐
│ Putt Tempo                    [⚙️]  │  ← ヘッダー（設定へ）
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────────┐     │
│     │                         │     │
│     │    🏌️ パター振り子     │     │  ← ビジュアルペンダム
│     │      アニメーション      │     │
│     │                         │     │
│     └─────────────────────────┘     │
│                                     │
│           85 BPM                    │  ← 現在のBPM（大きく表示）
│           2 : 1                     │  ← 現在の比率
│                                     │
│     ┌─────────────────────────┐     │
│     │  📁 スタンダード    ▼  │     │  ← プリセット選択
│     └─────────────────────────┘     │     （タップでモーダル）
│                                     │
│                                     │
│          ┌─────────────┐            │
│          │             │            │
│          │     ▶️      │            │  ← 再生/停止ボタン（大）
│          │             │            │
│          └─────────────┘            │
│                                     │
│    [🔇 バイブ]     [📳 音]         │  ← 出力切り替え
│                                     │
├─────────────────────────────────────┤
│  🏠     📁      📊      ⚙️        │  ← タブバー
│ ホーム  プリセット 統計   設定       │
└─────────────────────────────────────┘
```

**機能:**
- ビジュアルペンダム：パター風の振り子がBPMと比率に合わせてアニメーション
- BPM/比率表示：現在のプリセット設定を大きく表示
- プリセット選択：タップでモーダルを開き、プリセットを切り替え
- 再生/停止ボタン：メトロノームの再生制御
- 出力切り替え：音声/バイブレーションの切り替え

---

#### 8.3.2 プリセット一覧 `/presets`

デフォルトプリセットとカスタムプリセットの一覧表示・管理画面。

```
┌─────────────────────────────────────┐
│ プリセット                    [＋]  │  ← 新規作成ボタン
├─────────────────────────────────────┤
│                                     │
│  デフォルト                         │
│  ┌─────────────────────────────┐   │
│  │ ⭐ スタンダード              │   │
│  │    85 BPM / 2:1             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    ゆっくり                  │   │
│  │    70 BPM / 2:1             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    速め                      │   │
│  │    100 BPM / 2:1            │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    均等リズム                │   │
│  │    85 BPM / 1:1             │   │
│  └─────────────────────────────┘   │
│                                     │
│  カスタム（1/3）         [🔓 無料]  │  ← 残り枠表示
│  ┌─────────────────────────────┐   │
│  │ ⭐ 朝練用            [編集] │   │  ← スワイプで削除も可
│  │    90 BPM / 2:1             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │  ＋ 新しいプリセットを作成   │   │  ← 空きスロット
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                     │
├─────────────────────────────────────┤
│  🏠     📁      📊      ⚙️        │
└─────────────────────────────────────┘
```

**機能:**
- デフォルトプリセット：4種類を常に表示（編集不可）
- カスタムプリセット：ユーザーが作成したプリセット
- 残り枠表示：無料プランの場合「1/3」のように表示
- お気に入りマーク：⭐でマーク
- 編集ボタン：タップで編集画面へ
- スワイプ削除：左スワイプで削除オプション表示
- 新規作成：空きスロットまたは＋ボタンで作成画面へ

---

#### 8.3.3 プリセット作成/編集 `/presets/edit`

プリセットの作成・編集フォーム。

```
┌─────────────────────────────────────┐
│ [←] プリセット作成        [保存]    │
├─────────────────────────────────────┤
│                                     │
│  プリセット名                       │
│  ┌─────────────────────────────┐   │
│  │ 朝練用                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  テンポ（BPM）                      │
│  ┌─────────────────────────────┐   │
│  │    30 ───────●───────── 200 │   │  ← スライダー
│  │             85              │   │
│  └─────────────────────────────┘   │
│                                     │
│  比率（バック : フォワード）        │
│  ┌──────────┐   ┌──────────┐       │
│  │    2     │ : │    1     │       │  ← ステッパー
│  │  [－][＋]│   │  [－][＋]│       │
│  └──────────┘   └──────────┘       │
│                                     │
│  音の種類                           │
│  ┌─────────────────────────────┐   │
│  │ 🔊 クリック              ▼ │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    🎵 プレビュー再生        │   │  ← 設定を試聴
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⭐ お気に入りに追加         │   │  ← トグルスイッチ
│  └─────────────────────────────┘   │
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    🗑️ このプリセットを削除   │   │  ← 編集時のみ表示（赤色）
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**機能:**
- プリセット名入力：最大20文字
- BPMスライダー：30〜200の範囲で調整
- 比率ステッパー：バック/フォワードそれぞれ1〜5で調整
- 音の種類選択：ドロップダウン（プランに応じた選択肢）
- プレビュー再生：現在の設定でメトロノームを試聴
- お気に入りトグル：ON/OFFの切り替え
- 削除ボタン：編集モード時のみ表示
- 保存ボタン：バリデーション通過後に保存

**バリデーション:**
- プリセット名が空でないこと
- プリセット名が20文字以内であること
- 同名のプリセットが存在しないこと

---

#### 8.3.4 統計画面 `/stats`

練習記録と統計情報の表示画面。

```
┌─────────────────────────────────────┐
│ 統計                                │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  今週の練習                  │   │
│  │                             │   │
│  │   45分                      │   │  ← 総練習時間（大きく）
│  │   5セッション               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📊 日別グラフ              │   │
│  │  ┌──┬──┬──┬──┬──┬──┬──┐   │   │
│  │  │  │██│  │██│██│  │██│   │   │  ← 棒グラフ
│  │  └──┴──┴──┴──┴──┴──┴──┘   │   │
│  │  月 火 水 木 金 土 日        │   │
│  └─────────────────────────────┘   │
│                                     │
│  詳細                               │
│  ┌─────────────────────────────┐   │
│  │ 平均セッション時間   9分     │   │
│  ├─────────────────────────────┤   │
│  │ よく使うプリセット          │   │
│  │           スタンダード       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │
│  │ 🔓 7日間以上の履歴は        │   │  ← 無料ユーザー向けバナー
│  │    プレミアムで確認できます  │   │
│  │         [詳しく見る]        │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                     │
├─────────────────────────────────────┤
│  🏠     📁      📊      ⚙️        │
└─────────────────────────────────────┘
```

**機能:**
- サマリーカード：総練習時間とセッション数を大きく表示
- 日別グラフ：過去7日間（無料）または期間選択可能（プレミアム）の棒グラフ
- 詳細統計：平均セッション時間、最も使用したプリセット
- プレミアム誘導バナー：無料ユーザーに表示

---

#### 8.3.5 設定画面 `/settings`

アプリ設定とアカウント管理画面。

```
┌─────────────────────────────────────┐
│ 設定                                │
├─────────────────────────────────────┤
│                                     │
│  アカウント                         │
│  ┌─────────────────────────────┐   │
│  │ 👤 ゲストユーザー           │   │
│  │    アカウントを作成 →       │   │  ← メール昇格への導線
│  └─────────────────────────────┘   │
│                                     │
│  プラン                             │
│  ┌─────────────────────────────┐   │
│  │ 無料プラン                   │   │
│  │ プレミアムにアップグレード → │   │
│  └─────────────────────────────┘   │
│                                     │
│  サウンド設定                       │
│  ┌─────────────────────────────┐   │
│  │ デフォルトの音   クリック ▼ │   │
│  ├─────────────────────────────┤   │
│  │ バイブレーション     [ON]   │   │  ← トグルスイッチ
│  └─────────────────────────────┘   │
│                                     │
│  アプリについて                     │
│  ┌─────────────────────────────┐   │
│  │ バージョン         1.0.0    │   │
│  ├─────────────────────────────┤   │
│  │ 利用規約                  → │   │
│  ├─────────────────────────────┤   │
│  │ プライバシーポリシー      → │   │
│  ├─────────────────────────────┤   │
│  │ お問い合わせ              → │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔄 購入を復元               │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  🏠     📁      📊      ⚙️        │
└─────────────────────────────────────┘
```

**機能:**
- アカウントセクション：現在のログイン状態とメール昇格への導線
- プランセクション：現在のプランとプレミアムへの導線
- サウンド設定：デフォルト音とバイブレーションのON/OFF
- アプリ情報：バージョン、利用規約、プライバシーポリシー、お問い合わせ
- 購入復元：サブスクリプションの復元ボタン

---

#### 8.3.6 プレミアム画面 `/premium`

サブスクリプションの案内・購入画面（モーダル表示）。

```
┌─────────────────────────────────────┐
│ [×]                                 │  ← 閉じるボタン
├─────────────────────────────────────┤
│                                     │
│           ⭐ Premium ⭐             │
│                                     │
│     もっと自由に練習しよう          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ✅ プリセット無制限          │   │
│  ├─────────────────────────────┤   │
│  │ ✅ 練習履歴を1年間保存       │   │
│  ├─────────────────────────────┤   │
│  │ ✅ 10種類のサウンド          │   │
│  ├─────────────────────────────┤   │
│  │ ✅ 端末間でデータ同期        │   │
│  ├─────────────────────────────┤   │
│  │ ✅ 広告非表示                │   │
│  └─────────────────────────────┘   │
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    月額 ¥480               │   │
│  │    [今すぐ始める]           │   │  ← 購入ボタン
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    年額 ¥3,800（34%お得）   │   │
│  │    [年間プランで始める]     │   │
│  └─────────────────────────────┘   │
│                                     │
│        購入を復元                   │
│                                     │
│  ─────────────────────────────     │
│  7日間の無料トライアル付き          │
│  いつでもキャンセル可能             │
│                                     │
└─────────────────────────────────────┘
```

**機能:**
- 特典一覧：プレミアムの機能をリスト表示
- 月額プラン：¥480/月の購入ボタン
- 年額プラン：¥3,800/年（34%お得）の購入ボタン
- 購入復元：過去の購入を復元するリンク
- 無料トライアル案内：7日間の無料期間の説明

---

#### 8.3.7 プリセット選択モーダル（ホーム画面内）

ホーム画面からプリセットを切り替えるためのモーダル。

```
┌─────────────────────────────────────┐
│                                     │
│  （背景：ホーム画面がうっすら）     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ プリセットを選択       [×]  │   │
│  ├─────────────────────────────┤   │
│  │ ⭐ スタンダード   85/2:1   │   │  ← 選択中はハイライト
│  │    ゆっくり       70/2:1    │   │
│  │    速め          100/2:1    │   │
│  │    均等リズム     85/1:1    │   │
│  ├─────────────────────────────┤   │
│  │ ⭐ 朝練用        90/2:1    │   │
│  ├─────────────────────────────┤   │
│  │  ＋ 新規作成                │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**機能:**
- デフォルトプリセット：4種類を表示
- カスタムプリセット：ユーザー作成分を表示
- 選択中ハイライト：現在選択中のプリセットをハイライト表示
- お気に入りマーク：⭐マーク表示
- 新規作成リンク：タップでプリセット作成画面へ

---

### 8.4 UI コンポーネント

| コンポーネント | 用途 |
|---------------|------|
| `TabBar` | 画面下部のタブナビゲーション |
| `Header` | 画面上部のヘッダー |
| `PresetCard` | プリセット一覧のカード |
| `PlayButton` | 再生/停止の大きなボタン |
| `Pendulum` | パター風振り子アニメーション |
| `BpmSlider` | BPM調整スライダー |
| `RatioStepper` | 比率調整ステッパー |
| `SoundPicker` | 音の種類選択 |
| `StatsCard` | 統計情報カード |
| `BarChart` | 日別練習時間グラフ |
| `PremiumBanner` | プレミアム誘導バナー |
| `Modal` | 汎用モーダル |
| `Toast` | 通知トースト |

---

## 付録

### A. 定数定義

```typescript
// constants/app.ts

export const APP_CONFIG = {
  MIN_BPM: 30,
  MAX_BPM: 200,
  MIN_RATIO: 1,
  MAX_RATIO: 5,
  MAX_PRESET_NAME_LENGTH: 20,
  MIN_SESSION_DURATION: 10,    // 秒
  MAX_SESSION_DURATION: 7200,  // 秒（2時間）
} as const;

export const FREE_PLAN_LIMITS = {
  MAX_CUSTOM_PRESETS: 3,
  PRACTICE_HISTORY_DAYS: 7,
  AVAILABLE_SOUNDS: ['click', 'electronic', 'wood'],
} as const;

export const PREMIUM_PLAN_LIMITS = {
  MAX_CUSTOM_PRESETS: 100,
  PRACTICE_HISTORY_DAYS: 365,
  AVAILABLE_SOUNDS: [
    'click', 'electronic', 'wood',
    'metal', 'soft_beep', 'drum_stick',
    'water_drop', 'spring', 'bell', 'silent'
  ],
} as const;
```

### B. デフォルトプリセット定義

```typescript
// constants/presets.ts

export const DEFAULT_PRESETS = [
  {
    id: 'default-standard',
    name: 'スタンダード',
    bpm: 85,
    backRatio: 2,
    forwardRatio: 1,
    description: '基本練習',
  },
  {
    id: 'default-slow',
    name: 'ゆっくり',
    bpm: 70,
    backRatio: 2,
    forwardRatio: 1,
    description: '初心者・ロングパット',
  },
  {
    id: 'default-fast',
    name: '速め',
    bpm: 100,
    backRatio: 2,
    forwardRatio: 1,
    description: 'ショートパット',
  },
  {
    id: 'default-equal',
    name: '均等リズム',
    bpm: 85,
    backRatio: 1,
    forwardRatio: 1,
    description: 'チャーシューメン派',
  },
] as const;
```

---

*最終更新: 2026年1月20日*
