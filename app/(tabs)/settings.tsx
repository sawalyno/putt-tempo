// app/(tabs)/settings.tsx - 設定画面

import { View, Text, Pressable, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { useAuth } from '@/contexts/AuthContext';
import { usePurchase } from '@/hooks/usePurchase';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  iconColor?: string;
  showArrow?: boolean;
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
  iconColor = '#888888',
  showArrow = true,
}: SettingItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={[styles.itemIcon, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#888888" />
        )}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { isPremium, restore, isLoading } = usePurchase();

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleSignOut = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const handleRestore = async () => {
    try {
      const restored = await restore();
      if (restored) {
        Alert.alert('復元完了', '購入が復元されました');
      } else {
        Alert.alert('復元失敗', '復元可能な購入が見つかりませんでした');
      }
    } catch {
      Alert.alert('エラー', '復元に失敗しました');
    }
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@example.com?subject=Putt Tempo お問い合わせ');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* アカウントセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント</Text>
          <View style={styles.card}>
            <SettingItem
              icon="person"
              label="ユーザーID"
              value={user?.id?.slice(0, 8) || '-'}
              iconColor="#3B82F6"
              showArrow={false}
            />
            <SettingItem
              icon="mail"
              label="メールアドレス"
              value={user?.email || '未連携'}
              iconColor="#10B981"
              onPress={() => !user?.email && router.push('/settings/email')}
            />
          </View>
        </View>

        {/* プランセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>プラン</Text>
          <View style={styles.card}>
            <SettingItem
              icon="star"
              label="現在のプラン"
              value={isPremium ? 'プレミアム' : '無料'}
              iconColor="#F59E0B"
              onPress={() => !isPremium && router.push('/premium')}
            />
            {!isPremium && (
              <SettingItem
                icon="refresh"
                label="購入を復元"
                iconColor="#8B5CF6"
                onPress={handleRestore}
              />
            )}
          </View>
        </View>

        {/* アプリ情報セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          <View style={styles.card}>
            <SettingItem
              icon="information-circle"
              label="バージョン"
              value={appVersion}
              iconColor="#888888"
              showArrow={false}
            />
            <SettingItem
              icon="document-text"
              label="利用規約"
              iconColor="#888888"
              onPress={() => Linking.openURL('https://example.com/terms')}
            />
            <SettingItem
              icon="shield-checkmark"
              label="プライバシーポリシー"
              iconColor="#888888"
              onPress={() => Linking.openURL('https://example.com/privacy')}
            />
            <SettingItem
              icon="chatbubble"
              label="お問い合わせ"
              iconColor="#888888"
              onPress={handleContact}
            />
          </View>
        </View>

        {/* ログアウト */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>ログアウト</Text>
        </Pressable>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValue: {
    fontSize: 14,
    color: '#888888',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
