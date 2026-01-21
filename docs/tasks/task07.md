# Task 07: RPC関数作成（記録・統計）

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task07 |
| フェーズ | Phase 2: Supabase DB・RPC |
| 所要時間 | 1時間 |
| 依存タスク | task05（DBテーブル作成） |

## 目的
練習記録の保存、統計取得、サブスクリプション更新のRPC関数を作成する。

## 作成するRPC関数

### 1. save_practice_session
練習セッションを保存し、ユーザープロフィールを更新する。

```sql
CREATE OR REPLACE FUNCTION save_practice_session(
  p_user_id uuid,
  p_preset_id uuid,
  p_preset_name text,
  p_bpm integer,
  p_back_ratio integer,
  p_forward_ratio integer,
  p_duration_seconds integer,
  p_started_at timestamptz,
  p_ended_at timestamptz
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id uuid;
BEGIN
  -- バリデーション
  IF p_duration_seconds < 10 THEN
    RETURN json_build_object('success', false, 'error', 'SESSION_TOO_SHORT');
  END IF;
  
  IF p_duration_seconds > 7200 THEN
    RETURN json_build_object('success', false, 'error', 'SESSION_TOO_LONG');
  END IF;
  
  -- practice_sessions に挿入
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
  
  -- user_profiles 更新
  UPDATE user_profiles
  SET 
    last_used_preset_id = p_preset_id,
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN json_build_object('success', true, 'session_id', v_session_id);
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### 2. get_practice_stats
ユーザーの練習統計を取得する（プランに応じた期間制限あり）。

```sql
CREATE OR REPLACE FUNCTION get_practice_stats(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan text;
  v_start_date timestamptz;
  v_total_sessions integer;
  v_total_duration integer;
  v_average_duration integer;
  v_most_used_preset text;
  v_daily_stats json;
BEGIN
  -- プランを取得
  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = p_user_id;
  
  -- 期間フィルタを設定
  IF v_plan = 'free' OR v_plan IS NULL THEN
    v_start_date := now() - INTERVAL '7 days';
  ELSE
    v_start_date := now() - INTERVAL '1 year';
  END IF;
  
  -- 集計クエリ
  SELECT
    COUNT(*)::integer,
    COALESCE(SUM(duration_seconds), 0)::integer,
    COALESCE(AVG(duration_seconds), 0)::integer
  INTO v_total_sessions, v_total_duration, v_average_duration
  FROM practice_sessions
  WHERE user_id = p_user_id
    AND started_at >= v_start_date;
  
  -- 最も使用したプリセット
  SELECT preset_name INTO v_most_used_preset
  FROM practice_sessions
  WHERE user_id = p_user_id
    AND started_at >= v_start_date
  GROUP BY preset_name
  ORDER BY COUNT(*) DESC
  LIMIT 1;
  
  -- 日別統計
  SELECT json_agg(daily ORDER BY daily.date DESC)
  INTO v_daily_stats
  FROM (
    SELECT
      DATE(started_at) as date,
      SUM(duration_seconds)::integer as duration_seconds,
      COUNT(*)::integer as session_count
    FROM practice_sessions
    WHERE user_id = p_user_id
      AND started_at >= v_start_date
    GROUP BY DATE(started_at)
  ) as daily;
  
  RETURN json_build_object(
    'total_sessions', v_total_sessions,
    'total_duration_seconds', v_total_duration,
    'average_duration_seconds', v_average_duration,
    'most_used_preset', v_most_used_preset,
    'daily_stats', COALESCE(v_daily_stats, '[]'::json),
    'period_days', CASE WHEN v_plan = 'premium' THEN 365 ELSE 7 END
  );
END;
$$;
```

### 3. upgrade_subscription
課金情報を更新する（買い切り購入時）。

```sql
CREATE OR REPLACE FUNCTION upgrade_subscription(
  p_user_id uuid,
  p_plan text,
  p_platform text,
  p_store_product_id text,
  p_store_transaction_id text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
  
  RETURN json_build_object('success', true);
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

## 完了条件
- [ ] save_practice_session 関数が作成されている
- [ ] get_practice_stats 関数が作成されている
- [ ] upgrade_subscription 関数が作成されている
- [ ] 各関数のテストが通る

## 注意事項
- 統計取得はプランに応じて期間が異なる（無料: 7日、プレミアム: 1年）
- save_practice_session は10秒未満/2時間超過のセッションを拒否する
