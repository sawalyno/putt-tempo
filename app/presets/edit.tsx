// app/presets/edit.tsx - プリセット編集画面（mockデザイン準拠）

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';

import { useCustomPresets } from '@/hooks/usePresets';
import { useCreatePreset, useUpdatePreset, useDeletePreset } from '@/hooks/usePresetMutations';
import { usePremiumStatus } from '@/hooks/usePurchase';
import { useSoundPlayer } from '@/hooks/useSoundPlayer';
import { SoundType } from '@/types';
import { APP_CONFIG, SOUND_DEFINITIONS, getAvailableSounds } from '@/constants';

export default function PresetEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const { isPremium } = usePremiumStatus();
  const { data: customPresets = [] } = useCustomPresets();
  const { playSound } = useSoundPlayer();

  const createPresetMutation = useCreatePreset();
  const updatePresetMutation = useUpdatePreset();
  const deletePresetMutation = useDeletePreset();

  // フォーム状態
  const [name, setName] = useState('');
  const [bpm, setBpm] = useState(76);
  const [backRatio, setBackRatio] = useState(2);
  const [forwardRatio, setForwardRatio] = useState(1);
  const [soundType, setSoundType] = useState<SoundType>('click');
  const [isFavorite, setIsFavorite] = useState(false);

  // 編集モード時に既存データをロード
  useEffect(() => {
    if (isEditing && id) {
      const preset = customPresets.find((p) => p.id === id);
      if (preset) {
        setName(preset.name);
        setBpm(preset.bpm);
        setBackRatio(preset.back_ratio);
        setForwardRatio(preset.forward_ratio);
        setSoundType(preset.sound_type);
        setIsFavorite(preset.is_favorite);
      }
    }
  }, [isEditing, id, customPresets]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('エラー', 'プリセット名を入力してください');
      return;
    }

    try {
      if (isEditing && id) {
        await updatePresetMutation.mutateAsync({
          id,
          name: name.trim(),
          bpm,
          back_ratio: backRatio,
          forward_ratio: forwardRatio,
          sound_type: soundType,
          is_favorite: isFavorite,
        });
      } else {
        await createPresetMutation.mutateAsync({
          name: name.trim(),
          bpm,
          back_ratio: backRatio,
          forward_ratio: forwardRatio,
          sound_type: soundType,
          is_favorite: isFavorite,
        });
      }
      router.back();
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  }, [name, bpm, backRatio, forwardRatio, soundType, isFavorite, isEditing, id]);

  const handleDelete = useCallback(() => {
    if (!id) return;
    Alert.alert(
      '削除確認',
      `「${name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deletePresetMutation.mutateAsync(id);
            router.back();
          },
        },
      ]
    );
  }, [id, name]);

  const handlePreview = useCallback(() => {
    playSound(soundType);
  }, [soundType, playSound]);

  const adjustRatio = (delta: number) => {
    const currentRatio = backRatio / forwardRatio;
    const newRatio = Math.max(0.5, Math.min(4, currentRatio + delta * 0.1));
    
    // 比率を整数に近い値に調整
    if (newRatio >= 2) {
      setBackRatio(Math.round(newRatio));
      setForwardRatio(1);
    } else if (newRatio <= 0.5) {
      setBackRatio(1);
      setForwardRatio(2);
    } else {
      setBackRatio(Math.round(newRatio * 10) / 10);
      setForwardRatio(1);
    }
  };

  const availableSounds = getAvailableSounds(isPremium);
  const ratioDescription = backRatio === forwardRatio ? '均等リズム' : 
    backRatio > forwardRatio ? '標準ストローク' : 'クイックストローク';

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <BlurView intensity={80} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {isEditing ? 'プリセット編集' : 'プリセット作成'}
          </Text>
          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>保存</Text>
          </Pressable>
        </BlurView>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* プリセット名 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>プリセット名</Text>
            <Text style={styles.charCount}>{name.length}/{APP_CONFIG.PRESET_NAME_MAX_LENGTH}文字</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="例：高速グリーン用"
              placeholderTextColor="#4b5563"
              maxLength={APP_CONFIG.PRESET_NAME_MAX_LENGTH}
            />
            <Ionicons name="pencil" size={20} color="#4b5563" style={styles.inputIcon} />
          </View>
        </View>

        {/* テンポ（BPM） */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>テンポ（BPM）</Text>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyBadgeText}>精度優先</Text>
            </View>
          </View>
          <View style={styles.bpmCard}>
            <View style={styles.bpmDisplay}>
              <Text style={styles.bpmValue}>{bpm}</Text>
              <Text style={styles.bpmLabel}>BPM</Text>
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${((bpm - APP_CONFIG.BPM_MIN) / (APP_CONFIG.BPM_MAX - APP_CONFIG.BPM_MIN)) * 100}%` }]} />
              </View>
              <Slider
                style={styles.slider}
                minimumValue={APP_CONFIG.BPM_MIN}
                maximumValue={APP_CONFIG.BPM_MAX}
                step={1}
                value={bpm}
                onValueChange={setBpm}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbTintColor="#2a73ea"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{APP_CONFIG.BPM_MIN}</Text>
                <Text style={styles.sliderLabel}>115</Text>
                <Text style={styles.sliderLabel}>{APP_CONFIG.BPM_MAX}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 比率 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>比率（バック : フォワード）</Text>
          <View style={styles.ratioCard}>
            <Pressable
              style={styles.ratioButton}
              onPress={() => adjustRatio(-1)}
            >
              <Ionicons name="remove" size={24} color="#ffffff" />
            </Pressable>
            <View style={styles.ratioDisplay}>
              <View style={styles.ratioValues}>
                <Text style={styles.ratioNumber}>{backRatio}</Text>
                <Text style={styles.ratioColon}>:</Text>
                <Text style={styles.ratioNumber}>{forwardRatio}</Text>
              </View>
              <Text style={styles.ratioDescription}>{ratioDescription}</Text>
            </View>
            <Pressable
              style={[styles.ratioButton, styles.ratioButtonAdd]}
              onPress={() => adjustRatio(1)}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* 音の種類 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>音の種類</Text>
          <View style={styles.soundPickerContainer}>
            <Pressable style={styles.soundPicker}>
              <Text style={styles.soundPickerText}>
                {SOUND_DEFINITIONS.find(s => s.type === soundType)?.name || 'クリック音'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.soundList}>
            {availableSounds.map((sound) => (
              <Pressable
                key={sound.type}
                style={[
                  styles.soundChip,
                  soundType === sound.type && styles.soundChipSelected,
                ]}
                onPress={() => setSoundType(sound.type)}
              >
                <Text style={[
                  styles.soundChipText,
                  soundType === sound.type && styles.soundChipTextSelected,
                ]}>
                  {sound.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* お気に入り */}
        <View style={styles.favoriteCard}>
          <View style={styles.favoriteInfo}>
            <View style={styles.favoriteIcon}>
              <Ionicons name="star" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.favoriteTitle}>⭐ お気に入りに追加</Text>
              <Text style={styles.favoriteDescription}>ホーム画面から素早くアクセス</Text>
            </View>
          </View>
          <Switch
            value={isFavorite}
            onValueChange={setIsFavorite}
            trackColor={{ false: '#374151', true: '#2a73ea' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* 削除ボタン（編集時のみ） */}
        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={18} color="#ef4444" />
            <Text style={styles.deleteButtonText}>🗑️ このプリセットを削除</Text>
          </Pressable>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* フッター - プレビュー */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.miniPendulum}>
            <View style={styles.miniPendulumIndicator} />
          </View>
          <Pressable style={styles.previewButton} onPress={handlePreview}>
            <Text style={styles.previewButtonText}>🎵 プレビュー再生</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  saveButton: {
    backgroundColor: '#2a73ea',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: '#6b7280',
  },
  inputContainer: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#161616',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 48,
    fontSize: 16,
    fontFamily: 'NotoSansJP_400Regular',
    color: '#ffffff',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  accuracyBadge: {
    backgroundColor: 'rgba(42, 115, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(42, 115, 234, 0.2)',
  },
  accuracyBadgeText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: '#2a73ea',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bpmCard: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  bpmDisplay: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bpmValue: {
    fontSize: 72,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -3,
  },
  bpmLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: '#2a73ea',
    letterSpacing: 3,
    marginTop: 4,
  },
  sliderContainer: {
    position: 'relative',
    height: 48,
  },
  sliderTrack: {
    position: 'absolute',
    top: 23,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#2a73ea',
    borderRadius: 3,
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: -8,
    right: -8,
    height: 48,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: '#4b5563',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  ratioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginTop: 12,
  },
  ratioButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioButtonAdd: {
    backgroundColor: '#2a73ea',
    borderColor: '#2a73ea',
  },
  ratioDisplay: {
    alignItems: 'center',
  },
  ratioValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratioNumber: {
    fontSize: 32,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  ratioColon: {
    fontSize: 32,
    fontFamily: 'Manrope_700Bold',
    color: '#2a73ea',
  },
  ratioDescription: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: '#6b7280',
    marginTop: 4,
  },
  soundPickerContainer: {
    marginTop: 12,
  },
  soundPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  soundPickerText: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
    color: '#ffffff',
  },
  soundList: {
    marginTop: 12,
  },
  soundChip: {
    backgroundColor: '#222222',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  soundChipSelected: {
    backgroundColor: 'rgba(42, 115, 234, 0.2)',
    borderColor: '#2a73ea',
  },
  soundChipText: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: '#9ca3af',
  },
  soundChipTextSelected: {
    color: '#2a73ea',
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 32,
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  favoriteDescription: {
    fontSize: 10,
    fontFamily: 'Manrope_400Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: '#ef4444',
  },
  bottomSpacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(5, 5, 5, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  footerContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 16,
  },
  miniPendulum: {
    width: 192,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniPendulumIndicator: {
    position: 'absolute',
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 4,
    backgroundColor: '#2a73ea',
    borderRadius: 2,
  },
  previewButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#2a73ea',
    backgroundColor: 'rgba(42, 115, 234, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonText: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: '#2a73ea',
    letterSpacing: 1,
  },
});
