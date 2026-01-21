// components/PresetSelector.tsx

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Preset } from '@/types';

interface PresetSelectorProps {
  visible: boolean;
  presets: Preset[];
  selectedId: string;
  onSelect: (preset: Preset) => void;
  onClose: () => void;
}

export function PresetSelector({
  visible,
  presets,
  selectedId,
  onSelect,
  onClose,
}: PresetSelectorProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.title}>プリセット選択</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#888888" />
            </Pressable>
          </View>

          {/* プリセットリスト */}
          <ScrollView style={styles.list}>
            {presets.map((preset) => (
              <Pressable
                key={preset.id}
                style={[
                  styles.item,
                  selectedId === preset.id && styles.itemSelected,
                ]}
                onPress={() => onSelect(preset)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{preset.name}</Text>
                    {!preset.isDefault && preset.is_favorite && (
                      <Ionicons name="star" size={16} color="#F59E0B" />
                    )}
                    {preset.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>標準</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemDetail}>
                    {preset.bpm} BPM • {preset.backRatio}:{preset.forwardRatio}
                  </Text>
                </View>
                {selectedId === preset.id && (
                  <Ionicons name="checkmark" size={24} color="#3B82F6" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 34, // Safe area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    padding: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  itemSelected: {
    backgroundColor: '#1E1E1E',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemDetail: {
    fontSize: 14,
    color: '#888888',
  },
  defaultBadge: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: '#888888',
  },
});
