# Task 10: 音声ファイル準備・再生エンジン

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task10 |
| フェーズ | Phase 4: メトロノームコア |
| 所要時間 | 2時間 |
| 依存タスク | task09（定数定義） |

## 目的
メトロノーム用の音声ファイルを準備し、再生エンジンを実装する。

## 必要なパッケージ
```bash
npx expo install expo-av
```

## 音声ファイル準備

### ファイル配置
```
assets/
  sounds/
    click.mp3
    electronic.mp3
    wood.mp3
    metal.mp3
    soft_beep.mp3
    drum_stick.mp3
    water_drop.mp3
    spring.mp3
    bell.mp3
```

### 音声ファイル仕様
| 項目 | 仕様 |
|------|------|
| フォーマット | MP3 |
| サンプルレート | 44.1kHz |
| ビットレート | 128kbps |
| 長さ | 50ms〜100ms |
| 音量 | ノーマライズ済み |

### 音声ファイル入手方法
1. **フリー音源サイト**
   - freesound.org
   - soundsnap.com
   - zapsplat.com
2. **自作**
   - Audacity等で作成
3. **AI生成**
   - Suno等で生成

## 実装

### 1. lib/soundPlayer.ts
```typescript
// lib/soundPlayer.ts

import { Audio } from 'expo-av';
import { SoundType } from '@/types';

// 音声ファイルのマッピング
const SOUND_FILES: Record<SoundType, any> = {
  click: require('@/assets/sounds/click.mp3'),
  electronic: require('@/assets/sounds/electronic.mp3'),
  wood: require('@/assets/sounds/wood.mp3'),
  metal: require('@/assets/sounds/metal.mp3'),
  soft_beep: require('@/assets/sounds/soft_beep.mp3'),
  drum_stick: require('@/assets/sounds/drum_stick.mp3'),
  water_drop: require('@/assets/sounds/water_drop.mp3'),
  spring: require('@/assets/sounds/spring.mp3'),
  bell: require('@/assets/sounds/bell.mp3'),
  silent: null, // 無音
};

class SoundPlayer {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // オーディオモード設定
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true, // バックグラウンド再生対応
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    this.isInitialized = true;
  }

  async loadSound(soundType: SoundType): Promise<void> {
    if (soundType === 'silent' || this.sounds.has(soundType)) return;

    const file = SOUND_FILES[soundType];
    if (!file) return;

    try {
      const { sound } = await Audio.Sound.createAsync(file, {
        shouldPlay: false,
        volume: 1.0,
      });
      this.sounds.set(soundType, sound);
    } catch (error) {
      console.error(`Failed to load sound: ${soundType}`, error);
    }
  }

  async play(soundType: SoundType): Promise<void> {
    if (soundType === 'silent') return;

    const sound = this.sounds.get(soundType);
    if (!sound) {
      await this.loadSound(soundType);
      return this.play(soundType);
    }

    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error(`Failed to play sound: ${soundType}`, error);
    }
  }

  async preloadSounds(soundTypes: SoundType[]): Promise<void> {
    await Promise.all(soundTypes.map(type => this.loadSound(type)));
  }

  async unloadAll(): Promise<void> {
    for (const sound of this.sounds.values()) {
      await sound.unloadAsync();
    }
    this.sounds.clear();
  }
}

export const soundPlayer = new SoundPlayer();
```

### 2. hooks/useSoundPlayer.ts
```typescript
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
      await soundPlayer.preloadSounds(FREE_PLAN_LIMITS.AVAILABLE_SOUNDS as SoundType[]);
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
```

## 完了条件
- [ ] expo-av がインストールされている
- [ ] assets/sounds/ に音声ファイルが配置されている
- [ ] lib/soundPlayer.ts が実装されている
- [ ] hooks/useSoundPlayer.ts が実装されている
- [ ] 各音声が正常に再生できる
- [ ] バックグラウンド再生が有効

## 注意事項
- 音声ファイルは著作権に注意
- ファイルサイズを小さく保つ（各100KB以下推奨）
- iOSのサイレントモードでも再生されるように設定
