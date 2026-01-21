// lib/soundPlayer.ts

import { Audio } from 'expo-av';
import { SoundType } from '@/types';

// 音声ファイルのマッピング（ファイルがない場合はnull）
// 実際の音声ファイルを assets/sounds/ に配置した後、requireを有効にする
const SOUND_FILES: Partial<Record<SoundType, number>> = {
  // TODO: 音声ファイルを配置後、以下のコメントを解除
  // click: require('@/assets/sounds/click.mp3'),
  // electronic: require('@/assets/sounds/electronic.mp3'),
  // wood: require('@/assets/sounds/wood.mp3'),
  // metal: require('@/assets/sounds/metal.mp3'),
  // soft_beep: require('@/assets/sounds/soft_beep.mp3'),
  // drum_stick: require('@/assets/sounds/drum_stick.mp3'),
  // water_drop: require('@/assets/sounds/water_drop.mp3'),
  // spring: require('@/assets/sounds/spring.mp3'),
  // bell: require('@/assets/sounds/bell.mp3'),
};

class SoundPlayer {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // オーディオモード設定
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true, // バックグラウンド再生対応
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async loadSound(soundType: SoundType): Promise<void> {
    if (soundType === 'silent' || this.sounds.has(soundType)) return;

    const file = SOUND_FILES[soundType];
    if (!file) {
      console.warn(`Sound file not found for: ${soundType}`);
      return;
    }

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
      // サウンドがロードされていない場合、ロードを試みる
      await this.loadSound(soundType);
      const loadedSound = this.sounds.get(soundType);
      if (!loadedSound) {
        // ファイルがない場合は無視（開発中用）
        return;
      }
      return this.playLoadedSound(loadedSound);
    }

    return this.playLoadedSound(sound);
  }

  private async playLoadedSound(sound: Audio.Sound): Promise<void> {
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  async preloadSounds(soundTypes: SoundType[]): Promise<void> {
    await Promise.all(soundTypes.map((type) => this.loadSound(type)));
  }

  async unloadAll(): Promise<void> {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Failed to unload sound:', error);
      }
    }
    this.sounds.clear();
  }
}

export const soundPlayer = new SoundPlayer();
