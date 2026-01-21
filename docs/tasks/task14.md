# Task 14: プリセットCRUD操作フック

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task14 |
| フェーズ | Phase 5: プリセット管理 |
| 所要時間 | 1時間 |
| 依存タスク | task13（プリセット取得フック） |

## 目的
カスタムプリセットの作成・編集・削除・お気に入り操作のフックを実装する。

## 実装

### hooks/usePresetMutations.ts
```typescript
// hooks/usePresetMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SoundType } from '@/types';

interface CreatePresetInput {
  name: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
  isFavorite?: boolean;
}

interface UpdatePresetInput extends Partial<CreatePresetInput> {
  id: string;
}

const PRESETS_QUERY_KEY = 'presets';

export function useCreatePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePresetInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('custom_presets')
        .insert({
          user_id: user.id,
          name: input.name,
          bpm: input.bpm,
          back_ratio: input.backRatio,
          forward_ratio: input.forwardRatio,
          sound_type: input.soundType,
          is_favorite: input.isFavorite || false,
        })
        .select()
        .single();

      if (error) {
        // エラーコード変換
        if (error.code === '23505') {
          throw new Error('PRESET_NAME_DUPLICATE');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useUpdatePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePresetInput) => {
      if (!user) throw new Error('Not authenticated');

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.bpm !== undefined) updateData.bpm = input.bpm;
      if (input.backRatio !== undefined) updateData.back_ratio = input.backRatio;
      if (input.forwardRatio !== undefined) updateData.forward_ratio = input.forwardRatio;
      if (input.soundType !== undefined) updateData.sound_type = input.soundType;
      if (input.isFavorite !== undefined) updateData.is_favorite = input.isFavorite;

      const { data, error } = await supabase
        .from('custom_presets')
        .update(updateData)
        .eq('id', input.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('PRESET_NAME_DUPLICATE');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useDeletePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presetId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('custom_presets')
        .delete()
        .eq('id', presetId)
        .eq('user_id', user.id);

      if (error) throw error;

      return presetId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ presetId, isFavorite }: { presetId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('custom_presets')
        .update({
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', presetId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

// 便利なヘルパーフック
export function usePresetMutations() {
  const createPreset = useCreatePreset();
  const updatePreset = useUpdatePreset();
  const deletePreset = useDeletePreset();
  const toggleFavorite = useToggleFavorite();

  return {
    createPreset,
    updatePreset,
    deletePreset,
    toggleFavorite,
    isLoading:
      createPreset.isPending ||
      updatePreset.isPending ||
      deletePreset.isPending ||
      toggleFavorite.isPending,
  };
}
```

## 使用例

```typescript
const { createPreset, updatePreset, deletePreset, toggleFavorite } = usePresetMutations();

// 作成
await createPreset.mutateAsync({
  name: '朝練用',
  bpm: 90,
  backRatio: 2,
  forwardRatio: 1,
  soundType: 'click',
});

// 更新
await updatePreset.mutateAsync({
  id: 'preset-id',
  bpm: 95,
});

// 削除
await deletePreset.mutateAsync('preset-id');

// お気に入りトグル
await toggleFavorite.mutateAsync({
  presetId: 'preset-id',
  isFavorite: true,
});
```

## 完了条件
- [ ] hooks/usePresetMutations.ts が実装されている
- [ ] useCreatePreset が正しく動作する
- [ ] useUpdatePreset が正しく動作する
- [ ] useDeletePreset が正しく動作する
- [ ] useToggleFavorite が正しく動作する
- [ ] 操作後にキャッシュが無効化される
- [ ] 重複名エラーが適切にハンドリングされる

## 注意事項
- RLSにより自分のプリセットのみ操作可能
- 無料プランは3個まで（作成前にcheck_preset_limitで確認）
- デフォルトプリセットは操作対象外
