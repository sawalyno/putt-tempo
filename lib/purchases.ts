// lib/purchases.ts - RevenueCat SDK初期化・購入処理

import { Platform } from 'react-native';
import Purchases, { 
  CustomerInfo, 
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

// API Keys（app.config.tsのextraから取得、または直接設定）
const API_KEYS = {
  ios: Constants.expoConfig?.extra?.revenueCatIosKey || '',
  android: Constants.expoConfig?.extra?.revenueCatAndroidKey || '',
};

// Entitlement ID（RevenueCatダッシュボードで設定）
const ENTITLEMENT_ID = 'premium';

let isInitialized = false;

/**
 * RevenueCat SDKを初期化
 * @param userId オプションのユーザーID（匿名の場合は省略）
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) {
    console.log('[Purchases] Already initialized');
    return;
  }

  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  
  if (!apiKey) {
    console.warn('[Purchases] API Key not configured. Running in mock mode.');
    return;
  }

  try {
    // デバッグモードの設定（開発時のみ）
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    // SDK初期化
    await Purchases.configure({
      apiKey,
      appUserID: userId || null, // nullの場合、RevenueCatが匿名IDを生成
    });

    isInitialized = true;
    console.log('[Purchases] Initialized successfully');
  } catch (error) {
    console.log('[Purchases] Initialization failed:', error);
  }
}

/**
 * 現在の顧客情報を取得
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    if (!isInitialized) {
      console.warn('[Purchases] Not initialized');
      return null;
    }
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.log('[Purchases] Failed to get customer info:', error);
    return null;
  }
}

/**
 * プレミアム状態を確認
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return false;
    
    // entitlementsにpremiumがあればプレミアム
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.log('[Purchases] Failed to check premium status:', error);
    return false;
  }
}

/**
 * 利用可能なオファリング（商品）を取得
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    if (!isInitialized) {
      console.warn('[Purchases] Not initialized');
      return null;
    }
    
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.log('[Purchases] Failed to get offerings:', error);
    return null;
  }
}

/**
 * プレミアムを購入
 */
export async function purchasePremium(): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
  try {
    if (!isInitialized) {
      throw new Error('Purchases not initialized');
    }

    const offerings = await Purchases.getOfferings();
    const currentOffering = offerings.current;
    
    if (!currentOffering) {
      throw new Error('No offerings available');
    }

    // 最初の利用可能なパッケージを購入（通常は1つのみ）
    const premiumPackage = currentOffering.availablePackages[0];
    
    if (!premiumPackage) {
      throw new Error('No packages available');
    }

    const { customerInfo } = await Purchases.purchasePackage(premiumPackage);
    
    // 購入成功後、プレミアムが有効か確認
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    return { success: isPremium, customerInfo };
  } catch (error: any) {
    // ユーザーがキャンセルした場合
    if (error.userCancelled) {
      return { success: false };
    }
    
    console.log('[Purchases] Purchase failed:', error);
    throw error;
  }
}

/**
 * 購入を復元
 */
export async function restorePurchases(): Promise<{ success: boolean; isPremium: boolean; customerInfo?: CustomerInfo }> {
  try {
    if (!isInitialized) {
      throw new Error('Purchases not initialized');
    }

    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    return { success: true, isPremium, customerInfo };
  } catch (error) {
    console.log('[Purchases] Restore failed:', error);
    throw error;
  }
}

/**
 * SDKが初期化されているか確認
 */
export function isPurchasesInitialized(): boolean {
  return isInitialized;
}

/**
 * API Keyが設定されているか確認
 */
export function hasApiKey(): boolean {
  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  return !!apiKey;
}
