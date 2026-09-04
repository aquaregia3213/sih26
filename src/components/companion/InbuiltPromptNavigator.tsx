import React, { useState } from 'react';
import { 
  Sparkles, Volume2, Search, Shuffle, BookOpen, Music, 
  ChevronRight, X, Heart, Check, Filter, Play 
} from 'lucide-react';
import { 
  INBUILT_PROMPT_CATEGORIES, 
  INBUILT_PROMPTS, 
  INBUILT_SOUNDSCAPES, 
  InbuiltPromptItem, 
  InbuiltSoundscapeItem 
} from '../../data/inbuiltPromptsAndSounds';
import { soundSynth } from '../../utils/audioSynth';

interface InbuiltPromptNavigatorProps {
  onSelectPrompt: (promptText: string) => void;
  onClose?: () => void;
  embeddedMode?: boolean; // if true, renders inline inside chat drawer; if false, full modal
}

export const InbuiltPromptNavigator: React.FC<InbuiltPromptNavigatorProps> = ({
  onSelectPrompt,
  onClose,
  embeddedMode = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  const filteredPrompts = INBUILT_PROMPTS.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handlePlaySound = (sound: InbuiltSoundscapeItem) => {
    setActiveSoundId(sound.id);
    sound.play();
    setTimeout(() => {
      setActiveSoundId(null);
    }, 2500);
  };

  const handleSurpriseMe = () => {
    soundSynth.playCelebration();
    const randomIndex = Math.floor(Math.random() * INBUILT_PROMPTS.length);
    const chosen = INBUILT_PROMPTS[randomIndex];
    onSelectPrompt(chosen.promptText);
  };

  const content = (
    <div className="space-y-4 text-[#1E3A2F] dark:text-[#FDFBF7]">

      {/* ── 1. INBUILT VOICE & NATURE SOUNDSCAPES BAR ── */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] text-[#FDFBF7] shadow-md border border-[#D4AF37]/30">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#FDFBF7] tracking-tight">
              Inbuilt Acoustic Therapy & Cultural Soundscapes
            </h4>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-full">
            8 Pure Offline Sounds
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INBUILT_SOUNDSCAPES.map(snd => {
            const isPlaying = activeSoundId === snd.id;
            return (
              <button
                key={snd.id}
                type="button"
                onClick={() => handlePlaySound(snd)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  isPlaying
                    ? 'bg-[#D4AF37] text-[#1E3A2F] border-white shadow-md scale-102 font-bold ring-2 ring-white/50'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-[#FDFBF7]'
                }`}
                title={snd.description}
              >
                <span className="text-xl sm:text-2xl shrink-0">{snd.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-extrabold truncate">
                    {snd.name}
                  </div>
                  <div className={`text-[9px] truncate ${isPlaying ? 'text-[#1E3A2F]' : 'text-[#EAE2D2]/80'}`}>
                    {isPlaying ? 'Playing ♪' : 'Tap to hear'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. QUICK SEARCH & RANDOM PROMPT SHUFFLE ── */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-[#52635D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search prompts... (e.g. 'tea', 'bihu', 'anita', 'breathe', 'riddle')"
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#2D4739]/20 bg-white dark:bg-[#0F1E17] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSurpriseMe}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:scale-102 cursor-pointer shrink-0"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>🎲 Surprise Prompt</span>
        </button>
      </div>

      {/* ── 3. CATEGORY PILLS (EASY HORIZONTAL NAVIGATION) ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {INBUILT_PROMPT_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? INBUILT_PROMPTS.length 
            : INBUILT_PROMPTS.filter(p => p.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundSynth.playSoftClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#2D4739] text-[#FDFBF7] shadow-sm ring-1 ring-[#D4AF37]'
                  : 'bg-white dark:bg-[#0F1E17] border border-[#2D4739]/15 text-[#2D4739] dark:text-[#EAE2D2] hover:bg-[#F0EAD8]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-[#D4AF37] text-[#1E3A2F]' : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. PROMPTS CARDS GRID (1-CLICK EXECUTION) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-1">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              onClick={() => {
                soundSynth.playGentleChime();
                onSelectPrompt(prompt.promptText);
              }}
              className="group p-3 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#2D4739]/15 hover:border-[#D4AF37] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Highlight accent bar on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1E3A2F] dark:text-[#D4AF37]">
                    <span>{prompt.iconEmoji}</span>
                    <span>{prompt.title}</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#C66B44] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
                    Ask Oja ➔
                  </span>
                </div>

                <p className="text-xs text-[#2D4739] dark:text-[#EAE2D2] line-clamp-2 leading-relaxed font-medium">
                  "{prompt.promptText}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 mt-1 border-t border-stone-100 dark:border-stone-800 text-[10px] text-[#52635D] dark:text-[#A1A1A1]">
                <span className="truncate max-w-[200px]">{prompt.culturalContext}</span>
                <span className="font-bold text-[#2D4739] dark:text-[#D4AF37] shrink-0">Tap to send</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center bg-white dark:bg-[#0F1E17] rounded-2xl border border-dashed border-stone-300">
            <p className="text-xs text-stone-500">No prompts found matching "{searchQuery}". Try clearing search or selecting "All Prompts".</p>
          </div>
        )}
      </div>

    </div>
  );

  if (embeddedMode) {
    return (
      <div className="p-3 sm:p-4 bg-[#F5EFE6] dark:bg-[#182E23] border-b border-[#2D4739]/20">
        {content}
      </div>
    );
  }

  // Full Modal Mode
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FDFBF7] dark:bg-[#182E23] text-[#1E3A2F] dark:text-[#FDFBF7] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#1E3A2F] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-lg shadow-xs">
              ✨
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FDFBF7]">
                Inbuilt Voice Sounds & Memory Prompts Explorer
              </h3>
              <p className="text-[11px] text-[#D4AF37] font-medium">
                35+ Culturally Grounded Prompts • 8 Therapeutic Acoustic Soundscapes
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={() => {
                soundSynth.playSoftClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-[#2D4739] hover:bg-[#3E6250] text-[#FDFBF7] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {content}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#F0EAD8] dark:bg-[#0F1E17] border-t border-[#1E3A2F]/10 dark:border-[#D4AF37]/20 flex items-center justify-between text-xs">
          <span className="text-[#52635D] dark:text-[#A1A1A1]">
            Tap any prompt card to immediately converse with Oja. Zero typing required.
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#2D4739] text-white font-bold text-xs hover:bg-[#1E3A2F] cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
