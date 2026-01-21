# Task 09: 定数・デフォルトプリセット定義

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task09 |
| フェーズ | Phase 3: 型定義・定数 |
| 所要時間 | 30分 |
| 依存タスク | なし |

## 目的
アプリ全体で使用する定数とデフォルトプリセットを定義する。

## 作成ファイル

### 1. constants/app.ts
```typescript
// constants/app.ts

export const APP_CONFIG = {
  MIN_BPM: 30,
  MAX_BPM: 200,
  MIN_RATIO: 1,
  MAX_RATIO: 5,
  MAX_PRESET_NAME_LENGTH: 20,
  MIN_SESSION_DURATION: 10,    // 秒
  MAX_SESSION_DURATION: 7200,  // 秒（2時間）
} as const;

export const FREE_PLAN_LIMITS = {
  MAX_CUSTOM_PRESETS: 3,
  PRACTICE_HISTORY_DAYS: 7,
  AVAILABLE_SOUNDS: ['click', 'electronic', 'wood'] as const,
} as const;

export const PREMIUM_PLAN_LIMITS = {
  MAX_CUSTOM_PRESETS: 100,
  PRACTICE_HISTORY_DAYS: 365,
  AVAILABLE_SOUNDS: [
    'click', 'electronic', 'wood',
    'metal', 'soft_beep', 'drum_stick',
    'water_drop', 'spring', 'bell', 'silent'
  ] as const,
} as const;
```

### 2. constants/presets.ts
```typescript
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
```

### 3. constants/sounds.ts
```typescript
// constants/sounds.ts

import { SoundDefinition } from '@/types';

export const SOUND_DEFINITIONS: SoundDefinition[] = [
  // 無料
  { id: 'click', name: 'クリック', description: '標準的なクリック音', isPremium: false },
  { id: 'electronic', name: '電子音', description: 'ピッという電子音', isPremium: false },
  { id: 'wood', name: 'ウッド', description: 'コッという木の音', isPremium: false },
  // プレミアム
  { id: 'metal', name: '金属', description: 'カンという金属音', isPremium: true },
  { id: 'soft_beep', name: 'ソフトビープ', description: '柔らかい電子音', isPremium: true },
  { id: 'drum_stick', name: 'ドラムスティック', description: 'スティック音', isPremium: true },
  { id: 'water_drop', name: '水滴', description: 'ポタッという水滴音', isPremium: true },
  { id: 'spring', name: 'バネ', description: 'バネの音', isPremium: true },
  { id: 'bell', name: 'ベル', description: '鈴の音', isPremium: true },
  { id: 'silent', name: '無音', description: 'バイブ専用', isPremium: true },
];

export const getAvailableSounds = (isPremium: boolean): SoundDefinition[] => {
  return SOUND_DEFINITIONS.filter(sound => !sound.isPremium || isPremium);
};
```

### 4. constants/index.ts（エクスポート）
```typescript
// constants/index.ts

export * from './app';
export * from './presets';
export * from './sounds';
export * from './Colors';
export * from './typography';
export * from './spacing';
export * from './animations';
```

## 完了条件
- [ ] constants/app.ts が作成されている
- [ ] constants/presets.ts が作成されている
- [ ] constants/sounds.ts が作成されている
- [ ] constants/index.ts でエクスポートされている
- [ ] TypeScriptのコンパイルエラーがない

## 注意事項
- `as const` を使用して型を厳密にする
- 既存の Colors.ts, typography.ts, spacing.ts は維持
