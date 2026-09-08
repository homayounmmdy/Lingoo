import { DictionaryEntry, TSTNode } from "@/app/types/dictionary";

export class TernarySearchTree {
  private root: TSTNode | null = null;
  private _size: number = 0;

  get size(): number {
    return this._size;
  }

  /* ───── helpers ───── */

  private createNode(char: string): TSTNode {
    return {
      char,
      left: null,
      middle: null,
      right: null,
      isEndOfWord: false,
      data: null,
    };
  }

  /* ───── INSERT ───── */

  insert(entry: DictionaryEntry): void {
    const word = entry.word.toLowerCase();
    if (!word) return;
    this.root = this.insertNode(this.root, word, 0, entry);
  }

  private insertNode(
    node: TSTNode | null,
    word: string,
    index: number,
    entry: DictionaryEntry,
  ): TSTNode {
    const char = word[index];

    if (!node) {
      node = this.createNode(char);
    }

    if (char < node.char) {
      node.left = this.insertNode(node.left, word, index, entry);
    } else if (char > node.char) {
      node.right = this.insertNode(node.right, word, index, entry);
    } else {
      // chars match — move to next character
      if (index < word.length - 1) {
        node.middle = this.insertNode(node.middle, word, index + 1, entry);
      } else {
        // end of word
        if (!node.isEndOfWord) this._size++;
        node.isEndOfWord = true;
        node.data = entry;
      }
    }

    return node;
  }

  /* ───── EXACT SEARCH ───── */

  search(word: string): DictionaryEntry | null {
    const node = this.searchNode(this.root, word.toLowerCase(), 0);
    return node?.isEndOfWord ? node.data : null;
  }

  private searchNode(
    node: TSTNode | null,
    word: string,
    index: number,
  ): TSTNode | null {
    if (!node) return null;

    const char = word[index];

    if (char < node.char) {
      return this.searchNode(node.left, word, index);
    } else if (char > node.char) {
      return this.searchNode(node.right, word, index);
    } else {
      if (index === word.length - 1) return node;
      return this.searchNode(node.middle, word, index + 1);
    }
  }

  /* ───── PREFIX SEARCH (autocomplete) ───── */

  searchByPrefix(prefix: string, limit = 20): DictionaryEntry[] {
    const results: DictionaryEntry[] = [];
    const lowerPrefix = prefix.toLowerCase();

    // Navigate to the node at the end of the prefix
    let node = this.root;
    for (let i = 0; i < lowerPrefix.length; i++) {
      if (!node) return results;
      const char = lowerPrefix[i];
      if (char < node.char) {
        node = node.left;
        i--; // re-check same index on new node
      } else if (char > node.char) {
        node = node.right;
        i--;
      } else {
        if (i === lowerPrefix.length - 1) {
          // found prefix end — collect all words from middle subtree
          if (node.isEndOfWord && node.data) {
            results.push(node.data);
          }
          this.collectAll(node.middle, results, limit);
          return results;
        }
        node = node.middle;
      }
    }
    return results;
  }

  private collectAll(
    node: TSTNode | null,
    results: DictionaryEntry[],
    limit: number,
  ): void {
    if (!node || results.length >= limit) return;

    this.collectAll(node.left, results, limit);

    if (node.isEndOfWord && node.data && results.length < limit) {
      results.push(node.data);
    }

    this.collectAll(node.middle, results, limit);
    this.collectAll(node.right, results, limit);
  }

  /* ───── WILDCARD SEARCH (e.g., "r*n" matches "run", "rain") ───── */

  wildcardSearch(pattern: string, limit = 20): DictionaryEntry[] {
    const results: DictionaryEntry[] = [];
    this.wildcardHelper(this.root, pattern.toLowerCase(), 0, results, limit);
    return results;
  }

  private wildcardHelper(
    node: TSTNode | null,
    pattern: string,
    index: number,
    results: DictionaryEntry[],
    limit: number,
  ): void {
    if (!node || results.length >= limit) return;

    const char = pattern[index];

    if (char === "?" || char === "*") {
      // '?' matches exactly one char, '*' matches one or more
      // Try left, current, right
      this.wildcardHelper(node.left, pattern, index, results, limit);
      this.wildcardHelper(node.middle, pattern, index, results, limit);
      this.wildcardHelper(node.right, pattern, index, results, limit);

      if (
        char === "?" &&
        index === pattern.length - 1 &&
        node.isEndOfWord &&
        node.data
      ) {
        results.push(node.data);
      } else if (char === "?") {
        this.wildcardHelper(node.middle, pattern, index + 1, results, limit);
      }
    } else if (char < node.char) {
      this.wildcardHelper(node.left, pattern, index, results, limit);
    } else if (char > node.char) {
      this.wildcardHelper(node.right, pattern, index, results, limit);
    } else {
      if (index === pattern.length - 1) {
        if (node.isEndOfWord && node.data) results.push(node.data);
      } else {
        this.wildcardHelper(node.middle, pattern, index + 1, results, limit);
      }
    }
  }

  /* ───── COLLECT ALL WORDS ───── */

  getAllWords(): DictionaryEntry[] {
    const results: DictionaryEntry[] = [];
    this.collectAll(this.root, results, Infinity);
    return results;
  }

  /* ───── DELETE ───── */

  delete(word: string): boolean {
    const lower = word.toLowerCase();
    const result = this.deleteNode(this.root, lower, 0);
    if (result.deleted) this._size--;
    return result.deleted;
  }

  private deleteNode(
    node: TSTNode | null,
    word: string,
    index: number,
  ): { node: TSTNode | null; deleted: boolean } {
    if (!node) return { node: null, deleted: false };

    const char = word[index];
    let deleted = false;

    if (char < node.char) {
      const res = this.deleteNode(node.left, word, index);
      node.left = res.node;
      deleted = res.deleted;
    } else if (char > node.char) {
      const res = this.deleteNode(node.right, word, index);
      node.right = res.node;
      deleted = res.deleted;
    } else {
      if (index === word.length - 1) {
        if (node.isEndOfWord) {
          node.isEndOfWord = false;
          node.data = null;
          deleted = true;
        }
      } else {
        const res = this.deleteNode(node.middle, word, index + 1);
        node.middle = res.node;
        deleted = res.deleted;
      }
    }

    // Prune empty nodes
    if (!node.isEndOfWord && !node.left && !node.middle && !node.right) {
      return { node: null, deleted };
    }

    return { node, deleted };
  }

  /* ───── SERIALIZATION ───── */

  toJSON(): DictionaryEntry[] {
    return this.getAllWords();
  }

  static fromEntries(entries: DictionaryEntry[]): TernarySearchTree {
    const tree = new TernarySearchTree();
    for (const entry of entries) {
      tree.insert(entry);
    }
    return tree;
  }
}
