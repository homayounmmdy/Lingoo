import React from "react";
import AppConfig from "../config/app";

const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="text-6xl mb-4">🌟</div>
      <h2
        className="text-3xl md:text-4xl font-bold mb-3"
        style={{ color: "#f74697" }}
      >
        به {AppConfig.name} خوش آمدید!
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        با روشی سرگرم‌کننده و جذاب، اصطلاحات و گرامر انگلیسی را یاد بگیرید
      </p>
    </div>
  );
};

export default HeroSection;