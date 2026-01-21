// constants/sounds.ts

import { SoundDefinition } from '@/types';

export const SOUND_DEFINITIONS: SoundDefinition[] = [
  // 無料
  {
    id: 'click',
    name: 'クリック',
    description: '標準的なクリック音',
    isPremium: false,
  },
  {
    id: 'electronic',
    name: '電子音',
    description: 'ピッという電子音',
    isPremium: false,
  },
  {
    id: 'wood',
    name: 'ウッド',
    description: 'コッという木の音',
    isPremium: false,
  },
  // プレミアム
  {
    id: 'metal',
    name: '金属',
    description: 'カンという金属音',
    isPremium: true,
  },
  {
    id: 'soft_beep',
    name: 'ソフトビープ',
    description: '柔らかい電子音',
    isPremium: true,
  },
  {
    id: 'drum_stick',
    name: 'ドラムスティック',
    description: 'スティック音',
    isPremium: true,
  },
  {
    id: 'water_drop',
    name: '水滴',
    description: 'ポタッという水滴音',
    isPremium: true,
  },
  {
    id: 'spring',
    name: 'バネ',
    description: 'バネの音',
    isPremium: true,
  },
  {
    id: 'bell',
    name: 'ベル',
    description: '鈴の音',
    isPremium: true,
  },
  {
    id: 'silent',
    name: '無音',
    description: 'バイブ専用',
    isPremium: true,
  },
];

export const getAvailableSounds = (isPremium: boolean): SoundDefinition[] => {
  return SOUND_DEFINITIONS.filter((sound) => !sound.isPremium || isPremium);
};
