// components/BarChart.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyStat } from '@/types';

interface BarChartProps {
  data: DailyStat[];
  maxDays?: number;
}

export function BarChart({ data, maxDays = 7 }: BarChartProps) {
  // 直近N日分のデータを取得
  const recentData = data.slice(0, maxDays);

  // 最大値を計算
  const maxDuration = Math.max(
    ...recentData.map((d) => d.duration_seconds),
    1 // 0除算を防ぐ
  );

  // 曜日のラベル
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  // 時間のフォーマット
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
  };

  if (recentData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>データがありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {recentData.map((stat, index) => {
          const height = (stat.duration_seconds / maxDuration) * 100;
          return (
            <View key={stat.date} style={styles.barWrapper}>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.bar,
                    { height: `${height}%` },
                    index === 0 && styles.barToday,
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{getDayLabel(stat.date)}</Text>
            </View>
          );
        })}
      </View>

      {/* 凡例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.barToday]} />
          <Text style={styles.legendText}>今日</Text>
        </View>
        <Text style={styles.legendTotal}>
          合計: {formatDuration(recentData.reduce((sum, d) => sum + d.duration_seconds, 0))}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  emptyContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barBackground: {
    width: 24,
    height: 100,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  barToday: {
    backgroundColor: '#10B981',
  },
  dayLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#888888',
  },
  legendTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
