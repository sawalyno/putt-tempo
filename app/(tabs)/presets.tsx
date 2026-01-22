// app/(tabs)/presets.tsx - プリセット一覧画面（mockデザイン準拠）

import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAllPresets, useCustomPresets, usePresetLimit } from '@/hooks/usePresets';
import { useDeletePreset } from '@/hooks/usePresetMutations';
import { usePremiumStatus } from '@/hooks/usePurchase';
import { Preset, CustomPreset, DefaultPreset } from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

// プリセットアイコンのマッピング
const PRESET_ICONS: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  standard: 'star',
  slow: 'remove-circle',
  fast: 'timer',
  equal: 'analytics',
};

export default function PresetsScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremiumStatus();
  const { data: customPresets = [] } = useCustomPresets();
  const { canCreate, current, limit } = usePresetLimit();
  const deletePresetMutation = useDeletePreset();

  const handleCreatePreset = () => {
    if (!canCreate && !isPremium) {
      Alert.alert(
        'プリセット上限',
        `無料プランでは${limit}個までです。\nプレミアムにアップグレードして無制限に！`,
        [
          { text: 'キャンセル', style: 'cancel' },
          { text: 'プレミアムを見る', onPress: () => router.push('/premium') },
        ]
      );
      return;
    }
    router.push('/presets/edit');
  };

  const handleEditPreset = (preset: CustomPreset) => {
    router.push(`/presets/edit?id=${preset.id}`);
  };

  const handleDeletePreset = (preset: CustomPreset) => {
    Alert.alert(
      '削除確認',
      `「${preset.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deletePresetMutation.mutate(preset.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>プリセット</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* デフォルトプリセット */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>デフォルト</Text>
          </View>
          <View style={styles.presetList}>
            {DEFAULT_PRESETS.map((preset, index) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isFavorite={index === 0}
                iconName={PRESET_ICONS[preset.id] || 'ellipse'}
              />
            ))}
          </View>
        </View>

        {/* カスタムプリセット */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>カスタム</Text>
              {!isPremium && (
                <View style={styles.freeBadge}>
                  <Ionicons name="lock-open" size={10} color="#050505" />
                  <Text style={styles.freeBadgeText}>無料 {current}/{limit}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.presetList}>
            {customPresets.map((preset) => (
              <CustomPresetCard
                key={preset.id}
                preset={preset}
                onEdit={() => handleEditPreset(preset)}
                onDelete={() => handleDeletePreset(preset)}
              />
            ))}

            {/* 新規作成ボタン */}
            <Pressable
              style={styles.createButton}
              onPress={handleCreatePreset}
            >
              <View style={styles.createButtonContent}>
                <Ionicons name="add-circle" size={24} color="#64748b" />
                <Text style={styles.createButtonText}>＋ 新しいプリセットを作成</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ボトムスペーサー */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// デフォルトプリセットカード（編集不可）
function PresetCard({
  preset,
  isFavorite,
  iconName,
}: {
  preset: DefaultPreset;
  isFavorite?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.presetCard}>
      <View style={styles.presetCardContent}>
        <View style={[
          styles.presetIcon,
          isFavorite && styles.presetIconFavorite,
        ]}>
          <Ionicons
            name={iconName}
            size={24}
            color={isFavorite ? '#F59E0B' : '#64748b'}
          />
        </View>
        <View style={styles.presetInfo}>
          <Text style={styles.presetName}>{preset.name}</Text>
          <Text style={styles.presetDetails}>
            {preset.bpm} BPM <Text style={styles.presetDetailsDivider}>|</Text> {preset.backRatio}:{preset.forwardRatio} 比率
          </Text>
        </View>
      </View>
    </View>
  );
}

// カスタムプリセットカード
function CustomPresetCard({
  preset,
  onEdit,
  onDelete,
}: {
  preset: CustomPreset;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable style={styles.presetCard} onLongPress={onDelete}>
      <View style={styles.presetCardContent}>
        <View style={[styles.presetIcon, styles.presetIconCustom]}>
          <Ionicons name="musical-notes" size={24} color="#2a73ea" />
        </View>
        <View style={styles.presetInfo}>
          <Text style={styles.presetName}>{preset.name}</Text>
          <Text style={styles.presetDetails}>
            {preset.bpm} BPM <Text style={styles.presetDetailsDivider}>|</Text> {preset.back_ratio}:{preset.forward_ratio} 比率
          </Text>
        </View>
      </View>
      <Pressable style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>編集</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  freeBadgeText: {
    fontSize: 10,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#050505',
  },
  presetList: {
    gap: 12,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  presetCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  presetIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetIconFavorite: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  presetIconCustom: {
    backgroundColor: 'rgba(42, 115, 234, 0.1)',
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  presetDetails: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: '#64748b',
  },
  presetDetailsDivider: {
    opacity: 0.3,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#222222',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#94a3b8',
  },
  createButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#334155',
    borderRadius: 12,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: '#64748b',
  },
  bottomSpacer: {
    height: 80,
  },
});
