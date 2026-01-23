// lib/storage.ts - AsyncStorageベースのローカルストレージ

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CUSTOM_PRESETS: '@putt_tempo/custom_presets',
  PRACTICE_SESSIONS: '@putt_tempo/practice_sessions',
  IS_PREMIUM: '@putt_tempo/is_premium',
  USER_SETTINGS: '@putt_tempo/user_settings',
} as const;

// ジェネリックなストレージ操作
async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return defaultValue;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to get ${key}:`, error);
    return defaultValue;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set ${key}:`, error);
  }
}

// ========================================
// カスタムプリセット
// ========================================

export interface LocalCustomPreset {
  id: string;
  name: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCustomPresets(): Promise<LocalCustomPreset[]> {
  return getItem<LocalCustomPreset[]>(STORAGE_KEYS.CUSTOM_PRESETS, []);
}

export async function saveCustomPresets(presets: LocalCustomPreset[]): Promise<void> {
  await setItem(STORAGE_KEYS.CUSTOM_PRESETS, presets);
}

export async function addCustomPreset(preset: Omit<LocalCustomPreset, 'id' | 'createdAt' | 'updatedAt'>): Promise<LocalCustomPreset> {
  const presets = await getCustomPresets();
  
  // 同名チェック
  if (presets.some(p => p.name === preset.name)) {
    throw new Error('PRESET_NAME_DUPLICATE');
  }
  
  const newPreset: LocalCustomPreset = {
    ...preset,
    id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await saveCustomPresets([newPreset, ...presets]);
  return newPreset;
}

export async function updateCustomPreset(id: string, updates: Partial<Omit<LocalCustomPreset, 'id' | 'createdAt'>>): Promise<LocalCustomPreset | null> {
  const presets = await getCustomPresets();
  const index = presets.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  // 同名チェック（自分以外）
  if (updates.name && presets.some(p => p.id !== id && p.name === updates.name)) {
    throw new Error('PRESET_NAME_DUPLICATE');
  }
  
  const updatedPreset: LocalCustomPreset = {
    ...presets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  presets[index] = updatedPreset;
  await saveCustomPresets(presets);
  return updatedPreset;
}

export async function deleteCustomPreset(id: string): Promise<boolean> {
  const presets = await getCustomPresets();
  const filtered = presets.filter(p => p.id !== id);
  
  if (filtered.length === presets.length) return false;
  
  await saveCustomPresets(filtered);
  return true;
}

// ========================================
// 練習セッション
// ========================================

export interface LocalPracticeSession {
  id: string;
  presetName: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
}

export async function getPracticeSessions(): Promise<LocalPracticeSession[]> {
  return getItem<LocalPracticeSession[]>(STORAGE_KEYS.PRACTICE_SESSIONS, []);
}

export async function savePracticeSession(session: Omit<LocalPracticeSession, 'id'>): Promise<LocalPracticeSession> {
  const sessions = await getPracticeSessions();
  
  const newSession: LocalPracticeSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  
  // 最新の100件のみ保持
  const updatedSessions = [newSession, ...sessions].slice(0, 100);
  await setItem(STORAGE_KEYS.PRACTICE_SESSIONS, updatedSessions);
  
  return newSession;
}

// 統計計算（過去N日間）
export async function calculatePracticeStats(days: number = 7) {
  const sessions = await getPracticeSessions();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentSessions = sessions.filter(s => new Date(s.startedAt) >= cutoffDate);
  
  const totalDurationSeconds = recentSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalSessions = recentSessions.length;
  const averageDurationSeconds = totalSessions > 0 ? totalDurationSeconds / totalSessions : 0;
  
  // 日ごとの統計
  const dailyStats: { date: string; durationSeconds: number; sessionCount: number }[] = [];
  const dateMap = new Map<string, { duration: number; count: number }>();
  
  recentSessions.forEach(s => {
    const dateStr = s.startedAt.split('T')[0];
    const existing = dateMap.get(dateStr) || { duration: 0, count: 0 };
    dateMap.set(dateStr, {
      duration: existing.duration + s.durationSeconds,
      count: existing.count + 1,
    });
  });
  
  dateMap.forEach((value, date) => {
    dailyStats.push({
      date,
      durationSeconds: value.duration,
      sessionCount: value.count,
    });
  });
  
  // 最も使用されたプリセット
  const presetCounts = new Map<string, number>();
  recentSessions.forEach(s => {
    presetCounts.set(s.presetName, (presetCounts.get(s.presetName) || 0) + 1);
  });
  
  let mostUsedPreset: string | null = null;
  let maxCount = 0;
  presetCounts.forEach((count, name) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsedPreset = name;
    }
  });
  
  return {
    totalSessions,
    totalDurationSeconds,
    averageDurationSeconds,
    mostUsedPreset,
    dailyStats: dailyStats.sort((a, b) => a.date.localeCompare(b.date)),
    periodDays: days,
  };
}

// ========================================
// プレミアムステータス
// ========================================

export async function getIsPremium(): Promise<boolean> {
  return getItem<boolean>(STORAGE_KEYS.IS_PREMIUM, false);
}

export async function setIsPremium(isPremium: boolean): Promise<void> {
  await setItem(STORAGE_KEYS.IS_PREMIUM, isPremium);
}

// ========================================
// ユーザー設定
// ========================================

export interface LocalUserSettings {
  preferredSound: string;
  vibrationEnabled: boolean;
}

export async function getUserSettings(): Promise<LocalUserSettings> {
  return getItem<LocalUserSettings>(STORAGE_KEYS.USER_SETTINGS, {
    preferredSound: 'click',
    vibrationEnabled: true,
  });
}

export async function saveUserSettings(settings: Partial<LocalUserSettings>): Promise<void> {
  const current = await getUserSettings();
  await setItem(STORAGE_KEYS.USER_SETTINGS, { ...current, ...settings });
}

// ========================================
// 全データクリア（デバッグ用）
// ========================================

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
