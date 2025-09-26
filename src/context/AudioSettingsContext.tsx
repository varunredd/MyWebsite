import React, { createContext, useContext, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface AudioSettingsContextType {
  bgmEnabled: boolean;
  bgmVolume: number;   // 0..1
  bgmMuted: boolean;
  setBgmEnabled: (value: boolean) => void;
  setBgmVolume: (value: number) => void;
  setBgmMuted: (value: boolean) => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined);

export const AudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useSettings();

  const setBgmEnabled = useCallback((value: boolean) => {
    console.log('[AUDIO] setBgmEnabled:', value);
    updateSettings('audio.bgm.enabled', value);
  }, [updateSettings]);

  const setBgmVolume = useCallback((value: number) => {
    console.log('[AUDIO] setBgmVolume:', value);
    updateSettings('audio.bgm.volume', Math.max(0, Math.min(1, value)));
  }, [updateSettings]);

  const setBgmMuted = useCallback((value: boolean) => {
    console.log('[AUDIO] setBgmMuted:', value);
    // We'll treat volume 0 as muted, so set volume to 0 when muted
    if (value) {
      updateSettings('audio.bgm.volume', 0);
    } else {
      // When unmuting, set to a reasonable default if currently 0
      if (settings.audio.bgm.volume === 0) {
        updateSettings('audio.bgm.volume', 0.4);
      }
    }
  }, [updateSettings, settings.audio.bgm.volume]);

  const contextValue: AudioSettingsContextType = {
    bgmEnabled: settings.audio.bgm.enabled,
    bgmVolume: settings.audio.bgm.volume,
    bgmMuted: settings.audio.bgm.volume === 0,
    setBgmEnabled,
    setBgmVolume,
    setBgmMuted,
  };

  return (
    <AudioSettingsContext.Provider value={contextValue}>
      {children}
    </AudioSettingsContext.Provider>
  );
};

export const useAudioSettings = (): AudioSettingsContextType => {
  const context = useContext(AudioSettingsContext);
  if (context === undefined) {
    throw new Error('useAudioSettings must be used within an AudioSettingsProvider');
  }
  return context;
};