// app/(tabs)/presets.tsx - プリセット一覧画面

import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { PresetCard } from '@/components/PresetCard';
import {
  useAllPresets,
  usePresetLimit,
  useDefaultPresets,
} from '@/hooks/usePresets';
import { useToggleFavorite } from '@/hooks/usePresetMutations';
import { usePremiumStatus } from '@/hooks/usePurchase';

export default function PresetsScreen() {
  const { isPremium } = usePremiumStatus();
  const defaultPresets = useDefaultPresets();
  const { customPresets = [], isLoading } = useAllPresets();
  const { data: limitData } = usePresetLimit();
  const toggleFavorite = useToggleFavorite();

  const canCreate = limitData?.can_create ?? false;
  const currentCount = limitData?.current_count ?? 0;
  const maxCount = limitData?.max_count ?? 3;

  const handleCreatePreset = () => {
    if (!canCreate && !isPremium) {
      router.push('/premium');
      return;
    }
    router.push('/presets/edit');
  };

  const handleEditPreset = (presetId: string) => {
    router.push(`/presets/edit?id=${presetId}`);
  };

  const handleToggleFavorite = (presetId: string, currentFavorite: boolean) => {
    toggleFavorite.mutate({ presetId, isFavorite: !currentFavorite });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>プリセット</Text>
        <Pressable style={styles.addButton} onPress={handleCreatePreset}>
          <Ionicons name="add" size={24} color="#3B82F6" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* カスタムプリセットセクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>カスタム</Text>
            {!isPremium && (
              <Text style={styles.limitText}>
                {currentCount}/{maxCount}
              </Text>
            )}
          </View>

          {customPresets.length === 0 ? (
            <Pressable style={styles.emptyCard} onPress={handleCreatePreset}>
              <Ionicons name="add-circle-outline" size={32} color="#888888" />
              <Text style={styles.emptyText}>プリセットを作成</Text>
            </Pressable>
          ) : (
            customPresets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onPress={() => {}}
                onEdit={() => handleEditPreset(preset.id)}
                onToggleFavorite={() =>
                  handleToggleFavorite(preset.id, preset.is_favorite)
                }
              />
            ))
          )}

          {/* 空きスロット */}
          {!isPremium &&
            customPresets.length < maxCount &&
            customPresets.length > 0 && (
              <Pressable style={styles.emptySlot} onPress={handleCreatePreset}>
                <Ionicons name="add" size={20} color="#888888" />
                <Text style={styles.emptySlotText}>追加</Text>
              </Pressable>
            )}
        </View>

        {/* デフォルトプリセットセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>標準プリセット</Text>
          {defaultPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* プレミアム誘導 */}
        {!isPremium && (
          <Pressable
            style={styles.premiumBanner}
            onPress={() => router.push('/premium')}
          >
            <Ionicons name="star" size={24} color="#F59E0B" />
            <View style={styles.premiumBannerContent}>
              <Text style={styles.premiumBannerTitle}>
                プレミアムにアップグレード
              </Text>
              <Text style={styles.premiumBannerText}>
                無制限のプリセット、全ての音色が利用可能
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888888" />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
  },
  limitText: {
    fontSize: 14,
    color: '#888888',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
    padding: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
    padding: 16,
    gap: 8,
  },
  emptySlotText: {
    fontSize: 14,
    color: '#888888',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  premiumBannerContent: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumBannerText: {
    fontSize: 12,
    color: '#888888',
  },
});
