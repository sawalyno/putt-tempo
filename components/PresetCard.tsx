// components/PresetCard.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Preset } from '@/types';

interface PresetCardProps {
  preset: Preset;
  onPress: () => void;
  onEdit?: () => void;
  onToggleFavorite?: () => void;
}

export function PresetCard({
  preset,
  onPress,
  onEdit,
  onToggleFavorite,
}: PresetCardProps) {
  const isFavorite = !preset.isDefault && preset.is_favorite;
  const backRatio = preset.backRatio;
  const forwardRatio = preset.forwardRatio;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{preset.name}</Text>
          {preset.isDefault && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>標準</Text>
            </View>
          )}
          {isFavorite && (
            <Ionicons name="star" size={16} color="#F59E0B" />
          )}
        </View>
        <Text style={styles.detail}>
          {preset.bpm} BPM • {backRatio}:{forwardRatio}
        </Text>
        {preset.isDefault && 'description' in preset && (
          <Text style={styles.description}>{preset.description}</Text>
        )}
      </View>

      {!preset.isDefault && (
        <View style={styles.actions}>
          {onToggleFavorite && (
            <Pressable
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={20}
                color={isFavorite ? '#F59E0B' : '#888888'}
              />
            </Pressable>
          )}
          {onEdit && (
            <Pressable
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Ionicons name="pencil" size={20} color="#888888" />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#888888',
  },
  detail: {
    fontSize: 14,
    color: '#888888',
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
