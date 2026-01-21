// constants/Colors.ts
// Putt Tempo カラーパレット（mockデザイン準拠）

export const colors = {
  // プライマリカラー
  primary: '#2a73ea',
  primaryLight: '#3b82f6',

  // 背景・サーフェス
  background: '#050505',
  backgroundLight: '#f5f5f5',
  surface: '#121212',
  surfaceDark: '#161616',
  surfaceLighter: '#222222',
  cardDark: '#1A1A1A',

  // ボーダー
  border: '#2d343d',
  borderDark: '#1f1f1f',
  borderLight: '#333333',

  // プレミアム・アクセント
  premium: '#F59E0B',
  premiumGold: '#F59E0B',
  accentGold: '#F59E0B',

  // テキストカラー
  text: '#ffffff',
  textMuted: '#888888',
  textHint: '#666666',
  onPrimary: '#ffffff',
  onSurface: '#ffffff',
  onBackground: '#ffffff',

  // フィードバック
  error: '#ef4444',
  success: '#22c55e',
  warning: '#F59E0B',
  info: '#2a73ea',

  // その他
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

// エクスポート用の型
export type ColorKey = keyof typeof colors;
