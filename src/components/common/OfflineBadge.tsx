import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, ShieldCheck, Check, HardDrive } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';

interface OfflineBadgeProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  syncProgress: number;
  onTriggerSync: () => void;
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({
  isOnline,
  onToggleOnline,
  syncProgress,
  onTriggerSync
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSyncClick = () => {
    soundSynth.playWaterDrop();
    onTriggerSync();
  };

  return (
    <>
      <div className="flex items-center gap-2" id="offline-status-pill-wrapper">
        <button
          id="btn-offline-status-indicator"
          onClick={() => {
            soundSynth.playSoftClick();
            setShowModal(true);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-xs transition-all cursor-pointer ${
            !isOnline
              ? 'bg-[#315C4C]/10 text-[#24483C] border-[#315C4C]/30 hover:bg-[#315C4C]/20'
              : 'bg-[#7EA9A5]/15 text-[#24483C] border-[#7EA9A5]/40 hover:bg-[#7EA9A5]/25'
          }`}
          title="Click to view Offline & Local Encryption status"
        >
          {!isOnline ? (
            <>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C87552] animate-pulse" />
              <WifiOff className="w-3.5 h-3.5 text-[#C87552]" />
              <span className="font-medium">🌿 Working Offline</span>
            </>
          ) : (
            <>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#315C4C]" />
              <Wifi className="w-3.5 h-3.5 text-[#315C4C]" />
              <span className="font-medium">✓ Connected & Encrypted</span>
            </>
          )}
        </button>

        {syncProgress > 0 && syncProgress < 100 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#315C4C] font-semibold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing ({syncProgress}%)</span>
          </div>
        )}
      </div>

      {/* Offline & Encryption Architecture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24332E]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FDFBF7] border-2 border-[#315C4C] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-[#24332E]">
            <div className="flex items-center justify-between pb-4 border-b border-[#315C4C]/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#315C4C] text-[#F8F4EA]">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-[#24483C]">
                    Offline-First & Local Vault
                  </h3>
                  <p className="text-xs text-[#4A5B55]">
                    Designed for remote North Eastern hills with 0% connectivity
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-[#4A5B55] hover:bg-[#EDE5D2] cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-sm leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#F8F4EA] border border-[#D9A441]/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#315C4C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#24483C] text-sm">
                    AES-256 Client-Side Local Storage
                  </h4>
                  <p className="text-xs text-[#4A5B55] mt-0.5">
                    Family photos, facial emotion vectors, and game histories are safely retained on this tablet/device. No internet is required for daily memory games.
                  </p>
                </div>
              </div>

              {/* Sync Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#24483C]">
                  <span>Opportunistic Sync Status</span>
                  <span>{isOnline ? (syncProgress === 100 ? '100% Synced' : `${syncProgress}% in progress`) : 'Paused (Local Only)'}</span>
                </div>
                <div className="w-full bg-[#EDE5D2] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#315C4C] to-[#D9A441] h-full rounded-full transition-all duration-500"
                    style={{ width: `${isOnline ? syncProgress : 100}%` }}
                  />
                </div>
              </div>

              {/* Simulation Controls for Hackathon / Judges */}
              <div className="pt-2 border-t border-[#315C4C]/10 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    soundSynth.playSoftClick();
                    onToggleOnline();
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOnline
                      ? 'bg-[#C87552] text-white hover:bg-[#DE8F6E]'
                      : 'bg-[#315C4C] text-white hover:bg-[#3E725F]'
                  }`}
                >
                  {isOnline ? (
                    <>
                      <WifiOff className="w-4 h-4" /> Simulate Offline Mode
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4" /> Restore Online Connection
                    </>
                  )}
                </button>

                {isOnline && (
                  <button
                    onClick={handleSyncClick}
                    className="py-2.5 px-4 rounded-xl bg-[#D9A441] text-[#24483C] font-bold text-xs hover:bg-[#E7BA5F] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Run Sync Now
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-[#24483C] text-[#F8F4EA] font-semibold text-sm hover:bg-[#315C4C] transition-colors cursor-pointer"
              >
                Close & Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
