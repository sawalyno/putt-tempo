// components/RatioStepper.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_CONFIG } from '@/constants';

interface RatioStepperProps {
  backRatio: number;
  forwardRatio: number;
  onBackChange: (value: number) => void;
  onForwardChange: (value: number) => void;
}

export function RatioStepper({
  backRatio,
  forwardRatio,
  onBackChange,
  onForwardChange,
}: RatioStepperProps) {
  const handleIncrement = (
    current: number,
    onChange: (value: number) => void
  ) => {
    if (current < APP_CONFIG.MAX_RATIO) {
      onChange(current + 1);
    }
  };

  const handleDecrement = (
    current: number,
    onChange: (value: number) => void
  ) => {
    if (current > APP_CONFIG.MIN_RATIO) {
      onChange(current - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>比率（バック : フォワード）</Text>

      <View style={styles.stepperContainer}>
        {/* バック */}
        <View style={styles.stepperItem}>
          <Text style={styles.stepperLabel}>バック</Text>
          <View style={styles.stepper}>
            <Pressable
              style={[
                styles.stepperButton,
                backRatio <= APP_CONFIG.MIN_RATIO && styles.stepperButtonDisabled,
              ]}
              onPress={() => handleDecrement(backRatio, onBackChange)}
            >
              <Ionicons
                name="remove"
                size={20}
                color={
                  backRatio <= APP_CONFIG.MIN_RATIO ? '#444444' : '#FFFFFF'
                }
              />
            </Pressable>
            <Text style={styles.stepperValue}>{backRatio}</Text>
            <Pressable
              style={[
                styles.stepperButton,
                backRatio >= APP_CONFIG.MAX_RATIO && styles.stepperButtonDisabled,
              ]}
              onPress={() => handleIncrement(backRatio, onBackChange)}
            >
              <Ionicons
                name="add"
                size={20}
                color={
                  backRatio >= APP_CONFIG.MAX_RATIO ? '#444444' : '#FFFFFF'
                }
              />
            </Pressable>
          </View>
        </View>

        <Text style={styles.colon}>:</Text>

        {/* フォワード */}
        <View style={styles.stepperItem}>
          <Text style={styles.stepperLabel}>フォワード</Text>
          <View style={styles.stepper}>
            <Pressable
              style={[
                styles.stepperButton,
                forwardRatio <= APP_CONFIG.MIN_RATIO &&
                  styles.stepperButtonDisabled,
              ]}
              onPress={() => handleDecrement(forwardRatio, onForwardChange)}
            >
              <Ionicons
                name="remove"
                size={20}
                color={
                  forwardRatio <= APP_CONFIG.MIN_RATIO ? '#444444' : '#FFFFFF'
                }
              />
            </Pressable>
            <Text style={styles.stepperValue}>{forwardRatio}</Text>
            <Pressable
              style={[
                styles.stepperButton,
                forwardRatio >= APP_CONFIG.MAX_RATIO &&
                  styles.stepperButtonDisabled,
              ]}
              onPress={() => handleIncrement(forwardRatio, onForwardChange)}
            >
              <Ionicons
                name="add"
                size={20}
                color={
                  forwardRatio >= APP_CONFIG.MAX_RATIO ? '#444444' : '#FFFFFF'
                }
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  stepperItem: {
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepperButton: {
    padding: 12,
    backgroundColor: '#2A2A2A',
  },
  stepperButtonDisabled: {
    backgroundColor: '#1E1E1E',
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: 48,
    textAlign: 'center',
  },
  colon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#888888',
    marginTop: 28,
  },
});
