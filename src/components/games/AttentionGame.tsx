import React, { useState } from 'react';
import { ArrowLeft, Eye, Sparkles, CheckCircle2, Lightbulb, HelpCircle, Heart } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant, speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { Language } from '../../types';

interface AttentionGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

interface DifferenceItem {
  id: string;
  name: string;
  hint: string;
  xPercent: number; // 0 to 100 for canvas hotspot
  yPercent: number;
  found: boolean;
}

export const AttentionGame: React.FC<AttentionGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [differences, setDifferences] = useState<DifferenceItem[]>([
    {
      id: 'd-1',
      name: 'Floating Riverboat on the Brahmaputra',
      hint: 'Look near the tranquil blue river curve on the right bank.',
      xPercent: 78,
      yPercent: 35,
      found: false
    },
    {
      id: 'd-2',
      name: 'Blooming Kopou Orchid in Tree Branch',
      hint: 'Look up in the lush green shade canopy above the tea rows.',
      xPercent: 30,
      yPercent: 18,
      found: false
    },
    {
      id: 'd-3',
      name: 'Brass Kettle on the Courtyard Table',
      hint: 'Look down near the steaming morning Lal Saah table.',
      xPercent: 48,
      yPercent: 80,
      found: false
    },
    {
      id: 'd-4',
      name: 'Red Silk Scarf on the Woven Basket',
      hint: 'Look closely at the tea basket resting by the hill steps.',
      xPercent: 20,
      yPercent: 65,
      found: false
    }
  ]);

  const [activeHint, setActiveHint] = useState<string | null>(null);

  const foundCount = differences.filter(d => d.found).length;
  const isAllFound = foundCount === differences.length;

  const handleSpotDifference = (id: string) => {
    const target = differences.find(d => d.id === id);
    if (!target || target.found) return;

    soundSynth.playWaterDrop();
    const updated = differences.map(d => (d.id === id ? { ...d, found: true } : d));
    setDifferences(updated);

    const newFoundCount = updated.filter(d => d.found).length;
    // Record visual attention score in local vault
    vanikaStorage.recordGameSession('attention', 75 + newFoundCount * 6, 3);

    if (newFoundCount === differences.length) {
      soundSynth.playCelebration();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#315C4C', '#EAB308']
      });
      speechEngine.speak('Splendid observation! Your eyes are as sharp as clear river water.', { language: currentLanguage });
    } else {
      speechEngine.speak(`Well spotted! You found the ${target.name}.`, { language: currentLanguage });
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleShowHint = () => {
    const unFound = differences.find(d => !d.found);
    if (unFound) {
      soundSynth.playSoftClick();
      setActiveHint(unFound.hint);
      speechEngine.speak(unFound.hint, {
        language: currentLanguage,
        rate: 0.85,
        onEnd: () => setActiveHint(null)
      });
    }
  };

  const handleVoiceAnswer = () => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    soundSynth.playSoftClick();
    speechEngine.speak('Speak the item name you see in the photo', { language: currentLanguage });

    speechEngine.startListening(
      (transcript) => {
        setIsListening(false);
        const lower = transcript.toLowerCase();
        differences.forEach(diff => {
          if (!diff.found) {
            const words = diff.name.toLowerCase().split(' ');
            if (words.some(w => w.length > 3 && lower.includes(w))) {
              handleSpotDifference(diff.id);
            }
          }
        });
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
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6" id="view-game-attention">
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
              <span className="text-2xl">👀</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24483C]">
                Tea Garden Visual Scan
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5B55]">
              Spot the subtle differences in this tranquil Majuli & Tea Garden landscape
            </p>
          </div>
        </div>

        {/* Found Counter & Voice Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleVoiceAnswer}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isListening
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                : 'bg-[#EDE5D2] text-[#24483C] border-[#315C4C]/30 hover:bg-[#315C4C] hover:text-[#F8F4EA]'
            }`}
          >
            <span>🎙️</span>
            <span>{isListening ? 'Listening...' : 'Voice Answer'}</span>
          </button>

          <div className="bg-[#7EA9A5]/20 border border-[#7EA9A5]/50 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#24483C] flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#315C4C]" />
            <span>Found: {foundCount} of {differences.length}</span>
          </div>
        </div>
      </div>

      {/* Main Visual Board */}
      <div className="bg-[#FDFBF7] border-3 border-[#315C4C] rounded-3xl p-6 sm:p-8 shadow-xl text-[#24332E]">
        {/* Interactive Landscape Display */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border-2 border-[#EDE5D2] bg-[#F4EFE2]">
          {!imageLoaded && !imageError && (
            <div className="w-full h-72 sm:h-96 bg-gray-200 animate-pulse flex items-center justify-center text-[#315C4C] font-bold text-sm">
              <span>🌿 Loading tranquil North Eastern landscape...</span>
            </div>
          )}

          {imageError ? (
            <div className="w-full h-72 sm:h-96 bg-[#24483C] text-[#F8F4EA] flex flex-col items-center justify-center p-6 text-center space-y-3">
              <span className="text-4xl">🍃</span>
              <h4 className="font-heading font-extrabold text-lg">Majuli Tea Garden & River Basin</h4>
              <p className="text-xs text-[#EDE5D2]/80 max-w-md">
                Offline Mode Active: Tranquil tea rows, Riverboat on the Brahmaputra, Brass Tea Kettle, and Kopou Orchid.
              </p>
            </div>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
              alt="Tranquil North Eastern Tea Garden and River Scene"
              className={`w-full h-72 sm:h-96 object-cover opacity-90 transition-opacity duration-300 ${imageLoaded ? 'opacity-90' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}


          {/* Interactive Clickable Hotspots overlay */}
          {differences.map((diff) => (
            <button
              key={diff.id}
              onClick={() => handleSpotDifference(diff.id)}
              style={{ top: `${diff.yPercent}%`, left: `${diff.xPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                diff.found
                  ? 'bg-emerald-600/90 text-white ring-4 ring-white shadow-lg scale-110'
                  : 'bg-[#D9A441]/80 text-[#24483C] hover:scale-125 animate-pulse shadow-md'
              }`}
              title={diff.found ? diff.name : 'Click to inspect this spot'}
            >
              {diff.found ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="text-xs font-extrabold">🔍</span>
              )}
            </button>
          ))}

          {/* Calm Hint Pill */}
          {activeHint && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#24483C]/95 text-[#F8F4EA] p-3.5 rounded-2xl text-center text-sm font-semibold shadow-xl backdrop-blur-xs animate-fadeIn flex items-center justify-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#D9A441] shrink-0" />
              <span>{activeHint}</span>
            </div>
          )}
        </div>

        {/* Found Items Checklist */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-[#24483C]">
              Items to Discover in the Landscape:
            </h3>
            <button
              onClick={handleShowHint}
              disabled={isAllFound}
              className="px-4 py-2 rounded-xl bg-[#EDE5D2] hover:bg-[#DE8F6E]/20 text-[#24483C] text-xs sm:text-sm font-bold border border-[#315C4C]/25 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Lightbulb className="w-4 h-4 text-[#D9A441]" />
              <span>Need a gentle hint?</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {differences.map((diff) => (
              <div
                key={diff.id}
                onClick={() => handleSpotDifference(diff.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  diff.found
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                    : 'bg-[#F8F4EA] border-[#315C4C]/20 hover:bg-[#EDE5D2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      diff.found ? 'bg-emerald-600 text-white' : 'bg-[#315C4C] text-[#F8F4EA]'
                    }`}
                  >
                    {diff.found ? '✓' : '•'}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm sm:text-base">
                      {diff.name}
                    </h4>
                    <p className="text-xs opacity-75">{diff.hint}</p>
                  </div>
                </div>

                {diff.found && (
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    Discovered
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completion Card */}
        {isAllFound && (
          <div className="mt-6 p-5 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
            <div>
              <h4 className="font-bold text-lg">Peaceful Clarity!</h4>
              <p className="text-sm text-emerald-800">
                You have spotted all 4 peaceful elements with calm attention and focus.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
