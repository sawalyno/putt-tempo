// hooks/useMetronomeSession.ts

import { useState, useCallback } from 'react';
import { useMetronome } from './useMetronome';
import { MetronomeSettings, SessionData } from '@/types';

export function useMetronomeSession(
  settings: MetronomeSettings,
  presetId: string | null,
  presetName: string,
  onSessionEnd?: (session: SessionData) => void
) {
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  const metronome = useMetronome({
    bpm: settings.bpm,
    backRatio: settings.backRatio,
    forwardRatio: settings.forwardRatio,
    soundType: settings.soundType,
    outputMode: settings.outputMode,
    interval: settings.interval,
    onTick: () => {
      // 振り子アニメーション用のコールバックをここで呼べる
    },
  });

  const startSession = useCallback(() => {
    setSessionStart(new Date());
    metronome.start();
  }, [metronome]);

  const stopSession = useCallback(() => {
    metronome.stop();

    if (sessionStart) {
      const endedAt = new Date();
      const durationSeconds = Math.floor(
        (endedAt.getTime() - sessionStart.getTime()) / 1000
      );

      const sessionData: SessionData = {
        presetId,
        presetName,
        bpm: settings.bpm,
        backRatio: settings.backRatio,
        forwardRatio: settings.forwardRatio,
        startedAt: sessionStart,
        endedAt,
        durationSeconds,
      };

      onSessionEnd?.(sessionData);
      setSessionStart(null);

      return sessionData;
    }

    return null;
  }, [metronome, sessionStart, presetId, presetName, settings, onSessionEnd]);

  const toggleSession = useCallback(() => {
    if (metronome.isPlaying) {
      return stopSession();
    } else {
      startSession();
      return null;
    }
  }, [metronome.isPlaying, startSession, stopSession]);

  return {
    ...metronome,
    startSession,
    stopSession,
    toggleSession,
    sessionStart,
  };
}
