// hooks/usePresets.ts - ローカルストレージベースのプリセット管理

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_PRESETS, FREE_PLAN_LIMITS } from '@/constants';
import { getCustomPresets, LocalCustomPreset } from '@/lib/storage';
import { DefaultPreset, AppCustomPreset, Preset } from '@/types';

const PRESETS_QUERY_KEY = 'presets';

// LocalCustomPresetをAppCustomPresetに変換
const toAppPreset = (preset: LocalCustomPreset): AppCustomPreset => ({
  id: preset.id,
  user_id: 'local',
  name: preset.name,
  bpm: preset.bpm,
  sound_type: preset.soundType as any,
  is_favorite: false,
  created_at: preset.createdAt,
  updated_at: preset.updatedAt,
  backRatio: preset.backRatio,
  forwardRatio: preset.forwardRatio,
  isDefault: false,
});

// デフォルトプリセットを取得
export function useDefaultPresets(): DefaultPreset[] {
  return DEFAULT_PRESETS;
}

// カスタムプリセットを取得
export function useCustomPresets() {
  return useQuery({
    queryKey: [PRESETS_QUERY_KEY, 'custom'],
    queryFn: async (): Promise<AppCustomPreset[]> => {
      const localPresets = await getCustomPresets();
      return localPresets.map(toAppPreset);
    },
    staleTime: 1000 * 60 * 5, // 5分
  });
}

// 全プリセット（デフォルト + カスタム）を取得
export function useAllPresets() {
  const defaultPresets = useDefaultPresets();
  const { data: customPresets = [], ...query } = useCustomPresets();

  const allPresets: Preset[] = [...defaultPresets, ...customPresets];

  return {
    ...query,
    data: allPresets,
    defaultPresets,
    customPresets,
  };
}

// 単一プリセットを取得
export function usePreset(presetId: string | null): Preset | null {
  const { data: allPresets = [] } = useAllPresets();

  if (!presetId) return null;

  return allPresets.find((p) => p.id === presetId) || null;
}

// プリセット上限チェック（キャッシュを使わずリアルタイム計算）
export function usePresetLimit() {
  const { data: customPresets = [] } = useCustomPresets();
  
  const currentCount = customPresets.length;
  const maxCount = FREE_PLAN_LIMITS.MAX_CUSTOM_PRESETS;
  
  return {
    data: {
      can_create: currentCount < maxCount,
      current_count: currentCount,
      max_count: maxCount,
      plan: 'free' as const,
    },
  };
}

// プリセットキャッシュの無効化
export function useInvalidatePresets() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [PRESETS_QUERY_KEY],
    });
  };
}
