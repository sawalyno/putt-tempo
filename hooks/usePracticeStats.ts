// hooks/usePracticeStats.ts - ローカルストレージベースの練習統計

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { calculatePracticeStats, savePracticeSession } from '@/lib/storage';
import { SessionData } from '@/types';
import { useCallback } from 'react';

const STATS_QUERY_KEY = 'practice_stats';

// 練習統計を取得（過去7日間）
export function usePracticeStats(days: number = 7) {
  return useQuery({
    queryKey: [STATS_QUERY_KEY, days],
    queryFn: async () => {
      const stats = await calculatePracticeStats(days);
      return {
        total_sessions: stats.totalSessions,
        total_duration_seconds: stats.totalDurationSeconds,
        average_duration_seconds: stats.averageDurationSeconds,
        most_used_preset: stats.mostUsedPreset,
        daily_stats: stats.dailyStats.map(d => ({
          date: d.date,
          duration_seconds: d.durationSeconds,
          session_count: d.sessionCount,
        })),
        period_days: stats.periodDays,
      };
    },
    staleTime: 1000 * 60, // 1分
  });
}

// 練習セッションを保存
export function useSavePracticeSession() {
  const queryClient = useQueryClient();

  const saveSession = useCallback(async (session: SessionData) => {
    try {
      await savePracticeSession({
        presetName: session.presetName,
        bpm: session.bpm,
        backRatio: session.backRatio,
        forwardRatio: session.forwardRatio,
        durationSeconds: session.durationSeconds,
        startedAt: session.startedAt.toISOString(),
        endedAt: session.endedAt.toISOString(),
      });
      
      // キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save practice session:', error);
      return { success: false, error };
    }
  }, [queryClient]);

  return { saveSession };
}
