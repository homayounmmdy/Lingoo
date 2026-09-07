"use client";

import React from "react";
import FeatureHighlights from "./components/FeatureHighlights";
import HeroSection from "./components/HeroSection";
import LevelsOverview from "./components/LevelsOverview";
import MainSections from "./components/MainSections";
import StatsSection from "./components/StatsSection";

const HomePage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#f74697]/5 to-[#4097f2]/5"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-[#ffe073]/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🦜</span>
              <h1 className="text-2xl font-bold" style={{ color: "#f74697" }}>
                لینگو
              </h1>
            </div>
            <div className="text-sm text-gray-500">یادگیری زبان با لذت</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-12">
        <HeroSection />
        <MainSections />
        <LevelsOverview />
        <FeatureHighlights />
        <StatsSection />
      </main>
      
      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .group:hover .group-hover\\:animate-bounce {
          animation: bounce 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
