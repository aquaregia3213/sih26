import React, { useState } from 'react';
import { Volume2, MapPin, Globe, BookOpen } from 'lucide-react';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { Language } from '../../types';
import { VoiceAssistant } from '../../utils/speech';
import { soundSynth } from '../../utils/audioSynth';

interface CulturalSectionProps {
  currentLanguage: Language;
  onSelectLanguage?: (lang: Language) => void;
}

export const CulturalSection: React.FC<CulturalSectionProps> = ({
  currentLanguage,
  onSelectLanguage
}) => {
  const [playingId, setPlayingId] = useState<Language | null>(null);

  const handlePlayAudio = async (langId: Language, sampleText: string) => {
    soundSynth.playSoftClick();
    setPlayingId(langId);
    await VoiceAssistant.speak(sampleText, langId, 'slow');
    setPlayingId(null);
  };

  const selectedLang = REGIONAL_LANGUAGES.find(l => l.id === currentLanguage) || REGIONAL_LANGUAGES[0];

  return (
    <section className="py-14 sm:py-20 bg-cultural-subtle border-b border-[#1C382B]/10 dark:border-white/10" id="section-culture">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B3532D]/10 text-[#B3532D] text-xs font-semibold uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>North-East Regional Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#162620] dark:text-[#FAF7F2] tracking-tight">
            Reminiscence Anchored in Familiar Memories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed">
            Dementia care is most effective when grounded in native mother tongues, authentic folklore, folk instruments, and childhood memories.
          </p>
        </div>

        {/* 6 Regional Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {REGIONAL_LANGUAGES.map((lang) => {
            const isCurrent = currentLanguage === lang.id;
            const isPlaying = playingId === lang.id;

            return (
              <div
                key={lang.id}
                className={`card-editorial p-5 flex flex-col justify-between relative group ${
                  isCurrent 
                    ? 'border-[#C99738] ring-1 ring-[#C99738]/30 bg-white dark:bg-[#1A2620]' 
                    : 'bg-white dark:bg-[#16221C]'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B3532D]">
                      {lang.region}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-[#1C382B] dark:bg-[#C99738] text-white dark:text-[#13271E] text-[10px] font-bold">
                        Active Language
                      </span>
                    )}
                  </div>

                  {/* Native Script & Language Name */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#162620] dark:text-[#FAF7F2]">
                      {lang.nativeScript}
                    </h3>
                    <p className="text-xs font-medium text-[#4A5852] dark:text-[#9DB0A7]">
                      {lang.name}
                    </p>
                  </div>

                  {/* Greeting Quote */}
                  <blockquote className="my-3 p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border-l-2 border-[#C99738] text-xs text-[#1C382B] dark:text-[#FAF7F2] italic">
                    "{lang.greeting}"
                  </blockquote>

                  <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed mb-4">
                    {lang.description}
                  </p>
                </div>

                {/* Audio and Selection Actions */}
                <div className="pt-3 border-t border-[#1C382B]/08 dark:border-white/08 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePlayAudio(lang.id, lang.audioSampleText)}
                    className="py-1.5 px-3 rounded-lg bg-[#1C382B] dark:bg-[#23352A] hover:bg-[#2E5240] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus-accessible"
                    title={`Listen to spoken ${lang.name} greeting`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 text-[#C99738] ${isPlaying ? 'animate-pulse' : ''}`} />
                    <span>{isPlaying ? 'Playing...' : 'Hear Greeting'}</span>
                  </button>

                  {onSelectLanguage && (
                    <button
                      onClick={() => {
                        soundSynth.playSoftClick();
                        onSelectLanguage(lang.id);
                      }}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#C99738]/20 text-[#C99738] border-[#C99738]/40'
                          : 'bg-transparent text-[#1C382B] dark:text-[#FAF7F2] border-[#1C382B]/15 dark:border-white/15 hover:bg-[#F3ECE2] dark:hover:bg-white/05'
                      }`}
                    >
                      {isCurrent ? 'Current' : 'Select'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Cultural Anchor Card */}
        <div className="card-editorial-dark p-7 sm:p-9 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#C99738]/20 text-[#C99738] text-[11px] font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Active Region Focus: {selectedLang.region}</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Authentic sensory cues reduce agitation and rebuild confidence.
              </h3>

              <p className="text-xs sm:text-sm text-[#D1DCD6] leading-relaxed">
                Whether listening to the cadence of Assamese Bihu rhythms, recognizing Muga silk textures, or remembering the smell of morning Lal Saah, Vanika treats culture not as decoration, but as cognitive therapy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-lg bg-white/08 border border-white/10 text-xs">
                  <span className="font-bold text-[#C99738] block mb-0.5">🌸 Traditional Weaves</span>
                  <span className="text-[#D1DCD6] text-[11px]">Muga silk, Puan, Aronai</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/08 border border-white/10 text-xs">
                  <span className="font-bold text-[#C99738] block mb-0.5">🪘 Folk Instruments</span>
                  <span className="text-[#D1DCD6] text-[11px]">Dhol, Pepa, Gogona, Flute</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/08 border border-white/10 text-xs">
                  <span className="font-bold text-[#C99738] block mb-0.5">🍵 Courtyard Flavors</span>
                  <span className="text-[#D1DCD6] text-[11px]">Manimuni, Til Pitha, Gur</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-xl bg-white/06 border border-white/10 text-center space-y-3">
              <span className="text-4xl block">🪶</span>
              <h4 className="text-base font-bold text-white">
                Voice-First & Non-Literate
              </h4>
              <p className="text-xs text-[#D1DCD6] leading-relaxed">
                Designed specifically for elders who may have difficulty reading or writing—every step is spoken aloud clearly with compassionate pacing.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
