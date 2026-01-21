# Task 13: プリセットデータ取得フック

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task13 |
| フェーズ | Phase 5: プリセット管理 |
| 所要時間 | 1時間 |
| 依存タスク | task08（型定義）, task06（RPC関数） |

## 目的
デフォルトプリセットとカスタムプリセットを統合して取得するフックを実装する。

## 実装

### hooks/usePresets.ts
```typescript
// hooks/usePresets.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CustomPreset, DefaultPreset, Preset } from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

const PRESETS_QUERY_KEY = 'presets';

// カスタムプリセットをPreset型に変換
const toPreset = (preset: CustomPreset): Preset => ({
  ...preset,
  backRatio: preset.back_ratio,
  forwardRatio: preset.forward_ratio,
  isDefault: false,
});

// デフォルトプリセットを取得
export function useDefaultPresets(): DefaultPreset[] {
  return DEFAULT_PRESETS;
}

// カスタムプリセットを取得
export function useCustomPresets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [PRESETS_QUERY_KEY, 'custom', user?.id],
    queryFn: async (): Promise<Preset[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('custom_presets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(toPreset);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5分
  });
}

// 全プリセット（デフォルト + カスタム）を取得
export function useAllPresets() {
  const defaultPresets = useDefaultPresets();
  const { data: customPresets = [], ...query } = useCustomPresets();

  const allPresets: Preset[] = [
    ...defaultPresets,
    ...customPresets,
  ];

  // お気に入りを先頭に
  const sortedPresets = [...allPresets].sort((a, b) => {
    const aFav = !a.isDefault && a.is_favorite ? 1 : 0;
    const bFav = !b.isDefault && b.is_favorite ? 1 : 0;
    return bFav - aFav;
  });

  return {
    ...query,
    data: sortedPresets,
    defaultPresets,
    customPresets,
  };
}

// 単一プリセットを取得
export function usePreset(presetId: string | null) {
  const { data: allPresets = [] } = useAllPresets();

  if (!presetId) return null;

  return allPresets.find(p => p.id === presetId) || null;
}

// プリセット上限チェック
export function usePresetLimit() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [PRESETS_QUERY_KEY, 'limit', user?.id],
    queryFn: async () => {
      if (!user) {
        return { can_create: false, current_count: 0, max_count: 3, plan: 'free' };
      }

      const { data, error } = await supabase.rpc('check_preset_limit', {
        p_user_id: user.id,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1分
  });
}

// プリセットキャッシュの無効化
export function useInvalidatePresets() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [PRESETS_QUERY_KEY, 'custom', user?.id],
    });
    queryClient.invalidateQueries({
      queryKey: [PRESETS_QUERY_KEY, 'limit', user?.id],
    });
  };
}
```

## 完了条件
- [ ] hooks/usePresets.ts が実装されている
- [ ] useDefaultPresets が正しく動作する
- [ ] useCustomPresets がSupabaseからデータを取得できる
- [ ] useAllPresets がデフォルトとカスタムを統合できる
- [ ] usePresetLimit が上限情報を取得できる
- [ ] React Queryのキャッシュが正しく動作する

## 注意事項
- RLSにより他ユーザーのプリセットは取得されない
- キャッシュの無効化タイミングに注意（CRUD後）
