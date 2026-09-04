export type Language = 'English' | 'Assamese' | 'Bodo' | 'Khasi' | 'Mizo' | 'Nagamese';

export type EmotionState = 'calm' | 'joy' | 'confused' | 'frustrated' | 'thoughtful';

export type ActiveView = 
  | 'home' 
  | 'how-it-works' 
  | 'features' 
  | 'culture' 
  | 'caregiver' 
  | 'privacy' 
  | 'patient-app'
  | 'game-memory'
  | 'game-sequence'
  | 'game-attention'
  | 'game-cultural'
  | 'memory-house'
  | 'memory-garden'
  | 'companion'
  | 'reminders'
  | 'caregiver-portal'
  | 'games-hub'
  | 'game-result'
  | 'progress'
  | 'daily-routine'
  | 'settings'
  | 'notifications'
  | 'login'
  | 'signup'
  | 'onboarding';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  voiceSpeed: 'slow' | 'normal';
  voiceGuideEnabled: boolean;
}

export type DementiaStage = 'early' | 'moderate' | 'advanced' | 'not-diagnosed' | 'prefer-not-to-say';

export type CaregiverRelationship = 'family' | 'asha-worker' | 'clinician' | 'self';

export type ImpairmentType = 'low-vision' | 'hearing-difficulty' | 'none';

export type EngagementMode = 'trial-7day' | 'ongoing' | 'fixed-program';

export type CheckInFrequency = 'weekly' | 'biweekly' | 'monthly';

export type RenewalAction = 'continue-as-is' | 'adjust-difficulty' | 'pause' | 'stop-and-archive';

export type DataRetentionPolicy = 'keep-3-months' | 'keep-12-months' | 'delete-immediately' | 'export-then-delete';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  primaryLanguage: Language;
  memoryScore: number;
  attentionScore: number;
  moodStatus: 'Calm' | 'Happy' | 'Tired' | 'Restless';
  streakDays: number;
  adherenceRate: number;
  lastSynced: string;
  weeklySessions: number;
  
  // Onboarding & Personalization Prerequisites (DPDP Act 2023 Compliant)
  caregiverName?: string;
  caregiverContact?: string;
  relationshipToPatient?: CaregiverRelationship;
  dementiaStage?: DementiaStage;
  hobbiesOrInterests?: string[];
  hearingOrVisionImpairment?: ImpairmentType[];
  emergencyContact?: string;
  consentToDataStorage?: boolean;
  consentToCameraUse?: boolean;
  consentTimestamp?: string;
  preferredVoiceTone?: 'gentle-female' | 'calm-male' | 'elder-storyteller';
  wakeTime?: string;
  activityTime?: string;
  calibratedDifficulty?: 'gentle' | 'standard' | 'advanced';
}

export interface OnboardingProfile extends PatientProfile {
  dementiaStage: DementiaStage;
  caregiverName: string;
  caregiverContact: string;
  relationshipToPatient: CaregiverRelationship;
  hobbiesOrInterests: string[];
  hearingOrVisionImpairment: ImpairmentType[];
  consentToDataStorage: boolean;
  consentToCameraUse: boolean;
  consentTimestamp: string;
}

export interface EngagementPreference {
  patientId: string;
  engagementMode: EngagementMode;
  programDurationWeeks?: number;
  checkInFrequency: CheckInFrequency;
  lastCheckInDate: string;
  nextCheckInDue: string;
  renewalAction?: RenewalAction;
  dataRetentionOnStop: DataRetentionPolicy;
}

export interface MemoryPhotoItem {
  id: string;
  title: string;
  personName: string;
  relationship: string;
  year: string;
  location: string;
  imageUrl: string;
  audioPrompt: string;
  options: string[];
  correctAnswer: string;
  storyNote: string;
}

export interface SequenceStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  culturalNote: string;
}

export interface GardenElement {
  id: string;
  type: 'tree' | 'fern' | 'flower' | 'sunflower' | 'butterfly';
  title: string;
  associatedActivity: string;
  growthStage: number; // 1 to 4
  maxStage: number;
  lastWatered: string;
  color: string;
}

export interface ReminderItem {
  id: string;
  time: string;
  title: string;
  culturalWrapper: string;
  type: 'medication' | 'hydration' | 'activity' | 'memory' | 'rest';
  completed: boolean;
  audioPrompt: string;
}

export interface CognitiveDataPoint {
  date: string;
  dayName: string;
  memoryScore: number;
  attentionScore: number;
  moodIndex: number; // 1 to 10
  minutesActive: number;
}

export interface AlertNotification {
  id: string;
  severity: 'gentle-alert' | 'advisory' | 'positive';
  title: string;
  metricChange: string;
  timeframe: string;
  suggestedAction: string;
  timestamp: string;
  read: boolean;
}

export interface IndigenousCareArticle {
  id: string;
  title: string;
  region: string;
  category: 'diet' | 'routine' | 'storytelling' | 'community';
  summary: string;
  details: string;
  recommendedActivity: string;
}

export interface OnboardingData {
  name: string;
  ageGroup: string;
  language: Language;
  dailyGoal: number;
  practiceAreas: string[];
  caregiverPhone: string;
}

export interface GameResult {
  gameId: string;
  gameName: string;
  gameIcon: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number; // seconds
  difficulty: 'Easy' | 'Medium' | 'Hard';
  improvements: string[];
  strengths: string[];
  nextRecommendation: {
    name: string;
    category: string;
    icon: string;
    view: ActiveView;
  };
}

export interface RoutineTask {
  id: string;
  time: string;
  title: string;
  icon: string;
  period: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
}

export interface AppNotification {
  id: string;
  type: 'activity' | 'routine' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  actionView?: ActiveView;
}

export interface GameCardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'memory' | 'attention' | 'pattern' | 'daily-recall';
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  view: ActiveView;
  color: string;
}

export interface WeeklyProgress {
  day: string;
  activitiesCompleted: number;
  minutesActive: number;
  memoryScore: number;
  attentionScore: number;
  patternScore: number;
}

