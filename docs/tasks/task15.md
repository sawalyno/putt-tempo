# Task 15: ホーム画面実装

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task15 |
| フェーズ | Phase 6: UI実装 |
| 所要時間 | 2時間 |
| 依存タスク | task12（メトロノーム）, task13（プリセット取得） |

## 目的
メトロノームの操作を行うメイン画面を実装する。

## 画面仕様

### ワイヤーフレーム
```
┌─────────────────────────────────────┐
│ Putt Tempo                    [⚙️]  │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────────┐     │
│     │    🏌️ パター振り子     │     │  ← ビジュアルペンダム
│     │      アニメーション      │     │
│     └─────────────────────────┘     │
│                                     │
│           85 BPM                    │  ← BPM（大きく表示）
│           2 : 1                     │  ← 比率
│                                     │
│     ┌─────────────────────────┐     │
│     │  📁 スタンダード    ▼  │     │  ← プリセット選択
│     └─────────────────────────┘     │
│                                     │
│          ┌─────────────┐            │
│          │     ▶️      │            │  ← 再生/停止ボタン
│          └─────────────┘            │
│                                     │
│    [🔇 バイブ]     [📳 音]         │  ← 出力切り替え
│                                     │
├─────────────────────────────────────┤
│  [広告バナー]                       │  ← 無料ユーザーのみ
├─────────────────────────────────────┤
│  🏠     📁      📊      ⚙️        │
└─────────────────────────────────────┘
```

## 実装

### app/(tabs)/index.tsx
```typescript
// app/(tabs)/index.tsx

import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Pendulum } from '@/components/Pendulum';
import { PlayButton } from '@/components/PlayButton';
import { PresetSelector } from '@/components/PresetSelector';
import { OutputModeToggle } from '@/components/OutputModeToggle';
import { BannerAd } from '@/components/ads/BannerAd';
import { useMetronomeSession } from '@/hooks/useMetronomeSession';
import { useAllPresets, usePreset } from '@/hooks/usePresets';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumStatus } from '@/hooks/usePurchase';
import { OutputMode, Preset } from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  const { data: allPresets = [] } = useAllPresets();

  // 選択中のプリセット
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    DEFAULT_PRESETS[0].id
  );
  const selectedPreset = usePreset(selectedPresetId) || DEFAULT_PRESETS[0];

  // 出力モード
  const [outputMode, setOutputMode] = useState<OutputMode>('sound');

  // メトロノームセッション
  const {
    isPlaying,
    currentPhase,
    toggleSession,
  } = useMetronomeSession(
    {
      bpm: selectedPreset.bpm,
      backRatio: selectedPreset.backRatio ?? selectedPreset.back_ratio,
      forwardRatio: selectedPreset.forwardRatio ?? selectedPreset.forward_ratio,
      soundType: selectedPreset.sound_type || 'click',
      isVibrationEnabled: outputMode === 'vibration' || outputMode === 'both',
    },
    selectedPreset.isDefault ? null : selectedPreset.id,
    selectedPreset.name,
    async (session) => {
      // セッション終了時に記録を保存
      if (session.durationSeconds >= 10) {
        // save_practice_session RPC呼び出し
      }
    }
  );

  // プリセット選択モーダル
  const [isPresetModalVisible, setIsPresetModalVisible] = useState(false);

  const handlePresetSelect = useCallback((preset: Preset) => {
    setSelectedPresetId(preset.id);
    setIsPresetModalVisible(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    toggleSession();
  }, [toggleSession]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-white text-xl font-bold">Putt Tempo</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          className="p-2"
        >
          <Ionicons name="settings-outline" size={24} color="#888888" />
        </Pressable>
      </View>

      {/* メインコンテンツ */}
      <View className="flex-1 items-center justify-center px-4">
        {/* ビジュアルペンダム */}
        <Pendulum
          isPlaying={isPlaying}
          currentPhase={currentPhase}
          bpm={selectedPreset.bpm}
          backRatio={selectedPreset.backRatio ?? selectedPreset.back_ratio}
          forwardRatio={selectedPreset.forwardRatio ?? selectedPreset.forward_ratio}
        />

        {/* BPM・比率表示 */}
        <View className="items-center my-6">
          <Text className="text-white text-5xl font-bold">
            {selectedPreset.bpm} BPM
          </Text>
          <Text className="text-gray-400 text-2xl mt-2">
            {selectedPreset.backRatio ?? selectedPreset.back_ratio} : {selectedPreset.forwardRatio ?? selectedPreset.forward_ratio}
          </Text>
        </View>

        {/* プリセット選択 */}
        <Pressable
          onPress={() => setIsPresetModalVisible(true)}
          className="bg-surface rounded-lg px-4 py-3 w-64 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="folder-outline" size={20} color="#888888" />
            <Text className="text-white ml-2">{selectedPreset.name}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#888888" />
        </Pressable>

        {/* 再生/停止ボタン */}
        <View className="my-8">
          <PlayButton
            isPlaying={isPlaying}
            onPress={handleTogglePlay}
          />
        </View>

        {/* 出力モード切替 */}
        <OutputModeToggle
          mode={outputMode}
          onChange={setOutputMode}
        />
      </View>

      {/* 広告バナー（無料ユーザーのみ） */}
      {!isPremium && <BannerAd />}

      {/* プリセット選択モーダル */}
      <PresetSelector
        visible={isPresetModalVisible}
        presets={allPresets}
        selectedId={selectedPresetId}
        onSelect={handlePresetSelect}
        onClose={() => setIsPresetModalVisible(false)}
      />
    </SafeAreaView>
  );
}
```

## 作成するコンポーネント

1. **PlayButton** - 再生/停止の大きなボタン
2. **OutputModeToggle** - 音/バイブ切替トグル
3. **PresetSelector** - プリセット選択モーダル（ボトムシート）

## 完了条件
- [ ] ホーム画面が表示される
- [ ] ビジュアルペンダムエリアが表示される（アニメーションはtask21）
- [ ] BPMと比率が表示される
- [ ] プリセット選択が動作する
- [ ] 再生/停止ボタンが動作する
- [ ] 出力モード切替が動作する
- [ ] 無料ユーザーに広告が表示される

## 注意事項
- 振り子アニメーションは task21 で実装
- 練習記録の保存は10秒以上のセッションのみ
