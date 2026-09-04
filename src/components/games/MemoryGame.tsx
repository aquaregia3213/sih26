import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Heart, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { VoiceAssistant } from '../../utils/speech';
import { speechEngine } from '../../utils/speech';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { Language, MemoryPhotoItem } from '../../types';

interface MemoryGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [photos, setPhotos] = useState<MemoryPhotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const loaded = vanikaStorage.getMemoryPhotos();
    setPhotos(loaded);
  }, []);

  const currentItem = photos[currentIndex] || photos[0];

  const handleSelectOption = (option: string) => {
    soundSynth.playSoftClick();
    setSelectedAnswer(option);

    if (option === currentItem.correctAnswer) {
      setIsCorrect(true);
      setShowStory(true);
      const newScore = score + 1;
      setScore(newScore);
      soundSynth.playCelebration();

      // Record cognitive score to local vault
      vanikaStorage.recordGameSession('memory', Math.min(100, 75 + newScore * 10), 4);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#315C4C', '#D9A441', '#C87552']
      });

      speechEngine.speak(`Well remembered! That is ${currentItem.correctAnswer}.`, {
        language: currentLanguage
      });
    } else {
      setIsCorrect(false);
      soundSynth.playGentleChime();
      speechEngine.speak(`Let us look once more with a peaceful heart.`, {
        language: currentLanguage
      });
    }
  };

  const handleNextPhoto = () => {
    soundSynth.playSoftClick();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowStory(false);
    setImgLoaded(false);
    setImgError(false);
    if (photos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePlayVoicePrompt = () => {
    soundSynth.playSoftClick();
    speechEngine.speak(currentItem?.audioPrompt || 'Who is in this photo?', {
      language: currentLanguage
    });
  };

  const handleVoiceAnswer = () => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    soundSynth.playSoftClick();
    speechEngine.speak('Speak the name of the person in the photo', { language: currentLanguage });

    speechEngine.startListening(
      (transcript) => {
        setIsListening(false);
        const lower = transcript.toLowerCase();
        if (currentItem?.options) {
          const match = currentItem.options.find(opt => {
            const parts = opt.toLowerCase().split(' ');
            return parts.some(p => p.length > 2 && lower.includes(p));
          });
          if (match) {
            handleSelectOption(match);
          }
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


  if (!currentItem) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-[#24483C]">
        <p className="text-xl font-bold">Loading family memory photos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6" id="view-game-memory">
      {/* Top Bar with Return & Title */}
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
              <span className="text-2xl">🖼️</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24483C]">
                Who is this?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5B55]">
              Life-Story Memory Recall • Photo {currentIndex + 1} of {photos.length}
            </p>
          </div>
        </div>

        {/* Peaceful Progress Pill & Voice Answer */}
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

          <div className="bg-[#315C4C]/10 border border-[#315C4C]/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#24483C] flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#C87552] fill-current" />
            <span>Memories Recalled: {score}</span>
          </div>
        </div>
      </div>

      {/* Main Memory Album Frame */}
      <div className="bg-[#FDFBF7] border-3 border-[#315C4C] rounded-3xl p-6 sm:p-8 shadow-xl text-[#24332E]">
        {/* Photo & Story Context Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Photograph Container */}
          <div className="md:col-span-6 relative">
            <div className="bg-white p-3.5 rounded-2xl shadow-md border-2 border-[#EDE5D2] relative overflow-hidden group">
              {!imgLoaded && !imgError && (
                <div className="w-full h-64 sm:h-80 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center text-[#315C4C] text-sm font-bold">
                  <span>📸 Loading memory photo...</span>
                </div>
              )}

              {imgError ? (
                <div className="w-full h-64 sm:h-80 bg-[#315C4C] text-[#F8F4EA] rounded-xl flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <span className="text-4xl">🖼️</span>
                  <p className="font-heading font-extrabold text-base">{currentItem.title}</p>
                  <p className="text-xs text-[#EDE5D2]/80">{currentItem.personName} ({currentItem.relationship})</p>
                </div>
              ) : (
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className={`w-full h-64 sm:h-80 object-cover rounded-xl transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}

              <div className="mt-2.5 flex items-center justify-between text-xs text-[#4A5B55] px-1 font-semibold">
                <span>📍 {currentItem.location}</span>
                <span>🗓️ {currentItem.year}</span>
              </div>
            </div>
          </div>

          {/* Prompt & Voice Audio */}
          <div className="md:col-span-6 space-y-4">
            <div className="bg-[#F8F4EA] p-5 rounded-2xl border border-[#315C4C]/20 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C87552]">
                Family Album Memory
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
                {currentItem.title}
              </h3>
              <p className="text-base sm:text-lg text-[#4A5B55] leading-relaxed">
                "{currentItem.audioPrompt}"
              </p>

              <button
                onClick={handlePlayVoicePrompt}
                className="w-full py-3 px-4 rounded-xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#D9A441]" />
                <span>🔊 Hear Question Spoken Aloud</span>
              </button>
            </div>

            {/* Feedback Banners */}
            {isCorrect === true && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 animate-fadeIn space-y-1">
                <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span>Well remembered!</span>
                </div>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  {currentItem.storyNote}
                </p>
              </div>
            )}

            {isCorrect === false && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 animate-fadeIn space-y-1">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Heart className="w-5 h-5 text-[#C87552]" />
                  <span>Let's look once more.</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800">
                  Take a calm breath. Look at the smile and the {currentItem.location} backdrop.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4 Large Touch Target Options */}
        <div className="mt-8 pt-6 border-t border-[#315C4C]/15">
          <label className="block text-sm sm:text-base font-bold text-[#24483C] mb-3">
            Select the person in this memory:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentItem.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isRightAnswer = option === currentItem.correctAnswer;
              
              let btnClass = 'bg-[#F8F4EA] hover:bg-[#EDE5D2] text-[#24483C] border-[#315C4C]/20';
              if (isSelected) {
                if (isRightAnswer) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-700 font-extrabold shadow-md';
                } else {
                  btnClass = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className={`py-4 px-5 rounded-2xl text-base sm:text-lg font-bold border-2 transition-all cursor-pointer flex items-center justify-between text-left shadow-xs focus-accessible ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isRightAnswer && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-[#315C4C]/10">
          <button
            onClick={() => {
              soundSynth.playSoftClick();
              setSelectedAnswer(null);
              setIsCorrect(null);
            }}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#315C4C]/30 text-[#4A5B55] text-sm font-semibold hover:bg-[#EDE5D2] transition-colors cursor-pointer"
          >
            Try Again
          </button>

          <button
            onClick={handleNextPhoto}
            className="px-6 py-3 rounded-xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] font-bold text-base flex items-center gap-2 shadow-sm transition-colors cursor-pointer focus-accessible"
          >
            <span>Next Memory</span>
            <ArrowRight className="w-5 h-5 text-[#D9A441]" />
          </button>
        </div>
      </div>
    </div>
  );
};
