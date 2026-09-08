export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface DictionaryEntry {
  word: string;
  meaning: string;
  phonetic: string;
  example: string;
  exampleMeaning: string;
  cefrLevel: CEFRLevel;
}

export interface TSTNode {
  char: string;
  left: TSTNode | null;
  middle: TSTNode | null;
  right: TSTNode | null;
  isEndOfWord: boolean;
  data: DictionaryEntry | null;
}

export interface DictionaryJSON {
  version: string;
  lastUpdated: string;
  entries: DictionaryEntry[];
}