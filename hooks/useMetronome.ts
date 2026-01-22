// hooks/useMetronome.ts

import { useState, useRef, useCallback, useEffect } from 'react';
import { soundPlayer } from '@/lib/soundPlayer';
import { vibrationPlayer } from '@/lib/vibrationPlayer';
import { SoundType, OutputMode } from '@/types';

interface UseMetronomeOptions {
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
  outputMode: OutputMode;
  onTick?: (phase: 'back' | 'forward') => void;
}

export function useMetronome(options: UseMetronomeOptions) {
  const { bpm, backRatio, forwardRatio, soundType, outputMode, onTick } =
    options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'back' | 'forward'>('back');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const isPlayingRef = useRef(false);
  const isBackRef = useRef(true); // フェーズ追跡用ref

  // タイミング計算
  const calculateTimings = useCallback(() => {
    const cycleDuration = 60000 / bpm; // 1サイクルの時間(ms)
    const totalRatio = backRatio + forwardRatio;
    const backDuration = cycleDuration * (backRatio / totalRatio);
    const forwardDuration = cycleDuration * (forwardRatio / totalRatio);

    return { cycleDuration, backDuration, forwardDuration };
  }, [bpm, backRatio, forwardRatio]);

  // 音/バイブを再生
  const playFeedback = useCallback(
    async (phase: 'back' | 'forward') => {
      const shouldPlaySound = outputMode === 'sound' || outputMode === 'both';
      const shouldVibrate =
        outputMode === 'vibration' || outputMode === 'both';

      if (shouldPlaySound && soundType !== 'silent') {
        soundPlayer.play(soundType);
      }

      if (shouldVibrate) {
        if (phase === 'back') {
          vibrationPlayer.vibrateBack();
        } else {
          vibrationPlayer.vibrateForward();
        }
      }
    },
    [outputMode, soundType]
  );

  // メトロノームのメインループ
  const runMetronome = useCallback(() => {
    const { backDuration, forwardDuration } = calculateTimings();

    const tick = () => {
      if (!isPlayingRef.current) return;

      const phase = isBackRef.current ? 'back' : 'forward';
      setCurrentPhase(phase);
      playFeedback(phase);
      onTick?.(phase);

      // 現在のフェーズの長さだけ待ってから次へ
      const currentDuration = isBackRef.current ? backDuration : forwardDuration;
      isBackRef.current = !isBackRef.current;

      timeoutRef.current = setTimeout(tick, currentDuration);
    };

    // 最初のティック
    tick();
  }, [calculateTimings, playFeedback, onTick]);

  // 再生開始
  const start = useCallback(() => {
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    isBackRef.current = true; // フェーズをリセット
    setIsPlaying(true);
    startTimeRef.current = new Date();
    runMetronome();
  }, [runMetronome]);

  // 停止
  const stop = useCallback(() => {
    if (!isPlayingRef.current) return;

    isPlayingRef.current = false;
    isBackRef.current = true; // フェーズをリセット
    setIsPlaying(false);
    setCurrentPhase('back');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const endTime = new Date();
    const startTime = startTimeRef.current;
    const duration = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

    startTimeRef.current = null;

    return { startTime, endTime, duration };
  }, []);

  // 再生/停止トグル
  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      return stop();
    } else {
      start();
      return null;
    }
  }, [start, stop]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 設定変更時に再起動（runMetronomeを依存配列から除外して無限ループ防止）
  useEffect(() => {
    if (isPlayingRef.current) {
      // 一度停止して再開
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 新しいタイミングで再開
      const { backDuration, forwardDuration } = calculateTimings();
      
      const tick = () => {
        if (!isPlayingRef.current) return;

        const phase = isBackRef.current ? 'back' : 'forward';
        setCurrentPhase(phase);
        playFeedback(phase);
        onTick?.(phase);

        const currentDuration = isBackRef.current ? backDuration : forwardDuration;
        isBackRef.current = !isBackRef.current;

        timeoutRef.current = setTimeout(tick, currentDuration);
      };
      
      tick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, backRatio, forwardRatio]);

  return {
    isPlaying,
    currentPhase,
    start,
    stop,
    toggle,
    timings: calculateTimings(),
  };
}
