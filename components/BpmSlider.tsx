// components/BpmSlider.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { APP_CONFIG } from '@/constants';

interface BpmSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function BpmSlider({ value, onChange }: BpmSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>BPM</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={APP_CONFIG.MIN_BPM}
        maximumValue={APP_CONFIG.MAX_BPM}
        step={1}
        minimumTrackTintColor="#3B82F6"
        maximumTrackTintColor="#2A2A2A"
        thumbTintColor="#3B82F6"
        onValueChange={onChange}
      />
      <View style={styles.range}>
        <Text style={styles.rangeText}>{APP_CONFIG.MIN_BPM}</Text>
        <Text style={styles.rangeText}>{APP_CONFIG.MAX_BPM}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  slider: {
    height: 40,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: 12,
    color: '#888888',
  },
});
