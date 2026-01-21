import React from 'react';
import { View } from 'react-native';
import { elevation } from '@/constants';

interface CardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'outlined';
}

export function Card({ children, variant = 'standard' }: CardProps) {
  if (variant === 'outlined') {
    return (
      <View className="bg-transparent border border-white rounded-2xl p-4 mb-3">
        {children}
      </View>
    );
  }

  return (
    <View
      className="bg-secondary rounded-2xl p-4 mb-3"
      style={elevation.level2}
    >
      {children}
    </View>
  );
}
