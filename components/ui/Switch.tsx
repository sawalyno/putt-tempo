import React from 'react';
import { View, Text, Switch as RNSwitch, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export function Switch({ value, onValueChange, label }: SwitchProps) {
  return (
    <View className="flex-row items-center justify-between py-3">
      {label && (
        <Text className="text-base text-white flex-1 mr-4">{label}</Text>
      )}
      <View className="flex-row items-center">
        <RNSwitch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: colors.surfaceVariant,
            true: colors.accent1,
          }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.surfaceVariant}
        />
        <Text className="text-base text-textMuted ml-3">
          {value ? 'ON' : 'OFF'}
        </Text>
      </View>
    </View>
  );
}
