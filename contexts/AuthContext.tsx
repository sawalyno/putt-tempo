import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeUserData: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const isLoggingOut = useRef(false); // ログアウト処理中フラグ

  // ユーザーデータの初期化（RPC呼び出し）
  const initializeUserData = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('initialize_user');

      if (error) {
        console.error('ユーザーデータ初期化エラー:', error);
        throw error;
      }

      if (data?.success) {
        console.log('ユーザーデータ初期化成功:', data.user_id);
      }
    } catch (err) {
      console.error('ユーザーデータ初期化中にエラーが発生しました:', err);
      // エラーが発生してもアプリの動作は継続
    }
  }, []);

  // 匿名認証
  const signInAnonymously = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('匿名認証エラー:', error);
        throw error;
      }

      if (data.user) {
        console.log('匿名認証成功:', data.user.id);
        // ユーザーデータを初期化
        await initializeUserData();
      }
    } catch (err) {
      console.error('匿名認証中にエラーが発生しました:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [initializeUserData]);

  // ログアウト（ログアウト後に自動で匿名認証を実行）
  const signOut = useCallback(async () => {
    if (isLoggingOut.current) {
      console.log('既にログアウト処理中');
      return;
    }
    
    isLoggingOut.current = true;
    
    try {
      setLoading(true);
      
      // 1. ログアウト実行
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('ログアウトエラー:', error);
        throw error;
      }
      console.log('ログアウト成功');

      // 2. React Queryのキャッシュをクリア
      queryClient.clear();
      console.log('キャッシュクリア完了');

      // 3. 匿名認証を実行（onAuthStateChangeに依存しない）
      const { data, error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        console.error('匿名認証エラー:', signInError);
        throw signInError;
      }
      
      if (data.user) {
        console.log('新規匿名ユーザー作成:', data.user.id);
        setSession(data.session);
        setUser(data.user);
        
        // 4. ユーザーデータを初期化
        await initializeUserData();
      }
    } catch (err) {
      console.error('ログアウト処理中にエラーが発生しました:', err);
      throw err;
    } finally {
      setLoading(false);
      isLoggingOut.current = false;
    }
  }, [queryClient, initializeUserData]);

  // ユーザー情報をリフレッシュ
  const refreshUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('ユーザー情報取得エラー:', error);
        throw error;
      }

      setUser(user);
      console.log('ユーザー情報リフレッシュ成功');
    } catch (err) {
      console.error('ユーザー情報リフレッシュ中にエラーが発生しました:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    // 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setInitialized(true);

      // セッションがない場合は匿名認証を実行
      if (!session) {
        signInAnonymously().catch((err) => {
          console.error('初回匿名認証エラー:', err);
        });
      } else {
        // セッションがある場合はユーザーデータを初期化（未初期化の場合）
        initializeUserData().catch((err) => {
          console.error('ユーザーデータ初期化エラー:', err);
        });
      }
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('認証状態変更:', event, session?.user?.id);
      
      // ログアウト処理中は状態更新をスキップ（signOutで直接処理するため）
      if (isLoggingOut.current) {
        console.log('ログアウト処理中のため状態更新スキップ');
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session) {
        // ログイン時はユーザーデータを初期化
        await initializeUserData();
      }
      // SIGNED_OUTはsignOut関数内で処理するため、ここでは何もしない
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [signInAnonymously, initializeUserData]);

  const value: AuthContextType = {
    session,
    user,
    loading,
    initialized,
    signInAnonymously,
    signOut,
    initializeUserData,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
