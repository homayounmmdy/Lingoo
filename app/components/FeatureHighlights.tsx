import React from "react";

const FeatureHighlights: React.FC = () => {
  return (
    <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-2">{feature.icon}</div>
          <p className="text-sm text-gray-600">{feature.text}</p>
        </div>
      ))}
    </div>
  );
};

const features = [
  {
    icon: "🎓",
    text: "یادگیری تعاملی و سرگرم‌کننده",
  },
  {
    icon: "🚀",
    text: "بدون نیاز به ثبت‌نام",
  },
  {
    icon: "💎",
    text: "کاملاً رایگان",
  },
];
export default FeatureHighlights;
