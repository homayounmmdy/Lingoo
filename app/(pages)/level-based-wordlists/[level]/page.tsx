"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppConfig from "@/app/config/app";

interface Lesson {
  id: number;
  title: string;
  description: string;
  wordCount: number;
  color: string;
  isAvailable: boolean;
}

const levelConfig: { [key: string]: { name: string; title: string; color: string; bgColor: string; lessons: number } } = {
  a1: {
    name: "A1",
    title: "مبتدی (Beginner)",
    color: "#10B981",
    bgColor: "from-emerald-500 to-teal-500",
    lessons: 18
  },
  a2: {
    name: "A2",
    title: "ابتدایی (Elementary)",
    color: "#3B82F6",
    bgColor: "from-blue-500 to-cyan-500",
    lessons: 30
  },
  b1: {
    name: "B1",
    title: "متوسط (Intermediate)",
    color: "#F59E0B",
    bgColor: "from-amber-500 to-orange-500",
    lessons: 52
  },
  b2: {
    name: "B2",
    title: "بالاتر از متوسط (Upper Intermediate)",
    color: "#8B5CF6",
    bgColor: "from-purple-500 to-pink-500",
    lessons: 72
  },
  c1: {
    name: "C1",
    title: "پیشرفته (Advanced)",
    color: "#EF4444",
    bgColor: "from-red-500 to-rose-500",
    lessons: 47
  }
};

const LevelPage: React.FC = () => {
  const params = useParams();
  const levelId = params.level as string;
  const level = levelConfig[levelId];
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [availableLessons, setAvailableLessons] = useState<Set<number>>(new Set());
  const [checkingLessons, setCheckingLessons] = useState(true);

  useEffect(() => {
    // Load completed lessons from localStorage
    const saved = localStorage.getItem(`completed_${levelId}`);
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }

    // Check which lessons are available (have JSON files)
    checkAvailableLessons();
  }, [levelId]);

  const checkAvailableLessons = async () => {
    setCheckingLessons(true);
    const available = new Set<number>();
    
    // Check up to the maximum lessons for this level
    for (let i = 1; i <= level.lessons; i++) {
      try {
        const response = await fetch(`/community/level-based-words-${levelId}-p-${i}.json`);
        if (response.ok) {
          available.add(i);
        }
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    setAvailableLessons(available);
    setCheckingLessons(false);
  };

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">سطح پیدا نشد</h2>
          <Link href="/level-based-wordlists" className="text-[#f74697] mt-4 inline-block">
            بازگشت به لیست سطوح
          </Link>
        </div>
      </div>
    );
  }

  const lessons: Lesson[] = Array.from({ length: level.lessons }, (_, i) => {
    const lessonId = i + 1;
    const isAvailable = availableLessons.has(lessonId);
    
    return {
      id: lessonId,
      title: `درس ${lessonId}`,
      description: isAvailable 
        ? `لغات و اصطلاحات سطح ${level.name} - بخش ${lessonId}`
        : "این درس در حال آماده‌سازی است. به زودی اضافه می‌شود!",
      wordCount: isAvailable ? Math.floor(Math.random() * 15) + 10 : 0,
      color: level.color,
      isAvailable: isAvailable
    };
  });

  const progress = (completedLessons.length / lessons.filter(l => l.isAvailable).length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🦜</span>
              <h1 className="text-2xl font-bold text-[#f74697]">{AppConfig.name}</h1>
            </Link>
            
            <div className="flex gap-2">
              <Link href="/level-based-wordlists">
                <button className="px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-600 hover:bg-[#ffe073] transition-all duration-300">
                  ← سطوح
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Level Header */}
        <div className={`bg-gradient-to-r ${level.bgColor} rounded-2xl p-8 text-white mb-8 shadow-lg`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold mb-2">{level.name} - {level.title}</h2>
              <p className="text-white/90">
                {checkingLessons 
                  ? "در حال بارگیری دروس..." 
                  : `در این سطح با ${availableLessons.size} درس آماده و ${lessons.length - availableLessons.size} درس در حال آماده‌سازی آشنا می‌شوید`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl mb-2">📚</div>
              <div className="text-sm">{completedLessons.length}/{availableLessons.size} درس</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {!checkingLessons && availableLessons.size > 0 && (
            <div className="mt-4">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2">{Math.round(progress)}% پیشرفت</p>
            </div>
          )}
        </div>

        {/* Contribute Banner */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤝</span>
              <div>
                <h3 className="font-bold text-gray-800">به تکمیل محتوا کمک کنید!</h3>
                <p className="text-sm text-gray-600">با مشارکت در تهیه درس‌ها، به سریع‌تر شدن تکمیل دوره کمک کنید</p>
              </div>
            </div>
            <Link href="https://github.com/homayounmmdy/Lingoo/issues" target="_blank" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300">
              مشارکت در پروژه
            </Link>
          </div>
        </div>

        {/* Lessons Grid */}
        {checkingLessons ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f74697]"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              
              if (!lesson.isAvailable) {
                // Coming Soon Card
                return (
                  <div key={lesson.id} className="relative">
                    <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden opacity-75">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-500">{lesson.title}</h3>
                          <span className="text-3xl">🚧</span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4">{lesson.description}</p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            <span className="ml-1">⏳</span>
                            در حال آماده‌سازی
                          </span>
                          <button 
                            className="px-4 py-1 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                            disabled
                          >
                            به زودی
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Coming Soon Badge */}
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      به زودی
                    </div>
                  </div>
                );
              }
              
              // Available Lesson Card
              return (
                <Link href={`/level-based-wordlists/${levelId}/lesson/${lesson.id}`} key={lesson.id}>
                  <div className={`
                    bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105
                    ${isCompleted ? 'border-l-4 border-green-500' : ''}
                  `}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                        {isCompleted ? (
                          <span className="text-green-500 text-2xl">✓</span>
                        ) : (
                          <span className="text-gray-400 text-2xl">📖</span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          <span className="ml-1">📝</span>
                          {lesson.wordCount} کلمه
                        </span>
                        <button 
                          className={`
                            px-4 py-1 rounded-lg font-medium transition-all duration-300
                            ${isCompleted 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-[#f74697]/10 text-[#f74697] hover:bg-[#f74697] hover:text-white'
                            }
                          `}
                        >
                          {isCompleted ? 'مرور مجدد' : 'شروع درس'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Reset Progress Button */}
        {completedLessons.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (confirm("آیا مطمئن هستید؟ پیشرفت شما در این سطح پاک خواهد شد.")) {
                  localStorage.removeItem(`completed_${levelId}`);
                  setCompletedLessons([]);
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              🗑️ بازنشانی پیشرفت
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LevelPage;