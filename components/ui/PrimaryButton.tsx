import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { componentSize, elevation } from '@/constants';
import { buttonPressConfig } from '@/constants/animations';
import { colors } from '@/constants/Colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({ title, onPress, disabled = false }: PrimaryButtonProps) {
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
      className="bg-tertiary px-8 py-4 rounded-lg items-center justify-center"
      style={[
        {
          width: componentSize.button.width,
          height: componentSize.button.height,
          shadowColor: colors.tertiary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        },
        animatedStyle,
        disabled && { backgroundColor: colors.button.disabled, opacity: 0.6 },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </AnimatedPressable>
  );
}
