// constants/spacing.ts
export const spacing = {
  xs: 4,    // Extra Small
  sm: 8,    // Small
  md: 16,   // Medium
  lg: 24,   // Large
  xl: 32,   // Extra Large
  '2xl': 40,
  '3xl': 48,
} as const;

// NativeWindクラス対応
export const spacingClass = {
  xs: '1',   // 4px
  sm: '2',   // 8px
  md: '4',   // 16px
  lg: '6',   // 24px
  xl: '8',   // 32px
} as const;

// 角丸（Corner Radius）
export const radius = {
  sm: 8,    // ボタン、小さなカード
  md: 16,   // カード
  lg: 24,   // モーダル
  full: 9999, // 完全な円
} as const;

// NativeWindクラス対応
export const radiusClass = {
  sm: 'rounded-lg',      // 8px
  md: 'rounded-2xl',     // 16px
  lg: 'rounded-3xl',     // 24px
  full: 'rounded-full',
} as const;

// Elevation（影）
export const elevation = {
  level0: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  level2: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  level3: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  level4: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;

// コンポーネント別サイズ
export const componentSize = {
  // ボタン
  button: {
    width: 200,
    height: 56,
  },
  // モーダル
  modal: {
    widthPercent: 0.85,
    padding: 32,
  },
  // カード
  card: {
    padding: 16,
    marginBottom: 12,
  },
  // タブバー
  tabBar: {
    height: 48,
  },
  // バナー広告
  bannerAd: {
    width: 320,
    height: 50,
    margin: 16,
  },
} as const;
