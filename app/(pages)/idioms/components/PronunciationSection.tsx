import { PronunciationButton } from "./PronunciationButton";
import { SpeedControl } from "./SpeedControl";

interface PronunciationSectionProps {
  fonetic: string;
  currentSpeed: number;
  showSpeedControl: boolean;
  isSpeaking: boolean;
  onToggleSpeedControl: () => void;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onStop: () => void;
}

export const PronunciationSection: React.FC<PronunciationSectionProps> = ({
  fonetic,
  currentSpeed,
  showSpeedControl,
  isSpeaking,
  onToggleSpeedControl,
  onSpeedChange,
  onPlay,
  onStop,
}) => {
  return (
    <div
      className="rounded-xl p-4 transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: "#ffe07320" }}
    >
      <div className="text-center mb-3">
        <span className="text-sm text-gray-500">🔊 Pronunciation</span>
      </div>

      <p className="text-gray-700 font-mono text-sm text-center mb-4">
        {fonetic}
      </p>

      <SpeedControl
        currentSpeed={currentSpeed}
        showSpeedControl={showSpeedControl}
        onToggleSpeedControl={onToggleSpeedControl}
        onSpeedChange={onSpeedChange}
      />

      <PronunciationButton
        isSpeaking={isSpeaking}
        onPlay={onPlay}
        onStop={onStop}
      />

      <div className="text-center mt-3">
        <p className="text-xs text-gray-400">
          🎯 با تنظیم سرعت آهسته، کلمات را واضح‌تر بشنوید
        </p>
      </div>
    </div>
  );
};
