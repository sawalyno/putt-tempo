// app/premium.tsx - プレミアムアップグレード画面（mockデザイン準拠）

import { View, Text, Pressable, StyleSheet, Alert, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { usePurchase } from '@/hooks/usePurchase';

// 特典リスト
const FEATURES = [
  {
    title: 'プリセット無制限',
    description: '練習内容に合わせて保存が可能',
  },
  {
    title: '10種類のサウンド',
    description: '集中力を高める最適な音を選択',
  },
  {
    title: '広告非表示',
    description: '邪魔されずにトレーニングに没頭',
  },
];

export default function PremiumScreen() {
  const { purchase, restore, isLoading } = usePurchase();

  const handlePurchase = async () => {
    try {
      await purchase();
      Alert.alert('成功', 'プレミアムへのアップグレードが完了しました！', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      if (error?.userCancelled) {
        return;
      }
      Alert.alert('エラー', '購入処理に失敗しました。もう一度お試しください。');
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert('完了', '購入の復元が完了しました', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('エラー', '復元に失敗しました');
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <View style={styles.dragHandle} />
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </Pressable>
        </View>

        {/* タイトル */}
        <View style={styles.titleContainer}>
          <Text style={styles.premiumLabel}>⭐ プレミアム ⭐</Text>
          <Text style={styles.title}>もっと自由に練習しよう</Text>
        </View>

        {/* グラフィック */}
        <View style={styles.graphicContainer}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.2)', 'rgba(42, 115, 234, 0.1)', 'transparent']}
            style={styles.graphicGradient}
          >
            <View style={styles.soundWave}>
              <View style={[styles.soundBar, { height: 32 }]} />
              <View style={[styles.soundBar, styles.soundBarCenter, { height: 48 }]} />
              <View style={[styles.soundBar, { height: 32 }]} />
            </View>
          </LinearGradient>
        </View>

        {/* 特典リスト */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={20} color="#22c55e" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.purchaseButton,
              pressed && styles.purchaseButtonPressed,
              isLoading && styles.purchaseButtonDisabled,
            ]}
            onPress={handlePurchase}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.purchaseButtonTitle}>今すぐアップグレード</Text>
                <Text style={styles.purchaseButtonPrice}>¥480（買い切り）</Text>
              </>
            )}
          </Pressable>

          {/* 復元・注記 */}
          <View style={styles.footer}>
            <Pressable onPress={handleRestore}>
              <Text style={styles.restoreText}>購入を復元</Text>
            </Pressable>
            <Text style={styles.noteText}>一度購入すれば永久に利用可能</Text>
            <View style={styles.legalLinks}>
              <Pressable onPress={() => openLink('https://example.com/terms')}>
                <Text style={styles.legalLink}>利用規約</Text>
              </Pressable>
              <Pressable onPress={() => openLink('https://example.com/privacy')}>
                <Text style={styles.legalLink}>プライバシーポリシー</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#4b5563',
    borderRadius: 3,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  premiumLabel: {
    fontSize: 28,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#F59E0B',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(245, 158, 11, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  graphicGradient: {
    width: '100%',
    height: 128,
    borderRadius: 12,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  soundWave: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 48,
  },
  soundBar: {
    width: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.6)',
    borderRadius: 3,
  },
  soundBarCenter: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featureCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: '#9ca3af',
    marginTop: 2,
  },
  ctaContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  purchaseButton: {
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  purchaseButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  purchaseButtonPrice: {
    fontSize: 15,
    fontFamily: 'Manrope_500Medium',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  restoreText: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: '#9ca3af',
  },
  noteText: {
    fontSize: 11,
    fontFamily: 'Manrope_500Medium',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  legalLinks: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  legalLink: {
    fontSize: 10,
    fontFamily: 'Manrope_400Regular',
    color: '#4b5563',
  },
});
