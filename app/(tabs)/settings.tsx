// app/(tabs)/settings.tsx - 設定画面（ローカル保存版）

import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePremiumStatus, usePurchase } from '@/hooks/usePurchase';

export default function SettingsScreen() {
  const { isPremium } = usePremiumStatus();
  const { restore: restorePurchases, resetToFree } = usePurchase();

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || 
                      Constants.expoConfig?.android?.versionCode || '1';

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('完了', '購入の復元が完了しました');
    } catch (error) {
      Alert.alert('エラー', '購入の復元に失敗しました');
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('エラー', 'リンクを開けませんでした');
    });
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Ionicons name="golf" size={28} color="#2a73ea" />
            <Text style={styles.headerTitle}>Putt Tempo</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ページタイトル */}
        <Text style={styles.pageTitle}>設定</Text>

        {/* プランセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>プラン</Text>
          <View style={styles.card}>
            <Pressable 
              style={styles.menuItem}
              onPress={() => !isPremium && router.push('/premium')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons 
                  name="trophy" 
                  size={20} 
                  color={isPremium ? '#F59E0B' : '#6b7280'} 
                />
                <Text style={styles.menuItemText}>
                  {isPremium ? 'プレミアムプラン' : '無料プラン'}
                </Text>
              </View>
              {!isPremium && (
                <Text style={styles.menuItemAction}>プレミアムにアップグレード →</Text>
              )}
            </Pressable>
            {/* 開発用: 無料プランに戻す */}
            {isPremium && __DEV__ && (
              <>
                <View style={styles.menuItemDivider} />
                <Pressable 
                  style={styles.menuItem}
                  onPress={() => {
                    Alert.alert(
                      '開発用',
                      '無料プランに戻しますか？',
                      [
                        { text: 'キャンセル', style: 'cancel' },
                        { 
                          text: '戻す', 
                          style: 'destructive',
                          onPress: async () => {
                            await resetToFree();
                            Alert.alert('完了', '無料プランに戻しました');
                          }
                        },
                      ]
                    );
                  }}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name="refresh" size={20} color="#ef4444" />
                    <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
                      無料プランに戻す（DEV）
                    </Text>
                  </View>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* アプリについてセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリについて</Text>
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>バージョン</Text>
              <Text style={styles.menuItemValue}>v{appVersion} ({buildNumber})</Text>
            </View>
            <View style={styles.menuItemDivider} />
            <Pressable 
              style={styles.menuItem}
              onPress={() => openLink('https://example.com/terms')}
            >
              <Text style={styles.menuItemText}>利用規約</Text>
              <Ionicons name="open-outline" size={16} color="#6b7280" />
            </Pressable>
            <View style={styles.menuItemDivider} />
            <Pressable 
              style={styles.menuItem}
              onPress={() => openLink('https://example.com/privacy')}
            >
              <Text style={styles.menuItemText}>プライバシーポリシー</Text>
              <Ionicons name="open-outline" size={16} color="#6b7280" />
            </Pressable>
            <View style={styles.menuItemDivider} />
            <Pressable 
              style={styles.menuItem}
              onPress={() => openLink('mailto:support@example.com')}
            >
              <Text style={styles.menuItemText}>お問い合わせ</Text>
              <Ionicons name="mail-outline" size={16} color="#6b7280" />
            </Pressable>
          </View>
        </View>

        {/* 購入を復元 */}
        <View style={styles.restoreContainer}>
          <Pressable onPress={handleRestorePurchases}>
            <Text style={styles.restoreText}>🔄 購入を復元</Text>
          </Pressable>
        </View>

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
    backgroundColor: 'rgba(5, 5, 5, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
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
  pageTitle: {
    fontSize: 32,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 24,
    marginTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
    color: '#ffffff',
  },
  menuItemValue: {
    fontSize: 14,
    fontFamily: 'Manrope_400Regular',
    color: '#6b7280',
  },
  menuItemAction: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#F59E0B',
  },
  menuItemDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  restoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  restoreText: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: '#6b7280',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(107, 114, 128, 0.3)',
    paddingVertical: 8,
  },
  bottomSpacer: {
    height: 80,
  },
});
