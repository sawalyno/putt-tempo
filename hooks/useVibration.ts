// hooks/useVibration.ts

import { useCallback } from 'react';
import { vibrationPlayer, VibrationIntensity } from '@/lib/vibrationPlayer';

export function useVibration() {
  const vibrate = useCallback((intensity?: VibrationIntensity) => {
    vibrationPlayer.vibrate(intensity);
  }, []);

  const vibrateBack = useCallback(() => {
    vibrationPlayer.vibrateBack();
  }, []);

  const vibrateForward = useCallback(() => {
    vibrationPlayer.vibrateForward();
  }, []);

  const vibrateSelection = useCallback(() => {
    vibrationPlayer.vibrateSelection();
  }, []);

  const vibrateSuccess = useCallback(() => {
    vibrationPlayer.vibrateSuccess();
  }, []);

  const vibrateError = useCallback(() => {
    vibrationPlayer.vibrateError();
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    vibrationPlayer.setEnabled(enabled);
  }, []);

  return {
    vibrate,
    vibrateBack,
    vibrateForward,
    vibrateSelection,
    vibrateSuccess,
    vibrateError,
    setEnabled,
  };
}
