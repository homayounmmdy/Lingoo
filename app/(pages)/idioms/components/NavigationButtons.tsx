interface NavigationButtonsProps {
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentIndex,
  totalCount,
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className={`
          p-2 rounded-lg transition transform hover:scale-110
          ${currentIndex === 0 ? "text-gray-300 cursor-not-allowed" : "hover:bg-[#ffe073]/30"}
        `}
      >
        → قبلی
      </button>
      <span className="text-sm text-gray-500">
        {currentIndex + 1} / {totalCount}
      </span>
      <button
        onClick={onNext}
        disabled={currentIndex === totalCount - 1}
        className={`
          p-2 rounded-lg transition transform hover:scale-110
          ${currentIndex === totalCount - 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-[#ffe073]/30"}
        `}
      >
        بعدی ←
      </button>
    </div>
  );
};