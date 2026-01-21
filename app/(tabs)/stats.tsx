// app/(tabs)/stats.tsx - 統計画面

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatsCard } from '@/components/StatsCard';
import { BarChart } from '@/components/BarChart';
import { PremiumBanner } from '@/components/PremiumBanner';
import { usePracticeStats } from '@/hooks/usePracticeStats';
import { usePremiumStatus } from '@/hooks/usePurchase';

export default function StatsScreen() {
  const { isPremium } = usePremiumStatus();
  const { data: stats, isLoading } = usePracticeStats();

  // 時間のフォーマット
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  };

  const totalDuration = stats?.total_duration_seconds ?? 0;
  const totalSessions = stats?.total_sessions ?? 0;
  const averageDuration = stats?.average_duration_seconds ?? 0;
  const mostUsedPreset = stats?.most_used_preset ?? '-';
  const dailyStats = stats?.daily_stats ?? [];
  const periodDays = stats?.period_days ?? 7;

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>統計</Text>
        <Text style={styles.periodText}>過去{periodDays}日間</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* サマリーカード */}
        <View style={styles.cardsRow}>
          <StatsCard
            icon="time"
            label="総練習時間"
            value={formatDuration(totalDuration)}
            iconColor="#10B981"
          />
          <StatsCard
            icon="golf"
            label="セッション数"
            value={`${totalSessions}回`}
            iconColor="#3B82F6"
          />
        </View>

        {/* 日別グラフ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>日別練習時間</Text>
          <BarChart data={dailyStats} maxDays={periodDays} />
        </View>

        {/* 詳細統計 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>詳細</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>平均セッション時間</Text>
              <Text style={styles.detailValue}>
                {formatDuration(averageDuration)}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>よく使うプリセット</Text>
              <Text style={styles.detailValue}>{mostUsedPreset}</Text>
            </View>
          </View>
        </View>

        {/* プレミアム誘導（無料ユーザーのみ） */}
        {!isPremium && (
          <View style={styles.section}>
            <PremiumBanner
              title="詳細な統計をアンロック"
              description="過去1年間の統計を確認"
            />
          </View>
        )}

        {/* データがない場合 */}
        {totalSessions === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>まだデータがありません</Text>
            <Text style={styles.emptyText}>
              練習を始めると、ここに統計が表示されます
            </Text>
          </View>
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
  periodText: {
    fontSize: 14,
    color: '#888888',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});
