import { Idiom } from "@/app/types/idioms";
import { IdiomItem } from "./IdiomItem";

interface IdiomsListProps {
  idioms: Idiom[];
  selectedIdiom: Idiom | null;
  onSelectIdiom: (idiom: Idiom) => void;
  onStopPronunciation?: () => void;
  isRandomizing: boolean;
}

export const IdiomsList: React.FC<IdiomsListProps> = ({
  idioms,
  selectedIdiom,
  onSelectIdiom,
  onStopPronunciation,
  isRandomizing,
}) => {
  const handleSelect = (idiom: Idiom) => {
    onStopPronunciation?.();
    onSelectIdiom(idiom);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 border-t-4 border-[#f74697]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#ffe073]/30">
        <h2 className="font-bold" style={{ color: "#f74697" }}>
          📚 لیست اصطلاحات
        </h2>
        <span className="text-sm text-gray-500">{idioms.length} اصطلاحات</span>
      </div>

      <div className="p-4 max-h-150 overflow-y-scroll flex flex-col gap-3 overflow-x-hidden">
        {idioms.map((idiom, index) => (
          <IdiomItem
            key={index}
            idiom={idiom}
            isSelected={selectedIdiom?.idiom === idiom.idiom}
            onSelect={handleSelect}
            index={index}
            isRandomizing={isRandomizing}
          />
        ))}

        {idioms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {/* Empty state - searchTerm needs to be passed */}
          </div>
        )}
      </div>
    </div>
  );
};