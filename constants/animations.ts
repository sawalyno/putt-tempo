// constants/animations.ts
import { Easing } from 'react-native-reanimated';

// ボタン押下アニメーション設定
export const buttonPressConfig = {
  pressIn: { scale: 0.95, duration: 50, easing: Easing.inOut(Easing.ease) },
  pressOut: { scale: 1, duration: 100, easing: Easing.inOut(Easing.ease) },
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
  easing: Easing.inOut(Easing.ease),
} as const;

// スライドアニメーション設定
export const slideConfig = {
  duration: 400,
  easing: Easing.out(Easing.cubic),
} as const;
