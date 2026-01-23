// components/Pendulum.tsx - 水平スライダー型アニメーション（3フェーズ対応）

import { MetronomePhase } from '@/types';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

interface PendulumProps {
  isPlaying: boolean;
  currentPhase: MetronomePhase;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  interval: number;
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
  interval,
}: PendulumProps) {
  const position = useRef(new Animated.Value(0)).current;
  const indicatorScale = useRef(new Animated.Value(1)).current;
  const impactFlash = useRef(new Animated.Value(0)).current;

  // currentPhaseに基づいてアニメーション
  useEffect(() => {
    // 再生停止時
    if (!isPlaying || currentPhase === 'idle') {
      Animated.parallel([
        Animated.timing(position, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      impactFlash.setValue(0);
      return;
    }

    const cycleDuration = 60000 / bpm;
    const totalRatio = backRatio + forwardRatio;
    const takeBackMs = (backRatio / totalRatio) * cycleDuration;
    const impactMs = (forwardRatio / totalRatio) * cycleDuration;
    const intervalMs = interval * 1000;

    switch (currentPhase) {
      case 'address':
        // アドレス: 中央位置（開始点）
        Animated.parallel([
          Animated.timing(position, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(indicatorScale, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
        impactFlash.setValue(0);
        break;

      case 'takeBack':
        // テイクバック: 中央から右へ移動
        Animated.parallel([
          Animated.timing(position, {
            toValue: MAX_OFFSET,
            duration: takeBackMs * 0.9,
            useNativeDriver: true,
          }),
          Animated.timing(indicatorScale, {
            toValue: 0.85,
            duration: takeBackMs * 0.5,
            useNativeDriver: true,
          }),
        ]).start();
        break;

      case 'impact':
        // インパクト: 右から左へ通り抜け
        Animated.parallel([
          Animated.timing(position, {
            toValue: -MAX_OFFSET,
            duration: impactMs * 0.9,
            useNativeDriver: true,
          }),
          Animated.timing(indicatorScale, {
            toValue: 1.2,
            duration: impactMs * 0.3,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(impactFlash, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(impactFlash, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
        break;

      case 'interval':
        // インターバル: 左から中央に戻る
        Animated.parallel([
          Animated.timing(position, {
            toValue: 0,
            duration: Math.min(intervalMs * 0.3, 500),
            useNativeDriver: true,
          }),
          Animated.timing(indicatorScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        break;
    }
  }, [isPlaying, currentPhase, bpm, backRatio, forwardRatio, interval]);

  return (
    <View style={styles.container}>
      {/* インパクトフラッシュ */}
      <Animated.View
        style={[
          styles.impactFlash,
          {
            opacity: impactFlash.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />

      {/* フェーズインジケーター（3つ） */}
      <View style={styles.phaseIndicator}>
        <View style={[
          styles.phaseItem,
          currentPhase === 'address' && isPlaying && styles.phaseItemActive,
        ]}>
          <Text style={[
            styles.phaseText,
            currentPhase === 'address' && isPlaying && styles.phaseTextActive,
          ]}>ADDRESS</Text>
        </View>
        <View style={styles.phaseDivider} />
        <View style={[
          styles.phaseItem,
          currentPhase === 'takeBack' && isPlaying && styles.phaseItemActive,
        ]}>
          <Text style={[
            styles.phaseText,
            currentPhase === 'takeBack' && isPlaying && styles.phaseTextActive,
          ]}>BACK</Text>
        </View>
        <View style={styles.phaseDivider} />
        <View style={[
          styles.phaseItem,
          currentPhase === 'impact' && isPlaying && styles.phaseItemImpact,
        ]}>
          <Text style={[
            styles.phaseText,
            currentPhase === 'impact' && isPlaying && styles.phaseTextImpact,
          ]}>IMPACT</Text>
        </View>
      </View>

      {/* スライダートラック */}
      <View style={styles.sliderContainer}>
        {/* 背景トラック */}
        <View style={styles.track}>
          {/* 左端マーカー（フォロースルー点） */}
          <View style={styles.leftMarker} />
          
          {/* 中央マーカー（アドレス/インパクトポイント） */}
          <View style={styles.centerMarker} />
          
          {/* 右端マーカー（バック最大点） */}
          <View style={styles.rightMarker} />
        </View>

        {/* 移動するインジケーター */}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                { translateX: position },
                { scale: indicatorScale },
              ],
            },
          ]}
        >
          <View style={styles.indicatorInner} />
        </Animated.View>
      </View>

      {/* ラベル */}
      <View style={styles.labels}>
        <Text style={styles.labelLeft}>FOLLOW</Text>
        <Text style={styles.labelCenter}>●</Text>
        <Text style={styles.labelRight}>BACK →</Text>
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
    gap: 8,
    marginBottom: 32,
  },
  phaseItem: {
    paddingHorizontal: 12,
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
  phaseItemImpact: {
    backgroundColor: 'rgba(42, 115, 234, 0.2)',
    borderColor: '#2a73ea',
  },
  phaseDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  phaseText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  phaseTextActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  phaseTextImpact: {
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
  leftMarker: {
    position: 'absolute',
    left: 0,
    top: -4,
    width: 2,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
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
  rightMarker: {
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
    shadowOpacity: 0.6,
    shadowRadius: 12,
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
  labelLeft: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 1,
  },
  labelCenter: {
    fontSize: 8,
    color: '#2a73ea',
    fontFamily: 'Manrope_700Bold',
  },
  labelRight: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'Manrope_700Bold',
    letterSpacing: 1,
  },
});
