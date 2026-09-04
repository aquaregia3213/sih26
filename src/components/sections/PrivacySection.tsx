import React from 'react';
import { ShieldCheck, HardDrive, Lock, UserCheck, CheckCircle } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const privacyPillars = [
    {
      title: 'Local-First Architecture',
      description: 'Your memories, photographs, and daily game scores stay directly on your device. Constant internet connection is not required.',
      icon: HardDrive,
      symbol: '🏠'
    },
    {
      title: 'Private On-Device AI',
      description: 'Emotion detection and voice synthesis models operate on-device. Camera video streams never touch external cloud servers.',
      icon: ShieldCheck,
      symbol: '👁️'
    },
    {
      title: 'Encrypted Safe Vault',
      description: 'Personal memory albums, family relationships, and clinical telemetry logs are encrypted using AES-256 standards.',
      icon: Lock,
      symbol: '🔒'
    },
    {
      title: 'Explicit Caregiver Consent',
      description: 'Exporting telemetry or syncing with ASHA community nurses requires explicit, revocable family authorization.',
      icon: UserCheck,
      symbol: '🤝'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] dark:bg-[#111A15] border-b border-[#1C382B]/10 dark:border-white/10" id="section-privacy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C382B]/06 dark:bg-white/10 text-[#1C382B] dark:text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1C382B] dark:text-[#C99738]" />
            <span>Privacy & Clinical Ethics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#162620] dark:text-[#FAF7F2] tracking-tight">
            Ancestral Reverence for Family Memories
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4A5852] dark:text-[#9DB0A7] leading-relaxed">
            Personal family photographs, voice recordings, and cognitive scores are sacred. Built strictly compliant with India's Digital Personal Data Protection (DPDP) Act 2023.
          </p>
        </div>

        {/* Visual Privacy Pathway Flow */}
        <div className="card-editorial p-6 sm:p-8 bg-white dark:bg-[#1A2620] mb-8 text-center">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B3532D] block mb-4">
            Cryptographic Data Isolation Pathway
          </span>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-[#162620] dark:text-[#FAF7F2]">
            <div className="p-3.5 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 w-full sm:w-auto">
              <span className="text-xl block mb-1">🖼️</span>
              <span>Family Photo / Voice Note</span>
            </div>

            <span className="text-[#B3532D] font-bold rotate-90 sm:rotate-0">➔</span>

            <div className="p-3.5 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 w-full sm:w-auto">
              <span className="text-xl block mb-1">📱</span>
              <span>On-Device Memory Vault</span>
            </div>

            <span className="text-[#B3532D] font-bold rotate-90 sm:rotate-0">➔</span>

            <div className="p-3.5 rounded-lg bg-[#1C382B] text-white w-full sm:w-auto shadow-xs">
              <span className="text-xl block mb-1">🔒</span>
              <span>AES-256 Encrypted Offline Storage</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {privacyPillars.map((p) => (
            <div
              key={p.title}
              className="card-editorial p-5 flex flex-col justify-between bg-white dark:bg-[#1A2620]"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] dark:bg-[#111A15] border border-[#1C382B]/10 dark:border-white/10 flex items-center justify-center text-xl mb-3">
                  {p.symbol}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#162620] dark:text-[#FAF7F2]">
                  {p.title}
                </h3>
                <p className="text-xs text-[#4A5852] dark:text-[#9DB0A7] mt-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C382B]/08 dark:border-white/08 flex items-center gap-1.5 text-[11px] text-[#4D7E78] font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Private by Design</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
