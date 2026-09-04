import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Heart, Phone, Sparkles, Save, CheckCircle2, 
  Lock, Eye, Ear, Stethoscope, Clock, Calendar, ArrowRight, User 
} from 'lucide-react';
import { 
  Language, 
  DementiaStage, 
  CaregiverRelationship, 
  ImpairmentType, 
  EngagementMode, 
  CheckInFrequency, 
  DataRetentionPolicy,
  PatientProfile,
  EngagementPreference
} from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import { getTranslation } from '../../utils/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenOnboarding?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  onOpenOnboarding
}) => {
  const [activeTab, setActiveTab] = useState<'elder' | 'caregiver'>('elder');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Elder Profile State
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('72');
  const [location, setLocation] = useState('Guwahati, Assam');
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>(currentLanguage || 'Assamese');
  const [dementiaStage, setDementiaStage] = useState<DementiaStage>('early');
  const [hobbies, setHobbies] = useState<string[]>(['Tea gardening', 'Bihu folk music', 'Courtyard walks']);
  const [impairments, setImpairments] = useState<ImpairmentType[]>(['none']);
  const [preferredVoiceTone, setPreferredVoiceTone] = useState<'gentle-female' | 'calm-male' | 'elder-storyteller'>('gentle-female');

  // Caregiver Profile State
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverContact, setCaregiverContact] = useState('');
  const [relationshipToPatient, setRelationshipToPatient] = useState<CaregiverRelationship>('family');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  // Engagement & Continuation State
  const [engagementMode, setEngagementMode] = useState<EngagementMode>('ongoing');
  const [checkInFrequency, setCheckInFrequency] = useState<CheckInFrequency>('biweekly');
  const [dataRetentionOnStop, setDataRetentionOnStop] = useState<DataRetentionPolicy>('keep-12-months');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // Load from unified vanikaStorage vault whenever modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const p = vanikaStorage.getProfile();
        setName(p.name || 'Bhaben Hazarika');
        setAge(p.age ? String(p.age) : '72');
        setLocation(p.location || 'Guwahati, Assam');
        setPrimaryLanguage(p.primaryLanguage || currentLanguage || 'Assamese');
        setDementiaStage(p.dementiaStage || 'early');
        if (p.hobbiesOrInterests && p.hobbiesOrInterests.length > 0) {
          setHobbies(p.hobbiesOrInterests);
        }
        if (p.hearingOrVisionImpairment && p.hearingOrVisionImpairment.length > 0) {
          setImpairments(p.hearingOrVisionImpairment);
        }
        setPreferredVoiceTone(p.preferredVoiceTone || 'gentle-female');

        setCaregiverName(p.caregiverName || 'Ananya Hazarika');
        setCaregiverContact(p.caregiverContact || '+91 94350 12345');
        setRelationshipToPatient(p.relationshipToPatient || 'family');
        setEmergencyContact(p.emergencyContact || '+91 94350 12345');

        // Check engagement preference
        const pref = vanikaStorage.getEngagementPreference();
        if (pref.engagementMode) setEngagementMode(pref.engagementMode);
        if (pref.checkInFrequency) setCheckInFrequency(pref.checkInFrequency);
        if (pref.dataRetentionOnStop) setDataRetentionOnStop(pref.dataRetentionOnStop);

        // Check legacy profile for nickname/notes if present
        const legacy = localStorage.getItem('vanika_user_profile');
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            if (parsed.elderNickname) setNickname(parsed.elderNickname);
            if (parsed.notes) setNotes(parsed.notes);
          } catch (e) {
            // ignore
          }
        }

        const apiKey = localStorage.getItem('vanika_gemini_api_key') || '';
        setGeminiApiKey(apiKey);
      } catch (err) {
        console.warn('Notice loading vault in UserProfileModal:', err);
      }
    }
  }, [isOpen, currentLanguage]);

  if (!isOpen) return null;

  const hobbyOptions = [
    'Tea gardening', 'Bihu folk music', 'Courtyard walks', 
    'Traditional weaving', 'Majuli river stories', 'Fish angling',
    'Old radio broadcasts', 'Brahmaputra boat watching'
  ];

  const handleToggleHobby = (h: string) => {
    soundSynth.playSoftClick();
    setHobbies(prev => 
      prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
    );
  };

  const handleToggleImpairment = (imp: ImpairmentType) => {
    soundSynth.playSoftClick();
    if (imp === 'none') {
      setImpairments(['none']);
      return;
    }
    setImpairments(prev => {
      const filtered = prev.filter(x => x !== 'none');
      return filtered.includes(imp) ? filtered.filter(x => x !== imp) : [...filtered, imp];
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playGentleChime();

    // 1. Recalibrate baseline difficulty & accessibility
    const calibratedDifficulty = vanikaStorage.calibrateBaselineDifficulty(
      dementiaStage, 
      Number(age) || 72
    );
    const calibratedAccessibility = vanikaStorage.calibrateAccessibility(impairments);

    // 2. Build and save unified PatientProfile
    const existing = vanikaStorage.getProfile();
    const updatedProfile: PatientProfile = {
      ...existing,
      name: name.trim() || 'Bhaben Hazarika',
      age: Number(age) || 72,
      location: location.trim() || 'Guwahati, Assam',
      primaryLanguage,
      caregiverName: caregiverName.trim() || 'Ananya Hazarika',
      caregiverContact: caregiverContact.trim() || '+91 94350 12345',
      relationshipToPatient,
      dementiaStage,
      hobbiesOrInterests: hobbies,
      hearingOrVisionImpairment: impairments,
      emergencyContact: emergencyContact.trim() || caregiverContact.trim(),
      preferredVoiceTone,
      calibratedDifficulty
    };

    vanikaStorage.saveProfile(updatedProfile);

    // 3. Save engagement preference
    const now = new Date();
    const daysToAdd = checkInFrequency === 'weekly' ? 7 : checkInFrequency === 'biweekly' ? 14 : 30;
    const nextCheckInDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    const updatedPref: EngagementPreference = {
      patientId: updatedProfile.id,
      engagementMode,
      checkInFrequency,
      lastCheckInDate: now.toISOString(),
      nextCheckInDue: nextCheckInDate,
      dataRetentionOnStop,
      renewalAction: 'continue-as-is'
    };
    vanikaStorage.saveEngagementPreference(updatedPref);

    // 4. Save Gemini API key
    if (geminiApiKey.trim()) {
      localStorage.setItem('vanika_gemini_api_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('vanika_gemini_api_key');
    }

    // 5. Synchronize legacy profile storage for backward compatibility
    const legacyProfile = {
      elderName: updatedProfile.name,
      elderNickname: nickname.trim() || 'Kaka / Aita',
      age: String(updatedProfile.age),
      primaryLanguage: updatedProfile.primaryLanguage,
      caregiverName: updatedProfile.caregiverName,
      caregiverRelation: updatedProfile.relationshipToPatient,
      emergencyPhone: updatedProfile.emergencyContact,
      reminiscenceTopic: hobbies.slice(0, 2).join(' & '),
      notes: notes.trim()
    };
    localStorage.setItem('vanika_user_profile', JSON.stringify(legacyProfile));

    // 6. Update active language if changed
    if (primaryLanguage !== currentLanguage) {
      onSelectLanguage(primaryLanguage);
    }

    // 7. Dispatch global custom event so open views react immediately
    window.dispatchEvent(new CustomEvent('vanika_profile_updated', {
      detail: { profile: updatedProfile, accessibility: calibratedAccessibility }
    }));

    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FDFBF7] dark:bg-[#182E23] text-[#1E3A2F] dark:text-[#FDFBF7] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#1E3A2F] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-lg shadow-md">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#1E3A2F]">
                  Unified Sanctuary Account
                </span>
                <span className="text-xs text-[#D4AF37] font-bold">AES-256 DPDP Vault</span>
              </div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FDFBF7] tracking-tight">
                Elder & Caregiver Account Profile
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundSynth.playSoftClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#2D4739] hover:bg-[#3E6250] text-[#FDFBF7] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guided Wizard Callout Banner */}
        {onOpenOnboarding && (
          <div className="px-6 py-3 bg-gradient-to-r from-[#2D4739] via-[#1E3A2F] to-[#2D4739] border-b border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#FDFBF7]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <span className="font-extrabold text-[#D4AF37]">Prefer step-by-step guidance?</span>
                <p className="text-[11px] text-[#EAE2D2] leading-tight mt-0.5">
                  The 5-Step Setup Wizard calibrates difficulty, sensory tests, and voice confirmation together.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundSynth.playGentleChime();
                onClose();
                onOpenOnboarding();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-black text-xs shrink-0 transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <span>Launch 5-Step Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-Tab Navigation Switcher */}
        <div className="px-6 pt-3 pb-2 bg-[#F0EAD8] dark:bg-[#0F1E17] border-b border-[#1E3A2F]/10 dark:border-[#D4AF37]/20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundSynth.playSoftClick();
              setActiveTab('elder');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'elder'
                ? 'bg-[#1E3A2F] text-[#FDFBF7] shadow-md border-b-2 border-[#D4AF37]'
                : 'text-[#2D4739] dark:text-[#EAE2D2] hover:bg-white/60'
            }`}
          >
            <span className="text-base">👵🏽</span>
            <span>1. Elder Care Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundSynth.playSoftClick();
              setActiveTab('caregiver');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'caregiver'
                ? 'bg-[#C66B44] text-white shadow-md border-b-2 border-[#D4AF37]'
                : 'text-[#2D4739] dark:text-[#EAE2D2] hover:bg-white/60'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>2. Caregiver & Engagement Plan</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Saved Notification Alert */}
          {isSavedNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md animate-bounce-subtle">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Sanctuary Vault updated & synchronized across Elder & Caregiver views!</span>
            </div>
          )}

          {/* ══════════════ TAB 1: ELDER CARE PROFILE ══════════════ */}
          {activeTab === 'elder' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Basic Demographic */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44]">
                  <Heart className="w-4 h-4" />
                  <span>Elder Patient Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Elder Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Bhaben Hazarika"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Preferred Nickname / Title</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      placeholder="e.g. Kaka / Baidon / Aita"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Age * (Pacing calibration)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Primary Regional Dialect *</label>
                    <select
                      value={primaryLanguage}
                      onChange={e => setPrimaryLanguage(e.target.value as Language)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="Assamese">🌾 Assamese (অসমীয়া)</option>
                      <option value="Bodo">🏹 Bodo (बर')</option>
                      <option value="Khasi">🏔️ Khasi (Meghalaya)</option>
                      <option value="Mizo">🌿 Mizo (Mizoram)</option>
                      <option value="Nagamese">📜 Nagamese (Nagaland)</option>
                      <option value="English">🌐 English</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1">Location (District & State) *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Guwahati, Kamrup Metro, Assam"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Stage & Difficulty */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44]">
                    <Clock className="w-4 h-4" />
                    <span>Dementia Stage & Auto-Calibrated Difficulty</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#1E3A2F] dark:text-[#D4AF37]">
                    Tier: {vanikaStorage.calibrateBaselineDifficulty(dementiaStage, Number(age) || 72)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Clinical Cognitive Stage</label>
                  <select
                    value={dementiaStage}
                    onChange={e => setDementiaStage(e.target.value as DementiaStage)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="early">Early Stage (Mild Cognitive Impairment — Standard Pacing)</option>
                    <option value="moderate">Moderate Stage (Needs Gentle Assistance & Extra Cues)</option>
                    <option value="advanced">Advanced Stage (Gentle Tier: Zero Timers, Full Audio Assistance)</option>
                    <option value="not-diagnosed">Not Diagnosed / Preventive Cognitive Wellness</option>
                    <option value="prefer-not-to-say">Prefer not to disclose</option>
                  </select>
                </div>

                <p className="text-[11px] text-[#52635D] dark:text-[#EAE2D2] leading-relaxed">
                  *VANIKA auto-calibrates memory game timers, hint delays, and audio guidance based on the elder's age and stage.
                </p>
              </div>

              {/* Sensory Impairments */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44]">
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  <span>Sensory Adaptations (Auto-Applies Accessibility)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    impairments.includes('low-vision') 
                      ? 'bg-amber-100 dark:bg-amber-950 border-[#D4AF37] font-bold' 
                      : 'bg-[#FDFBF7] dark:bg-[#182E23] border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={impairments.includes('low-vision')}
                      onChange={() => handleToggleImpairment('low-vision')}
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-[#C66B44]" />
                      <span>Low Vision</span>
                    </div>
                    <p className="text-[10px] text-[#52635D] dark:text-[#A1A1A1]">
                      Auto-applies 20px+ font & contrast
                    </p>
                  </label>

                  <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    impairments.includes('hearing-difficulty') 
                      ? 'bg-amber-100 dark:bg-amber-950 border-[#D4AF37] font-bold' 
                      : 'bg-[#FDFBF7] dark:bg-[#182E23] border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={impairments.includes('hearing-difficulty')}
                      onChange={() => handleToggleImpairment('hearing-difficulty')}
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <Ear className="w-4 h-4 text-[#C66B44]" />
                      <span>Hearing Difficulty</span>
                    </div>
                    <p className="text-[10px] text-[#52635D] dark:text-[#A1A1A1]">
                      Slower voice rate & subtitles
                    </p>
                  </label>

                  <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    impairments.includes('none') 
                      ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 font-bold' 
                      : 'bg-[#FDFBF7] dark:bg-[#182E23] border-stone-200'
                  }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={impairments.includes('none')}
                      onChange={() => handleToggleImpairment('none')}
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Standard Senses</span>
                    </div>
                    <p className="text-[10px] text-[#52635D] dark:text-[#A1A1A1]">
                      Standard 18px elder sizing
                    </p>
                  </label>
                </div>
              </div>

              {/* Nostalgic Interests */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44]">
                  <Sparkles className="w-4 h-4" />
                  <span>Cultural Reminiscence Anchors & Hobbies</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hobbyOptions.map(h => {
                    const isSelected = hobbies.includes(h);
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleToggleHobby(h)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E3A2F] text-[#FDFBF7] shadow-sm border border-[#D4AF37]'
                            : 'bg-[#FDFBF7] dark:bg-[#182E23] border border-[#1E3A2F]/20 text-[#2D4739] dark:text-[#FDFBF7] hover:bg-stone-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voice Companion Persona */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-3 shadow-2xs">
                <label className="block text-xs font-bold">Preferred Voice Companion Tone</label>
                <select
                  value={preferredVoiceTone}
                  onChange={e => setPreferredVoiceTone(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold"
                >
                  <option value="gentle-female">Affectionate Grandmother (Aita / Mei-ieid)</option>
                  <option value="calm-male">Respected Wise Elder (Oja / Pa-ieid)</option>
                  <option value="elder-storyteller">Warm Village Storyteller (0.82x gentle cadence)</option>
                </select>
              </div>

            </div>
          )}

          {/* ══════════════ TAB 2: CAREGIVER & ENGAGEMENT ══════════════ */}
          {activeTab === 'caregiver' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Caregiver Identity & Relationship */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44]">
                  <Stethoscope className="w-4 h-4" />
                  <span>Primary Caregiver Identity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Caregiver Name *</label>
                    <input
                      type="text"
                      value={caregiverName}
                      onChange={e => setCaregiverName(e.target.value)}
                      placeholder="e.g. Ananya Hazarika"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Relationship to Elder *</label>
                    <select
                      value={relationshipToPatient}
                      onChange={e => setRelationshipToPatient(e.target.value as CaregiverRelationship)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="family">Family Member (Son/Daughter/Spouse)</option>
                      <option value="asha-worker">ASHA / Community Health Worker</option>
                      <option value="clinician">Geriatric Clinician / Nurse</option>
                      <option value="self">Self (Independent Elder)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Primary Phone Contact *</label>
                    <input
                      type="tel"
                      value={caregiverContact}
                      onChange={e => setCaregiverContact(e.target.value)}
                      placeholder="+91 94350 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Secondary Emergency Phone Contact</label>
                  <input
                    type="tel"
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                    placeholder="Doctor / Neighbor / ASHA contact"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Engagement Lifecycle & Schedule */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44]">
                  <Calendar className="w-4 h-4" />
                  <span>Care Plan & Check-In Schedule</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Engagement Mode</label>
                    <select
                      value={engagementMode}
                      onChange={e => setEngagementMode(e.target.value as EngagementMode)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold"
                    >
                      <option value="ongoing">Ongoing Long-Term Care (Continuous)</option>
                      <option value="trial-7day">7-Day Guided Evaluation Trial</option>
                      <option value="fixed-program">Fixed Cognitive Program (8-12 Weeks)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Caregiver Progress Check-In Frequency</label>
                    <select
                      value={checkInFrequency}
                      onChange={e => setCheckInFrequency(e.target.value as CheckInFrequency)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold"
                    >
                      <option value="weekly">Weekly (Detailed Trend Review)</option>
                      <option value="biweekly">Bi-weekly (Every 14 Days — Balanced)</option>
                      <option value="monthly">Monthly (ASHA Visit Cycle)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">DPDP Act 2023 Data Retention Policy</label>
                  <select
                    value={dataRetentionOnStop}
                    onChange={e => setDataRetentionOnStop(e.target.value as DataRetentionPolicy)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-semibold"
                  >
                    <option value="keep-12-months">Retain in local vault for 12 months (Clinical history)</option>
                    <option value="keep-3-months">Retain for 3 months then archive</option>
                    <option value="export-then-delete">Export JSON vault then purge immediately</option>
                    <option value="delete-immediately">Immediate purge upon program conclusion</option>
                  </select>
                </div>
              </div>

              {/* AI Engine & Gemini API Key */}
              <div className="p-4 rounded-2xl bg-[#1E3A2F]/10 dark:bg-[#0F1E17] border border-[#D4AF37]/40 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span>AI Engine & Free Key Integration</span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-[#C66B44] dark:text-[#D4AF37] hover:underline"
                  >
                    Get Free Key at Google AI Studio ↗
                  </a>
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="AIzaSy... (Leave empty to use Pollinations Free Open AI)"
                    value={geminiApiKey}
                    onChange={e => setGeminiApiKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-white dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <p className="text-[11px] text-[#2D4739] dark:text-[#EAE2D2] mt-1 font-semibold">
                    *VANIKA functions with zero-config free Pollinations AI or local fallbacks if no API key is supplied!
                  </p>
                </div>
              </div>

              {/* Caregiver Clinical Notes */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-2 shadow-2xs">
                <label className="block text-xs font-bold">Caregiver Observations & Special Routines</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Responds best to morning Bihu flute melodies. Prefers afternoon walks on verandah."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/20 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

            </div>
          )}

          {/* Footer Action Controls */}
          <div className="pt-3 border-t border-[#1E3A2F]/15 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#2D4739] dark:text-[#D4AF37] font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Cloud DPDP Act 2023 Compliant Local Vault</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#1E3A2F]/20 text-[#1E3A2F] dark:text-[#FDFBF7] font-extrabold text-xs hover:bg-[#1E3A2F]/10 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer border border-[#D4AF37]"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>Save Sanctuary Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
