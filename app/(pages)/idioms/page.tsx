"use client";

import React, { useState, useEffect } from "react";
import idiomsData from "@/public/community/idioms.json";
import Link from "next/link";

interface Idiom {
  idiom: string;
  fonetic: string;
  persian: string;
  example: string;
  exampleMeaning: string;
}

const IdiomsPage: React.FC = () => {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [selectedIdiom, setSelectedIdiom] = useState<Idiom | null>(null);
  const [sortOrder, setSortOrder] = useState<"order" | "random">("order");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [displayedIdioms, setDisplayedIdioms] = useState<Idiom[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // Default speed
  const [showSpeedControl, setShowSpeedControl] = useState<boolean>(false);

  // Speed options for users
  const speedOptions = [
    { label: "🐢 خیلی آهسته", value: 0.5 },
    { label: "🐢 آهسته", value: 0.7 },
    { label: "⚡ معمولی", value: 0.85 },
    { label: "🐇 تند", value: 1.0 },
    { label: "🐇 خیلی تند", value: 1.2 },
  ];

  // Load and sort idioms alphabetically by English on mount
  useEffect(() => {
    const sortedIdioms = [...idiomsData].sort((a, b) =>
        a.idiom.localeCompare(b.idiom)
    );
    setIdioms(sortedIdioms);
    setDisplayedIdioms(sortedIdioms);
    if (sortedIdioms.length > 0) {
      setSelectedIdiom(sortedIdioms[0]);
    }

    // Load available voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Filter idioms based on search
  useEffect(() => {
    const filtered = idioms.filter(idiom =>
        idiom.idiom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.persian.includes(searchTerm)
    );

    if (sortOrder === "order") {
      setDisplayedIdioms(filtered);
    } else {
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setDisplayedIdioms(shuffled);
    }
  }, [searchTerm, idioms, sortOrder]);

  // Function to play the idiom pronunciation with current speed setting
  const playIdiomSound = () => {
    if (!selectedIdiom) return;

    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);

    // Create utterance with the actual idiom text
    const textToSpeak = selectedIdiom.idiom;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Configure with user-selected speed
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    // Try to find the best English voice
    const findBestVoice = () => {
      const voicePriority = [
        'Google UK English Female',
        'Google US English Female',
        'Google UK English Male',
        'Google US English Male',
        'Samantha',
        'Alex',
        'Microsoft David',
        'Microsoft Zira',
        'en-US',
        'en-GB'
      ];

      for (const voiceName of voicePriority) {
        const voice = availableVoices.find(v =>
            v.name.includes(voiceName) ||
            (voiceName === 'en-US' && v.lang === 'en-US') ||
            (voiceName === 'en-GB' && v.lang === 'en-GB')
        );
        if (voice) {
          utterance.voice = voice;
          break;
        }
      }
    };

    findBestVoice();

    // Handle speech end
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis failed:', event);
      setIsSpeaking(false);
    };

    // Speak the idiom
    window.speechSynthesis.speak(utterance);
  };

  const stopPronunciation = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Get current speed label
  const getCurrentSpeedLabel = () => {
    const option = speedOptions.find(opt => opt.value === playbackSpeed);
    return option ? option.label : "⚡ معمولی";
  };

  const randomizeOrder = () => {
    setDiceRolling(true);
    setIsRandomizing(true);

    const gridItems = document.querySelectorAll('.idiom-item');
    gridItems.forEach((item, index) => {
      setTimeout(() => {
        (item as HTMLElement).style.transform = 'scale(0.95)';
        setTimeout(() => {
          (item as HTMLElement).style.transform = 'scale(1)';
        }, 150);
      }, index * 20);
    });

    setTimeout(() => {
      const filtered = idioms.filter(idiom =>
          idiom.idiom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idiom.persian.includes(searchTerm)
      );

      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setDisplayedIdioms(shuffled);

      if (selectedIdiom) {
        const found = shuffled.find(i => i.idiom === selectedIdiom.idiom);
        if (found) {
          setSelectedIdiom(found);
        } else if (shuffled.length > 0) {
          setSelectedIdiom(shuffled[0]);
        }
      } else if (shuffled.length > 0) {
        setSelectedIdiom(shuffled[0]);
      }

      setTimeout(() => {
        setDiceRolling(false);
        setIsRandomizing(false);
      }, 300);
    }, 600);
  };

  const handleSortChange = (mode: "order" | "random") => {
    setSortOrder(mode);

    if (mode === "order") {
      const filtered = idioms.filter(idiom =>
          idiom.idiom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idiom.persian.includes(searchTerm)
      );
      setDisplayedIdioms(filtered);
    } else {
      randomizeOrder();
    }
  };

  const nextIdiom = () => {
    stopPronunciation();
    const currentIndex = displayedIdioms.findIndex(i => i.idiom === selectedIdiom?.idiom);
    if (currentIndex < displayedIdioms.length - 1) {
      const detailCard = document.querySelector('.detail-card');
      if (detailCard) {
        detailCard.classList.add('animate-fadeOut');
        setTimeout(() => {
          setSelectedIdiom(displayedIdioms[currentIndex + 1]);
          detailCard.classList.remove('animate-fadeOut');
          detailCard.classList.add('animate-fadeIn');
          setTimeout(() => {
            detailCard.classList.remove('animate-fadeIn');
          }, 300);
        }, 150);
      } else {
        setSelectedIdiom(displayedIdioms[currentIndex + 1]);
      }
    }
  };

  const prevIdiom = () => {
    stopPronunciation();
    const currentIndex = displayedIdioms.findIndex(i => i.idiom === selectedIdiom?.idiom);
    if (currentIndex > 0) {
      const detailCard = document.querySelector('.detail-card');
      if (detailCard) {
        detailCard.classList.add('animate-fadeOut');
        setTimeout(() => {
          setSelectedIdiom(displayedIdioms[currentIndex - 1]);
          detailCard.classList.remove('animate-fadeOut');
          detailCard.classList.add('animate-fadeIn');
          setTimeout(() => {
            detailCard.classList.remove('animate-fadeIn');
          }, 300);
        }, 150);
      } else {
        setSelectedIdiom(displayedIdioms[currentIndex - 1]);
      }
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#f74697]/5 to-[#4097f2]/5" dir="rtl">
        <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-[#ffe073]/30">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-3xl">🦜</span>
                <h1 className="text-2xl font-bold" style={{ color: '#f74697' }}>لینگو</h1>
              </Link>

              <div className="flex gap-2">
                <button
                    onClick={() => handleSortChange("order")}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                        sortOrder === "order"
                            ? "bg-[#f74697] text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-[#ffe073] hover:text-gray-800"
                    }`}
                >
                  📋 الفبا
                </button>
                <button
                    onClick={() => handleSortChange("random")}
                    disabled={isRandomizing}
                    className={`
                  px-4 py-2 rounded-lg font-bold transition-all duration-300 relative
                  ${sortOrder === "random"
                        ? "bg-[#f74697] text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-[#ffe073] hover:text-gray-800"}
                  ${isRandomizing ? "cursor-wait opacity-75" : ""}
                `}
                >
                <span className={`inline-block transition-transform ${diceRolling ? "animate-dice-roll" : ""}`}>
                  🎲
                </span>
                  {isRandomizing ? " برزدن..." : " تصادفی"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 pt-8">
          <div className="mb-6">
            <input
                type="text"
                placeholder="🔍 اصطلاحات خود را به فارسی یا انگلیسی اینجا جستجو کنید..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#ffe073]/50 focus:border-[#f74697] focus:outline-none bg-white shadow-sm transition-all duration-300"
            />
          </div>

          {isRandomizing && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-2xl text-center border-t-4 border-[#f74697]">
                  <div className="text-6xl mb-4 animate-bounce">🎲</div>
                  <div className="text-2xl font-bold mb-2" style={{ color: '#f74697' }}>برزدن اصطلاحات!</div>
                  <div className="text-gray-500">تصادفی کردن تجربه یادگیری شما...</div>
                  <div className="mt-4 flex justify-center gap-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f74697' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse delay-100" style={{ backgroundColor: '#ffe073' }}></div>
                    <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ backgroundColor: '#4097f2' }}></div>
                  </div>
                </div>
              </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-4 border-t-4 border-[#f74697]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#ffe073]/30">
                <h2 className="font-bold" style={{ color: '#f74697' }}>📚 لیست اصطلاحات</h2>
                <span className="text-sm text-gray-500">{displayedIdioms.length} اصطلاحات</span>
              </div>

              <div className="p-4 max-h-150 overflow-y-scroll flex flex-col gap-3 overflow-x-hidden">
                {displayedIdioms.map((idiom, index) => (
                    <button
                        key={index}
                        onClick={() => {
                          stopPronunciation();
                          setSelectedIdiom(idiom);
                        }}
                        className={`cursor-pointer w-full p-3 rounded-lg transition-all duration-300
                    ${selectedIdiom?.idiom === idiom.idiom
                            ? "text-white shadow-md scale-102"
                            : "bg-gray-50 hover:bg-[#ffe073]/30 text-gray-700 hover-scale"}
                  `}
                        style={{
                          backgroundColor: selectedIdiom?.idiom === idiom.idiom ? '#f74697' : undefined,
                          animation: isRandomizing ? `slideIn 0.3s ease-out ${index * 0.02}s` : "none"
                        }}
                    >
                      <div className="font-bold text-left">{idiom.idiom}</div>
                      <div className={`text-sm text-right ${selectedIdiom?.idiom === idiom.idiom ? "text-pink-100" : "text-gray-500"}`}>
                        {idiom.persian}
                      </div>
                    </button>
                ))}

                {displayedIdioms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      هیچ اصطلاحاتی برای  &quot;{searchTerm}&quot; پیدا نشد
                    </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 detail-card transition-all duration-300 border-t-4 border-[#4097f2]">
              {selectedIdiom ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <button
                          onClick={prevIdiom}
                          disabled={displayedIdioms.findIndex(i => i.idiom === selectedIdiom.idiom) === 0}
                          className={`
                      p-2 rounded-lg transition transform hover:scale-110
                      ${displayedIdioms.findIndex(i => i.idiom === selectedIdiom.idiom) === 0
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-[#ffe073]/30"}
                    `}
                      >
                        → قبلی
                      </button>
                      <span className="text-sm text-gray-500">
                    {displayedIdioms.findIndex(i => i.idiom === selectedIdiom.idiom) + 1} / {displayedIdioms.length}
                  </span>
                      <button
                          onClick={nextIdiom}
                          disabled={displayedIdioms.findIndex(i => i.idiom === selectedIdiom.idiom) === displayedIdioms.length - 1}
                          className={`
                      p-2 rounded-lg transition transform hover:scale-110
                      ${displayedIdioms.findIndex(i => i.idiom === selectedIdiom.idiom) === displayedIdioms.length - 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-[#ffe073]/30"}
                    `}
                      >
                        بعدی  ←
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#f74697' }}>
                          {selectedIdiom.idiom}
                        </h2>
                      </div>

                      {/* Enhanced Pronunciation Section with Speed Control */}
                      <div className="rounded-xl p-4 transition-all duration-300 hover:shadow-md" style={{ backgroundColor: '#ffe07320' }}>
                        <div className="text-center mb-3">
                          <span className="text-sm text-gray-500">🔊 Pronunciation</span>
                        </div>

                        <p className="text-gray-700 font-mono text-sm text-center mb-4">{selectedIdiom.fonetic}</p>

                        {/* Speed Control Toggle Button */}
                        <div className="mb-4">
                          <button
                              onClick={() => setShowSpeedControl(!showSpeedControl)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/50 hover:bg-white transition-all duration-300 border border-[#ffe073]"
                          >
                            <span className="text-sm text-gray-600">🎚️ سرعت پخش:</span>
                            <span className="text-sm font-medium" style={{ color: '#f74697' }}>
                              {getCurrentSpeedLabel()}
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${showSpeedControl ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Speed Options Dropdown */}
                          {showSpeedControl && (
                              <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                                {speedOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                          setPlaybackSpeed(option.value);
                                          setShowSpeedControl(false);
                                          // Optional: Auto-play with new speed? Uncomment if desired
                                          // if (!isSpeaking) playIdiomSound();
                                        }}
                                        className={`
                                    w-full px-3 py-2 text-right transition-all duration-200
                                    flex items-center justify-between
                                    ${playbackSpeed === option.value
                                            ? 'bg-[#f74697]/10 text-[#f74697] font-medium'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }
                                  `}
                                    >
                                      <span>{option.label}</span>
                                      {playbackSpeed === option.value && (
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                      )}
                                    </button>
                                ))}
                              </div>
                          )}
                        </div>

                        {/* Playback Controls */}
                        <div className="flex gap-3 justify-center">
                          {/* Main Play Button */}
                          <button
                              onClick={playIdiomSound}
                              disabled={isSpeaking}
                              className={`
                              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                              ${isSpeaking
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-[#f74697] text-white hover:bg-[#d63081] hover:shadow-lg transform hover:scale-105'
                              }
                            `}
                          >
                            {isSpeaking ? (
                                <>
                                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32"/>
                                  </svg>
                                  در حال پخش...
                                </>
                            ) : (
                                <>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                  </svg>
                                  <span>شنیدن اصطلاح</span>
                                </>
                            )}
                          </button>

                          {/* Stop Button */}
                          {isSpeaking && (
                              <button
                                  onClick={stopPronunciation}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
                                </svg>
                                توقف
                              </button>
                          )}
                        </div>

                        <div className="text-center mt-3">
                          <p className="text-xs text-gray-400">
                            🎯 با تنظیم سرعت آهسته، کلمات را واضح‌تر بشنوید
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#f7469720' }}>
                        <div className="text-sm text-gray-500 mb-1">معنی</div>
                        <p className="text-xl font-bold" style={{ color: '#f74697' }}>{selectedIdiom.persian}</p>
                      </div>

                      <div className="rounded-xl p-4" style={{ backgroundColor: '#4097f210' }}>
                        <div className="text-sm text-gray-500 mb-2">💡 مثال انگلیسی</div>
                        <div className="text-gray-800 italic leading-relaxed" style={{direction: 'ltr'}}
                        >{selectedIdiom.example}</div>
                      </div>

                      <div className="rounded-xl p-4" style={{ backgroundColor: '#ffe07320' }}>
                        <div className="text-sm text-gray-500 mb-1">📝 معنی مثال</div>
                        <p className="text-gray-700">{selectedIdiom.exampleMeaning}</p>
                      </div>
                    </div>
                  </>
              ) : (
                  <div className="flex items-center justify-center h-96 text-center">
                    <div>
                      <div className="text-6xl mb-4">📖</div>
                      <p className="text-gray-500">در حال بارگیری اصطلاحات...</p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
};

export default IdiomsPage;