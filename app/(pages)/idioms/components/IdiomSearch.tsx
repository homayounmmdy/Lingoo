interface IdiomSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const IdiomSearch: React.FC<IdiomSearchProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔍 اصطلاحات خود را به فارسی یا انگلیسی اینجا جستجو کنید..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#ffe073]/50 focus:border-[#f74697] focus:outline-none bg-white shadow-sm transition-all duration-300"
      />
    </div>
  );
};