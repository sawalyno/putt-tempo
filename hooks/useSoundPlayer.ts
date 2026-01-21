// hooks/useSoundPlayer.ts

import { useEffect, useCallback } from 'react';
import { soundPlayer } from '@/lib/soundPlayer';
import { SoundType } from '@/types';
import { FREE_PLAN_LIMITS } from '@/constants';

export function useSoundPlayer() {
  useEffect(() => {
    // 初期化と無料サウンドのプリロード
    const init = async () => {
      await soundPlayer.initialize();
      await soundPlayer.preloadSounds(
        FREE_PLAN_LIMITS.AVAILABLE_SOUNDS as unknown as SoundType[]
      );
    };
    init();

    return () => {
      soundPlayer.unloadAll();
    };
  }, []);

  const playSound = useCallback(async (soundType: SoundType) => {
    await soundPlayer.play(soundType);
  }, []);

  const preloadSound = useCallback(async (soundType: SoundType) => {
    await soundPlayer.loadSound(soundType);
  }, []);

  return { playSound, preloadSound };
}
