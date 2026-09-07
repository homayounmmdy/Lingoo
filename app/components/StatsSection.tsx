import React from "react";

const StatsSection: React.FC = () => {
  return (
    <div className="mt-16 bg-linear-to-r from-[#f74697]/10 to-[#4097f2]/10 rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-6" style={{ color: "#f74697" }}>
        آمار لینگو
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const stats = [
  {
    value: "۱۰۰+",
    label: "اصطلاحات کاربردی",
    color: "#f74697",
  },
  {
    value: "۵",
    label: "سطح آموزشی",
    color: "#4097f2",
  },
  {
    value: "۱۰۰+",
    label: "درس تعاملی",
    color: "#10B981",
  },
  {
    value: "۲۰۰۰+",
    label: "کلمه و لغت",
    color: "#F59E0B",
  },
];

export default StatsSection;
