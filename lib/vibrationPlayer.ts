// lib/vibrationPlayer.ts

import * as Haptics from 'expo-haptics';

export type VibrationIntensity = 'light' | 'medium' | 'heavy';

class VibrationPlayer {
  private isEnabled = true;

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  getEnabled(): boolean {
    return this.isEnabled;
  }

  async vibrate(intensity: VibrationIntensity = 'medium'): Promise<void> {
    if (!this.isEnabled) return;

    try {
      switch (intensity) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    } catch (error) {
      // バイブレーション非対応デバイスでは無視
      console.warn('Vibration not supported:', error);
    }
  }

  /** バックストローク用（軽め） */
  async vibrateBack(): Promise<void> {
    await this.vibrate('light');
  }

  /** フォワードストローク用（やや強め） */
  async vibrateForward(): Promise<void> {
    await this.vibrate('medium');
  }

  /** 通知用（選択フィードバック） */
  async vibrateSelection(): Promise<void> {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Selection haptic not supported:', error);
    }
  }

  /** 成功通知 */
  async vibrateSuccess(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Notification haptic not supported:', error);
    }
  }

  /** エラー通知 */
  async vibrateError(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Notification haptic not supported:', error);
    }
  }
}

export const vibrationPlayer = new VibrationPlayer();
