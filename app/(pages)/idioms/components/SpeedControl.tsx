import { SPEED_OPTIONS } from "@/app/types/idioms";

interface SpeedControlProps {
  currentSpeed: number;
  showSpeedControl: boolean;
  onToggleSpeedControl: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  currentSpeed,
  showSpeedControl,
  onToggleSpeedControl,
  onSpeedChange,
}) => {
  const getCurrentSpeedLabel = () => {
    const option = SPEED_OPTIONS.find((opt) => opt.value === currentSpeed);
    return option ? option.label : "⚡ معمولی";
  };

  return (
    <div className="mb-4">
      <button
        onClick={onToggleSpeedControl}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/50 hover:bg-white transition-all duration-300 border border-[#ffe073]"
      >
        <span className="text-sm text-gray-600">🎚️ سرعت پخش:</span>
        <span className="text-sm font-medium" style={{ color: "#f74697" }}>
          {getCurrentSpeedLabel()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            showSpeedControl ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showSpeedControl && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSpeedChange(option.value);
                onToggleSpeedControl();
              }}
              className={`
                w-full px-3 py-2 text-right transition-all duration-200
                flex items-center justify-between
                ${
                  currentSpeed === option.value
                    ? "bg-[#f74697]/10 text-[#f74697] font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }
              `}
            >
              <span>{option.label}</span>
              {currentSpeed === option.value && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// components/idioms/PronunciationButton.tsx
interface PronunciationButtonProps {
  isSpeaking: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export const PronunciationButton: React.FC<PronunciationButtonProps> = ({
  isSpeaking,
  onPlay,
  onStop,
}) => {
  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={onPlay}
        disabled={isSpeaking}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${
            isSpeaking
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#f74697] text-white hover:bg-[#d63081] hover:shadow-lg transform hover:scale-105"
          }
        `}
      >
        {isSpeaking ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" />
            </svg>
            در حال پخش...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <span>شنیدن اصطلاح</span>
          </>
        )}
      </button>

      {isSpeaking && (
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
          </svg>
          توقف
        </button>
      )}
    </div>
  );
};