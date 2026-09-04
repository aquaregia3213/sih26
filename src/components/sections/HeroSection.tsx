import React, { useState } from 'react';
import { Volume2, ShieldCheck, ArrowRight, Play, Stethoscope, Cpu, Globe2, Sparkles } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';
import { getTranslation } from '../../utils/translations';
import { CulturalPatternBorder } from '../common/CulturalPatternBorder';

interface HeroSectionProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
  onOpenDemoStory?: () => void;
  currentLanguage?: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenCompanion,
  onOpenDemoStory,
  currentLanguage = 'English'
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = getTranslation(currentLanguage as Language);

  const handleHearWelcome = async () => {
    soundSynth.playGentleChime();
    setIsPlayingAudio(true);
    await VoiceAssistant.speak(
      "Namaskar and warm welcome to Vanika. Here in our digital community courtyard, you can remember cherished moments, play gentle games, and talk with a wise elder companion.",
      currentLanguage as Language,
      'slow'
    );
    setIsPlayingAudio(false);
  };

  return (
    <section
      id="section-hero"
      className="relative bg-[#FAF7F2] dark:bg-[#111A15] pt-12 pb-16 sm:pb-20 border-b border-[#1C382B]/10 dark:border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── EDITORIAL HEADER ── */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C382B]/06 dark:bg-white/10 border border-[#1C382B]/12 dark:border-white/15 text-[#1C382B] dark:text-[#FAF7F2] text-xs font-semibold tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-[#B3532D]" />
            <span>AI-Assisted Reminiscence & Cognitive Care • North-East India</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#162620] dark:text-[#FAF7F2] tracking-tight leading-[1.12]">
            Dignified Memory Care{' '}
            <span className="text-[#B3532D] block sm:inline">Rooted in Heritage.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed max-w-2xl mx-auto font-normal">
            Gentle, clinically grounded cognitive exercises and voice companionship for elders with mild cognitive impairment — tailored in Assamese, Hindi, and regional traditions.
          </p>

          {/* Audio Invitation Button */}
          <div className="mt-6 flex justify-center">
            <button
              id="btn-hero-hear-welcome"
              onClick={handleHearWelcome}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-[#1A2620] border border-[#1C382B]/15 dark:border-white/15 text-[#1C382B] dark:text-[#FAF7F2] text-xs sm:text-sm font-semibold hover:border-[#C99738] transition-colors cursor-pointer shadow-xs focus-accessible"
            >
              <Volume2 className={`w-4 h-4 text-[#C99738] ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingAudio ? 'Speaking in your language...' : 'Listen to Spoken Welcome in Local Language'}</span>
            </button>
          </div>
        </div>

        {/* ── DUAL TARGET ENTRY PORTALS ── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* PORTAL 1: Elder Courtyard */}
          <button
            id="btn-hero-elder-courtyard"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('patient-app');
            }}
            className="group card-editorial-dark p-7 text-left flex flex-col justify-between cursor-pointer focus-accessible"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">👴🏽</span>
                <span className="px-2.5 py-1 rounded-md bg-[#C99738]/20 text-[#C99738] text-[11px] font-bold tracking-wider uppercase">
                  Senior Friendly
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
                Enter Elder Courtyard
              </h2>
              <p className="text-sm text-[#D1DCD6] leading-relaxed mb-6 font-normal">
                Calibrated low-strain memory recall, family photo album exploration, gentle tea garden focus games, and voice chats with Oja.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#C99738] font-bold text-sm pt-4 border-t border-white/10 group-hover:gap-3 transition-all">
              <span>Start gentle session</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* PORTAL 2: Caregiver Suite */}
          <button
            id="btn-hero-caregiver-vault"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('caregiver-portal');
            }}
            className="group card-editorial p-7 text-left flex flex-col justify-between cursor-pointer focus-accessible bg-white dark:bg-[#1A2620] border-[#1C382B]/15 hover:border-[#B3532D]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#B3532D]/10 flex items-center justify-center text-[#B3532D]">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#B3532D]/10 text-[#B3532D] text-[11px] font-bold tracking-wider uppercase">
                  Caregiver Portal
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#162620] dark:text-[#FAF7F2] mb-2 leading-snug">
                Caregiver & Clinical Suite
              </h2>
              <p className="text-sm text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed mb-6 font-normal">
                Structured 7-day cognitive trend charts, daily medication rhythms, subtle decline alerts, and hearing/vision accessibility calibration.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#B3532D] font-bold text-sm pt-4 border-t border-[#1C382B]/08 dark:border-white/10 group-hover:gap-3 transition-all">
              <span>Access telemetry dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* ── CLINICAL ASSURANCE BADGES ── */}
        <div className="mt-10 pt-6 border-t border-[#1C382B]/08 dark:border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[#4A5852] dark:text-[#9DB0A7] font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1C382B] dark:text-[#C99738]" />
            <span>DPDP Act 2023 Compliant & Local Vault</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#4D7E78]" />
            <span>Assamese, Hindi & Regional Dialects</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#B3532D]" />
            <span>Offline-First Synced Architecture</span>
          </div>
        </div>

        {/* Story Demo Trigger */}
        {onOpenDemoStory && (
          <div className="mt-6 text-center">
            <button
              id="btn-hero-demo-story"
              onClick={() => {
                soundSynth.playGentleChime();
                onOpenDemoStory();
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C382B] dark:text-[#FAF7F2] hover:text-[#B3532D] transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#B3532D]" />
              <span>Preview Sample Patient Walkthrough: Uncle Dipankar (Guwahati)</span>
            </button>
          </div>
        )}
      </div>

      <CulturalPatternBorder variant="gamusa" className="mt-12" />
    </section>
  );
};
