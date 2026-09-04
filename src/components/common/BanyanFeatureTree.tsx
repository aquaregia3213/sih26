import React, { useState } from 'react';
import { Heart, Image, Sparkles, Eye, Mic, Activity, BookOpen, Shield, ArrowRight, Sun } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { getTranslation } from '../../utils/translations';

interface BanyanFeatureTreeProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
  currentLanguage?: Language;
}

interface TreeNode {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: any;
  symbol: string;
  view?: ActiveView;
  isCompanion?: boolean;
  x: number; // Percent or SVG coordinate X
  y: number; // Percent or SVG coordinate Y
  color: string;
  glowColor: string;
}

export const BanyanFeatureTree: React.FC<BanyanFeatureTreeProps> = ({
  onNavigate,
  onOpenCompanion,
  currentLanguage = 'English'
}) => {
  const t = getTranslation(currentLanguage as Language);
  const [activeNode, setActiveNode] = useState<string>('node-courtyard');

  const nodes: TreeNode[] = [
    {
      id: 'node-courtyard',
      title: t.patientCourtyard || 'Patient Courtyard',
      subtitle: 'Daily Reminiscence & Voice Routine',
      category: 'Sanctuary',
      icon: Heart,
      symbol: '🏡',
      view: 'patient-app',
      x: 18,
      y: 18,
      color: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.4)'
    },
    {
      id: 'node-memory',
      title: t.memoryHouse || 'Memory House',
      subtitle: 'Episodic Photo Recall (FR-01)',
      category: 'Episodic',
      icon: Image,
      symbol: '🖼️',
      view: 'game-memory',
      x: 42,
      y: 12,
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.4)'
    },
    {
      id: 'node-sequence',
      title: t.bihuSequencing || 'Bihu Sequence',
      subtitle: 'Procedural Memory (FR-02)',
      category: 'Procedural',
      icon: Sparkles,
      symbol: '🪘',
      view: 'game-sequence',
      x: 68,
      y: 12,
      color: '#EA580C',
      glowColor: 'rgba(234, 88, 12, 0.4)'
    },
    {
      id: 'node-attention',
      title: t.visualAttention || 'Attention Scan',
      subtitle: 'Majuli Spot Difference (FR-04)',
      category: 'Attention',
      icon: Eye,
      symbol: '👀',
      view: 'game-attention',
      x: 88,
      y: 20,
      color: '#14B8A6',
      glowColor: 'rgba(20, 184, 166, 0.4)'
    },
    {
      id: 'node-companion',
      title: t.talkToOja || 'Oja Companion',
      subtitle: 'Multilingual Voice AI (FR-05)',
      category: 'Voice AI',
      icon: Mic,
      symbol: '👵🏽',
      isCompanion: true,
      x: 86,
      y: 72,
      color: '#D4AF37',
      glowColor: 'rgba(212, 175, 55, 0.5)'
    },
    {
      id: 'node-caregiver',
      title: t.caregiverPortal || 'Caregiver Portal',
      subtitle: '7-Day Cognitive Trends (FR-08)',
      category: 'Insights',
      icon: Activity,
      symbol: '📊',
      view: 'caregiver-portal',
      x: 64,
      y: 84,
      color: '#E11D48',
      glowColor: 'rgba(225, 29, 72, 0.4)'
    },
    {
      id: 'node-roots',
      title: t.neRoots || 'Northeast Roots',
      subtitle: 'Folklore & Heritage Music',
      category: 'Heritage',
      icon: BookOpen,
      symbol: '📜',
      view: 'culture',
      x: 36,
      y: 84,
      color: '#059669',
      glowColor: 'rgba(5, 150, 105, 0.4)'
    },
    {
      id: 'node-privacy',
      title: t.privacy || 'Privacy Vault',
      subtitle: 'AES-256 Offline Sovereignty',
      category: 'Privacy',
      icon: Shield,
      symbol: '🔒',
      view: 'privacy',
      x: 14,
      y: 68,
      color: '#64748B',
      glowColor: 'rgba(100, 116, 139, 0.4)'
    }
  ];

  const handleNodeClick = (node: TreeNode) => {
    soundSynth.playGentleChime();
    setActiveNode(node.id);
    if (node.isCompanion) {
      onOpenCompanion();
    } else if (node.view) {
      onNavigate(node.view);
    }
  };

  return (
    <div id="banyan-tree-canvas-section" className="py-10 px-3 sm:px-6 max-w-6xl mx-auto space-y-6 select-none">
      {/* Title Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E3A2F]/10 dark:bg-[#D4AF37]/15 border border-[#1E3A2F]/20 dark:border-[#D4AF37]/30 text-[#1E3A2F] dark:text-[#D4AF37] text-xs font-mono-eyebrow shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Interactive Sacred Banyan Tree Canvas</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#1E3A2F] dark:text-[#FDFBF7] tracking-tight">
          Tree of Reminiscence
        </h2>
        <p className="text-sm sm:text-base text-[#52635D] dark:text-[#EAE2D2]">
          Click any of the glowing tree branches radiating from the Banyan trunk to open that feature.
        </p>
      </div>

      {/* Main SVG Banyan Tree Canvas Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#182E23] via-[#0F1E17] to-[#0A140F] border-2 border-[#D4AF37]/50 shadow-2xl p-4 sm:p-8 min-h-[560px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        
        {/* Ambient Pulsing Background Stars */}
        <div className="absolute inset-0 bg-ner-weave-dark opacity-30 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none animate-pulse" />

        {/* SVG Curved Branch Connecting Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1000 650"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C66B44" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6A9B96" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Center Banyan Roots & Trunk Silhouette */}
          <g transform="translate(500, 325)">
            {/* Tree Trunk Base */}
            <path
              d="M-25 120 Q-15 40 0 0 Q15 40 25 120 Z"
              fill="#1E3A2F"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            {/* Roots Spread */}
            <path d="M-25 120 Q-50 160 -90 180 M-10 120 Q-20 170 -40 190 M10 120 Q20 170 40 190 M25 120 Q50 160 90 180" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeDasharray="4 2" />
          </g>

          {/* Draw Curved SVG Branch Lines from Center (500, 325) to Node Percentages */}
          {nodes.map((node) => {
            const targetX = (node.x / 100) * 1000;
            const targetY = (node.y / 100) * 650;
            const isSelected = activeNode === node.id;

            // Control points for organic tree branch curvature
            const controlX = 500 + (targetX - 500) * 0.45;
            const controlY = 325 + (targetY - 325) * 0.15;

            return (
              <g key={`path-${node.id}`}>
                {/* Thick Branch Path */}
                <path
                  d={`M 500 325 Q ${controlX} ${controlY} ${targetX} ${targetY}`}
                  fill="none"
                  stroke={isSelected ? '#D4AF37' : 'url(#branchGrad)'}
                  strokeWidth={isSelected ? '4' : '2.5'}
                  strokeDasharray={isSelected ? 'none' : '6 4'}
                  filter="url(#glow)"
                  className="transition-all duration-300"
                />

                {/* Animated Glowing Energy Dot moving along branch */}
                <circle r="4" fill="#D4AF37">
                  <animateMotion
                    path={`M 500 325 Q ${controlX} ${controlY} ${targetX} ${targetY}`}
                    dur={`${4 + (node.x % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Center Banyan Tree Trunk Hub Node */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-auto">
          <button
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#C66B44] to-[#1E3A2F] p-1 shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:scale-110 transition-all cursor-pointer group relative border-2 border-[#D4AF37]"
            title="Vanika Core AI Sanctuary — Banyan Trunk"
          >
            <div className="w-full h-full rounded-full bg-[#1E3A2F] flex flex-col items-center justify-center text-center p-2 border-2 border-[#D4AF37]">
              {/* Tea Leaf & Sun SVG Emblem */}
              <svg viewBox="0 0 32 32" className="w-7 h-7 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4C10 8 6 15 8 23C13 25 21 24 25 18C28 12 24 6 16 4Z" fill="#D4AF37" fillOpacity="0.4" stroke="#D4AF37" />
                <path d="M11 20C14 16 16 12 16 4" stroke="#FDFBF7" strokeWidth="1.8" />
                <path d="M14 14L18 16" stroke="#FDFBF7" strokeWidth="1.5" />
                <circle cx="23" cy="8" r="2.5" fill="#D4AF37" stroke="none" />
              </svg>
              <span className="text-xs font-black text-[#D4AF37] tracking-widest uppercase mt-1 font-heading">
                VANIKA
              </span>
            </div>
            {/* Outer Pulsing Aura */}
            <div className="absolute -inset-3 rounded-full border-2 border-[#D4AF37]/50 animate-ping pointer-events-none" />
          </button>
        </div>

        {/* Orbiting Branch Leaf Nodes (Absolute Positioned over Canvas) */}
        {nodes.map((node) => {
          const isSelected = activeNode === node.id;
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <button
                onClick={() => handleNodeClick(node)}
                className={`group relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-3 backdrop-blur-md shadow-xl ${
                  isSelected
                    ? 'bg-[#1E3A2F] border-[#D4AF37] scale-110 shadow-[0_0_20px_rgba(212,175,55,0.6)] ring-4 ring-[#D4AF37]/30'
                    : 'bg-[#152B23]/95 hover:bg-[#1E3A2F] border-[#D4AF37]/35 hover:border-[#D4AF37] hover:scale-105'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px ${node.glowColor}` : '0 4px 15px rgba(0,0,0,0.4)'
                }}
              >
                {/* Node Leaf Icon Emblem */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner border border-white/20"
                  style={{ backgroundColor: node.color }}
                >
                  <span>{node.symbol}</span>
                </div>

                {/* Node Title & Subtitle */}
                <div className="text-left pr-1 hidden sm:block max-w-[140px]">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37]">
                    {node.category}
                  </span>
                  <span className="block font-heading font-extrabold text-xs text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {node.title}
                  </span>
                </div>

                {/* Glowing Tip Bullet */}
                <div
                  className="w-3 h-3 rounded-full animate-pulse shrink-0 border border-white/40"
                  style={{ backgroundColor: node.color }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
