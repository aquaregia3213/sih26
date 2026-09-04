import React from 'react';
import { Image, Eye, BookOpen, UserCheck, Sparkles, ArrowRight, Sun, Coffee, Music, Heart } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { CulturalPatternBorder } from '../common/CulturalPatternBorder';

interface MemoryHouseProps {
  onNavigate?: (view: ActiveView) => void;
  onOpenCompanion?: () => void;
  onBackToCourtyard?: () => void;
  onSelectActivity?: (room: any) => void;
  currentLanguage?: string;
  onOpenAddPhoto?: () => void;
}

export const MemoryHouse: React.FC<MemoryHouseProps> = ({
  onNavigate,
  onOpenCompanion,
  onBackToCourtyard,
  onSelectActivity,
  currentLanguage,
  onOpenAddPhoto
}) => {
  const rooms = [
    {
      id: 'memory-room',
      name: 'Memory Room',
      icon: Image,
      activity: 'Who is this? Photo Recall',
      view: 'game-memory' as ActiveView,
      color: 'bg-[#C66B44]',
      tagline: 'Recall loved ones, family feasts, and cherished photographs',
      symbol: '🖼️',
      actionText: 'Open Photo Album'
    },
    {
      id: 'focus-room',
      name: 'Focus & Attention Room',
      icon: Eye,
      activity: 'Tea Garden Visual Scan',
      view: 'game-attention' as ActiveView,
      color: 'bg-[#6A9B96]',
      tagline: 'Spot gentle differences in peaceful Northeast landscapes',
      symbol: '🌿',
      actionText: 'Enter Focus Room'
    },
    {
      id: 'story-room',
      name: 'Story & Folklore Room',
      icon: BookOpen,
      activity: 'Bihu Festival Sequencing',
      view: 'game-sequence' as ActiveView,
      color: 'bg-[#D4AF37]',
      tagline: 'Arrange harvest rituals and folk rhythms in chronological harmony',
      symbol: '📖',
      actionText: 'Explore Folk Lore'
    },
    {
      id: 'companion-room',
      name: 'Courtyard Companion Room',
      icon: UserCheck,
      activity: 'Oja / Aita Voice Conversation',
      isCompanion: true,
      color: 'bg-[#2D4739]',
      tagline: 'Share a gentle morning tea, proverbs, and comforting conversation',
      symbol: '👵🏽',
      actionText: 'Speak with Oja'
    }
  ];

  return (
    <div className="bg-[#FDFBF7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8" id="section-memory-house">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#1E3A2F] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C66B44]" />
            Signature Experience
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">
            The Memory House
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[#52635D] leading-relaxed">
            A peaceful digital home where each room holds familiar activities, stories, and companionship.
          </p>
        </div>

        {/* Digital Courtyard Visual Architecture */}
        <div className="bg-[#FFFFFF] border border-[#2D4739]/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md relative overflow-hidden">
          {/* Subtle Roof / Eaves Cultural Aesthetic */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C66B44] via-[#D4AF37] to-[#2D4739]" />

          {/* Courtyard Center Badge */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2D4739]/10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2D4739] text-[#FDFBF7] flex items-center justify-center text-2xl shadow-xs">
                🏡
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#1E3A2F]">
                  Raj’s Digital Courtyard
                </h3>
                <p className="text-sm text-[#52635D]">
                  Select any room below to begin your daily cognitive journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#F5EFE6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E3A2F]">
              <Sun className="w-4 h-4 text-[#D4AF37]" />
              <span>Morning Courtyard Sunlight • 100% Offline Ready</span>
            </div>
          </div>

          {/* 4 Interactive Room Chambers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {rooms.map((room) => {
              const Icon = room.icon;
              return (
                <div
                  key={room.id}
                  className="group relative bg-[#FDFBF7] border border-[#2D4739]/15 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-[#2D4739] flex flex-col justify-between"
                >
                  <div>
                    {/* Room Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${room.color} text-white flex items-center justify-center text-2xl shadow-2xs`}>
                          {room.symbol}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xl sm:text-2xl text-[#1E3A2F] group-hover:text-[#C66B44] transition-colors">
                            {room.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#2D4739] uppercase tracking-wide">
                            {room.activity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg text-[#52635D] leading-relaxed mb-6">
                      {room.tagline}
                    </p>
                  </div>

                  {/* Room Entry Trigger Button */}
                  <div className="space-y-2">
                    <button
                      id={`btn-enter-${room.id}`}
                      onClick={() => {
                        soundSynth.playSoftClick();
                        if (room.isCompanion) {
                          if (onOpenCompanion) onOpenCompanion();
                          else if (onSelectActivity) onSelectActivity(room);
                        } else {
                          if (onNavigate) onNavigate(room.view);
                          else if (onSelectActivity) onSelectActivity(room);
                        }
                      }}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#2D4739] hover:bg-[#1E3A2F] text-[#FDFBF7] font-bold text-base flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer focus-accessible"
                    >
                      <span>{room.actionText}</span>
                      <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                    </button>

                    {room.id === 'memory-room' && onOpenAddPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          soundSynth.playSoftClick();
                          onOpenAddPhoto();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#1E3A2F] border border-[#D4AF37]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>📸 + Add Family Photo or Place</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <CulturalPatternBorder variant="gamusa" className="mt-8" />
        </div>
      </div>
    </div>
  );
};
