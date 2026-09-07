import { useState, useEffect, useCallback, useRef } from "react";
import { VoiceSettings } from "@/app/types/idioms";

interface UseVoiceSynthesisResult {
  isSpeaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
  speak: (text: string, speed?: number) => void;
  stop: () => void;
  getBestVoice: () => SpeechSynthesisVoice | null;
  setVoices: (voices: SpeechSynthesisVoice[]) => void;
}

export const useVoiceSynthesis = (
  settings: VoiceSettings
): UseVoiceSynthesisResult => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    // Priority list from settings
    for (const priorityVoice of settings.voicePriority) {
      const voice = availableVoices.find((v) => v.name === priorityVoice);
      if (voice) return voice;
    }

    // Fallback voices
    const fallbackVoices = [
      "Google UK English Female",
      "Google US English Female",
      "Google UK English Male",
      "Google US English Male",
      "Samantha",
      "Alex",
      "Microsoft David",
      "Microsoft Zira",
    ];

    for (const voiceName of fallbackVoices) {
      const voice = availableVoices.find((v) => v.name.includes(voiceName));
      if (voice) return voice;
    }

    return availableVoices.find((v) => v.lang.startsWith("en-")) || null;
  }, [availableVoices, settings.voicePriority]);

  const speak = useCallback(
    (text: string, speed?: number) => {
      if (!text) return;

      // Stop any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed || settings.defaultSpeed || 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1;
      utterance.lang = "en-US";

      const bestVoice = getBestVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [getBestVoice, settings.defaultSpeed]
  );

  const stop = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    currentUtteranceRef.current = null;
  }, []);

  return {
    isSpeaking,
    availableVoices,
    speak,
    stop,
    getBestVoice,
    setVoices: setAvailableVoices,
  };
};