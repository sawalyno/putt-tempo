// lib/purchases.ts

import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, CustomerInfo } from 'react-native-purchases';

// RevenueCat API Keys
// TODO: RevenueCatダッシュボードから取得したキーに置き換える
const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || 'appl_xxxxx',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || 'goog_xxxxx',
};

// Entitlement ID
export const PREMIUM_ENTITLEMENT = 'premium';

// 初期化フラグ
let isInitialized = false;

/**
 * RevenueCat SDKを初期化
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) return;

  try {
    const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

    // デバッグモードではログを出力
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    await Purchases.configure({
      apiKey,
      appUserID: userId,
    });

    isInitialized = true;
    console.log('RevenueCat initialized');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
}

/**
 * ユーザーIDを設定（ログイン時）
 */
export async function loginUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('Failed to login user:', error);
  }
}

/**
 * ユーザーをログアウト
 */
export async function logoutUser(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Failed to logout user:', error);
  }
}

/**
 * プレミアム状態を確認
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    return false;
  }
}

/**
 * 利用可能なオファリングを取得
 */
export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
}

/**
 * 購入処理
 */
export async function purchasePremium(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  try {
    const offerings = await Purchases.getOfferings();
    const premiumPackage = offerings.current?.availablePackages[0];

    if (!premiumPackage) {
      return { success: false, error: 'Package not found' };
    }

    const { customerInfo } = await Purchases.purchasePackage(premiumPackage);

    if (customerInfo.entitlements.active[PREMIUM_ENTITLEMENT]) {
      return { success: true, customerInfo };
    }

    return { success: false, error: 'Purchase completed but entitlement not active' };
  } catch (error: unknown) {
    // ユーザーキャンセルは エラーとして扱わない
    if (error && typeof error === 'object' && 'userCancelled' in error && (error as { userCancelled: boolean }).userCancelled) {
      return { success: false };
    }
    console.error('Purchase failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 購入復元
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();

    if (customerInfo.entitlements.active[PREMIUM_ENTITLEMENT]) {
      return { success: true, customerInfo };
    }

    return { success: false };
  } catch (error) {
    console.error('Restore failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
