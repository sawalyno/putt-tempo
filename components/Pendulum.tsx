// components/Pendulum.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';

interface PendulumProps {
  isPlaying: boolean;
  currentPhase: 'back' | 'forward';
  bpm: number;
  backRatio: number;
  forwardRatio: number;
}

const ROTATION_ANGLE = 30; // 最大回転角度（度）

const AnimatedG = Animated.createAnimatedComponent(G);

export function Pendulum({
  isPlaying,
  bpm,
  backRatio,
  forwardRatio,
}: PendulumProps) {
  const rotation = useSharedValue(0);

  // タイミング計算
  const cycleDuration = 60000 / bpm;
  const totalRatio = backRatio + forwardRatio;
  const backDuration = cycleDuration * (backRatio / totalRatio);
  const forwardDuration = cycleDuration * (forwardRatio / totalRatio);

  useEffect(() => {
    if (isPlaying) {
      // バックストローク: 0 → -30 → 0
      // フォワードストローク: 0 → +30 → 0
      rotation.value = withRepeat(
        withSequence(
          // バックストローク前半: 0 → -30
          withTiming(-ROTATION_ANGLE, {
            duration: backDuration / 2,
            easing: Easing.out(Easing.sine),
          }),
          // バックストローク後半: -30 → 0
          withTiming(0, {
            duration: backDuration / 2,
            easing: Easing.in(Easing.sine),
          }),
          // フォワードストローク前半: 0 → +30
          withTiming(ROTATION_ANGLE, {
            duration: forwardDuration / 2,
            easing: Easing.out(Easing.sine),
          }),
          // フォワードストローク後半: +30 → 0
          withTiming(0, {
            duration: forwardDuration / 2,
            easing: Easing.in(Easing.sine),
          })
        ),
        -1, // 無限ループ
        false // リバースなし
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 200 });
    }

    return () => {
      cancelAnimation(rotation);
    };
  }, [isPlaying, bpm, backRatio, forwardRatio, backDuration, forwardDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pendulumWrapper, animatedStyle]}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          {/* 回転の支点 */}
          <Circle cx="100" cy="20" r="6" fill="#3B82F6" />

          {/* シャフト */}
          <Line
            x1="100"
            y1="20"
            x2="100"
            y2="140"
            stroke="#888888"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* パターヘッド */}
          <G>
            {/* ヘッド本体 */}
            <Path
              d={`
                M 70 140
                L 70 180
                Q 70 190 80 190
                L 120 190
                Q 130 190 130 180
                L 130 140
                L 110 140
                L 110 130
                L 90 130
                L 90 140
                Z
              `}
              fill="#3B82F6"
            />
            {/* フェース（打面） */}
            <Path
              d={`
                M 70 155
                L 130 155
              `}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* グリップライン */}
            <Line
              x1="100"
              y1="35"
              x2="100"
              y2="55"
              stroke="#2A2A2A"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>

      {/* ガイドライン（弧） */}
      <View style={styles.guideContainer}>
        <Svg width={200} height={30} viewBox="0 0 200 30">
          <Path
            d="M 30 25 Q 100 0 170 25"
            stroke="#2A2A2A"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          {/* 中央マーカー */}
          <Circle cx="100" cy="12" r="4" fill="#3B82F6" />
          {/* 左マーカー */}
          <Circle cx="30" cy="25" r="3" fill="#888888" />
          {/* 右マーカー */}
          <Circle cx="170" cy="25" r="3" fill="#888888" />
        </Svg>
      </View>

      {/* 比率表示 */}
      <View style={styles.ratioIndicator}>
        <View style={styles.ratioItem}>
          <View
            style={[
              styles.ratioDot,
              { backgroundColor: isPlaying ? '#3B82F6' : '#888888' },
            ]}
          />
          <View style={styles.ratioLabel}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#888888' }} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pendulumWrapper: {
    width: 200,
    height: 200,
    transformOrigin: '100px 20px', // 支点を基準に回転
  },
  guideContainer: {
    marginTop: -20,
  },
  ratioIndicator: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  ratioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratioLabel: {
    flexDirection: 'row',
    gap: 4,
  },
});
