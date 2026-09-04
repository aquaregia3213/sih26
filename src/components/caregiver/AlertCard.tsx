import React, { useState, useEffect } from 'react';
import { Heart, Bell, ArrowRight, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import { AlertNotification } from '../../types';

interface AlertCardProps {
  patientName?: string;
  onTakeAction?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  patientName = 'Bhaben',
  onTakeAction
}) => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const activeAlerts = vanikaStorage.evaluateCaregiverAlerts();
    setAlerts(activeAlerts);
  }, []);

  const activeAlert = alerts[0] || {
    id: 'default-alt',
    severity: 'advisory',
    title: 'Cognitive Engagement Baseline Stable',
    metricChange: 'Consistent daily memory session participation',
    timeframe: 'Past 7 Days',
    suggestedAction: 'Spend 10–15 quiet minutes reviewing family Bihu photos.',
    timestamp: 'Today'
  };

  if (isDismissed) return null;

  return (
    <div
      id="caregiver-gentle-alert"
      className="p-5 sm:p-6 rounded-3xl bg-[#FDFBF7] border-2 border-[#C87552]/40 shadow-sm relative overflow-hidden text-[#24332E] animate-fadeIn"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#C87552]/20 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C87552]/15 text-[#C87552] flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#C87552] uppercase tracking-wider">
            Gentle Wellness Advisory
          </span>
        </div>
        <span className="text-xs font-semibold text-[#4A5B55]">
          Logged: {activeAlert.timestamp || 'Today'}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#24483C]">
          {patientName} — {activeAlert.title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#315C4C]/15">
            <span className="text-xs font-bold text-[#4A5B55] uppercase block mb-1">
              Observed Trend & Timeframe
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-[#C87552]">{activeAlert.metricChange}</span>
            </div>
            <p className="text-xs text-[#4A5B55] mt-1">
              Timeframe: {activeAlert.timeframe}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
              Suggested Supportive Action
            </span>
            <p className="text-sm font-bold text-emerald-950">
              {activeAlert.suggestedAction}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#C87552]/15 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-[#4A5B55]">
          ✓ DPDP 2023 Compliant • Zero Diagnostic Stress
        </span>
        <button
          onClick={() => {
            soundSynth.playSoftClick();
            setIsDismissed(true);
            if (onTakeAction) onTakeAction();
          }}
          className="px-4 py-2 rounded-xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#D9A441]" />
          <span>Mark as Attended & Reviewed</span>
        </button>
      </div>
    </div>
  );
};

