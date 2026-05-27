"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VoiceSettings {
  preferredVoice: string;
  voicePriority: string[];
  defaultSpeed: number;
  autoPlay: boolean;
}

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    preferredVoice: "",
    voicePriority: [],
    defaultSpeed: 0.85,
    autoPlay: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [testText, setTestText] = useState("be in the black");
  const [isTesting, setIsTesting] = useState(false);
  const [currentPlayingVoice, setCurrentPlayingVoice] = useState<string>("");

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("idiomVoiceSettings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        } catch (e) {
          console.error("Failed to parse settings", e);
        }
      }
    };

    loadSettings();
  }, []);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Get the best voice based on priority (SAME LOGIC as idioms page)
  const getBestVoice = (): SpeechSynthesisVoice | null => {
    // First, try to find a voice from priority list
    for (const priorityVoice of settings.voicePriority) {
      const voice = availableVoices.find(v => v.name === priorityVoice);
      if (voice) {
        console.log("Using priority voice:", voice.name);
        return voice;
      }
    }
    
    // Fallback to default English voices
    const fallbackVoices = [
      'Google UK English Female',
      'Google US English Female',
      'Google UK English Male',
      'Google US English Male',
      'Samantha',
      'Alex',
      'Microsoft David',
      'Microsoft Zira',
    ];
    
    for (const voiceName of fallbackVoices) {
      const voice = availableVoices.find(v => v.name.includes(voiceName));
      if (voice) {
        console.log("Using fallback voice:", voice.name);
        return voice;
      }
    }
    
    // Last resort: any English voice
    const anyEnglish = availableVoices.find(v => v.lang.startsWith('en-'));
    if (anyEnglish) {
      console.log("Using any English voice:", anyEnglish.name);
      return anyEnglish;
    }
    
    return null;
  };

  // Test the selected voice with priority system
  const testVoice = () => {
    if (!testText.trim()) {
      alert("لطفاً متن تست را وارد کنید");
      return;
    }
    
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsTesting(true);
    
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.rate = settings.defaultSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    // Apply the best voice based on priority
    const bestVoice = getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
      setCurrentPlayingVoice(bestVoice.name);
      console.log("Testing with voice:", bestVoice.name);
    } else {
      setCurrentPlayingVoice("Default voice");
      console.log("No suitable voice found, using default");
    }

    utterance.onend = () => {
      setIsTesting(false);
      setCurrentPlayingVoice("");
    };
    
    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsTesting(false);
      setCurrentPlayingVoice("");
      alert("خطا در پخش صدا. لطفاً دوباره تلاش کنید.");
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopTest = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsTesting(false);
      setCurrentPlayingVoice("");
    }
  };

  // Save settings to localStorage
  const saveSettings = () => {
    setIsSaving(true);
    localStorage.setItem("idiomVoiceSettings", JSON.stringify(settings));
    
    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      alert("تنظیمات با موفقیت ذخیره شد!");
    }, 500);
  };

  // Add voice to priority list
  const addToPriority = (voiceName: string) => {
    if (!settings.voicePriority.includes(voiceName)) {
      setSettings({
        ...settings,
        voicePriority: [...settings.voicePriority, voiceName]
      });
    }
  };

  // Remove voice from priority list
  const removeFromPriority = (voiceName: string) => {
    setSettings({
      ...settings,
      voicePriority: settings.voicePriority.filter(v => v !== voiceName)
    });
  };

  // Move voice up in priority
  const moveUpPriority = (index: number) => {
    if (index > 0) {
      const newPriority = [...settings.voicePriority];
      [newPriority[index - 1], newPriority[index]] = [newPriority[index], newPriority[index - 1]];
      setSettings({ ...settings, voicePriority: newPriority });
    }
  };

  // Move voice down in priority
  const moveDownPriority = (index: number) => {
    if (index < settings.voicePriority.length - 1) {
      const newPriority = [...settings.voicePriority];
      [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]];
      setSettings({ ...settings, voicePriority: newPriority });
    }
  };

  // Set as primary voice (move to top)
  const setAsPrimary = (voiceName: string) => {
    const newPriority = [voiceName, ...settings.voicePriority.filter(v => v !== voiceName)];
    setSettings({ ...settings, voicePriority: newPriority });
  };

  // Speed options
  const speedOptions = [
    { label: "خیلی آهسته (Very Slow)", value: 0.5, emoji: "🐢" },
    { label: "آهسته (Slow)", value: 0.7, emoji: "🐢" },
    { label: "معمولی (Normal)", value: 0.85, emoji: "⚡" },
    { label: "تند (Fast)", value: 1.0, emoji: "🐇" },
    { label: "خیلی تند (Very Fast)", value: 1.2, emoji: "🐇" },
  ];

  // Group voices by language
  const englishVoices = availableVoices.filter(voice => 
    voice.lang.startsWith('en-')
  );

  const otherVoices = availableVoices.filter(voice => 
    !voice.lang.startsWith('en-')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f74697]/5 to-[#4097f2]/5" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-[#ffe073]/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🦜</span>
              <h1 className="text-2xl font-bold" style={{ color: '#f74697' }}>لینگو</h1>
            </Link>
            
            <div className="flex gap-2">
              <Link href="/idioms">
                <button className="px-4 py-2 rounded-lg font-bold bg-gray-100 text-gray-600 hover:bg-[#ffe073] transition-all duration-300">
                  ← بازگشت به اصطلاحات
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#f74697] to-[#4097f2] p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">⚙️ تنظیمات صدا</h2>
            <p className="opacity-90">تنظیمات مربوط به تلفظ اصطلاحات را اینجا مدیریت کنید</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Voice Priority Section */}
            <div className="border rounded-xl p-4 border-[#ffe073]">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#f74697' }}>
                🎙️ اولویت صداها
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                صداهای مورد نظر خود را انتخاب کنید. برنامه به ترتیب اولویت از این صداها استفاده خواهد کرد.
              </p>

              {/* Priority List */}
              {settings.voicePriority.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لیست اولویت (بالا به پایین):
                  </label>
                  <div className="space-y-2">
                    {settings.voicePriority.map((voiceName, index) => {
                      const voice = availableVoices.find(v => v.name === voiceName);
                      return (
                        <div key={voiceName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{voice?.name || voiceName}</div>
                            <div className="text-xs text-gray-500">{voice?.lang}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveUpPriority(index)}
                              disabled={index === 0}
                              className="p-1 text-gray-600 hover:text-[#f74697] disabled:opacity-30"
                              title="بالا بردن اولویت"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveDownPriority(index)}
                              disabled={index === settings.voicePriority.length - 1}
                              className="p-1 text-gray-600 hover:text-[#f74697] disabled:opacity-30"
                              title="پایین بردن اولویت"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => removeFromPriority(voiceName)}
                              className="p-1 text-red-500 hover:text-red-700"
                              title="حذف از اولویت"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Voices */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صداهای موجود:
                </label>
                
                {/* English Voices */}
                <div className="mb-3">
                  <div className="text-sm font-semibold text-gray-600 mb-2">🇬🇧 صداهای انگلیسی</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {englishVoices.map((voice) => (
                      <div key={voice.name} className="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-xs text-gray-500">{voice.lang}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setAsPrimary(voice.name)}
                            disabled={settings.voicePriority.includes(voice.name)}
                            className="px-2 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300"
                            title="قرار دادن در اولویت اول"
                          >
                            اصلی
                          </button>
                          <button
                            onClick={() => addToPriority(voice.name)}
                            disabled={settings.voicePriority.includes(voice.name)}
                            className="px-3 py-1 text-sm rounded-lg bg-[#f74697] text-white hover:bg-[#d63081] disabled:bg-gray-300"
                          >
                            افزودن به اولویت
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Voices */}
                {otherVoices.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">🌍 سایر صداها</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {otherVoices.map((voice) => (
                        <div key={voice.name} className="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="font-medium">{voice.name}</div>
                            <div className="text-xs text-gray-500">{voice.lang}</div>
                          </div>
                          <button
                            onClick={() => addToPriority(voice.name)}
                            disabled={settings.voicePriority.includes(voice.name)}
                            className="px-3 py-1 text-sm rounded-lg bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300"
                          >
                            افزودن به اولویت
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableVoices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    در حال بارگیری صداها...
                  </div>
                )}
              </div>
            </div>

            {/* Default Speed Setting */}
            <div className="border rounded-xl p-4 border-[#ffe073]">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#f74697' }}>
                ⚡ سرعت پیش‌فرض پخش
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {speedOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSettings({ ...settings, defaultSpeed: option.value })}
                      className={`
                        px-3 py-2 rounded-lg transition-all duration-300 text-sm
                        ${settings.defaultSpeed === option.value
                          ? 'bg-[#f74697] text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-[#ffe073]'
                        }
                      `}
                    >
                      <span className="ml-1">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-play Setting */}
            <div className="border rounded-xl p-4 border-[#ffe073]">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#f74697' }}>
                ▶️ تنظیمات خودکار
              </h3>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-700">پخش خودکار اصطلاحات</div>
                  <div className="text-sm text-gray-500">هنگام انتخاب اصطلاح، به طور خودکار تلفظ شود</div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.autoPlay}
                    onChange={(e) => setSettings({ ...settings, autoPlay: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f74697]"></div>
                </div>
              </label>
            </div>

            {/* Test Section - FIXED */}
            <div className="border rounded-xl p-4 border-[#ffe073] bg-gradient-to-r from-[#f74697]/5 to-[#4097f2]/5">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#f74697' }}>
                🎵 تست صدا با تنظیمات فعلی
              </h3>
              
              {/* Show current voice info */}
              <div className="mb-4 p-3 bg-white rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">صدای فعال:</span>
                  <span className="font-medium text-[#f74697]">
                    {settings.voicePriority.length > 0 
                      ? settings.voicePriority[0] 
                      : "صدای پیش‌فرض مرورگر"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">تعداد اولویت‌ها:</span>
                  <span className="font-medium">{settings.voicePriority.length} صدا</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">سرعت فعلی:</span>
                  <span className="font-medium">
                    {speedOptions.find(o => o.value === settings.defaultSpeed)?.label || "معمولی"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#f74697] text-sm font-mono"
                  rows={2}
                  dir="ltr"
                  placeholder="متن تست را به انگلیسی وارد کنید..."
                />
                
                {/* Voice being tested indicator */}
                {isTesting && currentPlayingVoice && (
                  <div className="text-center text-sm text-green-600">
                    🎤 در حال پخش با: {currentPlayingVoice}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={testVoice}
                    disabled={isTesting}
                    className="flex-1 px-4 py-2 bg-[#4097f2] text-white rounded-lg hover:bg-[#3081d0] transition-all duration-300 disabled:opacity-50"
                  >
                    {isTesting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32"/>
                        </svg>
                        در حال پخش...
                      </span>
                    ) : (
                      "🔊 تست تلفظ با اولویت‌های انتخاب شده"
                    )}
                  </button>
                  {isTesting && (
                    <button
                      onClick={stopTest}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                    >
                      توقف
                    </button>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>💡 نکته: تست با همان اولویت‌هایی که تنظیم کرده‌اید پخش می‌شود</p>
                  <p>🎯 مثال: "be in the black" - تلفظ صحیح این اصطلاح را بشنوید</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#f74697] text-white rounded-xl font-bold hover:bg-[#d63081] transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {isSaving ? "در حال ذخیره..." : "💾 ذخیره تنظیمات"}
              </button>
              <Link href="/idioms" className="flex-1">
                <button className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300">
                  ← بازگشت به اصطلاحات
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;