import { Idiom } from "@/app/types/idioms";

interface IdiomItemProps {
  idiom: Idiom;
  isSelected: boolean;
  onSelect: (idiom: Idiom) => void;
  index: number;
  isRandomizing: boolean;
}

export const IdiomItem: React.FC<IdiomItemProps> = ({
  idiom,
  isSelected,
  onSelect,
  index,
  isRandomizing,
}) => {
  return (
    <button
      onClick={() => onSelect(idiom)}
      className={`cursor-pointer w-full p-3 rounded-lg transition-all duration-300
        ${
          isSelected
            ? "text-white shadow-md scale-102"
            : "bg-gray-50 hover:bg-[#ffe073]/30 text-gray-700 hover-scale"
        }
      `}
      style={{
        backgroundColor: isSelected ? "#f74697" : undefined,
        animation: isRandomizing
          ? `slideIn 0.3s ease-out ${index * 0.02}s`
          : "none",
      }}
    >
      <div className="font-bold text-left">{idiom.idiom}</div>
      <div
        className={`text-sm text-right ${
          isSelected ? "text-pink-100" : "text-gray-500"
        }`}
      >
        {idiom.persian}
      </div>
    </button>
  );
};