import React from 'react';
import { Heart, Globe, Shield, Phone, Sparkles } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { CulturalPatternBorder } from '../common/CulturalPatternBorder';
import { soundSynth } from '../../utils/audioSynth';
import { VanikaLogo } from '../common/VanikaLogo';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onSelectLanguage?: (lang: Language) => void;
  currentLanguage: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectLanguage,
  currentLanguage
}) => {
  const handleNav = (view: ActiveView) => {
    soundSynth.playSoftClick();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#13271E] text-[#FAF7F2] relative pt-12 pb-8 border-t border-[#C99738]/20">
      {/* Cultural border line */}
      <CulturalPatternBorder variant="gamusa" inverted className="mb-8 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Clinical-Cultural Vision */}
          <div className="lg:col-span-2 space-y-4">
            <VanikaLogo onClick={() => handleNav('home')} />

            <p className="text-xs sm:text-sm text-[#D1DCD6] leading-relaxed max-w-md font-normal">
              A calm digital community courtyard providing culturally grounded, voice-first cognitive care and memory assistance for elderly individuals and family caregivers across North-East India.
            </p>

            <div className="p-3 rounded-lg bg-white/06 border border-white/10 max-w-md flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#C99738] shrink-0 mt-0.5" />
              <div className="text-xs text-[#FAF7F2]">
                <strong className="text-[#C99738] block mb-0.5">Community & ASHA Alignment</strong>
                Designed for field integration with community health workers, local village dialects, and family elders.
              </div>
            </div>
          </div>

          {/* Col 2: Core Experience */}
          <div>
            <h4 className="text-xs font-bold text-[#C99738] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Core Activities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('patient-app')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Elder Courtyard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('memory-house')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Memory House (Courtyard Rooms)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('memory-garden')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Memory Garden Sanctuary
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('game-memory')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Photo Recall & Cherished Faces
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('game-sequence')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Bihu & Routine Sequencing
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Caregiver & Trust */}
          <div>
            <h4 className="text-xs font-bold text-[#C99738] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Clinical & Caregivers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('caregiver-portal')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Cognitive Trends Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Local-First Encryption (DPDP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  How Vanika Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('daily-routine')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Daily Routine Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('progress')}
                  className="text-[#D1DCD6] hover:text-[#C99738] transition-colors cursor-pointer text-left"
                >
                  Longitudinal Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Dialects */}
          <div>
            <h4 className="text-xs font-bold text-[#C99738] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> NER Dialects
            </h4>
            <div className="flex flex-col gap-1">
              {REGIONAL_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    soundSynth.playSoftClick();
                    if (onSelectLanguage) onSelectLanguage(lang.id);
                  }}
                  className={`text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    currentLanguage === lang.id
                      ? 'bg-[#C99738] text-[#13271E] font-bold'
                      : 'text-[#D1DCD6] hover:bg-white/06'
                  }`}
                >
                  <span>{lang.nativeScript}</span>
                  <span className="opacity-75 text-[10px]">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional copyright and safe ethics statement */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D1DCD6] gap-3 text-center sm:text-left">
          <p>
            © 2026 Vanika (SIH 2026). Handcrafted with reverence for the elders and families of North-East India.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-[#C99738]">
              <Heart className="w-3.5 h-3.5 fill-current" /> Non-Stigmatizing Metaphors
            </span>
            <span>•</span>
            <span>Zero Diagnostic Jargon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
