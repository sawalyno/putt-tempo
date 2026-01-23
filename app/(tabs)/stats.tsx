// app/(tabs)/stats.tsx - 統計画面（mockデザイン準拠）

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePracticeStats } from '@/hooks/usePracticeStats';
import { usePremiumStatus } from '@/hooks/usePurchase';

// 曜日名
const DAY_NAMES = ['月', '火', '水', '木', '金', '土', '日'];

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremiumStatus();
  const { data: stats, isLoading } = usePracticeStats();

  // 日付範囲を計算
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // 月曜日
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // 日曜日
  const dateRange = `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;

  // RPCの daily_stats を週間データに変換
  const weeklyData = useMemo(() => {
    // 過去7日間のデータを曜日ごとに集計
    const dayData: { day: string; minutes: number }[] = DAY_NAMES.map((day) => ({
      day,
      minutes: 0,
    }));

    if (stats?.daily_stats && Array.isArray(stats.daily_stats)) {
      stats.daily_stats.forEach((stat: { date: string; duration_seconds: number }) => {
        const date = new Date(stat.date);
        const dayOfWeek = date.getDay(); // 0=日曜, 1=月曜...
        // 月曜を0、日曜を6に変換
        const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        dayData[index].minutes += Math.round(stat.duration_seconds / 60);
      });
    }

    return dayData;
  }, [stats?.daily_stats]);

  // 統計値
  const totalMinutes = stats?.total_duration_seconds
    ? Math.round(stats.total_duration_seconds / 60)
    : 0;
  const sessionCount = stats?.total_sessions || 0;
  const avgMinutes = stats?.average_duration_seconds
    ? (stats.average_duration_seconds / 60).toFixed(1)
    : '0';
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>統計</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* サマリーカード */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryGlow} />
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>今週の練習</Text>
              <View style={styles.summaryValue}>
                <Text style={styles.summaryNumber}>{totalMinutes}</Text>
                <Text style={styles.summaryUnit}>分</Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>セッション数</Text>
                <Text style={styles.summaryStatValue}>{sessionCount}</Text>
              </View>
              <View style={[styles.summaryStat, styles.summaryStatRight]}>
                <Text style={styles.summaryStatLabel}>平均/回</Text>
                <Text style={[styles.summaryStatValue, styles.summaryStatValuePrimary]}>{avgMinutes}分</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 練習時間グラフ */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>練習時間</Text>
              <Text style={styles.chartSubtitle}>過去7日間 ({dateRange})</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {weeklyData.map((data: any, index: number) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartBarBackground}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { height: `${(data.minutes / maxMinutes) * 100}%` },
                        data.minutes > 0 && styles.chartBarFillGlow,
                      ]}
                    />
                  </View>
                  <Text style={[
                    styles.chartBarLabel,
                    index === 5 && styles.chartBarLabelSat,
                    index === 6 && styles.chartBarLabelSun,
                  ]}>
                    {DAY_NAMES[index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 詳細セクション */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>詳細</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="timer" size={24} color="#2a73ea" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>平均セッション時間</Text>
                <Text style={styles.detailValue}>
                  {avgMinutes} 分
                </Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="options" size={24} color="#2a73ea" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>よく使うプリセット</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {stats?.most_used_preset || 'まだ記録がありません'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* プレミアムバナー（無料ユーザーのみ） */}
        {!isPremium && (
          <Pressable 
            style={styles.premiumBanner}
            onPress={() => router.push('/premium')}
          >
            <View style={styles.premiumIconContainer}>
              <Ionicons name="trophy" size={28} color="#050505" />
            </View>
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>
                🔓 7日間以上の履歴はプレミアムで確認できます
              </Text>
              <View style={styles.premiumLink}>
                <Text style={styles.premiumLinkText}>詳しく見る</Text>
                <Ionicons name="arrow-forward" size={14} color="#F59E0B" />
              </View>
            </View>
          </Pressable>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
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
  summaryCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  summaryGlow: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(42, 115, 234, 0.1)',
    borderRadius: 64,
  },
  summaryContent: {
    position: 'relative',
    zIndex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  summaryValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  summaryNumber: {
    fontSize: 48,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -2,
  },
  summaryUnit: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.4)',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStat: {
    flex: 1,
  },
  summaryStatRight: {
    alignItems: 'flex-end',
  },
  summaryStatLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.4)',
  },
  summaryStatValue: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  summaryStatValuePrimary: {
    color: '#2a73ea',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  chartBarBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#2a73ea',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartBarFillGlow: {
    shadowColor: '#2a73ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  chartBarLabel: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.4)',
  },
  chartBarLabelSat: {
    color: '#2a73ea',
  },
  chartBarLabelSun: {
    color: '#ef4444',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  detailsCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  premiumIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  premiumInfo: {
    flex: 1,
    gap: 4,
  },
  premiumTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#F59E0B',
    lineHeight: 20,
  },
  premiumLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  premiumLinkText: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#F59E0B',
  },
  bottomSpacer: {
    height: 80,
  },
});
