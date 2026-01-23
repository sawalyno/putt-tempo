// constants/app.ts

export const APP_CONFIG = {
  MIN_BPM: 30,
  MAX_BPM: 200,
  MIN_RATIO: 1,
  MAX_RATIO: 5,
  MAX_PRESET_NAME_LENGTH: 20,
  MIN_SESSION_DURATION: 10, // 秒
  MAX_SESSION_DURATION: 7200, // 秒（2時間）
  // インターバル設定
  MIN_INTERVAL: 1, // 秒
  MAX_INTERVAL: 10, // 秒
  DEFAULT_INTERVAL: 3, // 秒
  // アドレスからテイクバックまでの間隔（固定値）
  ADDRESS_DURATION: 1000, // ms - プロのパッティングルーティンに基づく
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
    'click',
    'electronic',
    'wood',
    'metal',
    'soft_beep',
    'drum_stick',
    'water_drop',
    'spring',
    'bell',
    'silent',
  ] as const,
} as const;
