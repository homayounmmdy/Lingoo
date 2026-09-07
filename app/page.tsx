"use client";
import React from "react";
import FeatureHighlights from "./components/FeatureHighlights";
import HeroSection from "./components/HeroSection";
import HomeHeader from "./components/HomeHeader";
import LevelsOverview from "./components/LevelsOverview";
import MainSections from "./components/MainSections";
import StatsSection from "./components/StatsSection";
import "./home.css";

const HomePage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-[#f74697]/5 to-[#4097f2]/5"
      dir="rtl"
    >
      <HomeHeader />
      <main className="max-w-6xl mx-auto px-4 pt-12">
        <HeroSection />
        <MainSections />
        <LevelsOverview />
        <FeatureHighlights />
        <StatsSection />
      </main>
    </div>
  );
};

export default HomePage;
