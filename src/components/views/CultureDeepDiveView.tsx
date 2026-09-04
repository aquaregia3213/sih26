import React, { useState } from 'react';
import { MapPin, Volume2, Sparkles, Music, BookOpen, Heart } from 'lucide-react';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { Language, ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';

interface CultureDeepDiveViewProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onNavigate: (view: ActiveView) => void;
}

export const CultureDeepDiveView: React.FC<CultureDeepDiveViewProps> = ({
  currentLanguage,
  onSelectLanguage,
  onNavigate
}) => {
  const [activeState, setActiveState] = useState<string>('Assam');

  const nerStates = [
    {
      name: 'Assam',
      capital: 'Dispur / Guwahati',
      symbol: '🦏',
      color: 'border-emerald-600',
      description: 'Land of the mighty Brahmaputra, lush emerald tea estates, Golden Muga silk, and the vibrant rhythms of Rongali Bihu.',
      traditions: ['Rongali, Kongali & Bhogali Bihu', 'Pepa, Dhol & Tokari folk tunes', 'Steaming Lal Saah & Pitha in open courtyards', 'Majuli island mask-making heritage'],
      quote: 'Dhol Pepa baje Rongali Bihu aahi pale!'
    },
    {
      name: 'Meghalaya',
      capital: 'Shillong',
      symbol: '🌧️',
      color: 'border-teal-600',
      description: 'Abode of the clouds, living root bridges, pine groves, matrilineal Khasi traditions, and acoustic guitar melodies.',
      traditions: ['Living Root Bridges of Nongriat', 'Nongkrem Dance & Wangala 100-Drum Festival', 'Ward’s Lake morning walks', 'Ka Shad Suk Mynsiem'],
      quote: 'Khublei shibun! Peaceful pine breezes over Shillong hills.'
    },
    {
      name: 'Nagaland',
      capital: 'Kohima',
      symbol: '🪶',
      color: 'border-amber-600',
      description: 'Land of festivals, majestic hornbill motifs, village Morung council halls, and rich tribal textile weaves.',
      traditions: ['Hornbill Festival gatherings', 'Morung oral storytelling with elders', 'Bamboo log drum synchrony', 'Traditional spear & bead crafts'],
      quote: 'Kuki, Angami, Ao, and Lotha generational wisdom.'
    },
    {
      name: 'Mizoram',
      capital: 'Aizawl',
      symbol: '🎋',
      color: 'border-rose-600',
      description: 'Rolling blue hills, bamboo forests, choir harmonies, and the spirit of Tlawmngaihna (selfless community service).',
      traditions: ['Cheraw Bamboo Dance', 'Chapchar Kut harvest celebration', 'Puan handloom weaving', 'Evening hill-top choir hymns'],
      quote: 'Chibai! Tlawmngaihna guides our care for every elder.'
    },
    {
      name: 'Manipur',
      capital: 'Imphal',
      symbol: '🌸',
      color: 'border-purple-600',
      description: 'Jeweled land of Loktak Lake floating phumdis, classical Raas Leela dance, and vibrant handloom traditions.',
      traditions: ['Lai Haraoba spiritual festival', 'Pena ancient stringed instrument', 'Ima Keithel mother’s market', 'Sagol Kangjei polo origins'],
      quote: 'Khurumjari! Honoring our mothers and ancestral roots.'
    },
    {
      name: 'Arunachal Pradesh',
      capital: 'Itanagar',
      symbol: '🏔️',
      color: 'border-indigo-600',
      description: 'Land of dawn-lit mountains, snow peaks, Tawang monastery, and diverse indigenous tribes living in harmony with nature.',
      traditions: ['Losar New Year in Tawang', 'Ziro Valley Apatani pine forests', 'Solung agricultural festival', 'Cane and bamboo weaving'],
      quote: 'Tashi Delek! Dawn sunlight over eastern Himalayan peaks.'
    },
    {
      name: 'Tripura',
      capital: 'Agartala',
      symbol: '🏛️',
      color: 'border-orange-600',
      description: 'Ujjayanta Palace, Neermahal water palace, rubber plantations, and rich Kokborok folklore.',
      traditions: ['Kharchi Puja 14-deity festival', 'Garia dance rituals', 'Risa traditional chest-wrap weave', 'Tripuri folk lore'],
      quote: 'Khulumkha! Warm hospitality across Tripura plains.'
    },
    {
      name: 'Sikkim',
      capital: 'Gangtok',
      symbol: '❄️',
      color: 'border-cyan-600',
      description: 'Guarded by sacred Mount Kangchenjunga, organic cardamom valleys, prayer flags fluttering in mountain breeze.',
      traditions: ['Pang Lhabsol Kangchenjunga homage', 'Cham masked monastery dances', 'Cardamom & ginger tea warmth', 'Bhutia & Lepcha crafts'],
      quote: 'Namaste & Tashi Delek under peaceful mountain skies.'
    }
  ];

  const current = nerStates.find(s => s.name === activeState) || nerStates[0];

  const handleHearDialect = () => {
    soundSynth.playGentleChime();
    VoiceAssistant.speak(`${current.name}: ${current.quote}`, currentLanguage, 'slow');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10" id="view-culture-deep-dive">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#315C4C]/15 text-[#24483C] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
          Heritage of the Ashtalakshmi
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#24483C]">
          The 8 States of North Eastern India
        </h2>
        <p className="text-base sm:text-lg text-[#4A5B55] leading-relaxed">
          Discover how each state's distinct music, festivals, landscapes, and linguistic cadence enrich Vanika's cognitive memory modules.
        </p>
      </div>

      {/* State Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {nerStates.map(st => (
          <button
            key={st.name}
            onClick={() => {
              soundSynth.playSoftClick();
              setActiveState(st.name);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeState === st.name
                ? 'bg-[#315C4C] text-[#F8F4EA] shadow-md scale-105'
                : 'bg-[#EDE5D2] text-[#24483C] hover:bg-[#F8F4EA]'
            }`}
          >
            <span>{st.symbol}</span>
            <span>{st.name}</span>
          </button>
        ))}
      </div>

      {/* Main Selected State Showcase Card */}
      <div className="bg-[#FDFBF7] border-3 border-[#315C4C] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#315C4C]/15 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#315C4C] text-[#F8F4EA] flex items-center justify-center text-3xl shadow-xs">
              {current.symbol}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C87552]">
                Capital: {current.capital}
              </span>
              <h3 className="font-heading font-extrabold text-3xl text-[#24483C]">
                {current.name}
              </h3>
            </div>
          </div>

          <button
            onClick={handleHearDialect}
            className="py-3 px-5 rounded-2xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-[#D9A441]" />
            <span>Hear Regional Cultural Voice</span>
          </button>
        </div>

        <p className="text-base sm:text-lg text-[#24332E] leading-relaxed">
          {current.description}
        </p>

        {/* State Cultural Pillars */}
        <div>
          <h4 className="font-heading font-bold text-base text-[#315C4C] uppercase tracking-wide mb-3">
            Core Cultural Memories & Traditions:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.traditions.map((trad, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#315C4C]/15 flex items-center gap-2.5 text-sm font-bold text-[#24483C]">
                <span className="w-2 h-2 rounded-full bg-[#D9A441]" />
                <span>{trad}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Quote Box */}
        <div className="p-5 rounded-2xl bg-[#EDE5D2]/70 border-l-4 border-[#C87552] text-[#24332E] italic text-sm sm:text-base">
          "{current.quote}"
        </div>
      </div>
    </div>
  );
};
