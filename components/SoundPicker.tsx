// components/SoundPicker.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoundType } from '@/types';
import { SOUND_DEFINITIONS, getAvailableSounds } from '@/constants';

interface SoundPickerProps {
  value: SoundType;
  onChange: (value: SoundType) => void;
  isPremium: boolean;
}

export function SoundPicker({ value, onChange, isPremium }: SoundPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const availableSounds = getAvailableSounds(isPremium);
  const selectedSound = SOUND_DEFINITIONS.find((s) => s.id === value);

  const handleSelect = (soundId: SoundType) => {
    const sound = SOUND_DEFINITIONS.find((s) => s.id === soundId);
    if (sound && (isPremium || !sound.isPremium)) {
      onChange(soundId);
      setIsOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>音の種類</Text>

      <Pressable style={styles.picker} onPress={() => setIsOpen(true)}>
        <View style={styles.pickerContent}>
          <Ionicons name="musical-note" size={20} color="#888888" />
          <Text style={styles.pickerText}>
            {selectedSound?.name || 'クリック'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#888888" />
      </Pressable>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>音の種類を選択</Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#888888" />
              </Pressable>
            </View>

            <ScrollView style={styles.list}>
              {SOUND_DEFINITIONS.map((sound) => {
                const isLocked = !isPremium && sound.isPremium;
                const isSelected = value === sound.id;

                return (
                  <Pressable
                    key={sound.id}
                    style={[
                      styles.item,
                      isSelected && styles.itemSelected,
                      isLocked && styles.itemLocked,
                    ]}
                    onPress={() => handleSelect(sound.id)}
                    disabled={isLocked}
                  >
                    <View style={styles.itemContent}>
                      <Text
                        style={[
                          styles.itemName,
                          isLocked && styles.itemNameLocked,
                        ]}
                      >
                        {sound.name}
                      </Text>
                      <Text style={styles.itemDescription}>
                        {sound.description}
                      </Text>
                    </View>
                    {isLocked ? (
                      <Ionicons name="lock-closed" size={20} color="#888888" />
                    ) : isSelected ? (
                      <Ionicons name="checkmark" size={24} color="#3B82F6" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
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
    paddingBottom: 34,
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
  itemLocked: {
    opacity: 0.5,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemNameLocked: {
    color: '#888888',
  },
  itemDescription: {
    fontSize: 12,
    color: '#888888',
  },
});
