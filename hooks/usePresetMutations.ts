// hooks/usePresetMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SoundType } from '@/types';

interface CreatePresetInput {
  name: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
  isFavorite?: boolean;
}

interface UpdatePresetInput extends Partial<CreatePresetInput> {
  id: string;
}

const PRESETS_QUERY_KEY = 'presets';

export function useCreatePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePresetInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('custom_presets')
        .insert({
          user_id: user.id,
          name: input.name,
          bpm: input.bpm,
          back_ratio: input.backRatio,
          forward_ratio: input.forwardRatio,
          sound_type: input.soundType,
          is_favorite: input.isFavorite || false,
        })
        .select()
        .single();

      if (error) {
        // エラーコード変換
        if (error.code === '23505') {
          throw new Error('PRESET_NAME_DUPLICATE');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useUpdatePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePresetInput) => {
      if (!user) throw new Error('Not authenticated');

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.bpm !== undefined) updateData.bpm = input.bpm;
      if (input.backRatio !== undefined)
        updateData.back_ratio = input.backRatio;
      if (input.forwardRatio !== undefined)
        updateData.forward_ratio = input.forwardRatio;
      if (input.soundType !== undefined)
        updateData.sound_type = input.soundType;
      if (input.isFavorite !== undefined)
        updateData.is_favorite = input.isFavorite;

      const { data, error } = await supabase
        .from('custom_presets')
        .update(updateData)
        .eq('id', input.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('PRESET_NAME_DUPLICATE');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useDeletePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presetId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('custom_presets')
        .delete()
        .eq('id', presetId)
        .eq('user_id', user.id);

      if (error) throw error;

      return presetId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      presetId,
      isFavorite,
    }: {
      presetId: string;
      isFavorite: boolean;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('custom_presets')
        .update({
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', presetId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

// 便利なヘルパーフック
export function usePresetMutations() {
  const createPreset = useCreatePreset();
  const updatePreset = useUpdatePreset();
  const deletePreset = useDeletePreset();
  const toggleFavorite = useToggleFavorite();

  return {
    createPreset,
    updatePreset,
    deletePreset,
    toggleFavorite,
    isLoading:
      createPreset.isPending ||
      updatePreset.isPending ||
      deletePreset.isPending ||
      toggleFavorite.isPending,
  };
}
