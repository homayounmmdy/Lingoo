export interface Idiom {
  idiom: string;
  fonetic: string;
  persian: string;
  example: string;
  exampleMeaning: string;
}

export interface VoiceSettings {
  preferredVoice: string;
  voicePriority: string[];
  defaultSpeed: number;
  autoPlay: boolean;
}

export type SortOrder = 'order' | 'random';

export const SPEED_OPTIONS = [
  { label: "🐢 خیلی آهسته", value: 0.5 },
  { label: "🐢 آهسته", value: 0.7 },
  { label: "⚡ معمولی", value: 0.85 },
  { label: "🐇 تند", value: 1.0 },
  { label: "🐇 خیلی تند", value: 1.2 },
];
