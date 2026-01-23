// hooks/useMetronome.ts

import { APP_CONFIG } from '@/constants';
import { soundPlayer } from '@/lib/soundPlayer';
import { vibrationPlayer } from '@/lib/vibrationPlayer';
import { MetronomePhase, OutputMode, SoundType } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseMetronomeOptions {
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
  outputMode: OutputMode;
  interval: number; // インターバル秒数
  onTick?: (phase: MetronomePhase) => void;
}

export function useMetronome(options: UseMetronomeOptions) {
  const { bpm, backRatio, forwardRatio, soundType, outputMode, interval, onTick } =
    options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<MetronomePhase>('idle');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const isPlayingRef = useRef(false);
  const phaseRef = useRef<MetronomePhase>('address'); // 3フェーズ + interval

  // タイミング計算
  // address: プロのルーティンに基づく固定時間（1000ms）
  // takeBack: backRatioに基づく時間
  // impact: forwardRatioに基づく時間
  // interval: ユーザー設定のインターバル時間
  const calculateTimings = useCallback(() => {
    const cycleDuration = 60000 / bpm; // 1サイクルの時間(ms)
    const totalRatio = backRatio + forwardRatio;
    const takeBackDuration = cycleDuration * (backRatio / totalRatio);
    const impactDuration = cycleDuration * (forwardRatio / totalRatio);
    const addressDuration = APP_CONFIG.ADDRESS_DURATION; // アドレス→テイクバックの間隔（固定）
    const intervalDuration = interval * 1000; // 秒をmsに変換

    return { 
      cycleDuration, 
      addressDuration,
      takeBackDuration, 
      impactDuration,
      intervalDuration,
    };
  }, [bpm, backRatio, forwardRatio, interval]);

  // 音/バイブを再生
  const playFeedback = useCallback(
    async (phase: MetronomePhase) => {
      // intervalフェーズでは音を鳴らさない
      if (phase === 'interval' || phase === 'idle') return;

      const shouldPlaySound = outputMode === 'sound' || outputMode === 'both';
      const shouldVibrate =
        outputMode === 'vibration' || outputMode === 'both';

      if (shouldPlaySound && soundType !== 'silent') {
        soundPlayer.play(soundType);
      }

      if (shouldVibrate) {
        // フェーズに応じたバイブレーション
        if (phase === 'impact') {
          vibrationPlayer.vibrateForward(); // インパクトは強め
        } else {
          vibrationPlayer.vibrateBack(); // アドレス、テイクバックは通常
        }
      }
    },
    [outputMode, soundType]
  );

  // メトロノームのメインループ
  const runMetronome = useCallback(() => {
    const { addressDuration, takeBackDuration, impactDuration, intervalDuration } = calculateTimings();

    const tick = () => {
      if (!isPlayingRef.current) return;

      const phase = phaseRef.current;
      setCurrentPhase(phase);
      playFeedback(phase);
      onTick?.(phase);

      // 次のフェーズと待機時間を決定
      let nextPhase: MetronomePhase;
      let duration: number;

      switch (phase) {
        case 'address':
          nextPhase = 'takeBack';
          duration = addressDuration;
          break;
        case 'takeBack':
          nextPhase = 'impact';
          duration = takeBackDuration;
          break;
        case 'impact':
          nextPhase = 'interval';
          duration = impactDuration;
          break;
        case 'interval':
        default:
          nextPhase = 'address';
          duration = intervalDuration;
          break;
      }

      phaseRef.current = nextPhase;
      timeoutRef.current = setTimeout(tick, duration);
    };

    // 最初のティック
    tick();
  }, [calculateTimings, playFeedback, onTick]);

  // 再生開始
  const start = useCallback(() => {
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    phaseRef.current = 'address'; // フェーズをリセット
    setIsPlaying(true);
    startTimeRef.current = new Date();
    runMetronome();
  }, [runMetronome]);

  // 停止
  const stop = useCallback(() => {
    if (!isPlayingRef.current) return;

    isPlayingRef.current = false;
    phaseRef.current = 'address'; // フェーズをリセット
    setIsPlaying(false);
    setCurrentPhase('idle');

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
      const { addressDuration, takeBackDuration, impactDuration, intervalDuration } = calculateTimings();
      
      const tick = () => {
        if (!isPlayingRef.current) return;

        const phase = phaseRef.current;
        setCurrentPhase(phase);
        playFeedback(phase);
        onTick?.(phase);

        let nextPhase: MetronomePhase;
        let duration: number;

        switch (phase) {
          case 'address':
            nextPhase = 'takeBack';
            duration = addressDuration;
            break;
          case 'takeBack':
            nextPhase = 'impact';
            duration = takeBackDuration;
            break;
          case 'impact':
            nextPhase = 'interval';
            duration = impactDuration;
            break;
          case 'interval':
          default:
            nextPhase = 'address';
            duration = intervalDuration;
            break;
        }

        phaseRef.current = nextPhase;
        timeoutRef.current = setTimeout(tick, duration);
      };
      
      tick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, backRatio, forwardRatio, interval]);

  return {
    isPlaying,
    currentPhase,
    start,
    stop,
    toggle,
    timings: calculateTimings(),
  };
}
