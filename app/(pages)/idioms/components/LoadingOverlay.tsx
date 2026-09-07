interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center border-t-4 border-[#f74697]">
        <div className="text-6xl mb-4 animate-bounce">🎲</div>
        <div className="text-2xl font-bold mb-2" style={{ color: "#f74697" }}>
          برزدن اصطلاحات!
        </div>
        <div className="text-gray-500">تصادفی کردن تجربه یادگیری شما...</div>
        <div className="mt-4 flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#f74697" }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-100" style={{ backgroundColor: "#ffe073" }}></div>
          <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ backgroundColor: "#4097f2" }}></div>
        </div>
      </div>
    </div>
  );
};