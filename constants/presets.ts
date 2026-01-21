// constants/presets.ts

import { DefaultPreset } from '@/types';

export const DEFAULT_PRESETS: DefaultPreset[] = [
  {
    id: 'default-standard',
    name: 'スタンダード',
    bpm: 85,
    backRatio: 2,
    forwardRatio: 1,
    description: '基本練習',
    isDefault: true,
  },
  {
    id: 'default-slow',
    name: 'ゆっくり',
    bpm: 70,
    backRatio: 2,
    forwardRatio: 1,
    description: '初心者・ロングパット',
    isDefault: true,
  },
  {
    id: 'default-fast',
    name: '速め',
    bpm: 100,
    backRatio: 2,
    forwardRatio: 1,
    description: 'ショートパット',
    isDefault: true,
  },
  {
    id: 'default-equal',
    name: '均等リズム',
    bpm: 85,
    backRatio: 1,
    forwardRatio: 1,
    description: 'チャーシューメン派',
    isDefault: true,
  },
];
