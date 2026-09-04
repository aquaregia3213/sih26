import React, { useState } from 'react';
import { ArrowLeft, Music, Volume2, Sparkles, CheckCircle2, Heart, Award } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant, speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { Language } from '../../types';

interface CulturalGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

interface HeritageItem {
  id: string;
  name: string;
  region: string;
  symbol: string;
  category: 'Instrument' | 'Festival' | 'Craft';
  question: string;
  options: string[];
  correctAnswer: string;
  lore: string;
}

const HERITAGE_ITEMS: HeritageItem[] = [
  {
    id: 'h-1',
    name: 'Pepa (Buffalo Horn Hornpipe)',
    region: 'Assam',
    symbol: '🎺',
    category: 'Instrument',
    question: 'Which instrument is crafted from buffalo horn and played during Rongali Bihu?',
    options: ['Pepa', 'Violin', 'Guitar', 'Harmonium'],
    correctAnswer: 'Pepa',
    lore: 'The Pepa produces a sharp, melodic, joyful tone that signals spring courtship and the awakening of nature in Assam.'
  },
  {
    id: 'h-2',
    name: 'Jappi (Traditional Sun Hat)',
    region: 'Brahmaputra Valley',
    symbol: '👒',
    category: 'Craft',
    question: 'What is the conical woven bamboo hat decorated with red and black wool used for respect and shade?',
    options: ['Jappi', 'Turbin', 'Cap', 'Beret'],
    correctAnswer: 'Jappi',
    lore: 'Historically used by farmers in the open fields, the decorated Jappi is now presented to honored guests as a mark of highest reverence.'
  },
  {
    id: 'h-3',
    name: 'Cheraw (Bamboo Dance)',
    region: 'Mizoram',
    symbol: '🎋',
    category: 'Festival',
    question: 'In which famous Mizo dance do performers step rhythmically between moving bamboo poles?',
    options: ['Cheraw', 'Kathak', 'Salsa', 'Bhangra'],
    correctAnswer: 'Cheraw',
    lore: 'Cheraw is celebrated during Chapchar Kut. The rhythmic clapping of bamboo poles requires great agility and community synchronization.'
  },
  {
    id: 'h-4',
    name: 'Brass Xorai (Offering Tray)',
    region: 'Assam',
    symbol: '🏆',
    category: 'Craft',
    question: 'Which bell-metal tray with a tripod stem is used to present Tamul-Paan and offer reverence?',
    options: ['Xorai', 'Plate', 'Cup', 'Tray'],
    correctAnswer: 'Xorai',
    lore: 'The Xorai is crafted by traditional artisans in Sarthebari and represents hospitality, blessings, and ancestral honor.'
  },
  {
    id: 'h-5',
    name: 'Living Root Bridge (Jingkieng Jri)',
    region: 'Meghalaya',
    symbol: '🌉',
    category: 'Craft',
    question: 'What bio-engineered bridges are shaped by guiding Ficus elastica tree roots across mountain streams?',
    options: ['Living Root Bridge', 'Steel Bridge', 'Wooden Plank', 'Cable Stayed'],
    correctAnswer: 'Living Root Bridge',
    lore: 'Nurtured over decades by indigenous Khasi and Jaintia elders, living root bridges become stronger with age.'
  },
  {
    id: 'h-6',
    name: 'Bihu Dhol (Two-Headed Drum)',
    region: 'Assam',
    symbol: '🥁',
    category: 'Instrument',
    question: 'What wooden drum provides the heart-pounding rhythmic foundation of Rongali Bihu celebrations?',
    options: ['Dhol', 'Tabla', 'Djembe', 'Bongo'],
    correctAnswer: 'Dhol',
    lore: 'Carved from jackfruit wood, the resonant beat of the Dhol inspires joyful dancing across every courtyard.'
  },
  {
    id: 'h-7',
    name: 'Golden Muga Silk Shawl',
    region: 'Sualkuchi, Assam',
    symbol: '🧵',
    category: 'Craft',
    question: 'Which naturally golden, durable wild silk is unique to Assam and woven in Sualkuchi looms?',
    options: ['Muga Silk', 'Cotton', 'Polyester', 'Nylon'],
    correctAnswer: 'Muga Silk',
    lore: 'Muga silk is famous for its natural golden luster that increases in shine with every wash.'
  },
  {
    id: 'h-8',
    name: 'Hornbill Festival Gathering',
    region: 'Nagaland',
    symbol: '🪶',
    category: 'Festival',
    question: 'Which grand annual festival brings together all Naga tribes to celebrate ancestral music and dance?',
    options: ['Hornbill Festival', 'Diwali', 'Holi', 'Onam'],
    correctAnswer: 'Hornbill Festival',
    lore: 'Named after the sacred Great Indian Hornbill, this festival showcases rich tribal heritage in Kisama heritage village.'
  },
  {
    id: 'h-9',
    name: 'Aronai Ceremonial Scarf',
    region: 'Bodoland',
    symbol: '🧣',
    category: 'Craft',
    question: 'What traditional Bodo woven scarf with Hajw (mountain) patterns is gifted to show warm respect?',
    options: ['Aronai', 'Stole', 'Tie', 'Ribbon'],
    correctAnswer: 'Aronai',
    lore: 'Woven on frame looms, the Aronai is presented during winter festivals and community welcomes.'
  },
  {
    id: 'h-10',
    name: 'Ka Shad Suk Mynsiem (Dance of Joyful Hearts)',
    region: 'Khasi Hills, Meghalaya',
    symbol: '🌸',
    category: 'Festival',
    question: 'Which spring Khasi festival celebrates thanksgiving to the Creator with traditional maidens’ silk attire?',
    options: ['Shad Suk Mynsiem', 'Bihu', 'Hornbill', 'Losoong'],
    correctAnswer: 'Shad Suk Mynsiem',
    lore: 'Performers wear gold crowns and silver chains in an ancient thanksgiving dance of peace and unity.'
  }
];

export const CulturalGame: React.FC<CulturalGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<boolean | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const current = HERITAGE_ITEMS[index];

  const handleSelect = (opt: string) => {
    soundSynth.playSoftClick();
    setSelected(opt);

    if (opt === current.correctAnswer) {
      setStatus(true);

      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      soundSynth.playCelebration();

      // Record cultural reminiscence score in vault
      vanikaStorage.recordGameSession('cultural', 88 + newCount * 4, 4);

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#D9A441', '#C87552', '#315C4C']
      });
      speechEngine.speak(`Wonderfully answered! ${current.name} is a treasure of ${current.region}.`, { language: currentLanguage });
    } else {
      setStatus(false);
      soundSynth.playGentleChime();
      speechEngine.speak(`Let us explore this folklore once more.`, { language: currentLanguage });
    }
  };

  const handleNext = () => {
    soundSynth.playSoftClick();
    setSelected(null);
    setStatus(null);
    setIndex((prev) => (prev + 1) % HERITAGE_ITEMS.length);
  };

  const handlePlayAudio = () => {
    soundSynth.playTraditionalDrum();
    VoiceAssistant.speak(`${current.question} The clue relates to ${current.region}.`, currentLanguage, 'slow');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6" id="view-game-cultural">
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
              <span className="text-2xl">🎋</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#24483C]">
                Cultural Wisdom & Folklore
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5B55]">
              Rediscover traditional crafts, instruments, and harvest celebrations
            </p>
          </div>
        </div>

        <div className="bg-[#D9A441]/20 border border-[#D9A441]/50 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#24483C] flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#C87552]" />
          <span>Wisdom Found: {completedCount}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#FDFBF7] border-3 border-[#315C4C] rounded-3xl p-6 sm:p-8 shadow-xl text-[#24332E]">
        <div className="bg-[#F8F4EA] p-6 rounded-2xl border-2 border-[#315C4C]/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C87552]">
              {current.category} • {current.region}
            </span>
            <span className="text-3xl">{current.symbol}</span>
          </div>

          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C] mb-3">
            {current.question}
          </h3>

          <button
            onClick={handlePlayAudio}
            className="py-2.5 px-4 rounded-xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#D9A441]" />
            <span>Hear Clue Spoken</span>
          </button>
        </div>

        {/* 4 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {current.options.map((opt) => {
            const isSel = selected === opt;
            const isRight = opt === current.correctAnswer;

            let btnClass = 'bg-[#F8F4EA] hover:bg-[#EDE5D2] text-[#24483C] border-[#315C4C]/20';
            if (isSel) {
              if (isRight) {
                btnClass = 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold';
              } else {
                btnClass = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`py-4 px-5 rounded-2xl text-base sm:text-lg font-bold border-2 transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isSel && isRight && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Folklore Story card reveal */}
        {status === true && (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 animate-fadeIn space-y-2 mb-6">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Folk Heritage: {current.name}</span>
            </h4>
            <p className="text-sm sm:text-base text-emerald-800 leading-relaxed">
              {current.lore}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-end pt-4 border-t border-[#315C4C]/15">
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] font-bold text-base flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Next Cultural Lore</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
