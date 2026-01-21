// constants/Colors.ts
export const colors = {
  // ベースカラー
  primary: '#0a0a0a',        // ダーク背景
  secondary: '#1a1a1a',      // サーフェス、カード背景
  tertiary: '#3b82f6',       // アクセントカラー（青）

  // アクセントカラー
  accent1: '#60a5fa',        // ライトブルー
  accent2: '#f59e0b',        // アンバー/ゴールド

  // サーフェスカラー
  background: '#0a0a0a',     // 背景
  surface: '#1a1a1a',        // サーフェス
  surfaceVariant: '#333333', // サーフェスバリアント

  // テキストカラー
  onPrimary: '#ffffff',
  onSurface: '#ffffff',
  onBackground: '#ffffff',
  textMuted: '#888888',
  textHint: '#666666',

  // ボタン状態
  button: {
    enabled: '#3b82f6',
    disabled: '#555555',
    disabledText: '#888888',
  },

  // フィードバック
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',

  // その他
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  // ボーダー
  border: '#333333',
  borderLight: '#444444',
} as const;
