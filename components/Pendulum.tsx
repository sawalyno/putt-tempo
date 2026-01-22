// components/Pendulum.tsx - 振り子アニメーション（バック/フォワードを視覚的に明示）

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
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
const PENDULUM_HEIGHT = 120;
const MAX_ANGLE = 25; // degrees

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
      rotation.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) });
      bobGlow.value = withTiming(0, { duration: 200 });
      impactFlash.value = 0;
      return;
    }

    const cycleDuration = 60000 / bpm;
    const totalRatio = backRatio + forwardRatio;
    const backMs = (backRatio / totalRatio) * cycleDuration;
    const forwardMs = (forwardRatio / totalRatio) * cycleDuration;

    if (currentPhase === 'back') {
      // バックスイング: 中央から右へ（ゆっくり）
      rotation.value = withTiming(MAX_ANGLE, {
        duration: backMs * 0.95, // 少し余裕を持たせる
        easing: Easing.inOut(Easing.sine),
      });
      bobGlow.value = withTiming(0.2, { duration: backMs * 0.5 });
      impactFlash.value = 0;
    } else if (currentPhase === 'forward') {
      // フォワード: 右から中央へ戻る（インパクト）
      rotation.value = withTiming(0, {
        duration: forwardMs * 0.95,
        easing: Easing.in(Easing.quad),
      });
      // インパクトフラッシュ
      bobGlow.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0.3, { duration: forwardMs - 50 })
      );
      impactFlash.value = withSequence(
        withTiming(1, { duration: 30 }),
        withTiming(0, { duration: 200 })
      );
    }
  }, [isPlaying, currentPhase, bpm, backRatio, forwardRatio]);

  // transformOriginを実現するためにtranslateを組み合わせる
  const pendulumAnimatedStyle = useAnimatedStyle(() => {
    const angle = rotation.value;
    // ピボットを上部中央にするための計算
    // 回転前に上に移動、回転、回転後に下に戻す
    const pivotY = PENDULUM_HEIGHT / 2;
    const rad = (angle * Math.PI) / 180;
    const offsetX = Math.sin(rad) * pivotY;
    const offsetY = (1 - Math.cos(rad)) * pivotY;
    
    return {
      transform: [
        { translateX: offsetX },
        { translateY: offsetY },
        { rotate: `${angle}deg` },
      ],
    };
  });

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
    width: Math.min(SCREEN_WIDTH * 0.8, 280),
    height: 200,
    alignItems: 'center',
    position: 'relative',
  },
  impactFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(42, 115, 234, 0.15)',
    borderRadius: 20,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 12,
  },
  phaseItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  phaseItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  phaseItemForward: {
    backgroundColor: 'rgba(42, 115, 234, 0.2)',
    borderColor: '#2a73ea',
  },
  phaseDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  phaseText: {
    fontSize: 11,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  phaseTextActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  phaseTextForward: {
    color: '#2a73ea',
  },
  pivot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    marginTop: 4,
    zIndex: 10,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  pendulumContainer: {
    alignItems: 'center',
    height: PENDULUM_HEIGHT,
  },
  rod: {
    width: 3,
    height: PENDULUM_HEIGHT - 28,
    borderRadius: 1.5,
  },
  bob: {
    width: 44,
    height: 22,
    backgroundColor: '#2a73ea',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    shadowColor: '#2a73ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bobInner: {
    width: 8,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 1.5,
  },
  arcContainer: {
    position: 'absolute',
    bottom: 8,
    width: '70%',
    height: 50,
    overflow: 'hidden',
  },
  arc: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: 'rgba(45, 52, 61, 0.6)',
    borderStyle: 'dashed',
    borderRadius: 100,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});
