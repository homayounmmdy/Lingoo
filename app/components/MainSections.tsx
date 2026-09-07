import Link from "next/link";
import React from "react";

const MainSections: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {sections.map((section) => (
        <Link key={section.href} href={section.href} className="group">
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer h-full"
            style={{ borderTop: `4px solid ${section.color}` }}
          >
            <div className="p-8 text-center">
              <div className="text-7xl mb-4 group-hover:animate-bounce inline-block">
                {section.icon}
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: section.color }}
              >
                {section.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {section.description}
              </p>
              <div
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all group-hover:gap-3"
                style={{
                  color: section.color,
                  backgroundColor: section.backgroundColor,
                }}
              >
                <span>{section.buttonText}</span>
                <span className="text-lg">←</span>
              </div>
            </div>
            {/* Features */}
            <div className="bg-gray-50 px-6 py-3 flex justify-around text-xs text-gray-500 border-t border-[#ffe073]/30">
              {section.features.map((feature, index) => (
                <span key={index}>{feature}</span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
interface Section {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  backgroundColor: string;
  buttonText: string;
  features: string[];
}

const sections: Section[] = [
  {
    href: "/trivia",
    icon: "🎯",
    title: "مسابقه زبان انگلیسی",
    description:
      "دانش خود را با سوالات چهارگزینه‌ای محک بزنید و نکات جالب یاد بگیرید!",
    color: "#f74697",
    backgroundColor: "#f7469710",
    buttonText: "شروع مسابقه",
    features: ["📋 > ۲۰ سوال", "💡 نکات آموزشی", "⭐ امتیازدهی"],
  },
  {
    href: "/idioms",
    icon: "📚",
    title: "دیکشنری اصطلاحات",
    description:
      "بیش از ۱۰۰ اصطلاح کاربردی انگلیسی با معنی فارسی و مثال‌های واقعی!",
    color: "#4097f2",
    backgroundColor: "#4097f210",
    buttonText: "مشاهده اصطلاحات",
    features: ["🔊 تلفظ صوتی", "📖 مثال‌های کاربردی", "🎲 حالت تصادفی"],
  },
  {
    href: "/level-based-wordlists",
    icon: "📖",
    title: "کلمات سطح‌بندی شده",
    description:
      "کلمات و اصطلاحات را بر اساس سطح (A1 تا C1) به صورت درس به درس یاد بگیرید!",
    color: "#10B981",
    backgroundColor: "#10B98110",
    buttonText: "شروع یادگیری",
    features: ["📊 ۵ سطح آموزشی", "📚 بیش از ۱۰۰ درس", "🏆 سیستم پیشرفت"],
  },
];
export default MainSections;
