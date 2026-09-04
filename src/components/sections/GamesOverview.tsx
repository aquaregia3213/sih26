import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface GamesOverviewProps {
  onNavigate: (view: ActiveView) => void;
  currentLanguage?: Language;
}

export const GamesOverview: React.FC<GamesOverviewProps> = ({ onNavigate, currentLanguage }) => {
  const games = [
    {
      id: 'game-memory',
      title: 'Memory Recall',
      subtitle: 'Who is this?',
      description: 'Recall family members, village gatherings, and cherished photographs from your private life album.',
      view: 'game-memory' as ActiveView,
      symbol: '🖼️',
      tag: 'Episodic Memory'
    },
    {
      id: 'game-sequence',
      title: 'Sequence Recall',
      subtitle: 'Bihu Morning & Tea Rituals',
      description: 'Arrange familiar daily and harvest rituals in logical order, accompanied by gentle folk drum rhythms.',
      view: 'game-sequence' as ActiveView,
      symbol: '🪘',
      tag: 'Procedural Logic'
    },
    {
      id: 'game-attention',
      title: 'Visual Attention',
      subtitle: 'Tea Garden & Majuli Scan',
      description: 'Observe serene North Eastern landscape scenes and gently discover subtle variations with calm guidance.',
      view: 'game-attention' as ActiveView,
      symbol: '👀',
      tag: 'Visual Scan & Focus'
    },
    {
      id: 'game-cultural',
      title: 'Cultural Heritage',
      subtitle: 'Folk Lore & Instrument Match',
      description: 'Rediscover traditional musical instruments, harvest customs, and indigenous heritage across the 8 NER states.',
      view: 'game-cultural' as ActiveView,
      symbol: '🎋',
      tag: 'Semantic Knowledge'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] dark:bg-[#111A15] border-b border-[#1C382B]/10 dark:border-white/10" id="section-games">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C382B]/06 dark:bg-white/10 text-[#1C382B] dark:text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
            <span>Targeted Cognitive Rehabilitation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#162620] dark:text-[#FAF7F2] tracking-tight">
            Cognitive Exercises Designed as Gentle Pastimes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed">
            Four clinically-informed activity modules targeting key neurocognitive domains while avoiding clinical stress or failure anxiety.
          </p>
        </div>

        {/* 4 Major Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {games.map((game) => (
            <div
              key={game.id}
              className="card-editorial p-5 flex flex-col justify-between group bg-white dark:bg-[#1A2620]"
            >
              <div>
                {/* Domain Tag and Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 flex items-center justify-center text-2xl">
                    {game.symbol}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F3ECE2] dark:bg-white/10 text-[#1C382B] dark:text-[#FAF7F2]">
                    {game.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#162620] dark:text-[#FAF7F2] group-hover:text-[#B3532D] transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-medium text-[#4D7E78] mt-0.5">
                  {game.subtitle}
                </p>

                <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7] mt-3 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Play Button Trigger */}
              <div className="pt-4 mt-4 border-t border-[#1C382B]/08 dark:border-white/08">
                <button
                  id={`btn-play-${game.id}`}
                  onClick={() => {
                    soundSynth.playSoftClick();
                    onNavigate(game.view);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#1C382B] dark:bg-[#2E5240] hover:bg-[#2A4B3C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-accessible"
                >
                  <span>Start Activity</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C99738]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
