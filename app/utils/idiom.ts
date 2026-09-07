import { Idiom } from "@/app/types/idioms";

export const filterIdioms = (idioms: Idiom[], searchTerm: string): Idiom[] => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return idioms;
  
  return idioms.filter(
    (idiom) =>
      idiom.idiom.toLowerCase().includes(term) ||
      idiom.persian.includes(searchTerm)
  );
};

export const sortIdioms = (idioms: Idiom[], order: "order" | "random"): Idiom[] => {
  if (order === "order") {
    return [...idioms].sort((a, b) => a.idiom.localeCompare(b.idiom));
  }
  return [...idioms].sort(() => Math.random() - 0.5);
};

export const findIdiomIndex = (idioms: Idiom[], target: Idiom | null): number => {
  if (!target) return -1;
  return idioms.findIndex((i) => i.idiom === target.idiom);
};

export const getSelectedOrFirst = (idioms: Idiom[], selected: Idiom | null): Idiom | null => {
  if (selected && idioms.some((i) => i.idiom === selected.idiom)) {
    return selected;
  }
  return idioms.length > 0 ? idioms[0] : null;
};