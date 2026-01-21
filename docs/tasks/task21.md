# Task 21: 振り子アニメーション実装

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task21 |
| フェーズ | Phase 7: ビジュアルペンダム |
| 所要時間 | 2時間 |
| 依存タスク | task12（メトロノームロジック） |

## 目的
BPMと比率に連動したパター風振り子アニメーションを実装する。

## 必要なパッケージ
```bash
npx expo install react-native-reanimated
```

## アニメーション仕様

### 動作
```
         ◄─── バックストローク ───►
                    │
         左端  ←──  │  ──→  右端
              ↖     │     ↗
                \   │   /
                 \  │  /    ← 振り子の弧
                  \ │ /
                   \│/
                    ●  ← パターヘッド
                    │
                    │  ← シャフト
                    ▼
```

### パラメータ
| 項目 | 値 |
|------|-----|
| 回転角度範囲 | -30° 〜 +30° |
| イージング | `Easing.inOut(Easing.sine)` |
| フレームレート | 60FPS |

### タイミング例（85 BPM, 2:1比率）
- 1サイクル = 706ms
- バックストローク = 471ms（中央→左→中央）
- フォワードストローク = 235ms（中央→右→中央）

## 実装

### components/Pendulum.tsx
```typescript
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
import Svg, { Path, Circle, Line } from 'react-native-svg';

interface PendulumProps {
  isPlaying: boolean;
  currentPhase: 'back' | 'forward';
  bpm: number;
  backRatio: number;
  forwardRatio: number;
}

const ROTATION_ANGLE = 30; // 最大回転角度（度）
const PENDULUM_LENGTH = 120; // シャフトの長さ
const HEAD_SIZE = 40; // パターヘッドのサイズ

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function Pendulum({
  isPlaying,
  currentPhase,
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
          }),
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
  }, [isPlaying, bpm, backRatio, forwardRatio]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pendulumWrapper, animatedStyle]}>
        <Svg width={100} height={200} viewBox="0 0 100 200">
          {/* 回転の支点（見えない） */}
          <Circle cx="50" cy="10" r="5" fill="#333333" />
          
          {/* シャフト */}
          <Line
            x1="50"
            y1="10"
            x2="50"
            y2={10 + PENDULUM_LENGTH}
            stroke="#888888"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* パターヘッド */}
          <Path
            d={`
              M 35 ${10 + PENDULUM_LENGTH}
              L 35 ${10 + PENDULUM_LENGTH + HEAD_SIZE}
              L 65 ${10 + PENDULUM_LENGTH + HEAD_SIZE}
              L 65 ${10 + PENDULUM_LENGTH}
              L 55 ${10 + PENDULUM_LENGTH}
              L 55 ${10 + PENDULUM_LENGTH - 10}
              L 45 ${10 + PENDULUM_LENGTH - 10}
              L 45 ${10 + PENDULUM_LENGTH}
              Z
            `}
            fill="#3B82F6"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        </Svg>
      </Animated.View>
      
      {/* フェーズインジケーター */}
      <View style={styles.indicator}>
        <View
          style={[
            styles.dot,
            currentPhase === 'back' && styles.dotActive,
          ]}
        />
        <View
          style={[
            styles.dot,
            currentPhase === 'forward' && styles.dotActive,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendulumWrapper: {
    transformOrigin: 'top center',
  },
  indicator: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
});
```

## babel.config.js の設定
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // 必ず最後に配置
    ],
  };
};
```

## 完了条件
- [ ] react-native-reanimated がインストールされている
- [ ] babel.config.js にプラグインが追加されている
- [ ] components/Pendulum.tsx が実装されている
- [ ] パターヘッドが左右に振れるアニメーションが動作する
- [ ] BPM変更時にアニメーション速度が変わる
- [ ] 比率変更時にタイミングが変わる
- [ ] 停止時に中央に戻る
- [ ] フェーズインジケーターが現在のフェーズを表示する

## 注意事項
- `transformOrigin` は振り子の支点を設定
- Expoの開発サーバーを再起動する必要がある場合あり
- パフォーマンスのため `useNativeDriver` 相当の処理をReanimatedが行う
