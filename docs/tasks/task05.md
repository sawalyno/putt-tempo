# Task 05: DBテーブル作成

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task05 |
| フェーズ | Phase 2: Supabase DB・RPC |
| 所要時間 | 1時間 |
| 依存タスク | task01（Supabaseクライアント設定） |

## 目的
Supabaseにアプリで使用する4つのテーブルを作成し、RLSポリシーを設定する。

## 作成するテーブル

### 1. user_profiles（ユーザー設定）
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  preferred_sound text NOT NULL DEFAULT 'click',
  vibration_enabled boolean NOT NULL DEFAULT true,
  last_used_preset_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### 2. custom_presets（カスタムプリセット）
```sql
CREATE TABLE custom_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bpm integer NOT NULL,
  back_ratio integer NOT NULL,
  forward_ratio integer NOT NULL,
  sound_type text NOT NULL DEFAULT 'click',
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT name_length CHECK (char_length(name) <= 20),
  CONSTRAINT bpm_range CHECK (bpm >= 30 AND bpm <= 200),
  CONSTRAINT back_ratio_range CHECK (back_ratio >= 1 AND back_ratio <= 5),
  CONSTRAINT forward_ratio_range CHECK (forward_ratio >= 1 AND forward_ratio <= 5),
  CONSTRAINT unique_user_preset_name UNIQUE (user_id, name)
);
```

### 3. practice_sessions（練習記録）
```sql
CREATE TABLE practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_id uuid REFERENCES custom_presets(id) ON DELETE SET NULL,
  preset_name text NOT NULL,
  bpm integer NOT NULL,
  back_ratio integer NOT NULL,
  forward_ratio integer NOT NULL,
  duration_seconds integer NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz NOT NULL,
  
  CONSTRAINT duration_min CHECK (duration_seconds >= 10),
  CONSTRAINT duration_max CHECK (duration_seconds <= 7200)
);

CREATE INDEX idx_practice_sessions_user_started 
ON practice_sessions(user_id, started_at DESC);
```

### 4. subscriptions（課金情報）
```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  platform text,
  store_product_id text,
  store_transaction_id text,
  purchased_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT plan_type CHECK (plan IN ('free', 'premium')),
  CONSTRAINT platform_type CHECK (platform IS NULL OR platform IN ('ios', 'android', 'web'))
);
```

## RLSポリシー

### user_profiles
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

### custom_presets
```sql
ALTER TABLE custom_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own presets"
ON custom_presets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own presets"
ON custom_presets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presets"
ON custom_presets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own presets"
ON custom_presets FOR DELETE
USING (auth.uid() = user_id);
```

### practice_sessions
```sql
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
ON practice_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
ON practice_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### subscriptions
```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
ON subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
ON subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 外部キー追加（user_profiles → custom_presets）
```sql
ALTER TABLE user_profiles
ADD CONSTRAINT fk_last_used_preset
FOREIGN KEY (last_used_preset_id)
REFERENCES custom_presets(id)
ON DELETE SET NULL;
```

## 完了条件
- [x] user_profiles テーブルが作成されている
- [x] custom_presets テーブルが作成されている
- [x] practice_sessions テーブルが作成されている
- [x] subscriptions テーブルが作成されている
- [x] 全テーブルにRLSポリシーが設定されている
- [x] インデックスが作成されている
- [x] Supabase Dashboardでテーブル構造を確認できる

## 注意事項
- 匿名認証を有効にしておくこと（Supabase Dashboard > Authentication > Settings）
- マイグレーションファイルとして保存しておくと再現性が高い
