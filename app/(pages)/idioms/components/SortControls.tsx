interface SortControlsProps {
  sortOrder: "order" | "random";
  onSortChange: (mode: "order" | "random") => void;
  isRandomizing: boolean;
  diceRolling: boolean;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortOrder,
  onSortChange,
  isRandomizing,
  diceRolling,
}) => {
  return (
    <>
      <button
        onClick={() => onSortChange("order")}
        className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
          sortOrder === "order"
            ? "bg-[#f74697] text-white shadow-lg scale-105"
            : "bg-gray-100 text-gray-600 hover:bg-[#ffe073] hover:text-gray-800"
        }`}
      >
        📋 الفبا
      </button>
      <button
        onClick={() => onSortChange("random")}
        disabled={isRandomizing}
        className={`
          px-4 py-2 rounded-lg font-bold transition-all duration-300 relative
          ${
            sortOrder === "random"
              ? "bg-[#f74697] text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-[#ffe073] hover:text-gray-800"
          }
          ${isRandomizing ? "cursor-wait opacity-75" : ""}
        `}
      >
        <span
          className={`inline-block transition-transform ${
            diceRolling ? "animate-dice-roll" : ""
          }`}
        >
          🎲
        </span>
        {isRandomizing ? " برزدن..." : " تصادفی"}
      </button>
    </>
  );
};
