import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { InitializeUserDataResponse } from '@/types';

/**
 * ユーザーデータを初期化するカスタムフック
 * 
 * @returns mutationオブジェクト（mutate, mutateAsync, isLoading, error等）
 */
export function useInitializeUserData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<InitializeUserDataResponse> => {
      const { data, error } = await supabase.rpc('initialize_user_data');

      if (error) {
        console.error('ユーザーデータ初期化エラー:', error);
        throw new Error(`ユーザーデータ初期化に失敗しました: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error('ユーザーデータ初期化が失敗しました');
      }

      return data;
    },
    onSuccess: () => {
      // 統計情報のキャッシュを無効化して再取得を促す
      queryClient.invalidateQueries({ queryKey: ['userStatistics'] });
    },
    onError: (error) => {
      console.error('ユーザーデータ初期化中にエラーが発生しました:', error);
    },
  });
}
