"use client";

import React, { useCallback, useEffect } from "react";
import { useAnimations } from "@/app/hooks/useAnimations";
import { useIdioms } from "@/app/hooks/useIdioms";
import { useVoiceSettings } from "@/app/hooks/useVoiceSettings";
import { useVoiceSynthesis } from "@/app/hooks/useVoiceSynthesis";
import { IdiomDetail } from "./components/IdiomDetail";
import { IdiomSearch } from "./components/IdiomSearch";
import { IdiomsHeader } from "./components/IdiomsHeader";
import { IdiomsList } from "./components/IdiomsList";
import { LoadingOverlay } from "./components/LoadingOverlay";

const IdiomsPage: React.FC = () => {
  // Custom hooks
  const {
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
  } = useIdioms();

  const {
    settings,
    currentSpeed,
    setCurrentSpeed,
    showSpeedControl,
    toggleSpeedControl,
  } = useVoiceSettings();

  const { isSpeaking, speak, stop } = useVoiceSynthesis(settings);

  const { animateListItems, animateDetailTransition } = useAnimations();

  // Handlers with animation
  const handleRandomize = useCallback(() => {
    animateListItems(".idiom-item");
    randomizeOrder();
  }, [animateListItems, randomizeOrder]);

  const handleSortChange = useCallback((mode: "order" | "random") => {
    setSortOrder(mode);
    if (mode === "random") {
      handleRandomize();
    }
  }, [setSortOrder, handleRandomize]);

  const handleNext = useCallback(() => {
    stop();
    animateDetailTransition(nextIdiom);
  }, [stop, animateDetailTransition, nextIdiom]);

  const handlePrev = useCallback(() => {
    stop();
    animateDetailTransition(prevIdiom);
  }, [stop, animateDetailTransition, prevIdiom]);

  const handleSelectIdiom = useCallback((idiom: any) => {
    stop();
    setSelectedIdiom(idiom);
  }, [stop, setSelectedIdiom]);

  const handlePlay = useCallback(() => {
    if (selectedIdiom) {
      speak(selectedIdiom.idiom, currentSpeed);
    }
  }, [selectedIdiom, speak, currentSpeed]);

  // Auto-play effect
  useEffect(() => {
    if (settings.autoPlay && selectedIdiom && !isSpeaking) {
      const timer = setTimeout(() => {
        handlePlay();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [settings.autoPlay, selectedIdiom, isSpeaking, handlePlay]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f74697]/5 to-[#4097f2]/5" dir="rtl">
      <IdiomsHeader
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        isRandomizing={isRandomizing}
        diceRolling={isRandomizing}
      />

      <main className="max-w-6xl mx-auto px-4 pt-8">
        <IdiomSearch value={searchTerm} onChange={setSearchTerm} />

        <LoadingOverlay isVisible={isRandomizing} />

        <div className="grid lg:grid-cols-2 gap-6">
          <IdiomsList
            idioms={displayedIdioms}
            selectedIdiom={selectedIdiom}
            onSelectIdiom={handleSelectIdiom}
            onStopPronunciation={stop}
            isRandomizing={isRandomizing}
          />

          <IdiomDetail
            idiom={selectedIdiom}
            currentIndex={getCurrentIndex()}
            totalCount={displayedIdioms.length}
            currentSpeed={currentSpeed}
            showSpeedControl={showSpeedControl}
            isSpeaking={isSpeaking}
            onNext={handleNext}
            onPrev={handlePrev}
            onToggleSpeedControl={toggleSpeedControl}
            onSpeedChange={setCurrentSpeed}
            onPlay={handlePlay}
            onStop={stop}
          />
        </div>
      </main>
    </div>
  );
};

export default IdiomsPage;