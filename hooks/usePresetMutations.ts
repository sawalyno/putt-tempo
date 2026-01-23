// hooks/usePresetMutations.ts - ローカルストレージベースのプリセット操作

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addCustomPreset, 
  updateCustomPreset, 
  deleteCustomPreset 
} from '@/lib/storage';
import { SoundType } from '@/types';

interface CreatePresetInput {
  name: string;
  bpm: number;
  backRatio: number;
  forwardRatio: number;
  soundType: SoundType;
}

interface UpdatePresetInput extends Partial<CreatePresetInput> {
  id: string;
}

const PRESETS_QUERY_KEY = 'presets';

export function useCreatePreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePresetInput) => {
      const newPreset = await addCustomPreset({
        name: input.name,
        bpm: input.bpm,
        backRatio: input.backRatio,
        forwardRatio: input.forwardRatio,
        soundType: input.soundType,
      });
      return newPreset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useUpdatePreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePresetInput) => {
      const updates: any = {};
      
      if (input.name !== undefined) updates.name = input.name;
      if (input.bpm !== undefined) updates.bpm = input.bpm;
      if (input.backRatio !== undefined) updates.backRatio = input.backRatio;
      if (input.forwardRatio !== undefined) updates.forwardRatio = input.forwardRatio;
      if (input.soundType !== undefined) updates.soundType = input.soundType;

      const updatedPreset = await updateCustomPreset(input.id, updates);
      
      if (!updatedPreset) {
        throw new Error('PRESET_NOT_FOUND');
      }
      
      return updatedPreset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESETS_QUERY_KEY] });
    },
  });
}

export function useDeletePreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presetId: string) => {
      const success = await deleteCustomPreset(presetId);
      
      if (!success) {
        throw new Error('PRESET_NOT_FOUND');
      }
      
      return presetId;
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

  return {
    createPreset,
    updatePreset,
    deletePreset,
    isLoading:
      createPreset.isPending ||
      updatePreset.isPending ||
      deletePreset.isPending,
  };
}
