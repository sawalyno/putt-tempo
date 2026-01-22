// constants/presets.ts
// 実際のパッティングテンポに基づいた設定
// - ロングパット（3m+）: 約2秒サイクル → 30 BPM
// - ミドルパット（1-3m）: 約1.5秒サイクル → 40 BPM
// - ショートパット（1m以下）: 約1.2秒サイクル → 50 BPM

import { DefaultPreset } from '@/types';

export const DEFAULT_PRESETS: DefaultPreset[] = [
  {
    id: 'default-standard',
    name: 'スタンダード',
    bpm: 40,
    backRatio: 2,
    forwardRatio: 1,
    description: 'ミドルパット（1-3m）',
    isDefault: true,
  },
  {
    id: 'default-slow',
    name: 'ロングパット',
    bpm: 30,
    backRatio: 2,
    forwardRatio: 1,
    description: 'ロングパット（3m以上）',
    isDefault: true,
  },
  {
    id: 'default-fast',
    name: 'ショートパット',
    bpm: 50,
    backRatio: 2,
    forwardRatio: 1,
    description: 'ショートパット（1m以下）',
    isDefault: true,
  },
  {
    id: 'default-equal',
    name: '均等リズム',
    bpm: 40,
    backRatio: 1,
    forwardRatio: 1,
    description: 'チャーシューメン派',
    isDefault: true,
  },
];
