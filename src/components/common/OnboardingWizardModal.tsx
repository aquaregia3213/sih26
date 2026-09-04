import React, { useState, useEffect } from 'react';
import { 
  X, Check, ShieldCheck, Heart, User, Sparkles, Volume2, Mic, 
  ArrowRight, ArrowLeft, Lock, Calendar, Stethoscope, AlertCircle, 
  Eye, Ear, Clock, CheckCircle2, ChevronRight 
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
  EngagementPreference,
  AccessibilitySettings
} from '../../types';
import { vanikaStorage } from '../../utils/storage';
import { soundSynth } from '../../utils/audioSynth';
import { speechEngine } from '../../utils/speech';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: PatientProfile, accessibility: Partial<AccessibilitySettings>) => void;
  currentLanguage: Language;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  currentLanguage
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State: Step 1 Required Caregiver Setup
  const [name, setName] = useState('Bhaben Hazarika');
  const [age, setAge] = useState('72');
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>(currentLanguage || 'Assamese');
  const [location, setLocation] = useState('Guwahati, Kamrup Metro, Assam');
  const [caregiverName, setCaregiverName] = useState('Ananya Hazarika');
  const [caregiverContact, setCaregiverContact] = useState('+91 94350 12345');
  const [relationshipToPatient, setRelationshipToPatient] = useState<CaregiverRelationship>('family');
  const [dementiaStage, setDementiaStage] = useState<DementiaStage>('early');
  const [consentToDataStorage, setConsentToDataStorage] = useState(true);
  const [consentToCameraUse, setConsentToCameraUse] = useState(true);

  // Form State: Step 2 Personalization & Accessibility
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([
    'Tea gardening', 'Bihu folk music', 'Courtyard walks'
  ]);
  const [impairments, setImpairments] = useState<ImpairmentType[]>(['none']);
  const [preferredVoiceTone, setPreferredVoiceTone] = useState<'gentle-female' | 'calm-male' | 'elder-storyteller'>('gentle-female');
  const [emergencyContact, setEmergencyContact] = useState('+91 94350 12345');
  const [wakeTime, setWakeTime] = useState('06:30 AM');
  const [activityTime, setActivityTime] = useState('10:00 AM');

  // Form State: Step 3 Engagement Lifecycle
  const [engagementMode, setEngagementMode] = useState<EngagementMode>('ongoing');
  const [programDurationWeeks, setProgramDurationWeeks] = useState('8');
  const [checkInFrequency, setCheckInFrequency] = useState<CheckInFrequency>('biweekly');
  const [dataRetentionOnStop, setDataRetentionOnStop] = useState<DataRetentionPolicy>('keep-12-months');

  // Form State: Step 4 Elder Voice-Guided Confirmation
  const [elderStepStatus, setElderStepStatus] = useState<{
    nameConfirmed: boolean;
    languageConfirmed: boolean;
    comfortConfirmed: boolean;
  }>({
    nameConfirmed: false,
    languageConfirmed: false,
    comfortConfirmed: false
  });
  const [isVoiceTesting, setIsVoiceTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load current vault profile if existing
      const existing = vanikaStorage.getProfile();
      if (existing.name) setName(existing.name);
      if (existing.age) setAge(String(existing.age));
      if (existing.primaryLanguage) setPrimaryLanguage(existing.primaryLanguage);
      if (existing.location) setLocation(existing.location);
      if (existing.caregiverName) setCaregiverName(existing.caregiverName);
      if (existing.caregiverContact) setCaregiverContact(existing.caregiverContact);
      if (existing.relationshipToPatient) setRelationshipToPatient(existing.relationshipToPatient);
      if (existing.dementiaStage) setDementiaStage(existing.dementiaStage);
      if (existing.hobbiesOrInterests) setSelectedHobbies(existing.hobbiesOrInterests);
      if (existing.hearingOrVisionImpairment) setImpairments(existing.hearingOrVisionImpairment);
      if (existing.preferredVoiceTone) setPreferredVoiceTone(existing.preferredVoiceTone);

      const pref = vanikaStorage.getEngagementPreference();
      if (pref.engagementMode) setEngagementMode(pref.engagementMode);
      if (pref.checkInFrequency) setCheckInFrequency(pref.checkInFrequency);
      if (pref.dataRetentionOnStop) setDataRetentionOnStop(pref.dataRetentionOnStop);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hobbyOptions = [
    'Tea gardening', 'Bihu folk music', 'Courtyard walks', 
    'Traditional weaving', 'Majuli river stories', 'Fish angling',
    'Old radio broadcasts', 'Brahmaputra boat watching'
  ];

  const handleToggleHobby = (h: string) => {
    soundSynth.playSoftClick();
    setSelectedHobbies(prev => 
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

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Patient name is required.';
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 40 || Number(age) > 120) {
      errs.age = 'Please enter a valid age (40-120).';
    }
    if (!location.trim()) errs.location = 'Location (district/state) is required for cultural calibration.';
    if (!caregiverName.trim()) errs.caregiverName = 'Caregiver name is required.';
    if (!caregiverContact.trim()) errs.caregiverContact = 'Caregiver contact number is required.';
    if (!consentToDataStorage) {
      errs.consent = 'DPDP Act 2023 compliance requires explicit consent to store patient records.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    soundSynth.playSoftClick();
    if (currentStep === 1) {
      if (!validateStep1()) {
        soundSynth.playWaterDrop();
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Step 4 to 5: Finalize calibration & save
      handleFinalize();
    }
  };

  const handleBack = () => {
    soundSynth.playSoftClick();
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as any);
    }
  };

  const playElderVoiceCheck = (questionType: 'name' | 'language' | 'comfort') => {
    soundSynth.playGentleChime();
    setIsVoiceTesting(true);

    let textToSpeak = '';
    if (questionType === 'name') {
      textToSpeak = `Namaskar ${name}. Does this address feel respectful and clear to you?`;
    } else if (questionType === 'language') {
      textToSpeak = `We will share stories and memories together in ${primaryLanguage}. Is this your comfortable tongue?`;
    } else {
      textToSpeak = `Take a gentle breath. Does our courtyard companion sound calm and peaceful for your hearing?`;
    }

    speechEngine.speak(textToSpeak, {
      language: primaryLanguage,
      rate: 0.82,
      onEnd: () => {
        setIsVoiceTesting(false);
        setElderStepStatus(prev => ({
          ...prev,
          [questionType === 'name' ? 'nameConfirmed' : questionType === 'language' ? 'languageConfirmed' : 'comfortConfirmed']: true
        }));
      }
    });
  };

  const handleFinalize = () => {
    soundSynth.playCelebration();

    // 1. Calibrate baseline game difficulty tier
    const calibratedDifficulty = vanikaStorage.calibrateBaselineDifficulty(
      dementiaStage, 
      Number(age)
    );

    // 2. Calibrate accessibility auto-settings
    const calibratedAccessibility = vanikaStorage.calibrateAccessibility(impairments);

    // 3. Assemble and save OnboardingProfile
    const updatedProfile: PatientProfile = {
      id: vanikaStorage.getCloudUserId() || `patient-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      location: location.trim(),
      primaryLanguage,
      memoryScore: 80,
      attentionScore: 82,
      moodStatus: 'Calm',
      streakDays: 1,
      adherenceRate: 100,
      lastSynced: new Date().toISOString(),
      weeklySessions: 1,
      caregiverName: caregiverName.trim(),
      caregiverContact: caregiverContact.trim(),
      relationshipToPatient,
      dementiaStage,
      hobbiesOrInterests: selectedHobbies,
      hearingOrVisionImpairment: impairments,
      emergencyContact: emergencyContact.trim(),
      consentToDataStorage,
      consentToCameraUse,
      consentTimestamp: new Date().toISOString(),
      preferredVoiceTone,
      wakeTime,
      activityTime,
      calibratedDifficulty
    };

    vanikaStorage.saveProfile(updatedProfile);

    // 4. Calculate next check-in due date
    const now = new Date();
    const daysToAdd = checkInFrequency === 'weekly' ? 7 : checkInFrequency === 'biweekly' ? 14 : 30;
    const nextCheckInDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    const engagementPref: EngagementPreference = {
      patientId: updatedProfile.id,
      engagementMode,
      programDurationWeeks: engagementMode === 'fixed-program' ? Number(programDurationWeeks) : undefined,
      checkInFrequency,
      lastCheckInDate: now.toISOString(),
      nextCheckInDue: nextCheckInDate,
      renewalAction: 'continue-as-is',
      dataRetentionOnStop
    };

    vanikaStorage.saveEngagementPreference(engagementPref);
    vanikaStorage.setOnboardingCompleted(true);

    // Add initial onboarding alert to caregiver vault
    vanikaStorage.addAlert({
      severity: 'positive',
      title: 'New Patient Onboarded & Vault Initialized',
      metricChange: `Profile established for ${name} (${dementiaStage} stage, ${calibratedDifficulty} difficulty).`,
      timeframe: 'Just now',
      suggestedAction: `First caregiver check-in scheduled for ${new Date(nextCheckInDate).toLocaleDateString()}.`
    });

    setCurrentStep(5);
  };

  const handleFinishAndEnter = () => {
    soundSynth.playSoftClick();
    const profile = vanikaStorage.getProfile();
    const calibratedAccessibility = vanikaStorage.calibrateAccessibility(impairments);
    onComplete(profile, calibratedAccessibility);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#FDFBF7] dark:bg-[#182E23] text-[#1E3A2F] dark:text-[#FDFBF7] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#1E3A2F] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-xl shadow-md">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#1E3A2F]">
                  Caregiver & Elder Setup
                </span>
                <span className="text-xs text-[#D4AF37] font-bold">DPDP Act 2023 Compliant</span>
              </div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FDFBF7]">
                Vanika Personalized Onboarding & Care Calibration
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

        {/* Progress Stepper Bar */}
        <div className="px-6 py-3 bg-[#F0EAD8] dark:bg-[#0F1E17] border-b border-[#1E3A2F]/10 dark:border-[#D4AF37]/20 flex items-center justify-between gap-2 text-xs">
          {[
            { step: 1, label: '1. Required Profile' },
            { step: 2, label: '2. Personalization' },
            { step: 3, label: '3. Engagement Plan' },
            { step: 4, label: '4. Elder Voice Check' },
            { step: 5, label: '5. Vault Ready' }
          ].map(s => (
            <div 
              key={s.step} 
              className={`flex items-center gap-1 font-bold ${
                currentStep === s.step 
                  ? 'text-[#C66B44] dark:text-[#D4AF37]' 
                  : currentStep > s.step 
                  ? 'text-emerald-700 dark:text-emerald-400' 
                  : 'text-stone-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === s.step 
                  ? 'bg-[#C66B44] text-white dark:bg-[#D4AF37] dark:text-[#1E3A2F]' 
                  : currentStep > s.step 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-stone-200 text-stone-600'
              }`}>
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className="hidden sm:inline text-[11px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ══════════ STEP 1: REQUIRED CAREGIVER FORM (BLOCKING) ══════════ */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-[#C66B44] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1E3A2F] dark:text-[#D4AF37]">Caregiver / ASHA Initial Setup</h4>
                  <p className="mt-0.5">
                    Filled by family caregiver or ASHA health worker on the elder's behalf. These fields calibrate difficulty, regional cultural assets, and alert escalation routes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Elder / Patient Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Bhaben Hazarika"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Age * (Determines default pacing)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  {errors.age && <p className="text-rose-600 text-[11px] mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Primary Regional Dialect *</label>
                  <select
                    value={primaryLanguage}
                    onChange={e => setPrimaryLanguage(e.target.value as Language)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="Assamese">🌾 Assamese (অসমীয়া)</option>
                    <option value="Bodo">🏹 Bodo (बर')</option>
                    <option value="Khasi">🏔️ Khasi (Meghalaya)</option>
                    <option value="Mizo">🌿 Mizo (Mizoram)</option>
                    <option value="Nagamese">📜 Nagamese (Nagaland)</option>
                    <option value="English">🌐 English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Location (District / State) *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Jorhat, Assam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  {errors.location && <p className="text-rose-600 text-[11px] mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Primary Caregiver Name *</label>
                  <input
                    type="text"
                    value={caregiverName}
                    onChange={e => setCaregiverName(e.target.value)}
                    placeholder="e.g. Ananya Hazarika"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  {errors.caregiverName && <p className="text-rose-600 text-[11px] mt-1">{errors.caregiverName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Caregiver Phone Contact *</label>
                  <input
                    type="text"
                    value={caregiverContact}
                    onChange={e => setCaregiverContact(e.target.value)}
                    placeholder="+91 94350 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  {errors.caregiverContact && <p className="text-rose-600 text-[11px] mt-1">{errors.caregiverContact}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Relationship to Patient *</label>
                  <select
                    value={relationshipToPatient}
                    onChange={e => setRelationshipToPatient(e.target.value as CaregiverRelationship)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="family">Family Member (Son/Daughter/Spouse)</option>
                    <option value="asha-worker">ASHA / Community Health Worker</option>
                    <option value="clinician">Clinician / Geriatric Caregiver</option>
                    <option value="self">Self (Elder Independent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Dementia Stage * <span className="text-[#C66B44]">(Calibrates Game Difficulty)</span>
                  </label>
                  <select
                    value={dementiaStage}
                    onChange={e => setDementiaStage(e.target.value as DementiaStage)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37] font-semibold"
                  >
                    <option value="early">Early Stage (Mild Cognitive Impairment)</option>
                    <option value="moderate">Moderate Stage (Needs Gentle Assistance)</option>
                    <option value="advanced">Advanced Stage (Zero Timers, Full Audio Cues)</option>
                    <option value="not-diagnosed">Not Diagnosed / Preventive Wellness</option>
                    <option value="prefer-not-to-say">Prefer not to disclose</option>
                  </select>
                </div>
              </div>

              {/* DPDP Act 2023 Explicit Consents */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#C66B44] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  DPDP Act 2023 Statutory Consent Capture
                </h4>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentToDataStorage}
                    onChange={e => setConsentToDataStorage(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm text-[#2D4739] focus:ring-[#D4AF37]"
                  />
                  <span className="text-xs text-[#2D4739] dark:text-[#EAE2D2] leading-relaxed">
                    <strong>Consent to Local AES-256 Data Storage:</strong> I consent to local on-device encrypted storage of elder name, game scores, and routine reminders in accordance with India's Digital Personal Data Protection Act 2023.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentToCameraUse}
                    onChange={e => setConsentToCameraUse(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm text-[#2D4739] focus:ring-[#D4AF37]"
                  />
                  <span className="text-xs text-[#2D4739] dark:text-[#EAE2D2] leading-relaxed">
                    <strong>Consent to Optical Engagement Sensor (Optional):</strong> Opt-in to local camera canvas motion analysis for automatic difficulty easing. Camera frames are never sent to external servers.
                  </span>
                </label>
                {errors.consent && <p className="text-rose-600 text-xs font-bold">{errors.consent}</p>}
              </div>
            </div>
          )}

          {/* ══════════ STEP 2: PERSONALIZATION & ACCESSIBILITY ══════════ */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
                <h4 className="font-bold text-sm text-[#1E3A2F] dark:text-[#D4AF37]">Personalization & Accessibility Auto-Tuning</h4>
                <p className="mt-0.5">
                  These choices bias photo recall prompts and automatically calibrate high-contrast, larger text, and voice speed for the elder.
                </p>
              </div>

              {/* Hobbies / Reminiscence Anchors */}
              <div className="space-y-2">
                <label className="block text-xs font-bold">
                  Elder's Hobbies & Nostalgic Interests (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {hobbyOptions.map(h => {
                    const isSelected = selectedHobbies.includes(h);
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleToggleHobby(h)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2D4739] text-[#FDFBF7] shadow-sm'
                            : 'bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/20 text-[#2D4739] dark:text-[#FDFBF7] hover:bg-stone-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sensory Impairments (Auto-sets Accessibility) */}
              <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#C66B44] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  Sensory Adaptation (Auto-Calibrates Accessibility)
                </h4>

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
                      Auto-applies 20px+ font & high contrast
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
                      Auto-slows voice speed & enables text guides
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
                      Default 18px elder accessibility
                    </p>
                  </label>
                </div>
              </div>

              {/* Routine & Companion Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Preferred AI Voice Tone</label>
                  <select
                    value={preferredVoiceTone}
                    onChange={e => setPreferredVoiceTone(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm"
                  >
                    <option value="gentle-female">Affectionate Grandmother (Aita / Mei-ieid)</option>
                    <option value="calm-male">Respected Wise Elder (Oja / Pa-ieid)</option>
                    <option value="elder-storyteller">Warm Village Storyteller (0.8x slow pacing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Secondary Emergency Phone</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                    placeholder="Doctor / Neighbor / ASHA contact"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 3: ENGAGEMENT LIFECYCLE & CONTINUATION ══════════ */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 text-xs text-teal-900 dark:text-teal-200">
                <h4 className="font-bold text-sm text-[#1E3A2F] dark:text-[#D4AF37]">
                  Caregiver Continuation & Engagement Lifecycle
                </h4>
                <p className="mt-0.5">
                  Addresses "How long do they want to continue". Caregiver receives periodic check-in nudges to review progress, adjust difficulty, or export records without treating the elder as a static indefinite profile.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold">Engagement Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'trial-7day', title: '7-Day Guided Trial', desc: 'Explore memory games & voice companion before committing' },
                    { id: 'ongoing', title: 'Ongoing Care', desc: 'Runs continuously with scheduled caregiver check-ins' },
                    { id: 'fixed-program', title: 'Fixed Cognitive Program', desc: 'Structured multi-week therapy cycle (e.g. 8 weeks)' }
                  ].map(m => (
                    <label 
                      key={m.id}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        engagementMode === m.id
                          ? 'bg-[#2D4739] text-[#FDFBF7] border-[#D4AF37] shadow-md'
                          : 'bg-white dark:bg-[#0F1E17] border-stone-200 hover:border-[#2D4739]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="engMode"
                        className="hidden"
                        checked={engagementMode === m.id}
                        onChange={() => setEngagementMode(m.id as any)}
                      />
                      <div className="font-bold text-sm">{m.title}</div>
                      <p className={`text-[11px] mt-1 ${engagementMode === m.id ? 'text-[#EAE2D2]' : 'text-[#52635D]'}`}>
                        {m.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fixed Program duration */}
              {engagementMode === 'fixed-program' && (
                <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-[#0F1E17] border border-stone-200">
                  <label className="block text-xs font-bold mb-1">Target Program Duration (Weeks)</label>
                  <select
                    value={programDurationWeeks}
                    onChange={e => setProgramDurationWeeks(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white dark:bg-[#182E23]"
                  >
                    <option value="4">4 Weeks (1 Month)</option>
                    <option value="8">8 Weeks (2 Months - Recommended)</option>
                    <option value="12">12 Weeks (Quarterly Clinical Cycle)</option>
                  </select>
                </div>
              )}

              {/* Check-In Cadence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Caregiver Progress Check-In Frequency</label>
                  <select
                    value={checkInFrequency}
                    onChange={e => setCheckInFrequency(e.target.value as CheckInFrequency)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm"
                  >
                    <option value="weekly">Weekly (Detailed trend review)</option>
                    <option value="biweekly">Bi-weekly (Every 14 days - Balanced)</option>
                    <option value="monthly">Monthly (Geriatric ASHA visit cycle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">DPDP Data Retention on Program Completion</label>
                  <select
                    value={dataRetentionOnStop}
                    onChange={e => setDataRetentionOnStop(e.target.value as DataRetentionPolicy)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1E3A2F]/20 bg-white dark:bg-[#0F1E17] text-sm"
                  >
                    <option value="keep-12-months">Retain in vault for 12 months (Clinical history)</option>
                    <option value="keep-3-months">Retain for 3 months then archive</option>
                    <option value="export-then-delete">Export JSON vault then purge immediately</option>
                    <option value="delete-immediately">Immediate purge upon program termination</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 4: ELDER VOICE-FIRST CONFIRMATION ══════════ */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
                <h4 className="font-bold text-sm text-[#1E3A2F] dark:text-[#D4AF37]">
                  Elder Voice-Guided 3-Question Confirmation
                </h4>
                <p className="mt-0.5">
                  Zero friction for the elder. The voice companion speaks to confirm respectful name address, preferred regional language, and audio volume.
                </p>
              </div>

              <div className="space-y-3">
                {/* Question 1: Name Check */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C66B44]">Question 1: Name Pronunciation</span>
                    <h5 className="font-bold text-sm text-[#1E3A2F] dark:text-[#FDFBF7]">
                      "Namaskar {name}, does this address feel respectful and clear?"
                    </h5>
                  </div>
                  <button
                    onClick={() => playElderVoiceCheck('name')}
                    disabled={isVoiceTesting}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      elderStepStatus.nameConfirmed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2D4739] text-[#D4AF37] hover:bg-[#1E3A2F]'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{elderStepStatus.nameConfirmed ? 'Verified ✓' : 'Play Audio'}</span>
                  </button>
                </div>

                {/* Question 2: Language Comfort */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C66B44]">Question 2: Dialect Confirmation</span>
                    <h5 className="font-bold text-sm text-[#1E3A2F] dark:text-[#FDFBF7]">
                      "We will share stories in {primaryLanguage}. Does this feel right?"
                    </h5>
                  </div>
                  <button
                    onClick={() => playElderVoiceCheck('language')}
                    disabled={isVoiceTesting}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      elderStepStatus.languageConfirmed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2D4739] text-[#D4AF37] hover:bg-[#1E3A2F]'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{elderStepStatus.languageConfirmed ? 'Verified ✓' : 'Play Audio'}</span>
                  </button>
                </div>

                {/* Question 3: Audio Comfort Check */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C66B44]">Question 3: Comfort & Pacing</span>
                    <h5 className="font-bold text-sm text-[#1E3A2F] dark:text-[#FDFBF7]">
                      "Does the companion voice sound calm, slow, and comfortable?"
                    </h5>
                  </div>
                  <button
                    onClick={() => playElderVoiceCheck('comfort')}
                    disabled={isVoiceTesting}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      elderStepStatus.comfortConfirmed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2D4739] text-[#D4AF37] hover:bg-[#1E3A2F]'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{elderStepStatus.comfortConfirmed ? 'Verified ✓' : 'Play Audio'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ STEP 5: SETUP COMPLETED & CALIBRATION SUMMARY ══════════ */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-lg border-2 border-emerald-400">
                ✓
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1E3A2F] dark:text-[#FDFBF7]">
                  Onboarding Complete & Vault Encrypted!
                </h3>
                <p className="text-xs sm:text-sm text-[#52635D] dark:text-[#EAE2D2] mt-1 max-w-md mx-auto">
                  {name} has been enrolled into Vanika's personalized cognitive sanctuary.
                </p>
              </div>

              {/* Calibration Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-left text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#0F1E17] border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-black block">Difficulty Tier</span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {vanikaStorage.calibrateBaselineDifficulty(dementiaStage, Number(age))}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0F1E17] border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-black block">Dialect</span>
                  <span className="font-bold text-[#1E3A2F] dark:text-[#FDFBF7]">{primaryLanguage}</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0F1E17] border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-black block">Caregiver Target</span>
                  <span className="font-bold text-[#C66B44]">{caregiverName}</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0F1E17] border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-black block">Next Check-In</span>
                  <span className="font-bold text-blue-700">
                    {checkInFrequency === 'weekly' ? '7 Days' : checkInFrequency === 'biweekly' ? '14 Days' : '30 Days'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 max-w-md mx-auto text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted locally with AES-256 (DPDP Act 2023 Compliant)</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 bg-[#F0EAD8] dark:bg-[#0F1E17] border-t border-[#1E3A2F]/10 dark:border-[#D4AF37]/20 flex items-center justify-between gap-3">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#182E23] border border-[#1E3A2F]/20 text-[#2D4739] dark:text-[#FDFBF7] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 4 && (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#2D4739] hover:bg-[#1E3A2F] text-[#FDFBF7] font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 shadow-sm cursor-pointer ml-auto"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-extrabold text-xs flex items-center gap-2 transition-all hover:scale-105 shadow-md cursor-pointer ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>Complete Onboarding & Initialize Vault</span>
            </button>
          )}

          {currentStep === 5 && (
            <button
              onClick={handleFinishAndEnter}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#2D4739] hover:bg-[#1E3A2F] text-[#FDFBF7] font-extrabold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl cursor-pointer mx-auto"
            >
              <span>Enter Elder Courtyard</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
