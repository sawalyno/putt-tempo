// app/premium.tsx - プレミアム画面（モーダル）

import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { usePurchase } from '@/hooks/usePurchase';

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isPremium?: boolean;
}

function FeatureItem({
  icon,
  title,
  description,
  isPremium = true,
}: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View
        style={[
          styles.featureIcon,
          isPremium ? styles.featureIconPremium : styles.featureIconFree,
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isPremium ? '#F59E0B' : '#888888'}
        />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      {isPremium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>PRO</Text>
        </View>
      )}
    </View>
  );
}

export default function PremiumScreen() {
  const { purchase, restore, isLoading } = usePurchase();

  const handlePurchase = async () => {
    try {
      const success = await purchase();
      if (success) {
        Alert.alert('購入完了', 'プレミアムにアップグレードされました！', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch {
      Alert.alert('エラー', '購入に失敗しました。しばらくしてからお試しください。');
    }
  };

  const handleRestore = async () => {
    try {
      const restored = await restore();
      if (restored) {
        Alert.alert('復元完了', '購入が復元されました！', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('復元失敗', '復元可能な購入が見つかりませんでした');
      }
    } catch {
      Alert.alert('エラー', '復元に失敗しました');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* タイトル */}
        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}>
            <Ionicons name="star" size={40} color="#F59E0B" />
          </View>
          <Text style={styles.title}>Putt Tempo Pro</Text>
          <Text style={styles.subtitle}>
            全ての機能をアンロックして{'\n'}練習を最大限に活用しよう
          </Text>
        </View>

        {/* 特典一覧 */}
        <View style={styles.features}>
          <FeatureItem
            icon="infinite"
            title="無制限のプリセット"
            description="お気に入りの設定を好きなだけ保存"
          />
          <FeatureItem
            icon="musical-notes"
            title="10種類の音色"
            description="全ての音色にアクセス可能"
          />
          <FeatureItem
            icon="stats-chart"
            title="詳細な統計"
            description="過去1年間の練習履歴を確認"
          />
          <FeatureItem
            icon="close-circle"
            title="広告なし"
            description="集中して練習に取り組める"
          />
        </View>

        {/* 価格 */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>買い切り価格</Text>
          <Text style={styles.price}>¥480</Text>
          <Text style={styles.priceNote}>一度の購入で永久利用可能</Text>
        </View>

        {/* 購入ボタン */}
        <Pressable onPress={handlePurchase} disabled={isLoading}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.purchaseButton, isLoading && styles.purchaseButtonDisabled]}
          >
            <Text style={styles.purchaseButtonText}>
              {isLoading ? '処理中...' : 'プレミアムを購入'}
            </Text>
          </LinearGradient>
        </Pressable>

        {/* 復元リンク */}
        <Pressable style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>以前の購入を復元</Text>
        </Pressable>

        {/* 注意事項 */}
        <Text style={styles.disclaimer}>
          お支払いはApple/Google アカウントに請求されます。{'\n'}
          購入後のキャンセル・返金はストアのポリシーに従います。
        </Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconPremium: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  featureIconFree: {
    backgroundColor: '#2A2A2A',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#888888',
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  price: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceNote: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  purchaseButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  restoreButton: {
    alignItems: 'center',
    padding: 16,
  },
  restoreButtonText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  disclaimer: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
