import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { buttonPressConfig } from '@/constants/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OutlinedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function OutlinedButton({ title, onPress, disabled = false }: OutlinedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(
        buttonPressConfig.pressIn.scale,
        { duration: buttonPressConfig.pressIn.duration }
      );
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withTiming(
        buttonPressConfig.pressOut.scale,
        { duration: buttonPressConfig.pressOut.duration }
      );
    }
  };

  return (
    <AnimatedPressable
      className="border border-white px-6 py-3 rounded-lg items-center justify-center"
      style={[
        { minWidth: 120, height: 48 },
        animatedStyle,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text className={`text-white text-sm font-medium ${disabled ? 'text-gray-600' : ''}`}>
        {title}
      </Text>
    </AnimatedPressable>
  );
}
