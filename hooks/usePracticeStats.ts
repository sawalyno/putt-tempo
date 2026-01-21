// hooks/usePracticeStats.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PracticeStats, SessionData } from '@/types';
import { APP_CONFIG } from '@/constants';

const STATS_QUERY_KEY = 'practice-stats';

export function usePracticeStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [STATS_QUERY_KEY, user?.id],
    queryFn: async (): Promise<PracticeStats> => {
      if (!user) {
        return {
          total_sessions: 0,
          total_duration_seconds: 0,
          average_duration_seconds: 0,
          most_used_preset: null,
          daily_stats: [],
          period_days: 7,
        };
      }

      const { data, error } = await supabase.rpc('get_practice_stats', {
        p_user_id: user.id,
      });

      if (error) throw error;
      return data as PracticeStats;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5分
  });
}

export function useSavePracticeSession() {
  const { user } = useAuth();

  const saveSession = async (session: SessionData): Promise<boolean> => {
    if (!user) return false;

    // 最小セッション時間チェック
    if (session.durationSeconds < APP_CONFIG.MIN_SESSION_DURATION) {
      console.log('Session too short, not saving');
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('save_practice_session', {
        p_user_id: user.id,
        p_preset_id: session.presetId,
        p_preset_name: session.presetName,
        p_bpm: session.bpm,
        p_back_ratio: session.backRatio,
        p_forward_ratio: session.forwardRatio,
        p_duration_seconds: session.durationSeconds,
        p_started_at: session.startedAt.toISOString(),
        p_ended_at: session.endedAt.toISOString(),
      });

      if (error) throw error;
      return data?.success === true;
    } catch (error) {
      console.error('Failed to save practice session:', error);
      return false;
    }
  };

  return { saveSession };
}
