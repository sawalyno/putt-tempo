import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/constants';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH * 0.5; // 画面幅の50%
const THUMB_SIZE = 20;
const TRACK_HEIGHT = 4;

export function Slider({
  value,
  onValueChange,
  minimumValue = 1,
  maximumValue = 10,
  step = 1,
  label,
  showValue = true,
}: SliderProps) {
  const translateX = useSharedValue(
    ((value - minimumValue) / (maximumValue - minimumValue)) * SLIDER_WIDTH
  );

  const updateValue = React.useCallback(
    (newTranslateX: number) => {
      const clampedX = Math.max(0, Math.min(SLIDER_WIDTH, newTranslateX));
      const ratio = clampedX / SLIDER_WIDTH;
      const rawValue = minimumValue + ratio * (maximumValue - minimumValue);
      const steppedValue = Math.round(rawValue / step) * step;
      const finalValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));
      onValueChange(finalValue);
    },
    [minimumValue, maximumValue, step, onValueChange]
  );

  const startX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart((e) => {
      const tapX = e.x;
      const clampedX = Math.max(0, Math.min(SLIDER_WIDTH, tapX));
      translateX.value = clampedX;
      startX.value = clampedX;
      runOnJS(updateValue)(clampedX);
    })
    .onUpdate((e) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, startX.value + e.translationX));
      translateX.value = newX;
      runOnJS(updateValue)(newX);
    })
    .onEnd(() => {
      const ratio = translateX.value / SLIDER_WIDTH;
      const rawValue = minimumValue + ratio * (maximumValue - minimumValue);
      const steppedValue = Math.round(rawValue / step) * step;
      const finalValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));
      const finalX = ((finalValue - minimumValue) / (maximumValue - minimumValue)) * SLIDER_WIDTH;
      translateX.value = withSpring(finalX, {
        damping: 15,
        stiffness: 200,
      });
      startX.value = finalX;
      runOnJS(onValueChange)(finalValue);
    });

  React.useEffect(() => {
    const newX = ((value - minimumValue) / (maximumValue - minimumValue)) * SLIDER_WIDTH;
    translateX.value = withSpring(newX, {
      damping: 15,
      stiffness: 200,
    });
  }, [value, minimumValue, maximumValue, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const trackFillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  return (
    <View className="flex-row items-center justify-between py-3">
      {label && (
        <Text className="text-base text-white flex-1 mr-4">{label}</Text>
      )}
      <View className="flex-1 flex-row items-center">
        <View style={styles.container}>
          {/* Track Background */}
          <View style={styles.trackBackground} />
          {/* Track Fill */}
          <Animated.View style={[styles.trackFill, trackFillStyle]} />
          {/* Thumb */}
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </GestureDetector>
        </View>
      </View>
      {showValue && (
        <Text className="text-base text-textMuted ml-4 min-w-[24px] text-right">
          {value}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SLIDER_WIDTH,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 2,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: TRACK_HEIGHT,
    backgroundColor: colors.accent1,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: -THUMB_SIZE / 2,
  },
});
