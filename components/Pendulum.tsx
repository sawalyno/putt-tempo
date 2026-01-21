// components/Pendulum.tsx - 振り子アニメーション（バック/フォワードを視覚的に明示）

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
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
const PENDULUM_HEIGHT = 140;
const MAX_ANGLE = 18; // degrees

export function Pendulum({
  isPlaying,
  currentPhase,
  bpm,
  backRatio,
  forwardRatio,
}: PendulumProps) {
  const rotation = useSharedValue(0);
  const bobGlow = useSharedValue(0);
  const impactFlash = useSharedValue(0);

  // currentPhaseに基づいてアニメーション
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 200 });
      bobGlow.value = withTiming(0, { duration: 200 });
      impactFlash.value = 0;
      return;
    }

    const cycleDuration = 60000 / bpm;
    const totalRatio = backRatio + forwardRatio;
    const backMs = (backRatio / totalRatio) * cycleDuration;
    const forwardMs = (forwardRatio / totalRatio) * cycleDuration;

    if (currentPhase === 'back') {
      // バックスイング: 中央から右へ
      rotation.value = withTiming(MAX_ANGLE, {
        duration: backMs,
        easing: Easing.out(Easing.quad),
      });
      bobGlow.value = withTiming(0.3, { duration: 100 });
      impactFlash.value = 0;
    } else if (currentPhase === 'forward') {
      // フォワード: 右から左へ（インパクト）
      rotation.value = withSequence(
        withTiming(-MAX_ANGLE * 0.5, {
          duration: forwardMs * 0.6,
          easing: Easing.in(Easing.quad),
        }),
        withTiming(0, {
          duration: forwardMs * 0.4,
          easing: Easing.out(Easing.quad),
        })
      );
      // インパクトフラッシュ
      bobGlow.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0.3, { duration: 150 })
      );
      impactFlash.value = withSequence(
        withTiming(1, { duration: 30 }),
        withTiming(0, { duration: 200 })
      );
    }
  }, [isPlaying, currentPhase, bpm, backRatio, forwardRatio]);

  const pendulumAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const bobAnimatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.4 + bobGlow.value * 0.6,
    shadowRadius: 20 + bobGlow.value * 30,
  }));

  const impactFlashStyle = useAnimatedStyle(() => ({
    opacity: impactFlash.value,
  }));

  return (
    <View style={styles.container}>
      {/* インパクトフラッシュ */}
      <Animated.View style={[styles.impactFlash, impactFlashStyle]} />

      {/* フェーズインジケーター */}
      <View style={styles.phaseIndicator}>
        <View style={[
          styles.phaseItem,
          currentPhase === 'back' && isPlaying && styles.phaseItemActive,
        ]}>
          <Text style={[
            styles.phaseText,
            currentPhase === 'back' && isPlaying && styles.phaseTextActive,
          ]}>BACK</Text>
        </View>
        <View style={styles.phaseDivider} />
        <View style={[
          styles.phaseItem,
          currentPhase === 'forward' && isPlaying && styles.phaseItemForward,
        ]}>
          <Text style={[
            styles.phaseText,
            currentPhase === 'forward' && isPlaying && styles.phaseTextForward,
          ]}>IMPACT</Text>
        </View>
      </View>

      {/* ピボットポイント */}
      <View style={styles.pivot} />

      {/* 振り子本体 */}
      <Animated.View style={[styles.pendulumContainer, pendulumAnimatedStyle]}>
        {/* 振り子の棒（グラデーション） */}
        <LinearGradient
          colors={['#ffffff', 'rgba(255,255,255,0.2)']}
          style={styles.rod}
        />

        {/* ボブ（先端の重り） */}
        <Animated.View style={[styles.bob, bobAnimatedStyle]}>
          <View style={styles.bobInner} />
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
    width: Math.min(SCREEN_WIDTH * 0.8, 300),
    height: 220,
    alignItems: 'center',
    position: 'relative',
  },
  impactFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(42, 115, 234, 0.1)',
    borderRadius: 20,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  phaseItem: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  phaseItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  phaseItemForward: {
    backgroundColor: 'rgba(42, 115, 234, 0.3)',
  },
  phaseDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  phaseText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  phaseTextActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  phaseTextForward: {
    color: '#2a73ea',
  },
  pivot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginTop: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  bobInner: {
    width: 8,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
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
