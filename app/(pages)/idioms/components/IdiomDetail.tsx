import { Idiom } from "@/app/types/idioms";
import { IdiomExample } from "./IdiomExample";
import { IdiomMeaning } from "./IdiomMeaning";
import { NavigationButtons } from "./NavigationButtons";
import { PronunciationSection } from "./PronunciationSection";

interface IdiomDetailProps {
  idiom: Idiom | null;
  currentIndex: number;
  totalCount: number;
  currentSpeed: number;
  showSpeedControl: boolean;
  isSpeaking: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggleSpeedControl: () => void;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onStop: () => void;
}

export const IdiomDetail: React.FC<IdiomDetailProps> = ({
  idiom,
  currentIndex,
  totalCount,
  currentSpeed,
  showSpeedControl,
  isSpeaking,
  onNext,
  onPrev,
  onToggleSpeedControl,
  onSpeedChange,
  onPlay,
  onStop,
}) => {
  if (!idiom) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 detail-card transition-all duration-300 border-t-4 border-[#4097f2]">
        <div className="flex items-center justify-center h-96 text-center">
          <div>
            <div className="text-6xl mb-4">📖</div>
            <p className="text-gray-500">در حال بارگیری اصطلاحات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 detail-card transition-all duration-300 border-t-4 border-[#4097f2]">
      <NavigationButtons
        currentIndex={currentIndex}
        totalCount={totalCount}
        onNext={onNext}
        onPrev={onPrev}
      />

      <div className="space-y-4">
        <div className="text-center">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "#f74697" }}
          >
            {idiom.idiom}
          </h2>
        </div>

        <PronunciationSection
          fonetic={idiom.fonetic}
          currentSpeed={currentSpeed}
          showSpeedControl={showSpeedControl}
          isSpeaking={isSpeaking}
          onToggleSpeedControl={onToggleSpeedControl}
          onSpeedChange={onSpeedChange}
          onPlay={onPlay}
          onStop={onStop}
        />

        <IdiomMeaning meaning={idiom.persian} />
        <IdiomExample example={idiom.example} meaning={idiom.exampleMeaning} />
      </div>
    </div>
  );
};
