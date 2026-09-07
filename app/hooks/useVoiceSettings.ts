import { useState, useEffect, useCallback } from "react";
import { VoiceSettings } from "@/app/types/idioms";

const DEFAULT_SETTINGS: VoiceSettings = {
  preferredVoice: "",
  voicePriority: [],
  defaultSpeed: 0.85,
  autoPlay: false,
};

interface UseVoiceSettingsResult {
  settings: VoiceSettings;
  currentSpeed: number;
  setCurrentSpeed: (speed: number) => void;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  saveSettings: () => void;
  showSpeedControl: boolean;
  toggleSpeedControl: () => void;
}

export const useVoiceSettings = (): UseVoiceSettingsResult => {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0.85);
  const [showSpeedControl, setShowSpeedControl] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("idiomVoiceSettings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          setCurrentSpeed(parsed.defaultSpeed || 0.85);
        } catch (e) {
          console.error("Failed to parse settings", e);
        }
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem("idiomVoiceSettings", JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }, [settings]);

  const toggleSpeedControl = useCallback(() => {
    setShowSpeedControl((prev) => !prev);
  }, []);

  return {
    settings,
    currentSpeed,
    setCurrentSpeed,
    updateSettings,
    saveSettings,
    showSpeedControl,
    toggleSpeedControl,
  };
};