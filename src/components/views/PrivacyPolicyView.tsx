import React from 'react';
import { ShieldCheck, Lock, HardDrive, EyeOff, UserCheck, CheckCircle2, Heart } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface PrivacyPolicyViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10" id="view-privacy-policy">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#315C4C]/15 text-[#24483C] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#315C4C]" />
          India DPDP Act 2023 Compliant
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#24483C]">
          Privacy & Cultural Data Sovereignty
        </h2>
        <p className="text-base sm:text-lg text-[#4A5B55] leading-relaxed">
          Your family photographs, relationship memories, and voice logs are personal treasures. Here is how Vanika protects them.
        </p>
      </div>

      {/* Main Privacy Articles */}
      <div className="bg-[#FDFBF7] border-3 border-[#315C4C] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-8 text-[#24332E]">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#315C4C] text-[#F8F4EA] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
              Local-First Data Storage
            </h3>
          </div>
          <p className="text-sm sm:text-base text-[#4A5B55] leading-relaxed pl-13">
            All user-uploaded photos, custom audio notes, and cognitive game scores reside inside your device’s browser storage (IndexedDB / LocalStorage). Vanika does not require constant cloud connectivity to function.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#315C4C] text-[#F8F4EA] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
              Zero Camera Stream Telemetry
            </h3>
          </div>
          <p className="text-sm sm:text-base text-[#4A5B55] leading-relaxed pl-13">
            Any facial micro-expression or emotion-adaptive pacing analysis runs on-device using local JavaScript models. Live video frames are never recorded, transmitted, or stored on external servers.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#315C4C] text-[#F8F4EA] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
              Cryptographic Safeguards (AES-256)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-[#4A5B55] leading-relaxed pl-13">
            Family names, memory relationship graphs, and caregiver notes are encrypted on disk with AES-256 standard encryption keys.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#315C4C] text-[#F8F4EA] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
              Explicit, Revocable Consent
            </h3>
          </div>
          <p className="text-sm sm:text-base text-[#4A5B55] leading-relaxed pl-13">
            In compliance with the Digital Personal Data Protection (DPDP) Act of India 2023, caregivers and elders retain full rights to export, wipe, or purge all local records instantly with one click.
          </p>
        </div>

      </div>
    </div>
  );
};
