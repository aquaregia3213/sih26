import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ArrowRight, Mic, Sun, ChevronLeft, Gamepad2, CalendarCheck, BarChart3 } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';
import { getTranslation } from '../../utils/translations';
import { vanikaStorage } from '../../utils/storage';

interface PatientAppViewProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
  onOpenAddPhoto?: () => void;
}

const GAME_TILES: {
  id: string;
  emoji: string;
  label: string;
  sub: string;
  view: ActiveView;
  tag: string;
}[] = [
  {
    id: 'tile-memory',
    emoji: '🖼️',
    label: 'Family Photo Recall',
    sub: 'Look at family gatherings and weddings. Gentle spoken cues will guide you through cherished memories.',
    view: 'game-memory',
    tag: 'Episodic Memory'
  },
  {
    id: 'tile-sequence',
    emoji: '🪘',
    label: 'Bihu & Tea Rituals',
    sub: 'Arrange the sequence of a festive Bihu morning or tea harvest with gentle rhythm cues.',
    view: 'game-sequence',
    tag: 'Procedural Rhythm'
  },
  {
    id: 'tile-attention',
    emoji: '👀',
    label: 'Tea Garden Walk',
    sub: 'Observe peaceful Brahmaputra tea estate scenes and gently spot subtle details at your own pace.',
    view: 'game-attention',
    tag: 'Visual Focus'
  },
  {
    id: 'tile-cultural',
    emoji: '🏛️',
    label: 'Cultural Heritage Quiz',
    sub: 'Recognize traditional instruments, Muga silk motifs, and indigenous heritage from across the 8 states.',
    view: 'game-cultural',
    tag: 'Cultural Wisdom'
  },
  {
    id: 'tile-memory-house',
    emoji: '🏡',
    label: 'The Memory House',
    sub: 'Walk through quiet rooms dedicated to photo albums, focus puzzles, folklore stories, and reflections.',
    view: 'memory-house',
    tag: 'Courtyard Sanctuary'
  },
  {
    id: 'tile-garden',
    emoji: '🌻',
    label: 'The Memory Garden',
    sub: 'Tend to the courtyard Banyan tree, Assam tea bushes, and orchids that blossom with every completed step.',
    view: 'memory-garden',
    tag: 'Botanical Sanctuary'
  }
];

export const PatientAppView: React.FC<PatientAppViewProps> = ({
  currentLanguage,
  onNavigate,
  onOpenCompanion,
  onOpenAddPhoto
}) => {
  const t = getTranslation(currentLanguage);

  const [profile, setProfile] = useState(() => {
    try {
      return vanikaStorage.getProfile();
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        setProfile(vanikaStorage.getProfile());
      } catch (e) {}
    };
    window.addEventListener('vanika_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('vanika_profile_updated', handleProfileUpdate);
  }, []);

  const elderDisplayName = profile?.name || 'Bhaben Kaka';

  const handleSpeakGreeting = () => {
    soundSynth.playGentleChime();
    VoiceAssistant.speak(
      `Good morning ${elderDisplayName}! Welcome to your peaceful courtyard. Which activity would you like to enjoy together today?`,
      currentLanguage,
      'slow'
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#111A15]" id="view-patient-courtyard">

      {/* ── BREADCRUMB & CONTEXT BAR ── */}
      <div className="bg-white dark:bg-[#1A2620] border-b border-[#1C382B]/10 dark:border-white/10 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A5852] dark:text-[#9DB0A7]">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 hover:text-[#1C382B] dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span>/</span>
            <span className="text-[#162620] dark:text-[#FAF7F2] font-bold">Elder Courtyard</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4D7E78]" />
            <span className="text-[11px] font-medium text-[#4A5852] dark:text-[#9DB0A7]">
              Calibrated for Senior Comfort
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">

        {/* ── DIGNIFIED GREETING HERO BANNER ── */}
        <div className="card-editorial-dark p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C99738] text-[#13271E] flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-xs">
                👵🏽
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#C99738] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Morning in Assam</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Namaskar, {elderDisplayName}!
                </h1>
                <p className="text-xs sm:text-sm text-[#D1DCD6] mt-1">
                  Your courtyard is peaceful and quiet. Which gentle pastime shall we enjoy today?
                </p>
              </div>
            </div>

            {/* High-Legibility Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                id="btn-patient-speak-oja"
                onClick={() => {
                  soundSynth.playGentleChime();
                  onOpenCompanion();
                }}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#C99738] hover:bg-[#DCAB4E] text-[#13271E] font-bold text-sm shadow-xs transition-colors cursor-pointer focus-accessible"
              >
                <Mic className="w-4 h-4 text-[#13271E]" />
                <span>Talk with Oja (Voice)</span>
              </button>
              {onOpenAddPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    soundSynth.playSoftClick();
                    onOpenAddPhoto();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-[#FAF7F2] border border-white/25 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>📸 + Add Photo / Place</span>
                </button>
              )}
              <button
                onClick={handleSpeakGreeting}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 transition-colors cursor-pointer focus-accessible"
              >
                <Volume2 className="w-4 h-4 text-[#C99738]" />
                <span>Hear Spoken Welcome</span>
              </button>
            </div>
          </div>
        </div>


        {/* ── 3-TAB QUICK NAVIGATION DECK ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            id="btn-courtyard-games-hub"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('games-hub');
            }}
            className="card-editorial p-4 text-left flex items-center gap-3.5 cursor-pointer bg-white dark:bg-[#1A2620] focus-accessible"
          >
            <div className="w-11 h-11 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 flex items-center justify-center text-[#B3532D] shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B3532D] block">Activities</span>
              <h4 className="font-bold text-sm text-[#162620] dark:text-[#FAF7F2]">All 4 Therapy Games</h4>
              <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7]">Memory, Sequence, Scan & Culture</p>
            </div>
          </button>

          <button
            id="btn-courtyard-routine"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('daily-routine');
            }}
            className="card-editorial p-4 text-left flex items-center gap-3.5 cursor-pointer bg-white dark:bg-[#1A2620] focus-accessible"
          >
            <div className="w-11 h-11 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 flex items-center justify-center text-[#4D7E78] shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D7E78] block">Rhythm</span>
              <h4 className="font-bold text-sm text-[#162620] dark:text-[#FAF7F2]">Daily Schedule</h4>
              <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7]">Lal Saah tea, medications, rest</p>
            </div>
          </button>

          <button
            id="btn-courtyard-progress"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('progress');
            }}
            className="card-editorial p-4 text-left flex items-center gap-3.5 cursor-pointer bg-white dark:bg-[#1A2620] focus-accessible"
          >
            <div className="w-11 h-11 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 flex items-center justify-center text-[#C99738] shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C99738] block">Wellness</span>
              <h4 className="font-bold text-sm text-[#162620] dark:text-[#FAF7F2]">Weekly Streak & Memory</h4>
              <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7]">7-day gentle activity records</p>
            </div>
          </button>
        </div>

        {/* ── ACOUSTIC SENSORY SOUNDSCAPES BAR ── */}
        <div className="card-editorial p-5 bg-white dark:bg-[#1A2620] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎵</span>
              <div>
                <h4 className="font-bold text-sm text-[#162620] dark:text-[#FAF7F2]">
                  Courtyard Calming Sounds & Melodies
                </h4>
                <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7]">
                  Tap any gentle sound to soothe the mind, support focus, or unwind peacefully.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C382B] dark:text-[#C99738] bg-[#F3ECE2] dark:bg-white/10 px-2 py-0.5 rounded hidden sm:inline">
              Offline Audio
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { label: 'Bamboo Flute', emoji: '🪈', desc: 'Assam Melody', fn: () => soundSynth.playAssamFluteMelody() },
              { label: 'Bihu Dhol', emoji: '🥁', desc: 'Folk Rhythm', fn: () => soundSynth.playBihuRhythm() },
              { label: 'Temple Bell', emoji: '🔔', desc: '432 Hz Calming', fn: () => soundSynth.playTempleBell() },
              { label: 'Morning Birds', emoji: '🐦', desc: 'Hillside Dawn', fn: () => soundSynth.playMorningBirdSong() },
              { label: 'Tea Garden Rain', emoji: '🌧️', desc: 'Gentle Rain', fn: () => soundSynth.playRainOnTeaLeaves() },
              { label: 'Singing Bowl', emoji: '🥣', desc: 'Deep Calm', fn: () => soundSynth.playSingingBowl() },
              { label: 'Spring Water', emoji: '💧', desc: 'Bamboo Drop', fn: () => soundSynth.playWaterDrop() }
            ].map((snd, idx) => (
              <button
                key={idx}
                onClick={snd.fn}
                className="p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] hover:bg-[#F3ECE2] dark:hover:bg-[#1E2D25] border border-[#1C382B]/10 dark:border-white/10 text-left transition-colors cursor-pointer flex flex-col justify-between focus-accessible"
              >
                <span className="text-xl mb-1">{snd.emoji}</span>
                <span className="text-xs font-bold text-[#162620] dark:text-[#FAF7F2] truncate">{snd.label}</span>
                <span className="text-[10px] text-[#72807A] truncate">{snd.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 6 CORE ACTIVITY CARDS ── */}
        <div>
          <div className="mb-4">
            <h3 className="font-bold text-xl text-[#162620] dark:text-[#FAF7F2]">
              Courtyard Pastimes
            </h3>
            <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7]">
              Select any pastime at your own comfortable pace — no scores to worry about, just pleasant memories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAME_TILES.map((tile) => (
              <button
                key={tile.id}
                id={tile.id}
                onClick={() => {
                  soundSynth.playSoftClick();
                  onNavigate(tile.view);
                }}
                className="card-editorial p-5 text-left flex flex-col justify-between cursor-pointer focus-accessible bg-white dark:bg-[#1A2620] hover:border-[#C99738]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 flex items-center justify-center text-2xl">
                      {tile.emoji}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F3ECE2] dark:bg-white/10 text-[#1C382B] dark:text-[#FAF7F2]">
                      {tile.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#162620] dark:text-[#FAF7F2] leading-snug mb-1">
                    {tile.label}
                  </h3>

                  <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed">
                    {tile.sub}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1C382B]/08 dark:border-white/08 flex items-center justify-between font-bold text-xs text-[#B3532D]">
                  <span>Begin pastime</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── DAILY MEDICINE & REST NOTIFICATION STRIP ── */}
        <div className="card-editorial p-4 sm:p-5 bg-white dark:bg-[#1A2620] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 flex items-center justify-center text-xl shrink-0">
              🍵
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#162620] dark:text-[#FAF7F2]">
                Morning Tea & Routine Medication Recorded ✓
              </h4>
              <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7]">
                Next scheduled checkpoint: 01:00 PM — Light lunch, cool spring water, and afternoon garden rest.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('caregiver-portal');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#F3ECE2] dark:bg-white/10 hover:bg-[#E6DCce] text-[#1C382B] dark:text-[#FAF7F2] text-xs font-semibold border border-[#1C382B]/10 dark:border-white/10 transition-colors cursor-pointer shrink-0 whitespace-nowrap focus-accessible"
          >
            Caregiver Logs →
          </button>
        </div>

      </div>
    </div>
  );
};
