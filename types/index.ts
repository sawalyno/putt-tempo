/**
 * 型定義ファイル
 * 
 * アプリで使用する型をここに定義します
 */

// ユーザー設定（テンプレート標準）
export interface UserSettings {
  user_id: string;
  // TODO: アプリ固有の設定項目を追加
  sound_volume: number;
  vibration_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// TODO: アプリ固有の型をここに追加
// export interface YourType {
//   id: string;
//   // ...
// }
