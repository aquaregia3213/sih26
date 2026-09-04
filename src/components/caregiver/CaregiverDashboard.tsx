import React, { useState, useEffect } from 'react';
import { Heart, Activity, Brain, Clock, ShieldCheck, UserCheck, Calendar, RefreshCw, AlertCircle, ArrowLeft, Download, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { AlertCard } from './AlertCard';
import { CognitiveTrendCharts } from './CognitiveTrendCharts';
import { RemindersManager } from './RemindersManager';
import { CulturalCareGuide } from './CulturalCareGuide';
import { PatientProfile, Language, ActiveView, MemoryPhotoItem } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import { AddMemoryPhotoModal } from '../memory/AddMemoryPhotoModal';

interface CaregiverDashboardProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
  onOpenProfile?: () => void;
  onOpenOnboarding?: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  currentLanguage,
  onNavigate,
  onOpenProfile,
  onOpenOnboarding
}) => {
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      return vanikaStorage.getProfile();
    } catch (e) {
      return {
        id: 'patient-001',
        name: 'Bhaben Hazarika',
        age: 72,
        location: 'Guwahati, Assam',
        primaryLanguage: 'Assamese',
        memoryScore: 78,
        attentionScore: 82,
        moodStatus: 'Calm',
        streakDays: 6,
        adherenceRate: 92,
        lastSynced: 'Just now',
        weeklySessions: 14
      };
    }
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        setPatient(vanikaStorage.getProfile());
      } catch (e) {}
    };
    window.addEventListener('vanika_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('vanika_profile_updated', handleProfileUpdate);
  }, []);

  const safePatient = patient || {
    id: 'patient-001',
    name: 'Bhaben Hazarika',
    age: 72,
    location: 'Guwahati, Assam',
    primaryLanguage: 'Assamese',
    memoryScore: 78,
    attentionScore: 82,
    moodStatus: 'Calm',
    streakDays: 6,
    adherenceRate: 92,
    lastSynced: 'Just now',
    weeklySessions: 14
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Photo form fields
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoPerson, setPhotoPerson] = useState('');
  const [photoRel, setPhotoRel] = useState('Son');
  const [photoYear, setPhotoYear] = useState('2024');
  const [photoLocation, setPhotoLocation] = useState('Guwahati, Assam');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [photoOptions, setPhotoOptions] = useState('Your Son, Uncle Mohan, Dr. Sharma, Neighbour Barua');

  const handleRefresh = () => {
    soundSynth.playWaterDrop();
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = vanikaStorage.getProfile();
      setPatient({
        ...refreshed,
        lastSynced: 'Just now'
      });
      setIsRefreshing(false);
    }, 800);
  };

  const handleExportVault = () => {
    soundSynth.playCelebration();
    const vaultJson = vanikaStorage.exportFullVault();
    const blob = new Blob([vaultJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanika-patient-vault-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('AES-256 Encrypted Patient Vault exported cleanly.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoPerson.trim()) return;

    soundSynth.playGentleChime();
    const optsArray = photoOptions.split(',').map(s => s.trim()).filter(Boolean);
    const newPhoto: MemoryPhotoItem = {
      id: `custom-photo-${Date.now()}`,
      title: photoTitle,
      personName: photoPerson,
      relationship: photoRel,
      year: photoYear,
      location: photoLocation,
      imageUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      audioPrompt: photoPrompt || `Can you recall who is in this memory photo taken in ${photoYear}?`,
      options: optsArray.length >= 2 ? optsArray : [photoPerson, 'Uncle Mohan', 'Dr. Sharma', 'Family Friend'],
      correctAnswer: photoPerson,
      storyNote: `Uploaded by family caregiver. ${photoPerson} (${photoRel}) in ${photoLocation}.`
    };

    vanikaStorage.addMemoryPhoto(newPhoto);
    setShowPhotoModal(false);
    setPhotoTitle('');
    setPhotoPerson('');
    setPhotoUrl('');
    setPhotoPrompt('');
    setExportNotice('New Family Memory Photo saved to local patient vault.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8" id="view-caregiver-portal">

      {/* ── CLINICAL SUMMARY CARD ── */}
      <div className="card-editorial-dark p-6 sm:p-8 shadow-sm">
        
        {/* Compliance and Telemetry Tag Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-[#C99738] text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C99738] animate-status-pulse" />
              AES-256 Vault
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-emerald-300 text-[11px] font-mono font-bold tracking-wider uppercase">
              DPDP 2023 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-sky-300 text-[11px] font-mono font-bold tracking-wider uppercase">
              Live Sync Ready
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#D1DCD6]">
            <Clock className="w-3.5 h-3.5 text-[#C99738]" />
            <span>Last Sync: {safePatient.lastSynced}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#C99738] text-[#13271E] flex items-center justify-center text-3xl shrink-0 font-bold">
              👴🏽
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {safePatient.name}
                </h1>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-semibold">
                  Age {safePatient.age}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#C99738]/20 text-[#C99738] text-xs font-semibold">
                  {safePatient.location}
                </span>
              </div>
              <p className="text-xs text-[#D1DCD6] mt-1">
                Primary Language: <span className="font-semibold text-white">{safePatient.primaryLanguage}</span> • Active Streak: <span className="font-semibold text-white">{safePatient.streakDays} Days</span> • Weekly Sessions: <span className="font-semibold text-white">{safePatient.weeklySessions}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
            {onOpenProfile && (
              <button
                onClick={() => { soundSynth.playSoftClick(); onOpenProfile(); }}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15 focus-accessible"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C99738]" />
                <span>Profile & Audio Calibration</span>
              </button>
            )}
            <button
              onClick={() => { soundSynth.playSoftClick(); setShowPhotoModal(true); }}
              className="px-3.5 py-2 rounded-lg bg-[#C99738] hover:bg-[#DCAB4E] text-[#13271E] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer focus-accessible shadow-xs"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>+ Add Family Photo</span>
            </button>
            <button
              onClick={handleExportVault}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15 focus-accessible"
            >
              <Download className="w-3.5 h-3.5 text-[#C99738]" />
              <span>Export Vault</span>
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15 focus-accessible"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* ── ADD PHOTO MODAL ── */}
      <AddMemoryPhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentLanguage={currentLanguage}
      />


      {/* ── 4 STRUCTURED METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Episodic Memory Score */}
        <div className="card-editorial p-4 bg-white dark:bg-[#1A2620]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A5852] dark:text-[#9DB0A7]">
              Episodic Memory
            </span>
            <span className="text-base">🖼️</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-[#162620] dark:text-[#FAF7F2] font-mono">{safePatient.memoryScore}</span>
            <span className="text-xs text-[#72807A]">/100</span>
          </div>
          <div className="w-full h-1.5 bg-[#F3ECE2] dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#B3532D] rounded-full" style={{ width: `${safePatient.memoryScore}%` }} />
          </div>
          <p className="text-[11px] text-[#4A5852] dark:text-[#9DB0A7]">↑ +2 pts over 7-day baseline</p>
        </div>

        {/* Visual Attention Score */}
        <div className="card-editorial p-4 bg-white dark:bg-[#1A2620]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A5852] dark:text-[#9DB0A7]">
              Visual Attention
            </span>
            <span className="text-base">👀</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-[#162620] dark:text-[#FAF7F2] font-mono">{safePatient.attentionScore}</span>
            <span className="text-xs text-[#72807A]">/100</span>
          </div>
          <div className="w-full h-1.5 bg-[#F3ECE2] dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#4D7E78] rounded-full" style={{ width: `${safePatient.attentionScore}%` }} />
          </div>
          <p className="text-[11px] text-[#4A5852] dark:text-[#9DB0A7]">Steady reaction cadence</p>
        </div>

        {/* Emotional Mood */}
        <div className="card-editorial p-4 bg-white dark:bg-[#1A2620]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A5852] dark:text-[#9DB0A7]">
              Emotional State
            </span>
            <span className="text-base">😊</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-[#162620] dark:text-[#FAF7F2]">{safePatient.moodStatus}</span>
          </div>
          <div className="w-full h-1.5 bg-[#F3ECE2] dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#C99738] rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-[#4A5852] dark:text-[#9DB0A7]">0 sundowning agitation events</p>
        </div>

        {/* Protocol Adherence */}
        <div className="card-editorial p-4 bg-white dark:bg-[#1A2620]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4A5852] dark:text-[#9DB0A7]">
              Care Adherence
            </span>
            <span className="text-base">✅</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-[#162620] dark:text-[#FAF7F2] font-mono">{safePatient.adherenceRate}</span>
            <span className="text-xs text-[#72807A]">%</span>
          </div>
          <div className="w-full h-1.5 bg-[#F3ECE2] dark:bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#1C382B] dark:bg-[#C99738] rounded-full" style={{ width: `${safePatient.adherenceRate}%` }} />
          </div>
          <p className="text-[11px] text-[#4A5852] dark:text-[#9DB0A7]">6 of 7 daily checkpoints met</p>
        </div>
      </div>

      {/* Non-Alarming Early Decline Alert Card */}
      <AlertCard patientName={safePatient.name} />

      {/* Cognitive Trends Analytics */}
      <CognitiveTrendCharts />

      {/* Reminders & Routine Manager */}
      <RemindersManager currentLanguage={currentLanguage} />

      {/* Indigenous Cultural Knowledge Base */}
      <CulturalCareGuide />

    </div>
  );
};
