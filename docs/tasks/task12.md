# Task 12: メトロノームロジック（BPM・比率）

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task12 |
| フェーズ | Phase 4: メトロノームコア |
| 所要時間 | 1.5時間 |
| 依存タスク | task10（音声再生）, task11（バイブレーション） |

## 目的
BPMと比率に基づいてメトロノームを制御するロジックを実装する。

## メトロノームの仕組み

### 計算式
```
1サイクル時間(ms) = 60000 / BPM

バック:フォワード = 2:1 の場合
  バックストローク時間 = 1サイクル時間 × (2/3)
  フォワードストローク時間 = 1サイクル時間 × (1/3)
```

### 例（85 BPM, 2:1比率）
- 1サイクル = 60000 / 85 ≈ 706ms
- バックストローク = 706 × (2/3) ≈ 471ms
- フォワードストローク = 706 × (1/3) ≈ 235ms

## 実装

### hooks/useMetronome.ts
```typescript
// hooks/useMetronome.ts

import { useState, useRef, useCallback, useEffect } from 'react';
import { soundPlayer } from '@/lib/soundPlayer';
import { vibrationPlayer } from '@/lib/vibrationPlayer';
import { SoundType, OutputMode } from '@/types';

interface MetronomeState {
  isPlaying: boolean;
  currentPhase: 'back' | 'forward';
  bpm: number;
  backRatio: number;
  forwardRatio: number;
}

interface UseMetronomeOptions {
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
  outputMode: OutputMode;
  onTick?: (phase: 'back' | 'forward') => void;
}

export function useMetronome(options: UseMetronomeOptions) {
  const {
    bpm,
    backRatio,
    forwardRatio,
    soundType,
    outputMode,
    onTick,
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'back' | 'forward'>('back');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // タイミング計算
  const calculateTimings = useCallback(() => {
    const cycleDuration = 60000 / bpm; // 1サイクルの時間(ms)
    const totalRatio = backRatio + forwardRatio;
    const backDuration = cycleDuration * (backRatio / totalRatio);
    const forwardDuration = cycleDuration * (forwardRatio / totalRatio);
    
    return { cycleDuration, backDuration, forwardDuration };
  }, [bpm, backRatio, forwardRatio]);

  // 音/バイブを再生
  const playFeedback = useCallback(async (phase: 'back' | 'forward') => {
    const shouldPlaySound = outputMode === 'sound' || outputMode === 'both';
    const shouldVibrate = outputMode === 'vibration' || outputMode === 'both';

    if (shouldPlaySound && soundType !== 'silent') {
      await soundPlayer.play(soundType);
    }

    if (shouldVibrate) {
      if (phase === 'back') {
        vibrationPlayer.vibrateBack();
      } else {
        vibrationPlayer.vibrateForward();
      }
    }
  }, [outputMode, soundType]);

  // メトロノームのメインループ
  const runMetronome = useCallback(() => {
    const { backDuration, forwardDuration } = calculateTimings();
    let isBack = true;

    const tick = () => {
      const phase = isBack ? 'back' : 'forward';
      setCurrentPhase(phase);
      playFeedback(phase);
      onTick?.(phase);
      
      isBack = !isBack;
      const nextDuration = isBack ? backDuration : forwardDuration;
      
      intervalRef.current = setTimeout(tick, nextDuration);
    };

    // 最初のティック
    tick();
  }, [calculateTimings, playFeedback, onTick]);

  // 再生開始
  const start = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    startTimeRef.current = new Date();
    runMetronome();
  }, [isPlaying, runMetronome]);

  // 停止
  const stop = useCallback(() => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    setCurrentPhase('back');
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    
    const endTime = new Date();
    const duration = startTimeRef.current
      ? Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000)
      : 0;
    
    startTimeRef.current = null;
    
    return { startTime: startTimeRef.current, endTime, duration };
  }, [isPlaying]);

  // 再生/停止トグル
  const toggle = useCallback(() => {
    if (isPlaying) {
      return stop();
    } else {
      start();
      return null;
    }
  }, [isPlaying, start, stop]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  // 設定変更時に再起動
  useEffect(() => {
    if (isPlaying) {
      stop();
      start();
    }
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
```

### hooks/useMetronomeSession.ts
```typescript
// hooks/useMetronomeSession.ts

import { useState, useCallback } from 'react';
import { useMetronome } from './useMetronome';
import { MetronomeSettings } from '@/types';

interface SessionData {
  presetId: string | null;
  presetName: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
}

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
    outputMode: settings.isVibrationEnabled ? 'both' : 'sound',
    onTick: (phase) => {
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
```

## 完了条件
- [ ] hooks/useMetronome.ts が実装されている
- [ ] hooks/useMetronomeSession.ts が実装されている
- [ ] BPM変更が正しく反映される
- [ ] 比率変更が正しく反映される
- [ ] 音声再生が正しいタイミングで行われる
- [ ] バイブレーションが正しいタイミングで行われる
- [ ] セッション開始/終了時間が記録される

## 注意事項
- setTimeoutの精度はミリ秒単位で若干の誤差がある
- バックグラウンドではタイマーの精度が落ちる可能性がある
- 高精度が必要な場合は `react-native-background-timer` の検討が必要
