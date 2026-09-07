export const getBestVoice = (
  availableVoices: SpeechSynthesisVoice[],
  voicePriority: string[]
): SpeechSynthesisVoice | null => {
  // Priority voices
  for (const priorityVoice of voicePriority) {
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
};

export const getSpeedLabel = (speed: number, options: any[]) => {
  const option = options.find((opt) => opt.value === speed);
  return option ? option.label : "⚡ معمولی";
};

export const isSpeechSupported = (): boolean => {
  return typeof window !== "undefined" && "speechSynthesis" in window;
};