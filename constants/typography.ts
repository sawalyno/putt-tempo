// constants/typography.ts
export const typography = {
  // Display - 運勢表示
  displayLarge: 'text-5xl font-bold',           // 48sp

  // Headline - 画面タイトル
  headlineLarge: 'text-3xl font-bold',          // 32sp

  // Title - セクションタイトル
  titleLarge: 'text-xl font-medium',            // 22sp

  // Body - 本文、メッセージ
  bodyLarge: 'text-lg font-normal',             // 18sp
  bodyMedium: 'text-base font-normal',          // 16sp

  // Label - ボタンテキスト
  labelLarge: 'text-sm font-medium',            // 14sp
  labelSmall: 'text-xs font-medium',            // 12sp
} as const;

// フォントファミリー（expo-fontで読み込み）
export const fontFamily = {
  android: 'NotoSansJP',
  ios: 'HiraginoSans',
  default: 'System',
} as const;

// 行間
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
} as const;
