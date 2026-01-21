// app/presets/edit.tsx - プリセット作成/編集画面

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { BpmSlider } from '@/components/BpmSlider';
import { RatioStepper } from '@/components/RatioStepper';
import { SoundPicker } from '@/components/SoundPicker';
import { PlayButton } from '@/components/PlayButton';
import { usePreset } from '@/hooks/usePresets';
import {
  useCreatePreset,
  useUpdatePreset,
  useDeletePreset,
} from '@/hooks/usePresetMutations';
import { useMetronome } from '@/hooks/useMetronome';
import { usePremiumStatus } from '@/hooks/usePurchase';
import { SoundType } from '@/types';
import { APP_CONFIG } from '@/constants';

export default function PresetEditScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;
  const existingPreset = usePreset(id || null);
  const { isPremium } = usePremiumStatus();

  const createPreset = useCreatePreset();
  const updatePreset = useUpdatePreset();
  const deletePreset = useDeletePreset();

  // フォーム状態
  const [name, setName] = useState('');
  const [bpm, setBpm] = useState(85);
  const [backRatio, setBackRatio] = useState(2);
  const [forwardRatio, setForwardRatio] = useState(1);
  const [soundType, setSoundType] = useState<SoundType>('click');
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 既存プリセットの読み込み
  useEffect(() => {
    if (existingPreset && !existingPreset.isDefault) {
      setName(existingPreset.name);
      setBpm(existingPreset.bpm);
      setBackRatio(existingPreset.backRatio);
      setForwardRatio(existingPreset.forwardRatio);
      setSoundType(existingPreset.sound_type);
      setIsFavorite(existingPreset.is_favorite);
    }
  }, [existingPreset]);

  // プレビュー用メトロノーム
  const { isPlaying, currentPhase, toggle } = useMetronome({
    bpm,
    backRatio,
    forwardRatio,
    soundType,
    outputMode: 'sound',
  });

  // バリデーション
  const validate = (): boolean => {
    if (!name.trim()) {
      setError('プリセット名を入力してください');
      return false;
    }
    if (name.length > APP_CONFIG.MAX_PRESET_NAME_LENGTH) {
      setError(`プリセット名は${APP_CONFIG.MAX_PRESET_NAME_LENGTH}文字以内にしてください`);
      return false;
    }
    setError(null);
    return true;
  };

  // 保存
  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isEditMode && id) {
        await updatePreset.mutateAsync({
          id,
          name,
          bpm,
          backRatio,
          forwardRatio,
          soundType,
          isFavorite,
        });
      } else {
        await createPreset.mutateAsync({
          name,
          bpm,
          backRatio,
          forwardRatio,
          soundType,
          isFavorite,
        });
      }
      router.back();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'PRESET_NAME_DUPLICATE') {
        setError('同じ名前のプリセットが既に存在します');
      } else {
        setError('保存に失敗しました');
      }
    }
  };

  // 削除
  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      'プリセットを削除',
      `「${name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePreset.mutateAsync(id);
              router.back();
            } catch {
              setError('削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const isLoading =
    createPreset.isPending ||
    updatePreset.isPending ||
    deletePreset.isPending;

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>
          {isEditMode ? 'プリセットを編集' : '新規プリセット'}
        </Text>
        <Pressable
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
        >
          <Text
            style={[styles.saveButtonText, isLoading && styles.saveButtonDisabled]}
          >
            保存
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* プリセット名 */}
        <View style={styles.section}>
          <Text style={styles.label}>プリセット名</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="プリセット名を入力"
            placeholderTextColor="#888888"
            maxLength={APP_CONFIG.MAX_PRESET_NAME_LENGTH}
          />
          <Text style={styles.charCount}>
            {name.length}/{APP_CONFIG.MAX_PRESET_NAME_LENGTH}
          </Text>
        </View>

        {/* BPMスライダー */}
        <BpmSlider value={bpm} onChange={setBpm} />

        {/* 比率 */}
        <RatioStepper
          backRatio={backRatio}
          forwardRatio={forwardRatio}
          onBackChange={setBackRatio}
          onForwardChange={setForwardRatio}
        />

        {/* 音の種類 */}
        <SoundPicker
          value={soundType}
          onChange={setSoundType}
          isPremium={isPremium}
        />

        {/* お気に入り */}
        <Pressable
          style={styles.favoriteRow}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <View style={styles.favoriteContent}>
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? '#F59E0B' : '#888888'}
            />
            <Text style={styles.favoriteText}>お気に入り</Text>
          </View>
          <View
            style={[styles.toggle, isFavorite && styles.toggleActive]}
          >
            <View
              style={[styles.toggleKnob, isFavorite && styles.toggleKnobActive]}
            />
          </View>
        </Pressable>

        {/* プレビュー */}
        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>プレビュー</Text>
          <View style={styles.previewContent}>
            <View style={styles.previewInfo}>
              <Text style={styles.previewBpm}>{bpm} BPM</Text>
              <Text style={styles.previewRatio}>
                {backRatio} : {forwardRatio}
              </Text>
            </View>
            <PlayButton isPlaying={isPlaying} onPress={toggle} size={56} />
          </View>
        </View>

        {/* エラー表示 */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 削除ボタン（編集モード時のみ） */}
        {isEditMode && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>プリセットを削除</Text>
          </Pressable>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  saveButtonDisabled: {
    color: '#888888',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  charCount: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
    marginTop: 8,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2A2A2A',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#3B82F6',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  previewSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewInfo: {
    flex: 1,
  },
  previewBpm: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  previewRatio: {
    fontSize: 16,
    color: '#888888',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
