/**
 * Putt Tempo 型定義ファイル
 */

// ========================================
// Enum Types
// ========================================

export type SoundType =
  | 'click'
  | 'electronic'
  | 'wood'
  | 'metal'
  | 'soft_beep'
  | 'drum_stick'
  | 'water_drop'
  | 'spring'
  | 'bell'
  | 'silent';

export type PlanType = 'free' | 'premium';

export type Platform = 'ios' | 'android' | 'web';

// ========================================
// App Types（アプリ内で使用）
// ========================================

/** デフォルトプリセット */
export interface DefaultPreset {
  id: string;
  name: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  description: string;
  isDefault: true;
}

/** カスタムプリセット（互換性のためのスネークケースプロパティを含む） */
export interface CustomPreset {
  id: string;
  user_id: string;
  name: string;
  bpm: number;
  back_ratio: number;
  forward_ratio: number;
  sound_type: SoundType;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

/** カスタムプリセット（アプリ内で使用する形式） */
export interface AppCustomPreset extends Omit<CustomPreset, 'back_ratio' | 'forward_ratio'> {
  backRatio: number;
  forwardRatio: number;
  isDefault: false;
}

/** 統一プリセット型（デフォルト + カスタム） */
export type Preset = DefaultPreset | AppCustomPreset;

/** メトロノーム設定 */
export interface MetronomeSettings {
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
  outputMode: OutputMode;
  interval: number; // インターバル秒数（1-10）
}

/** 出力モード */
export type OutputMode = 'sound' | 'vibration' | 'both';

/** メトロノームフェーズ */
export type MetronomePhase = 'address' | 'takeBack' | 'impact' | 'interval' | 'idle';

// ========================================
// Response Types
// ========================================

export interface CheckPresetLimitResponse {
  can_create: boolean;
  current_count: number;
  max_count: number;
  plan: PlanType;
}

export interface PracticeStats {
  total_sessions: number;
  total_duration_seconds: number;
  average_duration_seconds: number;
  most_used_preset: string | null;
  daily_stats: DailyStat[];
  period_days: number;
}

export interface DailyStat {
  date: string;
  duration_seconds: number;
  session_count: number;
}

// ========================================
// Error Types
// ========================================

export type ErrorCode =
  // プリセット系
  | 'PRESET_LIMIT_REACHED'
  | 'PRESET_NAME_DUPLICATE'
  | 'PRESET_NOT_FOUND'
  | 'PRESET_INVALID_BPM'
  | 'PRESET_INVALID_RATIO'
  | 'PRESET_NAME_TOO_LONG'
  // 練習記録系
  | 'SESSION_SAVE_FAILED'
  | 'SESSION_TOO_SHORT'
  | 'SESSION_TOO_LONG'
  // サブスク系
  | 'SUB_PURCHASE_FAILED'
  | 'SUB_RESTORE_FAILED'
  | 'SUB_ALREADY_PREMIUM';

export interface AppError {
  code: ErrorCode;
  message: string;
}

// ========================================
// Sound Definition
// ========================================

export interface SoundDefinition {
  id: SoundType;
  name: string;
  description: string;
  isPremium: boolean;
}

// ========================================
// Session Data
// ========================================

export interface SessionData {
  presetId: string | null;
  presetName: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
}
