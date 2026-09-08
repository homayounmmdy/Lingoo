import {
  CEFRLevel,
  DictionaryEntry,
  DictionaryJSON,
} from "@/app/types/dictionary";
import { TernarySearchTree } from "./TernarySearchTree";

const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export class DictionaryManager {
  private tree: TernarySearchTree;
  private cefrIndex: Map<CEFRLevel, Set<string>>;

  constructor() {
    this.tree = new TernarySearchTree();
    this.cefrIndex = new Map(CEFR_ORDER.map((l) => [l, new Set()]));
  }

  /* ───── LOAD FROM JSON ───── */

  loadFromJSON(json: DictionaryJSON): void {
    this.tree = new TernarySearchTree();
    this.cefrIndex = new Map(CEFR_ORDER.map((l) => [l, new Set()]));

    for (const entry of json.entries) {
      this.addEntry(entry);
    }

    console.log(
      `✅ Loaded ${this.tree.size} words from JSON (v${json.version})`,
    );
  }

  /* ───── ADD / REMOVE ───── */

  addEntry(entry: DictionaryEntry): void {
    this.tree.insert(entry);
    this.cefrIndex.get(entry.cefrLevel)?.add(entry.word.toLowerCase());
  }

  removeEntry(word: string): boolean {
    const existing = this.tree.search(word);
    if (!existing) return false;

    this.cefrIndex.get(existing.cefrLevel)?.delete(word.toLowerCase());
    return this.tree.delete(word);
  }

  /* ───── SEARCH ───── */

  /** Exact word lookup */
  lookup(word: string): DictionaryEntry | null {
    return this.tree.search(word);
  }

  /** Autocomplete / prefix search */
  autocomplete(prefix: string, limit = 15): DictionaryEntry[] {
    return this.tree.searchByPrefix(prefix, limit);
  }

  /** Wildcard: "r?n" → run, ran | "r*n" → rain, reason … */
  wildcard(pattern: string, limit = 20): DictionaryEntry[] {
    return this.tree.wildcardSearch(pattern, limit);
  }

  /** Related words = same prefix (3+ chars) */
  relatedWords(word: string, limit = 10): DictionaryEntry[] {
    const prefix = word.toLowerCase().slice(0, Math.min(3, word.length));
    return this.tree
      .searchByPrefix(prefix, limit + 1)
      .filter((e) => e.word.toLowerCase() !== word.toLowerCase())
      .slice(0, limit);
  }

  /* ───── CEFR CATEGORIZATION ───── */

  /** Get all words at a specific CEFR level */
  getByCEFR(level: CEFRLevel): DictionaryEntry[] {
    const words = this.cefrIndex.get(level);
    if (!words) return [];

    const results: DictionaryEntry[] = [];
    for (const w of words) {
      const entry = this.tree.search(w);
      if (entry) results.push(entry);
    }
    return results;
  }

  /** Get words across a range of CEFR levels */
  getByCEFRRange(from: CEFRLevel, to: CEFRLevel): DictionaryEntry[] {
    const fromIdx = CEFR_ORDER.indexOf(from);
    const toIdx = CEFR_ORDER.indexOf(to);
    const levels = CEFR_ORDER.slice(
      Math.min(fromIdx, toIdx),
      Math.max(fromIdx, toIdx) + 1,
    );

    return levels.flatMap((l) => this.getByCEFR(l));
  }

  /** Stats per level */
  cefrStats(): Record<CEFRLevel, number> {
    const stats = {} as Record<CEFRLevel, number>;
    for (const level of CEFR_ORDER) {
      stats[level] = this.cefrIndex.get(level)?.size ?? 0;
    }
    return stats;
  }

  /* ───── EXPORT TO JSON ───── */

  exportToJSON(): DictionaryJSON {
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      entries: this.tree.toJSON(),
    };
  }

  /** Download as .json file (browser) */
  downloadJSON(filename = "dictionary.json"): void {
    const json = JSON.stringify(this.exportToJSON(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

    getAllWords(): DictionaryEntry[] {
    return this.tree.getAllWords();
  }
  
  get totalWords(): number {
    return this.tree.size;
  }
}
