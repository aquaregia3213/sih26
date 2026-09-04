import React from 'react';
import { Heart, ArrowRight, Volume2 } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface EmotionalCTAProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
}

export const EmotionalCTA: React.FC<EmotionalCTAProps> = ({
  onNavigate,
  onOpenCompanion
}) => {
  return (
    <section className="py-16 sm:py-20 bg-[#1C382B] text-[#FAF7F2] relative" id="section-emotional-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C99738] text-xs font-semibold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>A Peaceful Digital Sanctuary</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Preserving Every Precious Memory With Dignity
        </h2>

        <p className="text-sm sm:text-base text-[#D1DCD6] max-w-xl mx-auto leading-relaxed">
          Gentle daily cognitive stimulation, familiar regional voices, and family connections that celebrate who our elders are—every single day.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-cta-begin-journey"
            onClick={() => {
              soundSynth.playGentleChime();
              onNavigate('patient-app');
            }}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#C99738] hover:bg-[#DCAB4E] text-[#13271E] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer focus-accessible"
          >
            <span>Enter Elder Courtyard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-cta-speak-companion"
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer focus-accessible"
          >
            <Volume2 className="w-4 h-4 text-[#C99738]" />
            <span>Speak with Oja (Voice)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
