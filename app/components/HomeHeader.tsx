import React from "react";

const HomeHeader: React.FC = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-[#ffe073]/30">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🦜</span>
            <h1 className="text-2xl font-bold" style={{ color: "#f74697" }}>
              لینگو
            </h1>
          </div>
          <div className="text-sm text-gray-500">یادگیری زبان با لذت</div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
