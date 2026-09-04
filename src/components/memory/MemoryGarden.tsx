import React, { useState, useEffect } from 'react';
import { Sparkles, Droplets, Sun, Wind, Heart, RotateCcw, Award } from 'lucide-react';
import { GardenElement } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';

interface MemoryGardenProps {
  currentLanguage?: string;
  onBackToCourtyard?: () => void;
  onStartActivity?: () => void;
}

export const MemoryGarden: React.FC<MemoryGardenProps> = ({ currentLanguage, onBackToCourtyard, onStartActivity }) => {
  const [gardenElements, setGardenElements] = useState<GardenElement[]>([]);
  const [isWatering, setIsWatering] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  useEffect(() => {
    setGardenElements(vanikaStorage.getGardenElements());
  }, []);

  const handleWaterAll = () => {
    soundSynth.playWaterDrop();
    setIsWatering(true);

    setTimeout(() => {
      soundSynth.playCelebration();
      const updated = gardenElements.map(el => ({
        ...el,
        growthStage: Math.min(el.maxStage, el.growthStage + 1),
        lastWatered: 'Just now'
      }));
      setGardenElements(updated);
      vanikaStorage.saveGardenElements(updated);
      setIsWatering(false);
      setCelebrationMsg('The afternoon sunshine and fresh water have nourished your courtyard!');

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#315C4C', '#D9A441', '#7EA9A5', '#C87552']
      });

      setTimeout(() => setCelebrationMsg(null), 4500);
    }, 1200);
  };

  const handleWaterSingle = (id: string) => {
    soundSynth.playWaterDrop();
    const updated = gardenElements.map(el => {
      if (el.id === id) {
        return {
          ...el,
          growthStage: Math.min(el.maxStage, el.growthStage + 1),
          lastWatered: 'Just now'
        };
      }
      return el;
    });
    setGardenElements(updated);
    vanikaStorage.saveGardenElements(updated);
  };

  const handleReset = () => {
    soundSynth.playSoftClick();
    const updated = gardenElements.map(el => ({ ...el, growthStage: 2 }));
    setGardenElements(updated);
    vanikaStorage.saveGardenElements(updated);
  };

  return (
    <div className="bg-[#FDFBF7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8" id="section-memory-garden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4739]/10 text-[#1E3A2F] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Signature Experience
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">
            The Memory Garden
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[#52635D] leading-relaxed">
            Your progress grows with you. Each moment of memory recall, attentive focus, and storytelling blooms into life.
          </p>
        </div>

        {/* Digital Sanctuary Canvas Container */}
        <div className="bg-gradient-to-b from-[#FFFFFF] via-[#FDFBF7] to-[#F5EFE6] border border-[#2D4739]/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
          {/* Garden Sky & Sun Controls */}
          <div className="flex items-center justify-between pb-6 border-b border-[#2D4739]/10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center text-2xl shadow-xs">
                🌻
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#1E3A2F]">
                  Courtyard Bloom Sanctuary
                </h3>
                <p className="text-sm text-[#52635D]">
                  4 active botanical companions thriving in Assam hill breeze
                </p>
              </div>
            </div>

            {/* Interactive Action Controls */}
            <div className="flex items-center gap-2.5">
              <button
                id="btn-water-garden"
                onClick={handleWaterAll}
                disabled={isWatering}
                className="px-5 py-3 rounded-xl bg-[#2D4739] hover:bg-[#1E3A2F] text-[#FDFBF7] font-bold text-sm sm:text-base flex items-center gap-2 shadow-xs transition-all cursor-pointer focus-accessible disabled:opacity-50"
              >
                <Droplets className={`w-5 h-5 text-[#6A9B96] ${isWatering ? 'animate-bounce' : ''}`} />
                <span>{isWatering ? 'Sprinkling Water...' : 'Nurture Garden'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-white border border-[#2D4739]/25 text-[#52635D] hover:text-[#1E3A2F] transition-colors cursor-pointer"
                title="Reset stages for demo"
                aria-label="Reset garden stages"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Celebration Banner */}
          {celebrationMsg && (
            <div className="my-4 p-4 rounded-2xl bg-[#2D4739] text-[#FDFBF7] font-semibold text-center text-sm sm:text-base animate-fadeIn flex items-center justify-center gap-2 shadow-xs">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>{celebrationMsg}</span>
            </div>
          )}

          {/* Garden Visual Grid */}
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gardenElements.map((el) => {
              const stagePercent = (el.growthStage / el.maxStage) * 100;
              return (
                <div
                  key={el.id}
                  className="bg-white border border-[#2D4739]/15 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Botanical Illustration & Animated Aura */}
                  <div className="relative text-center py-4">
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-[#FDFBF7] border border-[#2D4739]/15 flex items-center justify-center text-5xl shadow-inner group-hover:scale-105 transition-transform">
                      {el.type === 'tree' && (el.growthStage >= 3 ? '🌳' : '🌱')}
                      {el.type === 'fern' && (el.growthStage >= 3 ? '🌿' : '🍃')}
                      {el.type === 'flower' && (el.growthStage >= 3 ? '🌺' : '🌸')}
                      {el.type === 'sunflower' && (el.growthStage >= 3 ? '🌻' : '🪴')}
                    </div>

                    {/* Floating Butterfly */}
                    {el.growthStage >= 3 && (
                      <span className="absolute top-2 right-4 text-xl animate-gentle-float">
                        🦋
                      </span>
                    )}
                  </div>

                  {/* Botanical Details */}
                  <div className="mt-2 text-center">
                    <h4 className="font-heading font-bold text-lg text-[#1E3A2F]">
                      {el.title}
                    </h4>
                    <p className="text-xs text-[#6A9B96] font-semibold mt-0.5">
                      {el.associatedActivity}
                    </p>

                    {/* Stage Progress Pill */}
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#52635D]">
                        <span>Bloom Stage {el.growthStage} of {el.maxStage}</span>
                        <span className="text-[#2D4739]">{stagePercent}%</span>
                      </div>
                      <div className="w-full bg-[#EAE2D2] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2D4739] rounded-full transition-all duration-500"
                          style={{ width: `${stagePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] text-[#52635D] flex items-center justify-center gap-1">
                      <Sun className="w-3 h-3 text-[#D4AF37]" />
                      <span>Last tended: {el.lastWatered}</span>
                    </div>
                  </div>

                  {/* Single Plant Nurture */}
                  <button
                    onClick={() => handleWaterSingle(el.id)}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-[#FDFBF7] hover:bg-[#F5EFE6] border border-[#2D4739]/20 text-[#1E3A2F] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Droplets className="w-3.5 h-3.5 text-[#2D4739]" />
                    <span>Tend this plant</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Reassurance Disclaimer (No Medical Anxiety) */}
          <div className="bg-[#F5EFE6] p-4 rounded-2xl border border-[#D4AF37]/40 flex items-center gap-3 text-xs sm:text-sm text-[#52635D]">
            <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <p>
              <strong className="text-[#1E3A2F]">A Note on Your Garden:</strong> This sanctuary visually celebrates your daily presence and joyous engagement. It is a gentle metaphor of companionship, not a medical test or clinical diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
