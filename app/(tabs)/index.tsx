// app/(tabs)/index.tsx - ホーム画面

import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
import { usePremiumStatus } from '@/hooks/usePurchase';
import { useSavePracticeSession } from '@/hooks/usePracticeStats';
import { useSoundPlayer } from '@/hooks/useSoundPlayer';
import { OutputMode, Preset } from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

export default function HomeScreen() {
  const { isPremium } = usePremiumStatus();
  const { data: allPresets = [] } = useAllPresets();
  const { saveSession } = useSavePracticeSession();

  // サウンドプレイヤーの初期化
  useSoundPlayer();

  // 選択中のプリセット
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    DEFAULT_PRESETS[0].id
  );
  const selectedPreset = usePreset(selectedPresetId) || DEFAULT_PRESETS[0];

  // 出力モード
  const [outputMode, setOutputMode] = useState<OutputMode>('both');

  // プリセット選択モーダル
  const [isPresetModalVisible, setIsPresetModalVisible] = useState(false);

  // プリセットから設定値を取得
  const backRatio = selectedPreset.backRatio;
  const forwardRatio = selectedPreset.forwardRatio;
  const soundType =
    'sound_type' in selectedPreset ? selectedPreset.sound_type : 'click';

  // メトロノームセッション
  const { isPlaying, currentPhase, toggleSession } = useMetronomeSession(
    {
      bpm: selectedPreset.bpm,
      backRatio,
      forwardRatio,
      soundType,
      isVibrationEnabled: outputMode === 'vibration' || outputMode === 'both',
    },
    selectedPreset.isDefault ? null : selectedPreset.id,
    selectedPreset.name,
    async (session) => {
      // セッション終了時に記録を保存
      await saveSession(session);
    }
  );

  const handlePresetSelect = useCallback((preset: Preset) => {
    setSelectedPresetId(preset.id);
    setIsPresetModalVisible(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    toggleSession();
  }, [toggleSession]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>Putt Tempo</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/settings')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color="#888888" />
        </Pressable>
      </View>

      {/* メインコンテンツ */}
      <View style={styles.content}>
        {/* ビジュアルペンダム */}
        <Pendulum
          isPlaying={isPlaying}
          currentPhase={currentPhase}
          bpm={selectedPreset.bpm}
          backRatio={backRatio}
          forwardRatio={forwardRatio}
        />

        {/* BPM・比率表示 */}
        <View style={styles.displayContainer}>
          <Text style={styles.bpmText}>{selectedPreset.bpm} BPM</Text>
          <Text style={styles.ratioText}>
            {backRatio} : {forwardRatio}
          </Text>
        </View>

        {/* プリセット選択 */}
        <Pressable
          onPress={() => setIsPresetModalVisible(true)}
          style={styles.presetButton}
        >
          <View style={styles.presetButtonContent}>
            <Ionicons name="folder-outline" size={20} color="#888888" />
            <Text style={styles.presetButtonText}>{selectedPreset.name}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#888888" />
        </Pressable>

        {/* 再生/停止ボタン */}
        <View style={styles.playButtonContainer}>
          <PlayButton isPlaying={isPlaying} onPress={handleTogglePlay} />
        </View>

        {/* 出力モード切替 */}
        <OutputModeToggle mode={outputMode} onChange={setOutputMode} />
      </View>

      {/* 広告バナー（無料ユーザーのみ） */}
      {!isPremium && <BannerAd />}

      {/* プリセット選択モーダル */}
      <PresetSelector
        visible={isPresetModalVisible}
        presets={allPresets.length > 0 ? allPresets : DEFAULT_PRESETS}
        selectedId={selectedPresetId}
        onSelect={handlePresetSelect}
        onClose={() => setIsPresetModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  displayContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  bpmText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ratioText: {
    fontSize: 24,
    color: '#888888',
    marginTop: 8,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: 256,
  },
  presetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  presetButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  playButtonContainer: {
    marginVertical: 32,
  },
});
