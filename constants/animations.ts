// constants/animations.ts
// Note: Easing関数は使用箇所で直接 react-native-reanimated からインポートしてください
// モジュールトップレベルでEasingを使用するとReanimated初期化前にエラーが発生します

// ボタン押下アニメーション設定
export const buttonPressConfig = {
  pressIn: { scale: 0.95, duration: 50 },
  pressOut: { scale: 1, duration: 100 },
} as const;

// モーダル表示アニメーション設定
export const modalAnimationConfig = {
  backdrop: { fadeIn: { opacity: [0, 1], duration: 300 } },
  container: { slideIn: { translateY: [300, 0], duration: 400 } },
  content: { fadeIn: { opacity: [0, 1], duration: 300, delay: 200 } },
} as const;

// フェードアニメーション設定
export const fadeConfig = {
  duration: 300,
} as const;

// スライドアニメーション設定
export const slideConfig = {
  duration: 400,
} as const;
