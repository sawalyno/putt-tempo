// カスタムフックのエクスポート

// 認証・ユーザー関連（テンプレート標準）
export { useInitializeUserData } from './useInitializeUserData';
export { useUserSettings, useUpdateUserSettings } from './useUserSettings';
export { useRewardAd } from './useRewardAd';

// メトロノーム関連
export { useMetronome } from './useMetronome';
export { useMetronomeSession } from './useMetronomeSession';
export { useSoundPlayer } from './useSoundPlayer';
export { useVibration } from './useVibration';

// プリセット関連
export {
  useDefaultPresets,
  useCustomPresets,
  useAllPresets,
  usePreset,
  usePresetLimit,
  useInvalidatePresets,
} from './usePresets';
export {
  useCreatePreset,
  useUpdatePreset,
  useDeletePreset,
  useToggleFavorite,
  usePresetMutations,
} from './usePresetMutations';

// 統計関連
export { usePracticeStats, useSavePracticeSession } from './usePracticeStats';

// 課金関連
export { usePurchase, usePremiumStatus } from './usePurchase';
