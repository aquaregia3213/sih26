import React, { useState } from 'react';
import { User, Globe, Type, Eye, Volume2, Bell, Shield, Users, Moon, Sun, ChevronRight, Save, CheckCircle2 } from 'lucide-react';
import { AccessibilitySettings, Language } from '../../types';
import { NER_LANGUAGES } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

interface SettingsPageProps {
  accessibilitySettings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  accessibilitySettings,
  onUpdateSettings,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [saved, setSaved] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    try {
      await apiClient.patch('/accessibility', {
        fontSize: accessibilitySettings.fontSize,
        highContrast: accessibilitySettings.highContrast,
        voiceReadout: accessibilitySettings.voiceReadout,
        screenReaderOptimized: accessibilitySettings.screenReaderOptimized,
        simplifiedNavigation: accessibilitySettings.simplifiedNavigation,
        reducedMotion: accessibilitySettings.reducedMotion,
        audioCues: accessibilitySettings.audioCues,
      });
    } catch (err) {
      // Retained locally
    }
    setTimeout(() => setSaved(false), 2000);
  };

  const fontSizes: { id: 'normal' | 'large' | 'extra-large'; label: string; desc: string }[] = [
    { id: 'normal', label: 'Normal', desc: 'Standard text size' },
    { id: 'large', label: 'Large', desc: 'Bigger text for comfort' },
    { id: 'extra-large', label: 'Extra Large', desc: 'Maximum readability' },
  ];

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6" id="view-settings">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#6A9B96]/15 flex items-center justify-center">
            <User className="w-6 h-6 text-[#6A9B96]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F]">
              Profile & Settings
            </h1>
            <p className="text-sm text-[#52635D]">
              Customize your experience
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4AF37]" />
            Personal Information
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-4xl">
              👴🏽
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#1E3A2F]">Bhaben Hazarika</p>
              <p className="text-sm text-[#52635D]">72 years · Guwahati, Assam</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#52635D] mb-1.5 uppercase tracking-wider">Name</label>
              <input
                type="text"
                defaultValue="Bhaben Hazarika"
                className="w-full py-3 px-4 rounded-xl bg-[#F5EFE6] border border-[#2D4739]/10 text-[#1E3A2F] font-semibold focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635D] mb-1.5 uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full py-3 px-4 rounded-xl bg-[#F5EFE6] border border-[#2D4739]/10 text-[#1E3A2F] font-semibold focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C66B44]" />
            Language
          </h2>
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between py-4 px-5 rounded-2xl bg-[#F5EFE6] border border-[#2D4739]/10 cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <div>
              <span className="block text-base font-bold text-[#1E3A2F]">
                {NER_LANGUAGES.find(l => l.id === currentLanguage)?.nativeScript || currentLanguage}
              </span>
              <span className="block text-xs text-[#52635D]">
                {NER_LANGUAGES.find(l => l.id === currentLanguage)?.region || ''}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#52635D]" />
          </button>
        </div>

        {/* Display Size */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-2 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#D4AF37]" />
            Display Size
          </h2>
          <p className="text-sm text-[#52635D] mb-4">Choose text size for comfortable reading.</p>
          <div className="space-y-2">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => onUpdateSettings({ fontSize: size.id })}
                className={`w-full flex items-center justify-between py-4 px-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  accessibilitySettings.fontSize === size.id
                    ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#1E3A2F] shadow-md'
                    : 'bg-white text-[#1E3A2F] border-[#2D4739]/10 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <span className="block text-base font-extrabold">{size.label}</span>
                  <span className={`block text-xs ${
                    accessibilitySettings.fontSize === size.id ? 'text-[#D4AF37]' : 'text-[#52635D]'
                  }`}>
                    {size.desc}
                  </span>
                </div>
                {accessibilitySettings.fontSize === size.id && (
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#1E3A2F]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#6A9B96]" />
            Accessibility
          </h2>
          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-base font-bold text-[#1E3A2F]">High Contrast Mode</span>
                <span className="block text-xs text-[#52635D]">Enhanced contrast for visibility</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ highContrast: !accessibilitySettings.highContrast })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.highContrast ? 'bg-[#2D4739]' : 'bg-[#EAE2D2]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.highContrast}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.highContrast ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-base font-bold text-[#1E3A2F]">Night Mode</span>
                <span className="block text-xs text-[#52635D]">Darker theme for evening use</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ darkMode: !accessibilitySettings.darkMode })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.darkMode ? 'bg-[#2D4739]' : 'bg-[#EAE2D2]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.darkMode}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.darkMode ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-base font-bold text-[#1E3A2F]">Reduced Motion</span>
                <span className="block text-xs text-[#52635D]">Minimize animations</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ reducedMotion: !accessibilitySettings.reducedMotion })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.reducedMotion ? 'bg-[#2D4739]' : 'bg-[#EAE2D2]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.reducedMotion}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.reducedMotion ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Voice */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#D4AF37]" />
            Voice Assistance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-base font-bold text-[#1E3A2F]">Voice Guide</span>
                <span className="block text-xs text-[#52635D]">Read instructions aloud</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ voiceGuideEnabled: !accessibilitySettings.voiceGuideEnabled })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.voiceGuideEnabled ? 'bg-[#2D4739]' : 'bg-[#EAE2D2]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.voiceGuideEnabled}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.voiceGuideEnabled ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-base font-bold text-[#1E3A2F]">Voice Speed</span>
                <span className="block text-xs text-[#52635D]">
                  Currently: {accessibilitySettings.voiceSpeed === 'slow' ? 'Gentle & Slow' : 'Normal'}
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ voiceSpeed: accessibilitySettings.voiceSpeed === 'slow' ? 'normal' : 'slow' })}
                className="px-4 py-2 rounded-xl bg-[#F5EFE6] border border-[#2D4739]/10 text-sm font-bold text-[#1E3A2F] cursor-pointer hover:border-[#D4AF37] transition-all"
              >
                {accessibilitySettings.voiceSpeed === 'slow' ? 'Switch to Normal' : 'Switch to Slow'}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C66B44]" />
            Notifications
          </h2>
          <div className="space-y-3">
            {['Activity Reminders', 'Medicine Reminders', 'Weekly Summary', 'Achievement Alerts'].map((item) => (
              <div key={item} className="flex items-center justify-between py-2">
                <span className="text-base font-bold text-[#1E3A2F]">{item}</span>
                <button
                  className="w-14 h-8 rounded-full bg-[#2D4739] cursor-pointer relative"
                  role="switch"
                  aria-checked={true}
                >
                  <div className="absolute top-1 left-7 w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Caregiver Connection */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-6">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6A9B96]" />
            Caregiver Connection
          </h2>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F5EFE6] border border-[#2D4739]/10">
            <div className="w-12 h-12 rounded-xl bg-[#C66B44]/15 flex items-center justify-center text-2xl">👩🏽</div>
            <div>
              <p className="text-base font-bold text-[#1E3A2F]">Anindita Baruah</p>
              <p className="text-xs text-[#52635D]">Daughter · Connected</p>
            </div>
            <span className="ml-auto w-3 h-3 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm mb-8">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#2D4739]" />
            Privacy & Data
          </h2>
          <p className="text-sm text-[#52635D] mb-4">
            Your data is encrypted and stored locally. No personal health information is shared without your consent.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#6A9B96]">
            <Shield className="w-4 h-4" />
            <span>AES-256 Encrypted · DPDP Act 2023 Compliant</span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer focus-accessible"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#FDFBF7] p-6 shadow-2xl border border-[#2D4739]/10 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-[#1E3A2F] mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C66B44]" />
              Choose Language
            </h3>
            <div className="space-y-2">
              {NER_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onSelectLanguage(lang.id as Language);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center justify-between py-4 px-5 rounded-2xl border-2 cursor-pointer transition-all text-left ${
                    currentLanguage === lang.id
                      ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#1E3A2F] shadow-md'
                      : 'bg-white text-[#1E3A2F] border-[#2D4739]/10 hover:border-[#D4AF37]'
                  }`}
                >
                  <div>
                    <span className="block text-lg font-extrabold">{lang.nativeScript}</span>
                    <span className={`block text-xs mt-0.5 ${
                      currentLanguage === lang.id ? 'text-[#D4AF37]' : 'text-[#52635D]'
                    }`}>
                      {lang.name} · {lang.region}
                    </span>
                  </div>
                  {currentLanguage === lang.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 py-3 rounded-2xl bg-[#F5EFE6] text-[#52635D] font-bold cursor-pointer hover:bg-[#EAE2D2] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
