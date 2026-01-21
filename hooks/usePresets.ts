// hooks/usePresets.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  CustomPreset,
  DefaultPreset,
  Preset,
  AppCustomPreset,
  CheckPresetLimitResponse,
} from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

const PRESETS_QUERY_KEY = 'presets';

// カスタムプリセットをPreset型に変換
const toAppPreset = (preset: CustomPreset): AppCustomPreset => ({
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
    queryFn: async (): Promise<AppCustomPreset[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('custom_presets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(toAppPreset);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5分
  });
}

// 全プリセット（デフォルト + カスタム）を取得
export function useAllPresets() {
  const defaultPresets = useDefaultPresets();
  const { data: customPresets = [], ...query } = useCustomPresets();

  const allPresets: Preset[] = [...defaultPresets, ...customPresets];

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
export function usePreset(presetId: string | null): Preset | null {
  const { data: allPresets = [] } = useAllPresets();

  if (!presetId) return null;

  return allPresets.find((p) => p.id === presetId) || null;
}

// プリセット上限チェック
export function usePresetLimit() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [PRESETS_QUERY_KEY, 'limit', user?.id],
    queryFn: async (): Promise<CheckPresetLimitResponse> => {
      if (!user) {
        return {
          can_create: false,
          current_count: 0,
          max_count: 3,
          plan: 'free',
        };
      }

      const { data, error } = await supabase.rpc('check_preset_limit', {
        p_user_id: user.id,
      });

      if (error) throw error;
      return data as CheckPresetLimitResponse;
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
