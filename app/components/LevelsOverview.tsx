import React from "react";

const LevelsOverview: React.FC = () => {
  return (
    <div className="mt-16">
      <h3
        className="text-2xl font-bold text-center mb-8"
        style={{ color: "#f74697" }}
      >
        سطوح آموزشی
      </h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {levels.map((item) => (
          <div
            key={item.level}
            className={`bg-linear-to-br ${item.gradient} rounded-xl p-4 text-white text-center transform hover:scale-105 transition-all duration-300`}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-bold text-xl">{item.level}</div>
            <div className="text-xs opacity-90">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const levels = [
  {
    level: "A1",
    label: "مبتدی",
    icon: "🌱",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    level: "A2",
    label: "ابتدایی",
    icon: "📘",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    level: "B1",
    label: "متوسط",
    icon: "📚",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    level: "B2",
    label: "بالاتر از متوسط",
    icon: "🎓",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    level: "C1",
    label: "پیشرفته",
    icon: "🏆",
    gradient: "from-red-500 to-rose-500",
  },
];

export default LevelsOverview;
