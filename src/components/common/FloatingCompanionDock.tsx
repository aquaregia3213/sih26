import React from 'react';
import { Mic, Heart, Activity, Sparkles, Home, Volume2, BookOpen } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface FloatingCompanionDockProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
}

export const FloatingCompanionDock: React.FC<FloatingCompanionDockProps> = ({
  activeView,
  onNavigate,
  onOpenCompanion
}) => {
  return (
    <>
      {/* 1. Desktop & Tablet Floating AI Companion Quick Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 animate-bounce-subtle">
        {/* Quick Launch Tooltip Badge */}
        <div className="bg-[#1E3A2F] text-[#FDFBF7] px-3.5 py-2 rounded-2xl text-xs font-bold shadow-lg border border-[#D4AF37]/30 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Oja Companion Available</span>
        </div>

        {/* Floating Grandmother Avatar AI Button */}
        <button
          id="floating-btn-oja-companion"
          onClick={() => {
            soundSynth.playGentleChime();
            onOpenCompanion();
          }}
          className="group relative flex items-center justify-center p-3.5 rounded-full bg-gradient-to-r from-[#2D4739] to-[#1E3A2F] text-[#FDFBF7] shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-[#D4AF37] cursor-pointer focus-accessible"
          title="Talk to Oja — AI Elder Voice Companion"
          aria-label="Open AI Elder Companion Voice Chat"
        >
          {/* Animated Pulsing Halo */}
          <div className="absolute -inset-1 rounded-full bg-[#D4AF37]/30 animate-ping pointer-events-none" />
          
          <div className="flex items-center gap-2 relative z-10 px-2 py-1">
            <span className="text-3xl filter drop-shadow-xs">👵🏽</span>
            <div className="text-left pr-1">
              <span className="block font-heading font-extrabold text-xs text-[#D4AF37] leading-none uppercase tracking-wider">
                Voice AI
              </span>
              <span className="block font-bold text-sm text-[#FDFBF7] leading-tight">
                Talk to Oja
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold">
              <Mic className="w-4 h-4 text-[#1E3A2F]" />
            </div>
          </div>
        </button>
      </div>

      {/* 2. Mobile Bottom Quick Touch Navigation Bar (Always Visible on Small Screens) */}
      <nav
        id="mobile-bottom-quick-bar"
        className="fixed bottom-0 inset-x-0 z-40 bg-[#1E3A2F] text-[#FDFBF7] border-t border-[#D4AF37]/30 px-3 py-2 flex md:hidden items-center justify-around shadow-2xl backdrop-blur-md"
        aria-label="Mobile Navigation Quick Bar"
      >
        {/* Courtyard */}
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('patient-app');
          }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'patient-app' ? 'text-[#D4AF37] bg-[#2D4739]' : 'text-[#EAE2D2]'
          }`}
        >
          <Heart className="w-5 h-5 text-[#D4AF37]" />
          <span>Courtyard</span>
        </button>

        {/* Play Games */}
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('game-memory');
          }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView.startsWith('game-') ? 'text-[#D4AF37] bg-[#2D4739]' : 'text-[#EAE2D2]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span>Games</span>
        </button>

        {/* Prominent Center AI Voice Companion Trigger */}
        <button
          onClick={() => {
            soundSynth.playGentleChime();
            onOpenCompanion();
          }}
          className="flex flex-col items-center justify-center -mt-6 p-3 rounded-full bg-[#D4AF37] text-[#1E3A2F] shadow-xl border-2 border-white cursor-pointer active:scale-95 transition-transform"
          aria-label="Talk to Oja AI Companion"
        >
          <span className="text-2xl">👵🏽</span>
        </button>

        {/* Caregiver Portal */}
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('caregiver-portal');
          }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'caregiver-portal' || activeView === 'caregiver' ? 'text-[#D4AF37] bg-[#2D4739]' : 'text-[#EAE2D2]'
          }`}
        >
          <Activity className="w-5 h-5 text-[#D4AF37]" />
          <span>Caregiver</span>
        </button>

        {/* Culture / Northeast Roots */}
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('culture');
          }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'culture' ? 'text-[#D4AF37] bg-[#2D4739]' : 'text-[#EAE2D2]'
          }`}
        >
          <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          <span>NER Roots</span>
        </button>
      </nav>
    </>
  );
};
