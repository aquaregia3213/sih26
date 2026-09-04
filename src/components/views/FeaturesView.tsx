import React from 'react';
import { Sparkles, Brain, Image, Music, Eye, Heart, ShieldCheck, HardDrive, Bell, Users, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { BanyanFeatureTree } from '../common/BanyanFeatureTree';

interface FeaturesViewProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({ onNavigate, onOpenCompanion }) => {
  const features = [
    {
      id: 'f-1',
      title: 'Life-Story Memory Reconstruction Engine',
      category: 'Episodic Memory (FR-01)',
      symbol: '🖼️',
      color: 'bg-[#C87552]',
      description: 'Dynamic question generator that transforms user-uploaded family photos and albums into contextual "Who is this?" recall activities with rich North Eastern relationship tags.',
      actionView: 'game-memory' as ActiveView,
      actionLabel: 'Try Memory Game'
    },
    {
      id: 'f-2',
      title: 'Progressive Ritual Sequencing',
      category: 'Procedural Memory (FR-02, FR-03)',
      symbol: '🪘',
      color: 'bg-[#D9A441]',
      description: 'Culturally grounded sequencing exercises based on familiar traditions: Rongali Bihu morning rituals, Assam tea plucking cycles, and Wangala harvest drums.',
      actionView: 'game-sequence' as ActiveView,
      actionLabel: 'Try Sequence Game'
    },
    {
      id: 'f-3',
      title: 'Majuli & Riverside Visual Scan',
      category: 'Visual Attention (FR-04)',
      symbol: '👀',
      color: 'bg-[#7EA9A5]',
      description: 'Gentle, zero-stress spot-the-difference exploration in tranquil tea garden scenes with spoken clues and acoustic chimes.',
      actionView: 'game-attention' as ActiveView,
      actionLabel: 'Try Visual Scan'
    },
    {
      id: 'f-4',
      title: 'AI Companion & Reminiscence Engine',
      category: 'Voice Interaction (FR-05, FR-06)',
      symbol: '👵🏽',
      color: 'bg-[#315C4C]',
      description: 'Multilingual voice assistant ("Oja / Aita") trained on regional folktales, Bihu songs, tea garden stories, and calm speech cadence.',
      actionView: 'companion' as ActiveView,
      actionLabel: 'Talk to Oja'
    },
    {
      id: 'f-5',
      title: 'Caregiver Portal & Enculturated Reminders',
      category: 'Caregiver Operations (FR-[#caregiver])',
      symbol: '📊',
      color: 'bg-[#C87552]',
      description: 'Unified 7/30-day cognitive trends, mood logs, patient photo uploader, and daily ritual reminder scheduling.',
      actionView: 'caregiver-portal' as ActiveView,
      actionLabel: 'View Reminders'
    },
    {
      id: 'f-6',
      title: 'Local-First Privacy & AES-256 Vault',
      category: 'Data Sovereignty (FR-17)',
      symbol: '🔒',
      color: 'bg-[#7EA9A5]',
      description: 'Zero external cloud dependency for daily games. Camera frames never leave the device, strictly aligned with India’s DPDP Act 2023.',
      actionView: 'privacy' as ActiveView,
      actionLabel: 'Read Privacy Protocol'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10" id="view-features">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D4739]/15">
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('home');
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#2D4739] hover:text-[#1E3A2F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => {
            soundSynth.playSoftClick();
            onNavigate('patient-app');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2D4739] text-[#FDFBF7] text-xs font-bold shadow-xs hover:bg-[#1E3A2F] transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
          <span>Patient Courtyard</span>
        </button>
      </div>

      {/* Embedded Banyan Feature Tree Hub */}
      <BanyanFeatureTree onNavigate={onNavigate} onOpenCompanion={onOpenCompanion} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C87552]/15 text-[#C87552] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Technical & Product Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#24483C]">
          6 Core Innovation Pillars
        </h2>
        <p className="text-base sm:text-lg text-[#4A5B55] leading-relaxed">
          Engineered specifically for low-connectivity rural regions, multilingual elder populations, and cultural preservation.
        </p>
      </div>

      {/* Grid of 6 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="bg-[#FDFBF7] border-2 border-[#315C4C]/20 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group hover:border-[#315C4C]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl ${feat.color} text-white flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform`}>
                  {feat.symbol}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#EDE5D2] text-[#24483C]">
                  {feat.category}
                </span>
              </div>

              <h3 className="font-heading font-extrabold text-xl text-[#24483C] group-hover:text-[#C87552] transition-colors leading-snug">
                {feat.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#4A5B55] mt-2.5 leading-relaxed">
                {feat.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#315C4C]/15">
              <button
                onClick={() => {
                  soundSynth.playSoftClick();
                  if (feat.actionView === 'companion') {
                    onOpenCompanion();
                  } else {
                    onNavigate(feat.actionView);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#EDE5D2] group-hover:bg-[#315C4C] group-hover:text-[#F8F4EA] text-[#24483C] font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{feat.actionLabel}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
