/**
 * Putt Tempo 型定義ファイル
 */

// ========================================
// Database Types（Supabaseテーブル対応）
// ========================================

export interface UserProfile {
  id: string;
  display_name: string | null;
  preferred_sound: SoundType;
  vibration_enabled: boolean;
  last_used_preset_id: string | null;
  created_at: string;
  updated_at: string;
}

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

export interface PracticeSession {
  id: string;
  user_id: string;
  preset_id: string | null;
  preset_name: string;
  bpm: number;
  back_ratio: number;
  forward_ratio: number;
  duration_seconds: number;
  started_at: string;
  ended_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  platform: Platform | null;
  store_product_id: string | null;
  store_transaction_id: string | null;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
}

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

/** デフォルトプリセット（DBに保存しない） */
export interface DefaultPreset {
  id: string;
  name: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  description: string;
  isDefault: true;
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
  isVibrationEnabled: boolean;
}

/** 出力モード */
export type OutputMode = 'sound' | 'vibration' | 'both';

// ========================================
// RPC Response Types
// ========================================

export interface InitializeUserResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface CheckPresetLimitResponse {
  can_create: boolean;
  current_count: number;
  max_count: number;
  plan: PlanType;
}

export interface SavePracticeSessionResponse {
  success: boolean;
  session_id?: string;
  error?: string;
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

export interface UpgradeSubscriptionResponse {
  success: boolean;
  error?: string;
}

// ========================================
// Error Types
// ========================================

export type ErrorCode =
  // 認証系
  | 'AUTH_ANONYMOUS_FAILED'
  | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_INVALID_EMAIL'
  | 'AUTH_LINK_FAILED'
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
  | 'SUB_ALREADY_PREMIUM'
  // 通信系
  | 'NETWORK_OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'NETWORK_SERVER_ERROR';

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
