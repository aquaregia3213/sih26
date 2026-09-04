import React, { useState } from 'react';
import { Play, Volume2, X, Sparkles, Heart, CheckCircle2, Award, Image, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { getTranslation } from '../../utils/translations';
import { vanikaStorage } from '../../utils/storage';

interface ElderStoryDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView) => void;
  currentLanguage: Language;
}

interface DemoMemoryCard {
  id: string;
  title: string;
  year: string;
  location: string;
  image: string;
  narrative: string;
  question: string;
  options: string[];
  correctIndex: number;
  culturalNote: string;
}

export const ElderStoryDemoModal: React.FC<ElderStoryDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentLanguage
}) => {
  const t = getTranslation(currentLanguage);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isLoadedIntoApp, setIsLoadedIntoApp] = useState(false);

  const memoryCards: DemoMemoryCard[] = [
    {
      id: 'm-1',
      title: 'Tezpur Tea Estate Harvest',
      year: '1982',
      location: 'Tezpur, Sonitpur District, Assam',
      image: '/demo/demo-tezpur-tea.jpg',
      narrative: 'Dipankar Kaka supervised the morning tea plucking along the misty Brahmaputra riverbanks for over 28 years.',
      question: 'Where did Dipankar Kaka spend his early career supervising morning tea plucking?',
      options: ['Tezpur Tea Estate, Assam', 'Darjeeling Gardens', 'Nilgiri Hills'],
      correctIndex: 0,
      culturalNote: 'Assam produces over 50% of India’s fresh orthodox black tea leaves.'
    },
    {
      id: 'm-2',
      title: 'Rongali Bihu Dhol Celebration',
      year: '1995',
      location: 'Village Peepal Chok, Assam',
      image: '/demo/demo-bihu-dhol.jpg',
      narrative: 'Every April during Bohag Bihu, Dipankar Kaka led the village youth with his rhythmic Dhol drum beat.',
      question: 'What traditional instrument did Dipankar Kaka play during April Bohag Bihu celebrations?',
      options: ['Tabla', 'Dhol Drum with Gamusa', 'Sitar'],
      correctIndex: 1,
      culturalNote: 'The Dhol beat symbolizes energy and springtime rejuvenation in Assamese folklore.'
    },
    {
      id: 'm-3',
      title: 'Ward’s Lake Cherry Blossom Walk',
      year: '2004',
      location: 'Shillong, Meghalaya',
      image: '/demo/demo-wards-lake.jpg',
      narrative: 'Dipankar Kaka loved peaceful autumn strolls across the wooden bridge at Ward’s Lake surrounded by pine trees.',
      question: 'Which iconic Meghalaya lake bridge did Dipankar Kaka visit every autumn?',
      options: ['Umiam Lake', 'Ward’s Lake in Shillong', 'Dawki River'],
      correctIndex: 1,
      culturalNote: 'Ward’s Lake is famed for its horseshoe wooden bridge and seasonal pink cherry blossoms.'
    },
    {
      id: 'm-4',
      title: 'Verandah Tea with Daughter Anindita',
      year: '2012',
      location: 'Family Home, Jorhat, Assam',
      image: '/demo/demo-verandah-tea.jpg',
      narrative: 'Morning CTC tea served in traditional brass cups on the open garden verandah with his daughter Anindita.',
      question: 'Who enjoys morning verandah tea with Dipankar Kaka in his Jorhat garden home?',
      options: ['His daughter Anindita', 'His high school teacher', 'His railway colleague'],
      correctIndex: 0,
      culturalNote: 'Family tea time on open verandahs is a sacred daily bonding ritual across North Eastern homes.'
    }
  ];

  if (!isOpen) return null;

  const currentCard = memoryCards[activeCardIndex];

  const handleVoiceRecall = () => {
    soundSynth.playGentleChime();
    setIsPlayingVoice(true);
    const text = `Namaskar Dipankar Kaka! Here is your memory photo from ${currentCard.year} at ${currentCard.title}. ${currentCard.narrative}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingVoice(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedOption(index);
    if (index === currentCard.correctIndex) {
      soundSynth.playGentleChime();
      setScore((prev) => prev + 25);
    } else {
      soundSynth.playSoftClick();
    }
  };

  const handleNextCard = () => {
    soundSynth.playSoftClick();
    setSelectedOption(null);
    if (activeCardIndex < memoryCards.length - 1) {
      setActiveCardIndex(activeCardIndex + 1);
    }
  };

  const handleLoadDemoProfile = () => {
    soundSynth.playGentleChime();
    const demoProfile = {
      elderName: 'Uncle Dipankar Baruah',
      elderNickname: 'Dipankar Kaka',
      age: '74',
      primaryLanguage: 'Assamese',
      caregiverName: 'Anindita Baruah',
      caregiverRelation: 'Daughter',
      emergencyPhone: '+91 98765 43210',
      reminiscenceTopic: 'Tezpur Tea Estates & Rongali Bihu Dhol Drums',
      notes: 'Loves listening to Bihu flute, tea garden stories, and Ward’s Lake memories.'
    };
    localStorage.setItem('vanika_user_profile', JSON.stringify(demoProfile));
    
    // Also synchronize live encrypted AES-256 vault
    const existing = vanikaStorage.getProfile();
    vanikaStorage.saveProfile({
      ...existing,
      name: 'Uncle Dipankar Baruah',
      age: 74,
      location: 'Tezpur & Guwahati, Assam',
      primaryLanguage: 'Assamese',
      caregiverName: 'Anindita Baruah',
      caregiverContact: '+91 98765 43210',
      relationshipToPatient: 'family',
      dementiaStage: 'early',
      hobbiesOrInterests: ['Tezpur Tea Estates', 'Rongali Bihu Dhol Drums', 'Ward’s Lake walks']
    });

    setIsLoadedIntoApp(true);
    setTimeout(() => {
      onClose();
      onNavigate('patient-app');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#FDFBF7] dark:bg-[#182E23] text-[#1E3A2F] dark:text-[#FDFBF7] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Title Bar */}
        <div className="px-5 py-4 bg-[#1E3A2F] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-xl shadow-md">
              👴🏽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#C66B44] text-white">
                  Interactive Demo Profile
                </span>
                <span className="text-xs text-[#D4AF37] font-bold">Uncle Dipankar Baruah (74 Yrs)</span>
              </div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FDFBF7]">
                Personal Memory Journey • Tezpur & Shillong
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundSynth.playSoftClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#2D4739] hover:bg-[#3E6250] text-[#FDFBF7] transition-colors cursor-pointer"
            aria-label="Close demo modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Loaded Success Toast */}
          {isLoadedIntoApp && (
            <div className="p-3.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg animate-bounce-subtle">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Uncle Dipankar Baruah's Demo Profile loaded into Patient Courtyard & Oja Companion!</span>
            </div>
          )}

          {/* Top Persona Banner */}
          <div className="p-4 rounded-2xl bg-[#1E3A2F]/10 dark:bg-[#0F1E17] border border-[#1E3A2F]/20 dark:border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/demo/demo-verandah-tea.jpg"
                alt="Uncle Dipankar Baruah"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-sm"
              />
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#1E3A2F] dark:text-[#FDFBF7]">
                  Uncle Dipankar Baruah
                </h3>
                <p className="text-xs text-[#2D4739] dark:text-[#EAE2D2] font-semibold">
                  Retired Senior Tea Plantation Supervisor • Jorhat & Tezpur, Assam
                </p>
              </div>
            </div>

            {/* Audio Voice Guide Button */}
            <button
              onClick={handleVoiceRecall}
              className="px-4 py-2 rounded-full bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] text-xs font-black flex items-center gap-2 border border-[#D4AF37] shadow-sm cursor-pointer hover:scale-105 transition-all"
            >
              <Volume2 className={`w-4 h-4 text-[#D4AF37] ${isPlayingVoice ? 'animate-pulse' : ''}`} />
              <span>{isPlayingVoice ? 'Speaking Narrative...' : 'Listen to Voice Memory'}</span>
            </button>
          </div>

          {/* Main Photo Card & Interactive Recall Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: High Resolution Memory Location Photo */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-lg group bg-[#0F1E17]">
              <img
                src={currentCard.image}
                alt={currentCard.title}
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1E3A2F] text-xs font-black uppercase tracking-wider">
                    {currentCard.year}
                  </span>
                  <span className="text-xs text-[#EAE2D2] font-bold">
                    Card {activeCardIndex + 1} of {memoryCards.length}
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-lg sm:text-xl text-[#FDFBF7]">
                  {currentCard.title}
                </h4>
                <p className="text-xs text-[#D4AF37] font-semibold">
                  📍 {currentCard.location}
                </p>
              </div>
            </div>

            {/* Right: Interactive Cognitive Recall Question */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#0F1E17] border-2 border-[#1E3A2F]/15 dark:border-[#D4AF37]/25 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Episodic Memory Recall
                  </span>
                  <span className="text-xs font-bold text-[#1E3A2F] dark:text-[#FDFBF7] bg-[#D4AF37]/20 px-2 py-0.5 rounded-md">
                    Score: {score} Pts
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#2D4739] dark:text-[#EAE2D2] italic mb-3">
                  "{currentCard.narrative}"
                </p>

                <h5 className="font-heading font-extrabold text-sm sm:text-base text-[#1E3A2F] dark:text-[#FDFBF7] mb-3">
                  {currentCard.question}
                </h5>

                {/* Multiple Choice Options */}
                <div className="space-y-2">
                  {currentCard.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentCard.correctIndex;

                    let btnStyle = "bg-[#FDFBF7] dark:bg-[#182E23] border-[#1E3A2F]/20 text-[#1E3A2F] dark:text-[#FDFBF7]";
                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-700 text-white border-emerald-500 font-black";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-700 text-white border-rose-500";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cultural Knowledge Note */}
              <div className="p-3 rounded-xl bg-[#1E3A2F]/10 dark:bg-[#182E23] border border-[#1E3A2F]/15 text-xs text-[#1E3A2F] dark:text-[#EAE2D2]">
                <strong className="text-[#C66B44] dark:text-[#D4AF37] block mb-0.5">Heritage Insight:</strong>
                {currentCard.culturalNote}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#1E3A2F]/15">
            <div className="flex items-center gap-2">
              {memoryCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCardIndex(idx);
                    setSelectedOption(null);
                  }}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    activeCardIndex === idx ? 'bg-[#D4AF37] w-6' : 'bg-[#1E3A2F]/30 dark:bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {activeCardIndex < memoryCards.length - 1 ? (
                <button
                  onClick={handleNextCard}
                  className="px-5 py-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Next Photo Memory</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              ) : (
                <button
                  onClick={handleLoadDemoProfile}
                  className="px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer border border-[#1E3A2F]"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Load Uncle Dipankar’s Profile into App</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
