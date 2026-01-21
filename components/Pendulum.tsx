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
  runOnJS,
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
const PENDULUM_HEIGHT = 180;
const MAX_ANGLE = 25; // degrees

export function Pendulum({
  isPlaying,
  currentPhase,
  bpm,
  backRatio,
  forwardRatio,
}: PendulumProps) {
  const rotation = useSharedValue(0);
  const bobGlow = useSharedValue(0.4);

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

      // グロー効果のアニメーション
      bobGlow.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: beatMs / 2 }),
          withTiming(0.4, { duration: beatMs / 2 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      cancelAnimation(bobGlow);
      rotation.value = withTiming(0, { duration: 300 });
      bobGlow.value = 0.4;
    }
  }, [isPlaying, bpm, backRatio, forwardRatio]);

  const pendulumAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const bobGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: bobGlow.value,
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
        <Animated.View style={[styles.bob, bobGlowStyle]}>
          <LinearGradient
            colors={['#2a73ea', '#1d4ed8']}
            style={styles.bobInner}
          />
        </Animated.View>
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
    width: SCREEN_WIDTH * 0.8,
    height: 260,
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
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2a73ea',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  bobInner: {
    width: '100%',
    height: '100%',
  },
  arcContainer: {
    position: 'absolute',
    bottom: 16,
    width: '80%',
    height: 80,
    overflow: 'hidden',
  },
  arc: {
    width: '100%',
    height: 160,
    borderWidth: 2,
    borderColor: '#2d343d',
    borderStyle: 'dashed',
    borderRadius: 160,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});
