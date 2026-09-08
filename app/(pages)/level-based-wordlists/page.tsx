"use client";

import React from "react";
import Link from "next/link";
import AppConfig from "@/app/config/app";

interface Level {
  id: string;
  name: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  lessons: number;
  words: number;
  icon: string;
}

const levels: Level[] = [
  {
    id: "A1",
    name: "A1",
    title: "مبتدی (Beginner)",
    description: "شروع یادگیری زبان انگلیسی با کلمات پایه و ساده",
    color: "#10B981",
    bgColor: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-600",
    lessons: 18,
    words: 0,
    icon: "🌱"
  },
  {
    id: "A2",
    name: "A2",
    title: "ابتدایی (Elementary)",
    description: "تقویت دایره لغات برای مکالمات روزمره",
    color: "#3B82F6",
    bgColor: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-600",
    lessons: 30,
    words: 0,
    icon: "📘"
  },
  {
    id: "B1",
    name: "B1",
    title: "متوسط (Intermediate)",
    description: "تسلط بر موضوعات متنوع و گسترده",
    color: "#F59E0B",
    bgColor: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500",
    textColor: "text-amber-600",
    lessons: 52,
    words: 0,
    icon: "📚"
  },
  {
    id: "B2",
    name: "B2",
    title: "بالاتر از متوسط (Upper Intermediate)",
    description: "آمادگی برای مکالمات پیشرفته و نوشتار حرفه‌ای",
    color: "#8B5CF6",
    bgColor: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-600",
    lessons: 72,
    words: 0,
    icon: "🎓"
  },
  {
    id: "C1",
    name: "C1",
    title: "پیشرفته (Advanced)",
    description: "تسلط کامل بر زبان انگلیسی در سطح آکادمیک",
    color: "#EF4444",
    bgColor: "from-red-500 to-rose-500",
    borderColor: "border-red-500",
    textColor: "text-red-600",
    lessons: 47,
    words: 0,
    icon: "🏆"
  }
];

const LevelBasedWordlists: React.FC = () => {
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
            
            <Link href="/">
              <button className="px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-600 hover:bg-[#ffe073] transition-all duration-300">
                ← بازگشت
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#f74697] to-[#4097f2] bg-clip-text text-transparent">
            📚 سطح‌بندی شده بر اساس CEFR
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            کلمات و اصطلاحات را بر اساس سطح خود یاد بگیرید. از سطح مبتدی تا پیشرفته
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Link href={`/level-based-wordlists/${level.id.toLowerCase()}`} key={level.id}>
              <div className={`
                group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105
                bg-gradient-to-br ${level.bgColor}
              `}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-6xl">{level.icon}</span>
                    <span className="text-4xl font-black opacity-20">{level.name}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {level.name} - {level.title}
                  </h3>
                  
                  <p className="text-white/90 text-sm mb-4 line-clamp-2">
                    {level.description}
                  </p>
                  
                  <div className="flex gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <span>📖</span>
                      <span>{level.lessons} درس</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📝</span>
                      <span>{level.words} کلمه</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg py-2 font-medium transition-all duration-300 backdrop-blur-sm">
                    شروع یادگیری →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-[#f74697]/10 to-[#4097f2]/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">CEFR چیست؟</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            CEFR (چارچوب مشترک اروپایی مرجع برای زبان‌ها) یک استاندارد بین‌المللی برای سنجش سطح زبان است. 
            از A1 (مبتدی) تا C2 (تسلط کامل) را شامل می‌شود. ما سطوح A1 تا C1 را پوشش می‌دهیم.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LevelBasedWordlists;