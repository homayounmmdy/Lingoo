'use client'
import { useState, useMemo, useEffect } from "react";
import { DictionaryManager } from "./DictionaryManager";
import { DictionaryJSON, DictionaryEntry, CEFRLevel } from "@/app/types/dictionary";
import dictionaryData from "../../data/dictionary.json";
import { Button } from "@/app/components/ui/button";

// Initialize manager once outside component to persist across renders
const dictManager = new DictionaryManager();
dictManager.loadFromJSON(dictionaryData as DictionaryJSON);

const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Harmonized color palette for CEFR badges
const CEFR_BADGE_COLORS: Record<CEFRLevel, string> = {
  A1: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  A2: "bg-sky-50 text-sky-700 border border-sky-200",
  B1: "bg-amber-50 text-amber-700 border border-amber-200",
  B2: "bg-rose-50 text-rose-700 border border-rose-200",
  C1: "bg-violet-50 text-violet-700 border border-violet-200",
  C2: "bg-slate-100 text-slate-700 border border-slate-200",
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | "همه">("همه");
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search for optimal TST performance
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized results
  const displayResults = useMemo(() => {
    let results: DictionaryEntry[] = [];

    if (debouncedQuery.trim().length > 0) {
      const exact = dictManager.lookup(debouncedQuery);
      const auto = dictManager.autocomplete(debouncedQuery, 50);
      results = exact ? [exact, ...auto.filter((w) => w.word !== exact.word)] : auto;
    } else if (selectedCefr !== "همه") {
      results = dictManager.getByCEFR(selectedCefr as CEFRLevel);
    } else {
      results = dictManager.getAllWords();
    }

    return results;
  }, [debouncedQuery, selectedCefr]);

  const relatedWords = useMemo(() => {
    if (!selectedWord) return [];
    return dictManager.relatedWords(selectedWord.word, 5);
  }, [selectedWord]);

  const stats = dictManager.cefrStats();

  return (
    // ✅ dir="rtl" ensures proper Persian layout
    <div className="min-h-screen bg-slate-50 text-slate-800" dir="rtl">
      <div className="mx-auto max-w-6xl p-6 space-y-8">

        {/* ─── Header & Stats ─── */}
        <header className="animate-fadeIn space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                <span className="text-[#f74697]">دیکشنری</span> هوشمند
              </h1>
              <p className="text-slate-500 mt-1">یادگیری واژگان با جستجوی هوشمند و سریع</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover-scale cursor-default">
              <span className="w-2 h-2 rounded-full bg-[#f74697] animate-pulse"></span>
              <span className="text-sm font-medium text-slate-600">
                {dictManager.totalWords} واژه بارگذاری شده
              </span>
            </div>
          </div>

          {/* ─── CEFR Filters ─── */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedCefr("همه")}
              variant={selectedCefr === "همه" ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
              همه سطوح
            </Button>
            {CEFR_LEVELS.map((level, index) => (
              <Button
                key={level}
                onClick={() => setSelectedCefr(level)}
                variant={selectedCefr === level ? "default" : "outline"}
                size="sm"
                className="gap-2 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className={`w-2 h-2 rounded-full ${
                  level === "A1" ? "bg-emerald-500" : 
                  level === "A2" ? "bg-sky-500" : 
                  level === "B1" ? "bg-amber-500" : 
                  level === "B2" ? "bg-rose-500" : 
                  level === "C1" ? "bg-violet-500" : "bg-slate-500"
                }`}></span>
                سطح {level}
                <span className="text-xs opacity-70">({stats[level]})</span>
              </Button>
            ))}
          </div>
        </header>

        {/* ─── Search Bar ─── */}
        <div className="relative animate-fadeIn delay-100">
          {/* ✅ ps-12 (padding-start) places icon on the right in RTL */}
          <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="جستجوی واژه (مثلاً: run, ability)..."
            className="w-full ps-12 pe-12 py-4 bg-white border border-slate-200 rounded-2xl text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f74697]/30 focus:border-[#f74697] transition-all duration-200 hover-scale placeholder:text-slate-400 font-sans"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedWord(null);
            }}
          />
          {isSearching && (
            <div className="absolute inset-y-0 end-0 pe-4 flex items-center">
              <div className="h-5 w-5 border-2 border-[#f74697] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Right Column (in RTL): Results List */}
          <div className="lg:col-span-7 space-y-4 animate-fadeIn delay-200">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              {debouncedQuery ? `نتایج جستجو برای "${debouncedQuery}"` : selectedCefr !== "همه" ? `واژگان سطح ${selectedCefr}` : "واژگان پیشنهادی"}
              <span className="text-sm font-normal text-slate-400">({displayResults.length})</span>
            </h2>

            {displayResults.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm animate-fadeIn">
                <p className="text-slate-500">واژه‌ای با این مشخصات یافت نشد.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pe-2 custom-scrollbar">
                {displayResults.map((entry, index) => (
                  <WordCard
                    key={entry.word}
                    entry={entry}
                    isSelected={selectedWord?.word === entry.word}
                    onClick={() => setSelectedWord(entry)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Left Column (in RTL): Details Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              {selectedWord ? (
                <div className="bg-white border border-slate-200 rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden animate-fadeIn">
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-l from-[#f74697] to-[#ff66aa] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-4xl font-extrabold capitalize tracking-tight ltr:text-left">{selectedWord.word}</h2>
                          <p className="text-white/80 font-mono text-sm mt-1 flex items-center gap-2 ltr:flex-row-reverse">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                            {selectedWord.phonetic}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm border border-white/30">
                          {selectedWord.cefrLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#f74697] mb-2">معنی</h3>
                      <p className="text-slate-700 text-lg leading-relaxed">{selectedWord.meaning}</p>
                    </div>

                    {/* ✅ border-s-4 and rounded-e-xl for proper RTL styling */}
                    <div className="bg-slate-50 border-s-4 border-[#f74697] rounded-e-xl p-5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">مثال</h3>
                      <p className="text-slate-800 italic text-lg leading-relaxed mb-2 ltr:text-left">"{selectedWord.example}"</p>
                      <p className="text-slate-500 text-sm">{selectedWord.exampleMeaning}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center animate-fadeIn">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">انتخاب یک واژه</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">برای مشاهده معنی دقیق، تلفظ و مثال‌های کاربردی، روی یکی از واژه‌های لیست کلیک کنید.</p>
                </div>
              )}

              {/* Related Words Section */}
              {selectedWord && relatedWords.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeIn delay-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#f74697]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    واژگان مرتبط
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedWords.map((rel) => (
                      <Button
                        key={rel.word}
                        onClick={() => {
                          setSelectedWord(rel);
                          setSearchQuery(rel.word);
                        }}
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                      >
                        <span className="ltr:order-2">{rel.word}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${CEFR_BADGE_COLORS[rel.cefrLevel]}`}>
                          {rel.cefrLevel}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Subcomponent: Word Card ───
interface WordCardProps {
  entry: DictionaryEntry;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

function WordCard({ entry, isSelected, onClick, index }: WordCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`group relative w-full bg-white border rounded-2xl p-4 cursor-pointer transition-all duration-200 hover-scale animate-fadeIn ${
        isSelected
          ? "border-[#f74697] ring-1 ring-[#f74697] shadow-md shadow-pink-100"
          : "border-slate-200 hover:border-[#f74697]/50 hover:shadow-md"
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h3 className="text-lg font-bold text-slate-800 capitalize group-hover:text-[#f74697] transition-colors ltr:text-left">
            {entry.word}
          </h3>
          <span className="text-xs font-mono text-slate-400 ltr:text-left">{entry.phonetic}</span>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${CEFR_BADGE_COLORS[entry.cefrLevel]}`}>
          {entry.cefrLevel}
        </span>
      </div>
      <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
        {entry.meaning}
      </p>

      {/* Active/Hover Indicator Dot */}
      <div className={`absolute end-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#f74697] transition-opacity duration-200 ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}></div>
    </div>
  );
}
