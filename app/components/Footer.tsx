import AppConfig from "../config/app";

const Footer = () => {
  return (
    <footer className="text-center mt-12 py-8 border-t border-[#ffe073]/30">
      <p className="text-sm text-gray-500">
        🤝 Open Source — با مشارکت شما بهتر می‌شویم
      </p>
      <p className="text-xs text-gray-400 mt-2">
        {AppConfig.name} - یادگیری زبان انگلیسی به روش مدرن
      </p>
    </footer>
  );
};

export default Footer;
