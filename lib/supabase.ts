import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 環境変数からSupabaseのURLとanon keyを取得
// EASビルド対応: expoConfig または manifest から取得
const getExtra = () => {
  return (
    Constants.expoConfig?.extra ||
    Constants.manifest?.extra ||
    (Constants.manifest2?.extra as { expoClient?: { extra?: Record<string, unknown> } })?.expoClient?.extra ||
    {}
  );
};

const extra = getExtra();
const supabaseUrl = (extra?.supabaseUrl as string) || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = (extra?.supabaseAnonKey as string) || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file or app.json.'
  );
}

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // セッションを自動的にリフレッシュ
    autoRefreshToken: true,
    // セッションを永続化
    persistSession: true,
    // AsyncStorageを使用してセッションを永続化（アプリ再起動後も保持）
    storage: AsyncStorage,
  },
});
