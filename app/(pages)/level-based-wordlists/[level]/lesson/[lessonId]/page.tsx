"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Word {
  word: string;
  meaning: string;
  fonetic: string;
  example?: string;
  exampleMeaning?: string;
  moreInfo?: string;
}

const LessonPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const levelId = params.level as string;
  const lessonId = parseInt(params.lessonId as string);
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState({
    voicePriority: [] as string[],
    defaultSpeed: 0.85,
    autoPlay: false
  });

  useEffect(() => {
    // Load voice settings
    const savedSettings = localStorage.getItem("idiomVoiceSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setVoiceSettings(parsed);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Load words data from JSON file
    loadWordsData();
  }, [levelId, lessonId]);

  const loadWordsData = async () => {
    setIsLoading(true);
    setIsComingSoon(false);
    
    try {
      // Try to load the specific JSON file for this level and lesson
      const jsonPath = `/community/level-based-words-${levelId}-p-${lessonId}.json`;
      const response = await fetch(jsonPath);
      
      if (response.ok) {
        const data = await response.json();
        setWords(data);
        setIsLoading(false);
      } else {
        // If file doesn't exist, show "Coming Soon"
        setIsComingSoon(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading words data:", error);
      setIsComingSoon(true);
      setIsLoading(false);
    }
  };

  const getBestVoice = (): SpeechSynthesisVoice | null => {
    // First, try to find a voice from priority list
    for (const priorityVoice of voiceSettings.voicePriority) {
      const voice = availableVoices.find(v => v.name === priorityVoice);
      if (voice) return voice;
    }
    
    // Fallback to default English voices
    const fallbackVoices = [
      'Google UK English Female',
      'Google US English Female',
      'Google UK English Male',
      'Google US English Male',
      'Samantha',
      'Alex',
      'Microsoft David',
      'Microsoft Zira',
    ];
    
    for (const voiceName of fallbackVoices) {
      const voice = availableVoices.find(v => v.name.includes(voiceName));
      if (voice) return voice;
    }
    
    return availableVoices.find(v => v.lang.startsWith('en-')) || null;
  };

  const playWordSound = (word: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = voiceSettings.defaultSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    
    const bestVoice = getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSound = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowMeaning(false);
    }
  };

  const markAsLearned = () => {
    // Save progress
    const saved = localStorage.getItem(`completed_${levelId}_lesson_${lessonId}_words`);
    const completed = saved ? JSON.parse(saved) : [];
    if (!completed.includes(currentIndex)) {
      completed.push(currentIndex);
      localStorage.setItem(`completed_${levelId}_lesson_${lessonId}_words`, JSON.stringify(completed));
    }
    
    if (currentIndex < words.length - 1) {
      nextWord();
    } else {
      // Mark lesson as completed
      const completedLessons = localStorage.getItem(`completed_${levelId}`);
      const lessons = completedLessons ? JSON.parse(completedLessons) : [];
      if (!lessons.includes(lessonId)) {
        lessons.push(lessonId);
        localStorage.setItem(`completed_${levelId}`, JSON.stringify(lessons));
      }
      alert("تبریک! شما این درس را به اتمام رساندید 🎉");
      router.push(`/level-based-wordlists/${levelId}`);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#f74697] mb-4"></div>
          <p className="text-gray-600">در حال بارگیری کلمات...</p>
        </div>
      </div>
    );
  }

  // Show "Coming Soon" state
  if (isComingSoon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">در حال ساخت!</h2>
          <p className="text-gray-600 mb-6">
            محتوای درس {lessonId} از سطح {levelId.toUpperCase()} به زودی اضافه خواهد شد.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              💡 شما می‌توانید با مشارکت در پروژه، به سریع‌تر تکمیل شدن محتوا کمک کنید.
            </p>
          </div>
          <Link href={`/level-based-wordlists/${levelId}`}>
            <button className="px-6 py-3 bg-[#f74697] text-white rounded-xl font-bold hover:bg-[#d63081] transition-all duration-300">
              ← بازگشت به دروس
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">خطا در بارگیری محتوا</h2>
          <Link href={`/level-based-wordlists/${levelId}`}>
            <button className="mt-4 px-6 py-2 bg-[#f74697] text-white rounded-lg">
              بازگشت
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to check if word has example data
  const hasExample = currentWord.example && currentWord.example.trim() !== "";
  const hasExampleMeaning = currentWord.exampleMeaning && currentWord.exampleMeaning.trim() !== "";
  const hasMoreInfo = currentWord.moreInfo && currentWord.moreInfo.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/level-based-wordlists/${levelId}`}>
              <button className="px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-600 hover:bg-[#ffe073] transition-all duration-300">
                ← بازگشت به دروس
              </button>
            </Link>
            <h1 className="text-xl font-bold text-[#f74697]">
              درس {lessonId} - {levelId.toUpperCase()}
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>پیشرفت درس</span>
            <span>{currentIndex + 1} از {words.length}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#f74697] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Word Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            {/* English Word */}
            <div className="mb-6">
              <button
                onClick={() => playWordSound(currentWord.word)}
                className="group relative"
              >
                <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-3 hover:text-[#f74697] transition-colors">
                  {currentWord.word}
                </h2>
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-2xl">🔊</span>
                </div>
              </button>
              
              <p className="text-gray-500 font-mono text-sm">{currentWord.fonetic}</p>
            </div>

            {/* Meaning (Toggled) */}
            <div className="mb-6">
              {!showMeaning ? (
                <button
                  onClick={() => setShowMeaning(true)}
                  className="px-6 py-3 bg-[#f74697] text-white rounded-xl font-bold hover:bg-[#d63081] transition-all duration-300"
                >
                  👁️ نمایش معنی
                </button>
              ) : (
                <div className="animate-fadeIn">
                  <div className="bg-[#ffe073]/20 rounded-xl p-6">
                    <p className="text-2xl font-bold text-[#f74697] mb-4">{currentWord.meaning}</p>
                    
                    {/* Example Section - only shown if example exists */}
                    {(hasExample || hasExampleMeaning) && (
                    <div className="border-t border-[#ffe073] pt-4 mt-4">
                      <p className="text-gray-600 mb-2">💡 مثال:</p>
                        {hasExample && (
                      <p className="text-gray-800 italic" dir="ltr">{currentWord.example}</p>
                        )}
                        {hasExampleMeaning && (
                      <p className="text-gray-600 mt-2">{currentWord.exampleMeaning}</p>
                        )}
                      </div>
                    )}

                    {/* More Info Section - only shown if moreInfo exists */}
                    {hasMoreInfo && (
                      <div className="border-t border-[#ffe073] pt-4 mt-4">
                        <p className="text-gray-600 mb-2">📚 اطلاعات بیشتر:</p>
                        <p className="text-gray-700 leading-relaxed text-right whitespace-pre-wrap">
                          {currentWord.moreInfo}
                        </p>
                    </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-center">
              {isSpeaking ? (
                <button
                  onClick={stopSound}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all duration-300"
                >
                  ⏹️ توقف
                </button>
              ) : (
                <button
                  onClick={() => playWordSound(currentWord.word)}
                  className="px-6 py-3 bg-[#4097f2] text-white rounded-xl font-bold hover:bg-[#3081d0] transition-all duration-300"
                >
                  🔊 شنیدن تلفظ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={prevWord}
            disabled={currentIndex === 0}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            → قبلی
          </button>
          
          <button
            onClick={markAsLearned}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all duration-300"
          >
            {currentIndex === words.length - 1 ? '🏁 اتمام درس' : '✓ یاد گرفتم'}
          </button>
          
          <button
            onClick={nextWord}
            disabled={currentIndex === words.length - 1}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            بعدی ←
          </button>
        </div>

        {/* Word List Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {words.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setShowMeaning(false);
              }}
              className={`
                w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
                ${idx === currentIndex 
                  ? 'bg-[#f74697] text-white scale-110' 
                  : idx < currentIndex 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonPage;