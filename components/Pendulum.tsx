// components/Pendulum.tsx - 水平スライダー型アニメーション（バック/インパクトを視覚化）

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';

interface PendulumProps {
  isPlaying: boolean;
  currentPhase: 'back' | 'forward' | 'idle';
  bpm: number;
  backRatio: number;
  forwardRatio: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = Math.min(SCREEN_WIDTH * 0.7, 260);
const INDICATOR_SIZE = 24;
const MAX_OFFSET = (SLIDER_WIDTH - INDICATOR_SIZE) / 2;

export function Pendulum({
  isPlaying,
  currentPhase,
  bpm,
  backRatio,
  forwardRatio,
}: PendulumProps) {
  const position = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const indicatorGlow = useSharedValue(0);
  const impactFlash = useSharedValue(0);

  // currentPhaseに基づいてアニメーション
  useEffect(() => {
    // 再生停止時
    if (!isPlaying) {
      position.value = withTiming(0, { duration: 300 });
      indicatorScale.value = withTiming(1, { duration: 200 });
      indicatorGlow.value = 0;
      impactFlash.value = 0;
      return;
    }

    const cycleDuration = 60000 / bpm;
    const totalRatio = backRatio + forwardRatio;
    const backMs = (backRatio / totalRatio) * cycleDuration;
    const forwardMs = (forwardRatio / totalRatio) * cycleDuration;

    if (currentPhase === 'back') {
      // バックスイング: 中央から右へ移動
      position.value = withTiming(MAX_OFFSET, { duration: backMs * 0.9 });
      indicatorScale.value = withTiming(0.85, { duration: backMs * 0.5 });
      indicatorGlow.value = 0.3;
      impactFlash.value = 0;
    } else if (currentPhase === 'forward') {
      // フォワード: 右から中央へ戻る（インパクト）
      position.value = withTiming(0, { duration: forwardMs * 0.9 });
      indicatorScale.value = withTiming(1.2, { duration: forwardMs * 0.3 });
      indicatorGlow.value = 1;
      impactFlash.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: 200 })
      );
    }
  }, [isPlaying, currentPhase, bpm, backRatio, forwardRatio]);

  // インジケーターのアニメーションスタイル
  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value },
      { scale: indicatorScale.value },
    ],
    shadowOpacity: 0.4 + indicatorGlow.value * 0.6,
    shadowRadius: 8 + indicatorGlow.value * 12,
  }));

  // インパクトフラッシュスタイル
  const impactFlashStyle = useAnimatedStyle(() => ({
    opacity: impactFlash.value * 0.3,
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

      {/* スライダートラック */}
      <View style={styles.sliderContainer}>
        {/* 背景トラック */}
        <View style={styles.track}>
          {/* 中央マーカー（インパクトポイント） */}
          <View style={styles.centerMarker} />
          
          {/* 右端マーカー（バック最大点） */}
          <View style={styles.endMarker} />
        </View>

        {/* 移動するインジケーター */}
        <Animated.View style={[styles.indicator, indicatorAnimatedStyle]}>
          <View style={styles.indicatorInner} />
        </Animated.View>
      </View>

      {/* ラベル */}
      <View style={styles.labels}>
        <Text style={styles.labelCenter}>●</Text>
        <Text style={styles.labelRight}>→ BACK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Math.min(SCREEN_WIDTH * 0.85, 300),
    alignItems: 'center',
    paddingVertical: 16,
  },
  impactFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2a73ea',
    borderRadius: 20,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 32,
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
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    position: 'relative',
  },
  centerMarker: {
    position: 'absolute',
    left: '50%',
    marginLeft: -3,
    top: -8,
    width: 6,
    height: 20,
    backgroundColor: '#2a73ea',
    borderRadius: 3,
  },
  endMarker: {
    position: 'absolute',
    right: 0,
    top: -4,
    width: 2,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  indicator: {
    position: 'absolute',
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: '#2a73ea',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2a73ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  indicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  labelCenter: {
    fontSize: 8,
    color: '#2a73ea',
    fontFamily: 'Manrope_700Bold',
  },
  labelRight: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 1,
  },
});
