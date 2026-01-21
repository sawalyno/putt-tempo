// app/(tabs)/index.tsx - ホーム画面（mockデザイン準拠）

import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Pendulum } from '@/components/Pendulum';
import { PresetSelector } from '@/components/PresetSelector';
import { BannerAd } from '@/components/ads/BannerAd';
import { useMetronomeSession } from '@/hooks/useMetronomeSession';
import { useAllPresets, usePreset } from '@/hooks/usePresets';
import { usePremiumStatus } from '@/hooks/usePurchase';
import { useSavePracticeSession } from '@/hooks/usePracticeStats';
import { OutputMode, Preset } from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremiumStatus();
  const { data: allPresets = [] } = useAllPresets();
  const { saveSession } = useSavePracticeSession();

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

  const toggleOutputMode = (mode: 'vibration' | 'sound') => {
    if (mode === 'vibration') {
      setOutputMode((prev) =>
        prev === 'vibration' ? 'sound' : prev === 'both' ? 'sound' : 'both'
      );
    } else {
      setOutputMode((prev) =>
        prev === 'sound' ? 'vibration' : prev === 'both' ? 'vibration' : 'both'
      );
    }
  };

  const isVibrationEnabled = outputMode === 'vibration' || outputMode === 'both';
  const isSoundEnabled = outputMode === 'sound' || outputMode === 'both';

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Putt Tempo</Text>
      </View>

      {/* 振り子エリア */}
      <View style={styles.pendulumArea}>
        <Pendulum
          isPlaying={isPlaying}
          currentPhase={currentPhase}
          bpm={selectedPreset.bpm}
          backRatio={backRatio}
          forwardRatio={forwardRatio}
        />

        {/* BPM・比率表示 */}
        <View style={styles.displayContainer}>
          <View style={styles.bpmContainer}>
            <Text style={styles.bpmText}>{selectedPreset.bpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>
          <View style={styles.ratioContainer}>
            <View style={styles.ratioDivider} />
            <Text style={styles.ratioText}>
              {backRatio} : {forwardRatio} Ratio
            </Text>
            <View style={styles.ratioDivider} />
          </View>
        </View>
      </View>

      {/* 下部コントロールパネル */}
      <View style={styles.controlPanel}>
        {/* プリセット選択 */}
        <View style={styles.presetSection}>
          <Text style={styles.presetLabel}>プリセット</Text>
          <Pressable
            onPress={() => setIsPresetModalVisible(true)}
            style={styles.presetButton}
          >
            <Text style={styles.presetButtonText}>{selectedPreset.name}</Text>
            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.4)" />
          </Pressable>
        </View>

        {/* コントロールボタン */}
        <View style={styles.controlButtons}>
          {/* バイブボタン */}
          <View style={styles.controlItem}>
            <Pressable
              style={[
                styles.controlButton,
                !isVibrationEnabled && styles.controlButtonInactive,
              ]}
              onPress={() => toggleOutputMode('vibration')}
            >
              <Ionicons
                name="phone-portrait"
                size={24}
                color={isVibrationEnabled ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)'}
              />
            </Pressable>
            <Text style={[styles.controlLabel, !isVibrationEnabled && styles.controlLabelInactive]}>
              バイブ
            </Text>
          </View>

          {/* 再生ボタン */}
          <Pressable
            onPress={handleTogglePlay}
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.playButtonPressed,
            ]}
          >
            <Ionicons
              name={isPlaying ? 'stop' : 'play'}
              size={48}
              color="#ffffff"
              style={!isPlaying && { marginLeft: 4 }}
            />
          </Pressable>

          {/* 音ボタン */}
          <View style={styles.controlItem}>
            <Pressable
              style={[
                styles.controlButton,
                isSoundEnabled && styles.controlButtonActive,
              ]}
              onPress={() => toggleOutputMode('sound')}
            >
              <Ionicons
                name="volume-high"
                size={24}
                color={isSoundEnabled ? '#2a73ea' : 'rgba(255,255,255,0.3)'}
              />
            </Pressable>
            <Text style={[styles.controlLabel, isSoundEnabled && styles.controlLabelActive]}>
              音
            </Text>
          </View>
        </View>
      </View>

      {/* 広告 + タブバースペース */}
      <View style={styles.bottomArea}>
        {!isPremium && (
          <View style={styles.adContainer}>
            <BannerAd />
          </View>
        )}
      </View>

      {/* プリセット選択モーダル */}
      <PresetSelector
        visible={isPresetModalVisible}
        presets={allPresets.length > 0 ? allPresets : DEFAULT_PRESETS}
        selectedId={selectedPresetId}
        onSelect={handlePresetSelect}
        onClose={() => setIsPresetModalVisible(false)}
      />

      {/* 背景グロー効果 */}
      <View style={styles.glowTopLeft} pointerEvents="none" />
      <View style={styles.glowBottomRight} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  pendulumArea: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  displayContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bpmText: {
    fontSize: 60,
    fontFamily: 'Manrope_800ExtraBold',
    color: '#ffffff',
    letterSpacing: -2,
  },
  bpmLabel: {
    fontSize: 18,
    fontFamily: 'Manrope_500Medium',
    color: 'rgba(255,255,255,0.4)',
    marginLeft: 4,
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  ratioDivider: {
    width: 16,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ratioText: {
    fontSize: 20,
    fontFamily: 'Manrope_700Bold',
    color: '#2a73ea',
  },
  controlPanel: {
    flex: 1,
    backgroundColor: '#16181b',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  presetSection: {
    marginBottom: 24,
  },
  presetLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 4,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#2d343d',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  presetButtonText: {
    fontSize: 14,
    fontFamily: 'Manrope_700Bold',
    color: '#ffffff',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  controlItem: {
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#2d343d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonInactive: {
    opacity: 0.6,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(42, 115, 234, 0.2)',
    borderColor: 'rgba(42, 115, 234, 0.3)',
  },
  controlLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controlLabelInactive: {
    opacity: 0.6,
  },
  controlLabelActive: {
    color: '#2a73ea',
  },
  playButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2a73ea',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2a73ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  playButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  bottomArea: {
    backgroundColor: '#16181b',
    paddingBottom: 80, // タブバーの高さ分
  },
  adContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(5, 5, 5, 0.5)',
  },
  glowTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 150,
    backgroundColor: 'rgba(42, 115, 234, 0.1)',
    borderRadius: 100,
    zIndex: -1,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: 50,
    right: -30,
    width: 200,
    height: 150,
    backgroundColor: 'rgba(42, 115, 234, 0.05)',
    borderRadius: 100,
    zIndex: -1,
  },
});
