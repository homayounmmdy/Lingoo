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
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="32"
              />
            </svg>
            در حال پخش...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect
              x="6"
              y="6"
              width="12"
              height="12"
              rx="1"
              fill="currentColor"
            />
          </svg>
          توقف
        </button>
      )}
    </div>
  );
};
