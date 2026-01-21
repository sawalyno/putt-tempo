// components/OutputModeToggle.tsx

import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OutputMode } from '@/types';

interface OutputModeToggleProps {
  mode: OutputMode;
  onChange: (mode: OutputMode) => void;
}

type ModeOption = {
  value: OutputMode;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const MODES: ModeOption[] = [
  { value: 'sound', icon: 'volume-high', label: '音' },
  { value: 'vibration', icon: 'phone-portrait', label: 'バイブ' },
  { value: 'both', icon: 'musical-notes', label: '両方' },
];

export function OutputModeToggle({ mode, onChange }: OutputModeToggleProps) {
  return (
    <View style={styles.container}>
      {MODES.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.button,
            mode === option.value && styles.buttonActive,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Ionicons
            name={option.icon}
            size={20}
            color={mode === option.value ? '#3B82F6' : '#888888'}
          />
          <Text
            style={[
              styles.label,
              mode === option.value && styles.labelActive,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  buttonActive: {
    backgroundColor: '#2A2A2A',
  },
  label: {
    fontSize: 14,
    color: '#888888',
  },
  labelActive: {
    color: '#3B82F6',
  },
});
