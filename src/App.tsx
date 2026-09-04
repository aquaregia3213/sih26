import React, { useState, useEffect } from 'react';
import { ActiveView, AccessibilitySettings, Language, GameResult } from './types';
import { AccessibilityBar } from './components/common/AccessibilityBar';
import { OfflineBadge } from './components/common/OfflineBadge';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AIElderCompanionModal } from './components/companion/AIElderCompanionModal';
import { FloatingCompanionDock } from './components/common/FloatingCompanionDock';

import { UserProfileModal } from './components/common/UserProfileModal';
import { OnboardingWizardModal } from './components/common/OnboardingWizardModal';
import { ElderStoryDemoModal } from './components/demo/ElderStoryDemoModal';
import { OjaAgenticWorkflowModal } from './components/companion/OjaAgenticWorkflowModal';
import { BanyanFeatureTree } from './components/common/BanyanFeatureTree';
import { vanikaStorage } from './utils/storage';

// Landing Page Sections
import { HeroSection } from './components/sections/HeroSection';
import { CulturalSection } from './components/sections/CulturalSection';
import { DayTimeline } from './components/sections/DayTimeline';
import { GamesOverview } from './components/sections/GamesOverview';
import { PrivacySection } from './components/sections/PrivacySection';
import { EmotionalCTA } from './components/sections/EmotionalCTA';

// Interactive Core Modules
import { MemoryHouse } from './components/memory/MemoryHouse';
import { MemoryGarden } from './components/memory/MemoryGarden';
import { MemoryGame } from './components/games/MemoryGame';
import { SequenceGame } from './components/games/SequenceGame';
import { AttentionGame } from './components/games/AttentionGame';
import { CulturalGame } from './components/games/CulturalGame';

// Imported Interactive Features
import { GamesHub } from './components/games/GamesHub';
import { GameResultScreen } from './components/games/GameResultScreen';
import { DailyRoutinePage } from './components/routine/DailyRoutinePage';
import { ProgressPage } from './components/progress/ProgressPage';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { SettingsPage } from './components/settings/SettingsPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import { AddMemoryPhotoModal } from './components/memory/AddMemoryPhotoModal';
import { DEFAULT_GAME_RESULT } from './data/mockData';

// Portals & Views
import { PatientAppView } from './components/patient/PatientAppView';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { HowItWorksView } from './components/views/HowItWorksView';
import { FeaturesView } from './components/views/FeaturesView';
import { CultureDeepDiveView } from './components/views/CultureDeepDiveView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAgenticOpen, setIsAgenticOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');
  const [latestGameResult, setLatestGameResult] = useState<GameResult>(DEFAULT_GAME_RESULT);

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    darkMode: false,
    reducedMotion: false,
    voiceSpeed: 'slow',
    voiceGuideEnabled: true
  });

  // Load patient profile & calibrated accessibility from local encrypted vault
  useEffect(() => {
    const applyProfileSettings = () => {
      try {
        const profile = vanikaStorage.getProfile();
        if (profile.primaryLanguage) {
          setCurrentLanguage(profile.primaryLanguage);
        }
        if (profile.hearingOrVisionImpairment) {
          const calibrated = vanikaStorage.calibrateAccessibility(profile.hearingOrVisionImpairment);
          setAccessibilitySettings(prev => ({ ...prev, ...calibrated }));
        }
      } catch (e) {
        console.warn('[App] Vault initialization notice:', e);
      }
    };

    applyProfileSettings();
    window.addEventListener('vanika_profile_updated', applyProfileSettings);
    return () => window.removeEventListener('vanika_profile_updated', applyProfileSettings);
  }, []);

  // Apply font size, dark mode, and high contrast classes to the document body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge', 'high-contrast', 'dark-theme', 'dark');

    if (accessibilitySettings.fontSize === 'large') {
      root.classList.add('font-large');
    } else if (accessibilitySettings.fontSize === 'extra-large') {
      root.classList.add('font-xlarge');
    } else {
      root.classList.add('font-normal');
    }

    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    }

    if (accessibilitySettings.darkMode) {
      root.classList.add('dark-theme', 'dark');
    }
  }, [accessibilitySettings]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div
      className={`min-h-screen flex flex-col font-body transition-colors duration-200 ${
        accessibilitySettings.highContrast
          ? 'bg-black text-amber-300'
          : accessibilitySettings.darkMode
          ? 'bg-[#111A15] text-[#FAF7F2]'
          : 'bg-[#FAF7F2] text-[#162620]'
      }`}
    >
      {/* 1. Accessibility Controls Bar */}
      <AccessibilityBar
        settings={accessibilitySettings}
        onUpdateSettings={(newSetts) => setAccessibilitySettings(prev => ({ ...prev, ...newSetts }))}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenCompanion={() => setIsCompanionOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* 3. Main Dynamic Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            <HeroSection
              onNavigate={setActiveView}
              onOpenCompanion={() => setIsCompanionOpen(true)}
              onOpenDemoStory={() => setIsDemoOpen(true)}
              currentLanguage={currentLanguage}
            />
            <CulturalSection currentLanguage={currentLanguage} />
            <DayTimeline onOpenCompanion={() => setIsCompanionOpen(true)} />
            <GamesOverview
              onNavigate={setActiveView}
              currentLanguage={currentLanguage}
            />
            <BanyanFeatureTree
              onNavigate={setActiveView}
              onOpenCompanion={() => setIsCompanionOpen(true)}
              currentLanguage={currentLanguage}
            />
            
            {/* Embedded Interactive Memory House Teaser */}
            <div className="py-16 bg-[#FFFFFF] border-y border-[#2D4739]/10">
              <MemoryHouse
                currentLanguage={currentLanguage}
                onNavigate={setActiveView}
                onOpenCompanion={() => setIsCompanionOpen(true)}
                onOpenAddPhoto={() => setIsAddPhotoOpen(true)}
                onSelectActivity={(room) => {
                  if (room.id === 'room-photos' || room.id === 'memory-room') setActiveView('game-memory');
                  else if (room.id === 'room-puzzles' || room.id === 'focus-room') setActiveView('game-sequence');
                  else if (room.id === 'room-stories' || room.id === 'story-room') setActiveView('game-cultural');
                  else if (room.id === 'room-companion' || room.id === 'companion-room') setIsCompanionOpen(true);
                }}
              />
            </div>

            {/* Embedded Interactive Memory Garden Teaser */}
            <div className="py-16 bg-[#FDFBF7]">
              <MemoryGarden currentLanguage={currentLanguage} />
            </div>

            <PrivacySection />
            <EmotionalCTA
              onNavigate={setActiveView}
              onOpenCompanion={() => setIsCompanionOpen(true)}
            />
          </div>
        )}

        {/* Elder Courtyard App View */}
        {activeView === 'patient-app' && (
          <PatientAppView
            currentLanguage={currentLanguage}
            onNavigate={setActiveView}
            onOpenCompanion={() => setIsCompanionOpen(true)}
            onOpenAddPhoto={() => setIsAddPhotoOpen(true)}
          />
        )}

        {/* Dedicated Activities / Games Hub */}
        {activeView === 'games-hub' && (
          <GamesHub
            currentLanguage={currentLanguage}
            onNavigate={setActiveView}
          />
        )}

        {/* Memory House Multi-Room Experience */}
        {activeView === 'memory-house' && (
          <MemoryHouse
            currentLanguage={currentLanguage}
            onNavigate={setActiveView}
            onBackToCourtyard={() => setActiveView('patient-app')}
            onOpenCompanion={() => setIsCompanionOpen(true)}
            onOpenAddPhoto={() => setIsAddPhotoOpen(true)}
            onSelectActivity={(room) => {
              if (room.id === 'room-photos' || room.id === 'memory-room') setActiveView('game-memory');
              else if (room.id === 'room-puzzles' || room.id === 'focus-room') setActiveView('game-sequence');
              else if (room.id === 'room-stories' || room.id === 'story-room') setActiveView('game-cultural');
              else if (room.id === 'room-companion' || room.id === 'companion-room') setIsCompanionOpen(true);
            }}
          />
        )}

        {/* Memory Garden Sanctuary */}
        {activeView === 'memory-garden' && (
          <MemoryGarden
            currentLanguage={currentLanguage}
            onBackToCourtyard={() => setActiveView('patient-app')}
          />
        )}

        {/* 4 Specialized Cognitive Therapy Games with Result Transitions */}
        {activeView === 'game-memory' && (
          <MemoryGame
            currentLanguage={currentLanguage}
            onBackToApp={() => {
              setLatestGameResult({
                ...DEFAULT_GAME_RESULT,
                gameId: 'game-memory',
                gameName: 'Memory Recall & Family Moments',
                gameIcon: '🖼️',
                accuracy: 85,
                score: 4,
                totalQuestions: 5,
                difficulty: 'Easy',
                improvements: ['Response speed improved by 14%', 'Recognized family relations with zero hesitation'],
                strengths: ['Cherished memories recall', 'Visual facial orientation'],
                nextRecommendation: {
                  name: 'Bihu & Tea Rituals',
                  category: 'Pattern Sequence',
                  icon: '🪘',
                  view: 'game-sequence'
                }
              });
              setActiveView('game-result');
            }}
          />
        )}

        {activeView === 'game-sequence' && (
          <SequenceGame
            currentLanguage={currentLanguage}
            onBackToApp={() => {
              setLatestGameResult({
                ...DEFAULT_GAME_RESULT,
                gameId: 'game-sequence',
                gameName: 'Bihu & Tea Rituals',
                gameIcon: '🪘',
                accuracy: 90,
                score: 5,
                totalQuestions: 5,
                difficulty: 'Medium',
                improvements: ['Step ordering cadence was completely smooth'],
                strengths: ['Procedural memory retention', 'Rhythmic cultural awareness'],
                nextRecommendation: {
                  name: 'Tea Garden Walk',
                  category: 'Visual Scan',
                  icon: '👀',
                  view: 'game-attention'
                }
              });
              setActiveView('game-result');
            }}
          />
        )}

        {activeView === 'game-attention' && (
          <AttentionGame
            currentLanguage={currentLanguage}
            onBackToApp={() => {
              setLatestGameResult({
                ...DEFAULT_GAME_RESULT,
                gameId: 'game-attention',
                gameName: 'Tea Garden Walk Scan',
                gameIcon: '👀',
                accuracy: 80,
                score: 4,
                totalQuestions: 5,
                difficulty: 'Easy',
                improvements: ['Good spatial focus in green tea canopy scenes'],
                strengths: ['Visual distinction', 'Sustained focus'],
                nextRecommendation: {
                  name: 'Cultural Heritage Quiz',
                  category: 'Heritage',
                  icon: '🏛️',
                  view: 'game-cultural'
                }
              });
              setActiveView('game-result');
            }}
          />
        )}

        {activeView === 'game-cultural' && (
          <CulturalGame
            currentLanguage={currentLanguage}
            onBackToApp={() => {
              setLatestGameResult({
                ...DEFAULT_GAME_RESULT,
                gameId: 'game-cultural',
                gameName: 'Cultural Heritage Quiz',
                gameIcon: '🏛️',
                accuracy: 100,
                score: 5,
                totalQuestions: 5,
                difficulty: 'Medium',
                improvements: ['Perfect heritage recall of North Eastern instruments and textiles'],
                strengths: ['Deep cultural semantic memory', 'High confidence responses'],
                nextRecommendation: {
                  name: 'The Memory Garden',
                  category: 'Sanctuary',
                  icon: '🌻',
                  view: 'memory-garden'
                }
              });
              setActiveView('game-result');
            }}
          />
        )}

        {/* Post-Game Encouragement & Summary Screen */}
        {activeView === 'game-result' && (
          <GameResultScreen
            result={latestGameResult}
            onNavigate={setActiveView}
          />
        )}

        {/* Daily Routine & Rituals Timeline */}
        {activeView === 'daily-routine' && (
          <DailyRoutinePage />
        )}

        {/* Cognitive Analytics & Progress Page */}
        {activeView === 'progress' && (
          <ProgressPage currentLanguage={currentLanguage} />
        )}

        {/* Caregiver Portal & Clinical Dashboard */}
        {(activeView === 'caregiver' || activeView === 'caregiver-portal') && (
          <CaregiverDashboard
            currentLanguage={currentLanguage}
            onNavigate={setActiveView}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {/* System & Accessibility Settings */}
        {activeView === 'settings' && (
          <SettingsPage
            accessibilitySettings={accessibilitySettings}
            onUpdateSettings={(newSetts) => setAccessibilitySettings(prev => ({ ...prev, ...newSetts }))}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
          />
        )}

        {/* In-App Notifications Center */}
        {activeView === 'notifications' && (
          <NotificationCenter onNavigate={setActiveView} />
        )}

        {/* Optional Multi-User Authentication */}
        {activeView === 'login' && (
          <LoginPage
            onNavigate={setActiveView}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
          />
        )}

        {activeView === 'signup' && (
          <SignupPage
            onNavigate={setActiveView}
            currentLanguage={currentLanguage}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {/* Educational & Narrative Views */}
        {activeView === 'how-it-works' && (
          <HowItWorksView
            onNavigate={setActiveView}
            onOpenCompanion={() => setIsCompanionOpen(true)}
          />
        )}

        {activeView === 'features' && (
          <FeaturesView
            onNavigate={setActiveView}
            onOpenCompanion={() => setIsCompanionOpen(true)}
          />
        )}

        {activeView === 'culture' && (
          <CultureDeepDiveView
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'privacy' && (
          <PrivacyPolicyView onNavigate={setActiveView} />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        onNavigate={setActiveView}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* 5. Persistent AI Elder Companion Floating Modal */}
      <AIElderCompanionModal
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenAgenticWorkflow={() => setIsAgenticOpen(true)}
      />

      {/* 6. Oja Autonomous Agentic AI Workflow & Tool Execution Visualizer */}
      <OjaAgenticWorkflowModal
        isOpen={isAgenticOpen}
        onClose={() => setIsAgenticOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* 7. User Account & Caregiver Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 8. 5-Step Guided Personalized Onboarding & Care Calibration Wizard */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentLanguage={currentLanguage}
        onComplete={(newProfile, calibratedAccessibility) => {
          if (newProfile.primaryLanguage) {
            setCurrentLanguage(newProfile.primaryLanguage);
          }
          if (calibratedAccessibility) {
            setAccessibilitySettings(prev => ({ ...prev, ...calibratedAccessibility }));
          }
          setIsOnboardingOpen(false);
          setActiveView('patient-app');
        }}
      />

      {/* 9. Interactive Elder Life Story Demo Modal (Uncle Dipankar Baruah) */}
      <ElderStoryDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigate={setActiveView}
        currentLanguage={currentLanguage}
      />

      {/* 10. In-App Notification Center Modal Overlay */}
      {isNotificationsOpen && (
        <NotificationCenter
          isModal
          onNavigate={(view) => {
            setIsNotificationsOpen(false);
            setActiveView(view);
          }}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}

      {/* 11. Floating AI Companion Launcher & Mobile Quick Dock */}
      <FloatingCompanionDock
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenCompanion={() => setIsCompanionOpen(true)}
      />

      {/* 12. Offline Capabilities Badge & Storage Manager */}
      <OfflineBadge />

      {/* 13. Add Family Photo or Place Modal */}
      <AddMemoryPhotoModal
        isOpen={isAddPhotoOpen}
        onClose={() => setIsAddPhotoOpen(false)}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
