# Task 06: RPC関数作成（基本）

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task06 |
| フェーズ | Phase 2: Supabase DB・RPC |
| 所要時間 | 1時間 |
| 依存タスク | task05（DBテーブル作成） |

## 目的
ユーザー初期化とプリセット上限チェックのRPC関数を作成する。

## 作成するRPC関数

### 1. initialize_user
新規ユーザーの初期設定を作成する。

```sql
CREATE OR REPLACE FUNCTION initialize_user(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_exists boolean;
BEGIN
  -- 既存チェック
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = p_user_id)
  INTO v_profile_exists;
  
  IF v_profile_exists THEN
    RETURN json_build_object('success', true, 'message', 'User already initialized');
  END IF;
  
  -- user_profiles 作成
  INSERT INTO user_profiles (id)
  VALUES (p_user_id);
  
  -- subscriptions 作成（freeプラン）
  INSERT INTO subscriptions (user_id, plan)
  VALUES (p_user_id, 'free');
  
  RETURN json_build_object('success', true);
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### 2. check_preset_limit
プリセット作成前に上限をチェックする。

```sql
CREATE OR REPLACE FUNCTION check_preset_limit(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan text;
  v_current_count integer;
  v_max_count integer;
  v_can_create boolean;
BEGIN
  -- プランを取得
  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = p_user_id;
  
  -- プランが見つからない場合はfreeとして扱う
  IF v_plan IS NULL THEN
    v_plan := 'free';
  END IF;
  
  -- 現在のプリセット数を取得
  SELECT COUNT(*) INTO v_current_count
  FROM custom_presets
  WHERE user_id = p_user_id;
  
  -- 上限チェック
  IF v_plan = 'free' THEN
    v_max_count := 3;
    v_can_create := v_current_count < 3;
  ELSE
    v_max_count := 100; -- 実質無制限だが念のため
    v_can_create := v_current_count < 100;
  END IF;
  
  RETURN json_build_object(
    'can_create', v_can_create,
    'current_count', v_current_count,
    'max_count', v_max_count,
    'plan', v_plan
  );
END;
$$;
```

## 呼び出し例（TypeScript）

```typescript
// initialize_user
const { data, error } = await supabase.rpc('initialize_user', {
  p_user_id: user.id
});

// check_preset_limit
const { data, error } = await supabase.rpc('check_preset_limit', {
  p_user_id: user.id
});
// data: { can_create: true, current_count: 1, max_count: 3, plan: 'free' }
```

## 完了条件
- [ ] initialize_user 関数が作成されている
- [ ] check_preset_limit 関数が作成されている
- [ ] Supabase Dashboard の SQL Editor から実行テストが通る
- [ ] アプリから呼び出しできることを確認

## 注意事項
- `SECURITY DEFINER` を使用しているため、RLSをバイパスできる
- エラーハンドリングを適切に行うこと
