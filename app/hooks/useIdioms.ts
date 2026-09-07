import { useState, useEffect, useCallback, useMemo } from "react";
import { Idiom, SortOrder } from "@/app/types/idioms";
import idiomsData from "@/public/community/idioms.json";

interface UseIdiomsResult {
  idioms: Idiom[];
  displayedIdioms: Idiom[];
  selectedIdiom: Idiom | null;
  setSelectedIdiom: (idiom: Idiom | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  randomizeOrder: () => void;
  isRandomizing: boolean;
  getCurrentIndex: () => number;
  nextIdiom: () => void;
  prevIdiom: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const useIdioms = (): UseIdiomsResult => {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [selectedIdiom, setSelectedIdiom] = useState<Idiom | null>(null);
  const [displayedIdioms, setDisplayedIdioms] = useState<Idiom[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("order");
  const [isRandomizing, setIsRandomizing] = useState(false);

  // Load and sort idioms
  useEffect(() => {
    const sortedIdioms = [...idiomsData].sort((a, b) =>
      a.idiom.localeCompare(b.idiom)
    );
    setIdioms(sortedIdioms);
    setDisplayedIdioms(sortedIdioms);
    if (sortedIdioms.length > 0) {
      setSelectedIdiom(sortedIdioms[0]);
    }
  }, []);

  // Filter idioms based on search and sort
  useEffect(() => {
    const filtered = idioms.filter(
      (idiom) =>
        idiom.idiom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.persian.includes(searchTerm)
    );

    if (sortOrder === "order") {
      setDisplayedIdioms(filtered);
    } else {
      // For random, shuffle but keep the order
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setDisplayedIdioms(shuffled);
    }
  }, [searchTerm, idioms, sortOrder]);

  const getCurrentIndex = useCallback(() => {
    return displayedIdioms.findIndex((i) => i.idiom === selectedIdiom?.idiom);
  }, [displayedIdioms, selectedIdiom]);

  const hasNext = useMemo(() => {
    return getCurrentIndex() < displayedIdioms.length - 1;
  }, [getCurrentIndex, displayedIdioms.length]);

  const hasPrev = useMemo(() => {
    return getCurrentIndex() > 0;
  }, [getCurrentIndex]);

  const nextIdiom = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < displayedIdioms.length - 1) {
      setSelectedIdiom(displayedIdioms[currentIndex + 1]);
    }
  }, [displayedIdioms, getCurrentIndex]);

  const prevIdiom = useCallback(() => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      setSelectedIdiom(displayedIdioms[currentIndex - 1]);
    }
  }, [displayedIdioms, getCurrentIndex]);

  const randomizeOrder = useCallback(() => {
    setIsRandomizing(true);

    const filtered = idioms.filter(
      (idiom) =>
        idiom.idiom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.persian.includes(searchTerm)
    );

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDisplayedIdioms(shuffled);

    // Update selected idiom if needed
    if (selectedIdiom) {
      const found = shuffled.find((i) => i.idiom === selectedIdiom.idiom);
      if (found) {
        setSelectedIdiom(found);
      } else if (shuffled.length > 0) {
        setSelectedIdiom(shuffled[0]);
      }
    } else if (shuffled.length > 0) {
      setSelectedIdiom(shuffled[0]);
    }

    setTimeout(() => {
      setIsRandomizing(false);
    }, 300);
  }, [idioms, searchTerm, selectedIdiom]);

  return {
    idioms,
    displayedIdioms,
    selectedIdiom,
    setSelectedIdiom,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    randomizeOrder,
    isRandomizing,
    getCurrentIndex,
    nextIdiom,
    prevIdiom,
    hasNext,
    hasPrev,
  };
};