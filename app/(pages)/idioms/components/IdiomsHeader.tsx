import Link from "next/link";
import { SortControls } from "./SortControls";
import AppConfig from "@/app/config/app";

interface IdiomsHeaderProps {
  sortOrder: "order" | "random";
  onSortChange: (mode: "order" | "random") => void;
  isRandomizing: boolean;
  diceRolling: boolean;
}

export const IdiomsHeader: React.FC<IdiomsHeaderProps> = ({
  sortOrder,
  onSortChange,
  isRandomizing,
  diceRolling,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-[#ffe073]/30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🦜</span>
            <h1 className="text-2xl font-bold" style={{ color: "#f74697" }}>
              {AppConfig.name}
            </h1>
          </Link>

          <div className="flex gap-2">
            <Link href="/settings">
              <button className="px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-600 hover:bg-[#ffe073] transition-all duration-300">
                ⚙️ تنظیمات صدا
              </button>
            </Link>
            <SortControls
              sortOrder={sortOrder}
              onSortChange={onSortChange}
              isRandomizing={isRandomizing}
              diceRolling={diceRolling}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
