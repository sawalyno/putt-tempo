// components/PlayButton.tsx

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

interface PlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  size?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlayButton({
  isPlaying,
  onPress,
  size = 80,
}: PlayButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, { width: size, height: size }, animatedStyle]}
    >
      <View
        style={[
          styles.inner,
          {
            width: size - 8,
            height: size - 8,
            borderRadius: (size - 8) / 2,
          },
          isPlaying && styles.innerPlaying,
        ]}
      >
        <Ionicons
          name={isPlaying ? 'stop' : 'play'}
          size={size * 0.4}
          color="#FFFFFF"
          style={!isPlaying && { marginLeft: size * 0.05 }}
        />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  inner: {
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerPlaying: {
    backgroundColor: '#EF4444',
  },
});
