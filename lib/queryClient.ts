import { QueryClient } from '@tanstack/react-query';

/**
 * React QueryのQueryClientインスタンス
 * デフォルト設定を適用
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ネットワークエラー時の再試行回数
      retry: 2,
      // デフォルトのstaleTime（5分）
      staleTime: 1000 * 60 * 5,
      // デフォルトのcacheTime（10分）
      gcTime: 1000 * 60 * 10,
      // バックグラウンドでの自動再取得を無効化（必要に応じて有効化）
      refetchOnWindowFocus: false,
    },
    mutations: {
      // ミューテーションの再試行を無効化
      retry: false,
    },
  },
});
