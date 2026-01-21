// components/Pendulum.tsx - 振り子アニメーション（mockデザイン準拠）

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PendulumProps {
  isPlaying: boolean;
  currentPhase: 'back' | 'forward' | 'idle';
  bpm: number;
  backRatio: number;
  forwardRatio: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PENDULUM_HEIGHT = 160;
const MAX_ANGLE = 20; // degrees

export function Pendulum({
  isPlaying,
  bpm,
  backRatio,
  forwardRatio,
}: PendulumProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying && bpm > 0) {
      // 1ビートの時間（ミリ秒）
      const beatMs = 60000 / bpm;
      const totalRatio = backRatio + forwardRatio;
      const backMs = (backRatio / totalRatio) * beatMs;
      const forwardMs = (forwardRatio / totalRatio) * beatMs;

      // アニメーションシーケンス
      rotation.value = withRepeat(
        withSequence(
          // 中央から右へ（バックスイング）
          withTiming(MAX_ANGLE, {
            duration: backMs / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          // 右から左へ（フォワードスイング）
          withTiming(-MAX_ANGLE, {
            duration: backMs / 2 + forwardMs / 2,
            easing: Easing.inOut(Easing.sin),
          }),
          // 左から中央へ
          withTiming(0, {
            duration: forwardMs / 2,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isPlaying, bpm, backRatio, forwardRatio]);

  const pendulumAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* ピボットポイント（上部の白い丸） */}
      <View style={styles.pivot} />

      {/* 振り子本体 */}
      <Animated.View style={[styles.pendulumContainer, pendulumAnimatedStyle]}>
        {/* 振り子の棒（グラデーション） */}
        <LinearGradient
          colors={['#ffffff', 'rgba(255,255,255,0.2)']}
          style={styles.rod}
        />

        {/* ボブ（先端の重り） */}
        <View style={styles.bob} />
      </Animated.View>

      {/* 弧（破線） */}
      <View style={styles.arcContainer}>
        <View style={styles.arc} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Math.min(SCREEN_WIDTH * 0.8, 300),
    height: 220,
    alignItems: 'center',
    position: 'relative',
  },
  pivot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginTop: 16,
    zIndex: 10,
  },
  pendulumContainer: {
    alignItems: 'center',
    transformOrigin: 'top center',
    height: PENDULUM_HEIGHT,
  },
  rod: {
    width: 4,
    height: PENDULUM_HEIGHT - 24,
    borderRadius: 2,
  },
  bob: {
    width: 48,
    height: 24,
    backgroundColor: '#2a73ea',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#2a73ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  arcContainer: {
    position: 'absolute',
    bottom: 16,
    width: '80%',
    height: 60,
    overflow: 'hidden',
  },
  arc: {
    width: '100%',
    height: 120,
    borderWidth: 2,
    borderColor: '#2d343d',
    borderStyle: 'dashed',
    borderRadius: 120,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});
