import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UserSettings } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ユーザー設定フック
 * 
 * TODO: アプリ固有の設定項目に合わせてカスタマイズ
 */

// デフォルト設定
const DEFAULT_SETTINGS: Omit<UserSettings, 'user_id'> = {
  sound_volume: 5,
  vibration_enabled: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// 設定を取得
export function useUserSettings() {
  const { user, initialized } = useAuth();

  const query = useQuery({
    queryKey: ['userSettings', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // 設定が存在しない場合はデフォルト値を返す
        if (error.code === 'PGRST116') {
          return {
            user_id: user.id,
            ...DEFAULT_SETTINGS,
          } as UserSettings;
        }
        throw error;
      }

      return data as UserSettings;
    },
    enabled: initialized && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });

  // ユーザーが未認証の場合はデフォルト値を返す（ローディング状態にしない）
  if (!initialized || !user?.id) {
    return {
      ...query,
      data: { user_id: '', ...DEFAULT_SETTINGS } as UserSettings,
      isLoading: !initialized, // 初期化完了前のみローディング
    };
  }

  return query;
}

// 設定を更新
export function useUpdateUserSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    // TODO: アプリ固有の設定項目に合わせて型を修正
    mutationFn: async (updates: Partial<Pick<UserSettings, 'sound_volume' | 'vibration_enabled'>>) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as UserSettings;
    },
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['userSettings', user?.id] });
    },
  });
}
