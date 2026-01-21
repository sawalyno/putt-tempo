import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

/**
 * タブナビゲーション設定
 * 
 * TODO: アプリに合わせてタブを追加・変更
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
