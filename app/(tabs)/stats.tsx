// app/(tabs)/stats.tsx - 統計画面（mockデザイン準拠）

import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { usePracticeStats } from '@/hooks/usePracticeStats';
import { usePremiumStatus } from '@/hooks/usePurchase';

// 曜日名
const DAY_NAMES = ['月', '火', '水', '木', '金', '土', '日'];
const DAY_COLORS = ['#fff', '#fff', '#fff', '#fff', '#fff', '#2a73ea', '#ef4444'];

export default function StatsScreen() {
  const { isPremium } = usePremiumStatus();
  const { data: stats } = usePracticeStats();

  // モックデータ（実際のデータがない場合）
  const weeklyData = stats?.daily_stats || [
    { day: '月', minutes: 8 },
    { day: '火', minutes: 14 },
    { day: '水', minutes: 5 },
    { day: '木', minutes: 6 },
    { day: '金', minutes: 2 },
    { day: '土', minutes: 12 },
    { day: '日', minutes: 10 },
  ];

  const totalMinutes = stats?.total_practice_time_seconds 
    ? Math.round(stats.total_practice_time_seconds / 60) 
    : 45;
  const sessionCount = stats?.session_count || 5;
  const maxMinutes = Math.max(...weeklyData.map((d: any) => d.minutes || 0), 1);

  // 日付範囲を計算
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const dateRange = `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <BlurView intensity={80} style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="analytics" size={24} color="#2a73ea" />
            <Text style={styles.headerTitle}>統計</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton}>
              <Ionicons name="calendar" size={22} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.headerButton}>
              <Ionicons name="share-outline" size={22} color="#ffffff" />
            </Pressable>
          </View>
        </BlurView>
      </SafeAreaView>

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
                <Text style={styles.summaryStatLabel}>{sessionCount}セッション</Text>
                <Text style={styles.summaryStatValue}>継続中</Text>
              </View>
              <View style={[styles.summaryStat, styles.summaryStatRight]}>
                <Text style={styles.summaryStatLabel}>効率</Text>
                <Text style={[styles.summaryStatValue, styles.summaryStatValuePrimary]}>+12%</Text>
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
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>週目標: 80%</Text>
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
                  {sessionCount > 0 ? (totalMinutes / sessionCount).toFixed(1) : 0} 分
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="options" size={24} color="#2a73ea" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>よく使うプリセット</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {stats?.most_used_preset || '2.1s テンポ (75 BPM)'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
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
  goalBadge: {
    backgroundColor: 'rgba(42, 115, 234, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  goalBadgeText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: '#2a73ea',
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
