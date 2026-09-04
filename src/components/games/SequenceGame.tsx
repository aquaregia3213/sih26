import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Sparkles, CheckCircle2, RotateCcw, Volume2, Music, Sun, Coffee } from 'lucide-react';
import { BIHU_SEQUENCE_STEPS, TEA_PLUCKING_SEQUENCE_STEPS } from '../../data/culturalContent';
import { SequenceStep, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant, speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';

interface SequenceGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

// Fisher-Yates Shuffle Algorithm for Uniform Unbiased Randomization
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [selectedTheme, setSelectedTheme] = useState<'bihu' | 'tea'>('bihu');
  const [isListening, setIsListening] = useState(false);

  
  // Scramble initial steps using Fisher-Yates shuffle
  const initialSteps = selectedTheme === 'bihu' ? BIHU_SEQUENCE_STEPS : TEA_PLUCKING_SEQUENCE_STEPS;
  const [steps, setSteps] = useState<SequenceStep[]>(() => {
    return fisherYatesShuffle(initialSteps);
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState<boolean | null>(null);

  const handleSwitchTheme = (theme: 'bihu' | 'tea') => {
    soundSynth.playSoftClick();
    setSelectedTheme(theme);
    const newInitial = theme === 'bihu' ? BIHU_SEQUENCE_STEPS : TEA_PLUCKING_SEQUENCE_STEPS;
    setSteps(fisherYatesShuffle(newInitial));
    setIsCompleted(false);
    setCheckedStatus(null);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    soundSynth.playTraditionalDrum();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setSteps(updated);
    setCheckedStatus(null);
  };

  const handleVerify = () => {
    const isCorrect = steps.every((s, i) => s.stepNumber === i + 1);

    if (isCorrect) {
      soundSynth.playCelebration();
      setIsCompleted(true);
      setCheckedStatus(true);

      // Record sequence cognitive score in local storage vault
      vanikaStorage.recordGameSession('sequence', 92, 5);

      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D9A441', '#315C4C', '#C87552']
      });
      speechEngine.speak('Auspicious harmony! You have arranged the festival ritual in perfect order.', { language: currentLanguage });
    } else {
      soundSynth.playGentleChime();
      setCheckedStatus(false);
      speechEngine.speak('Let us reflect on the morning order once more. The dawn starts before the feast.', { language: currentLanguage });
    }
  };

  const handleReset = () => {
    soundSynth.playSoftClick();
    const curInitial = selectedTheme === 'bihu' ? BIHU_SEQUENCE_STEPS : TEA_PLUCKING_SEQUENCE_STEPS;
    setSteps(fisherYatesShuffle(curInitial));
    setIsCompleted(false);
    setCheckedStatus(null);
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    soundSynth.playSoftClick();
    speechEngine.speak('Say check or shuffle', { language: currentLanguage });

    speechEngine.startListening(
      (transcript) => {
        setIsListening(false);
        const lower = transcript.toLowerCase();
        if (lower.includes('check') || lower.includes('verify') || lower.includes('done') || lower.includes('correct')) {
          handleVerify();
        } else if (lower.includes('shuffle') || lower.includes('reset') || lower.includes('again')) {
          handleReset();
        }
      },
      (err) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      currentLanguage
    );
  };


  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6" id="view-game-sequence">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#315C4C]/15">
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                onBackToApp();
              }}
              className="p-2.5 rounded-xl bg-[#EDE5D2] text-[#24483C] hover:bg-[#315C4C] hover:text-[#F8F4EA] transition-colors cursor-pointer"
              title="Return to Courtyard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪘</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24483C]">
                Folk Ritual Sequencing
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5B55]">
              Arrange the steps in natural order from morning dawn to celebration
            </p>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1.5 bg-[#EDE5D2] p-1.5 rounded-2xl border border-[#315C4C]/20">
          <button
            onClick={() => handleSwitchTheme('bihu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTheme === 'bihu'
                ? 'bg-[#315C4C] text-white shadow-xs'
                : 'text-[#4A5B55] hover:bg-[#F8F4EA]'
            }`}
          >
            🌸 Bihu Morning
          </button>
          <button
            onClick={() => handleSwitchTheme('tea')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTheme === 'tea'
                ? 'bg-[#315C4C] text-white shadow-xs'
                : 'text-[#4A5B55] hover:bg-[#F8F4EA]'
            }`}
          >
            🍃 Tea Plucking
          </button>
        </div>
      </div>

      {/* Main Sequencing Workspace */}
      <div className="bg-[#FDFBF7] border-3 border-[#315C4C] rounded-3xl p-6 sm:p-8 shadow-xl text-[#24332E]">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <span className="text-sm font-bold text-[#315C4C] uppercase tracking-wider">
            {selectedTheme === 'bihu' ? 'Festival Order' : 'Tea Garden Morning Cycle'}
          </span>
          <span className="text-xs text-[#4A5B55]">
            Use the arrows to adjust order, then verify harmony
          </span>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 shadow-sm ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-[#F8F4EA] border-[#315C4C]/25 hover:border-[#315C4C]'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#315C4C] text-[#D9A441] font-heading font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#24483C]">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A5B55] mt-0.5">
                    {step.description}
                  </p>
                  <span className="text-[11px] text-[#C87552] font-semibold block mt-1">
                    🌿 {step.culturalNote}
                  </span>
                </div>
              </div>

              {/* Move Controls */}
              {!isCompleted && (
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 rounded-lg bg-white border border-[#315C4C]/20 text-[#24483C] hover:bg-[#EDE5D2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
                    title="Move earlier"
                    aria-label={`Move ${step.title} up`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === steps.length - 1}
                    className="p-2 rounded-lg bg-white border border-[#315C4C]/20 text-[#24483C] hover:bg-[#EDE5D2] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
                    title="Move later"
                    aria-label={`Move ${step.title} down`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verification & Outcome Banners */}
        {checkedStatus === true && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
            <div>
              <h4 className="font-bold text-lg">Well Sequenced!</h4>
              <p className="text-sm text-emerald-800">
                You have woven the ritual together with clear procedural recall and harmony.
              </p>
            </div>
          </div>
        )}

        {checkedStatus === false && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center gap-3 animate-fadeIn">
            <Sparkles className="w-6 h-6 text-[#C87552] shrink-0" />
            <div>
              <h4 className="font-bold text-base">Almost there!</h4>
              <p className="text-xs sm:text-sm text-amber-800">
                Think about what happens at first sunrise, before the afternoon community feast.
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-[#315C4C]/15 flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#315C4C]/30 text-[#4A5B55] font-semibold text-sm hover:bg-[#EDE5D2] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Shuffle Again</span>
          </button>

          <button
            onClick={handleVerify}
            className="px-7 py-3.5 rounded-2xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] font-extrabold text-base flex items-center gap-2 shadow-md transition-colors cursor-pointer focus-accessible"
          >
            <CheckCircle2 className="w-5 h-5 text-[#D9A441]" />
            <span>Check Sequence Harmony</span>
          </button>
        </div>
      </div>
    </div>
  );
};
