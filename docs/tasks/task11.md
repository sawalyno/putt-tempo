# Task 11: バイブレーション制御

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task11 |
| フェーズ | Phase 4: メトロノームコア |
| 所要時間 | 30分 |
| 依存タスク | なし |

## 目的
メトロノームのバイブレーション機能を実装する。

## 必要なパッケージ
```bash
npx expo install expo-haptics
```

## バイブレーションパターン

| タイプ | パターン | 用途 |
|--------|---------|------|
| バック | Light (軽め) | バックストローク |
| フォワード | Medium (やや強め) | フォワードストローク（インパクト） |

## 実装

### lib/vibrationPlayer.ts
```typescript
// lib/vibrationPlayer.ts

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type VibrationIntensity = 'light' | 'medium' | 'heavy';

class VibrationPlayer {
  private isEnabled = true;

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
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
```

### hooks/useVibration.ts
```typescript
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

  const setEnabled = useCallback((enabled: boolean) => {
    vibrationPlayer.setEnabled(enabled);
  }, []);

  return {
    vibrate,
    vibrateBack,
    vibrateForward,
    vibrateSelection,
    setEnabled,
  };
}
```

## 完了条件
- [ ] expo-haptics がインストールされている
- [ ] lib/vibrationPlayer.ts が実装されている
- [ ] hooks/useVibration.ts が実装されている
- [ ] バックストローク用（軽め）のバイブレーションが動作する
- [ ] フォワードストローク用（やや強め）のバイブレーションが動作する
- [ ] 有効/無効の切り替えができる

## 注意事項
- シミュレーターではバイブレーションが動作しない（実機テスト必須）
- Androidの一部デバイスではHapticsがサポートされていない
- バッテリー消費に注意
