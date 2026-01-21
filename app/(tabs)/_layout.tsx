// app/(tabs)/_layout.tsx - タブレイアウト（mockデザイン準拠）

import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={80} style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#2a73ea',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="presets"
        options={{
          title: 'プリセット',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'list' : 'list-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '統計',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons name={name} size={24} color={color} />;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(5, 5, 5, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 8,
    paddingBottom: 24,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    marginTop: 4,
  },
});
