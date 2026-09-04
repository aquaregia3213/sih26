import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Menu, X, Heart, Shield, Users, Compass, BookOpen, Volume2, 
  Home, Activity, User, Stethoscope, Bell, Gamepad2, CalendarCheck, BarChart3, Settings as SettingsIcon,
  LogIn, LogOut
} from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VanikaLogo } from '../common/VanikaLogo';
import { getTranslation } from '../../utils/translations';
import { vanikaStorage } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  currentLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
  onOpenCompanion: () => void;
  onOpenProfile: () => void;
  onOpenOnboarding?: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  currentLanguage = 'English',
  onSelectLanguage,
  onOpenCompanion,
  onOpenProfile,
  onOpenOnboarding,
  onOpenNotifications
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const [patientName, setPatientName] = useState(() => {
    try {
      return vanikaStorage.getProfile()?.name || 'Elder';
    } catch (e) {
      return 'Elder';
    }
  });

  const t = getTranslation(currentLanguage as Language);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const p = vanikaStorage.getProfile();
        if (p?.name) setPatientName(p.name);
      } catch (e) {}
    };
    window.addEventListener('vanika_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('vanika_profile_updated', handleProfileUpdate);
  }, []);

  const handleNavClick = (view: ActiveView) => {
    soundSynth.playSoftClick();
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const isElderMode = activeView === 'patient-app' || activeView.startsWith('game-') || activeView === 'memory-house' || activeView === 'memory-garden';
  const isCaregiverMode = activeView === 'caregiver' || activeView === 'caregiver-portal';
  const isExplorMode = !isElderMode && !isCaregiverMode;

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#FAF7F2]/95 dark:bg-[#111A15]/95 backdrop-blur-md border-[#1C382B]/12 dark:border-white/10 shadow-xs py-2'
          : 'bg-[#FAF7F2] dark:bg-[#111A15] border-[#1C382B]/08 dark:border-white/06 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Brand Logo with clinical/cultural tag */}
        <div className="flex items-center gap-3">
          <VanikaLogo onClick={() => handleNavClick('home')} size="sm" />
          <span className="hidden xl:inline-block text-[11px] font-semibold text-[#4F5E57] dark:text-[#9DB0A7] border-l border-[#1C382B]/15 dark:border-white/15 pl-3">
            Cognitive Care • NE India
          </span>
        </div>

        {/* ===== CENTER: Segmented Mode Controller ===== */}
        <nav 
          aria-label="Primary View Modes"
          className="hidden md:flex items-center bg-[#F3ECE2] dark:bg-[#1A2620] rounded-xl p-1 border border-[#1C382B]/10 dark:border-white/10"
        >
          {/* Mode 1: Explore */}
          <button
            id="btn-nav-mode-explore"
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${
              isExplorMode
                ? 'bg-[#1C382B] text-[#FAF7F2] shadow-xs'
                : 'text-[#1C382B] dark:text-[#FAF7F2] hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#C99738]" />
            <span>Overview</span>
          </button>

          {/* Mode 2: Elder Courtyard */}
          <button
            id="btn-nav-mode-elder"
            onClick={() => handleNavClick('patient-app')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${
              isElderMode
                ? 'bg-[#C99738] text-[#13271E] shadow-xs font-black'
                : 'text-[#1C382B] dark:text-[#FAF7F2] hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <span>👴🏽</span>
            <span>Elder Courtyard</span>
          </button>

          {/* Mode 3: Caregiver Suite */}
          <button
            id="btn-nav-mode-caregiver"
            onClick={() => handleNavClick('caregiver-portal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${
              isCaregiverMode
                ? 'bg-[#B3532D] text-white shadow-xs font-black'
                : 'text-[#1C382B] dark:text-[#FAF7F2] hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-white" />
            <span>Caregiver Suite</span>
          </button>
        </nav>

        {/* ===== RIGHT SIDE: Quick Actions Cluster ===== */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Quick Sub-navigation */}
          <button
            onClick={() => handleNavClick('games-hub')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeView === 'games-hub'
                ? 'bg-[#1C382B]/10 dark:bg-white/15 text-[#1C382B] dark:text-white font-bold'
                : 'text-[#4F5E57] dark:text-[#9DB0A7] hover:text-[#1C382B] dark:hover:text-white'
            }`}
          >
            Activities
          </button>

          <button
            onClick={() => handleNavClick('daily-routine')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeView === 'daily-routine'
                ? 'bg-[#1C382B]/10 dark:bg-white/15 text-[#1C382B] dark:text-white font-bold'
                : 'text-[#4F5E57] dark:text-[#9DB0A7] hover:text-[#1C382B] dark:hover:text-white'
            }`}
          >
            Routine
          </button>

          <button
            onClick={() => handleNavClick('progress')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeView === 'progress'
                ? 'bg-[#1C382B]/10 dark:bg-white/15 text-[#1C382B] dark:text-white font-bold'
                : 'text-[#4F5E57] dark:text-[#9DB0A7] hover:text-[#1C382B] dark:hover:text-white'
            }`}
          >
            Analytics
          </button>

          <div className="h-4 w-px bg-[#1C382B]/15 dark:bg-white/15 mx-1" />

          {/* Talk to Companion Button */}
          <button
            id="btn-nav-ai-companion"
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C382B] dark:bg-[#1A2620] hover:bg-[#2A4B3C] text-[#FAF7F2] font-semibold text-xs border border-[#C99738]/50 transition-colors shadow-xs cursor-pointer focus-accessible"
            title="Open Voice AI Companion"
          >
            <span className="w-2 h-2 rounded-full bg-[#C99738] animate-status-pulse shrink-0" />
            <Volume2 className="w-3.5 h-3.5 text-[#C99738]" />
            <span>Talk to Oja</span>
          </button>

          {/* Notifications Bell */}
          <button
            id="btn-nav-notifications"
            onClick={() => {
              soundSynth.playSoftClick();
              if (onOpenNotifications) onOpenNotifications();
              else onNavigate('notifications');
            }}
            className="p-2 rounded-lg bg-[#F3ECE2] dark:bg-[#1A2620] hover:bg-[#E6DCce] text-[#1C382B] dark:text-[#C99738] border border-[#1C382B]/10 dark:border-white/10 transition-colors cursor-pointer relative focus-accessible"
            title="Notifications & Routine Alerts"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B3532D]" />
          </button>

          {/* User Profile / Auth Button */}
          {auth.isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <button
                id="btn-nav-account-profile"
                onClick={() => {
                  soundSynth.playSoftClick();
                  onOpenProfile();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E2D25] hover:bg-[#F3ECE2] text-[#1C382B] dark:text-[#FAF7F2] font-semibold text-xs border border-[#1C382B]/15 dark:border-white/15 transition-colors cursor-pointer focus-accessible shadow-xs"
                title="Caregiver & Elder Profile"
              >
                <User className="w-3.5 h-3.5 text-[#4F5E57] dark:text-[#9DB0A7]" />
                <span className="truncate max-w-[100px]">{patientName.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => {
                  soundSynth.playSoftClick();
                  auth.logout();
                }}
                className="p-1.5 rounded-lg text-[#4F5E57] dark:text-[#9DB0A7] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={() => {
                soundSynth.playSoftClick();
                handleNavClick('login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C99738] hover:bg-[#DCAB4E] text-[#13271E] font-bold text-xs shadow-xs transition-colors cursor-pointer"
              title="Sign In or Register"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* ===== MOBILE CONTROLS ===== */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="p-2 rounded-lg bg-[#1C382B] text-[#C99738] border border-[#C99738]/40 cursor-pointer"
            aria-label="Open Voice AI Companion"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              soundSynth.playSoftClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="p-2 rounded-lg bg-[#F3ECE2] dark:bg-[#1A2620] text-[#1C382B] dark:text-[#FAF7F2] border border-[#1C382B]/15 dark:border-white/15 cursor-pointer focus-accessible"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] dark:bg-[#111A15] border-b border-[#1C382B]/12 dark:border-white/10 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          
          {/* Mode Switcher on Mobile */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#F3ECE2] dark:bg-[#1A2620] rounded-xl p-1 border border-[#1C382B]/10">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isExplorMode ? 'bg-[#1C382B] text-white' : 'text-[#1C382B] dark:text-[#FAF7F2]'
              }`}
            >
              <Home className="w-4 h-4 text-[#C99738]" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => handleNavClick('patient-app')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isElderMode ? 'bg-[#C99738] text-[#13271E]' : 'text-[#1C382B] dark:text-[#FAF7F2]'
              }`}
            >
              <span>👴🏽</span>
              <span>Elder</span>
            </button>
            <button
              onClick={() => handleNavClick('caregiver-portal')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                isCaregiverMode ? 'bg-[#B3532D] text-white' : 'text-[#1C382B] dark:text-[#FAF7F2]'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Caregiver</span>
            </button>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1C382B]/10 dark:border-white/10">
            {[
              { label: 'Activities', view: 'games-hub' as ActiveView, icon: Gamepad2 },
              { label: 'Daily Routine', view: 'daily-routine' as ActiveView, icon: CalendarCheck },
              { label: 'Analytics', view: 'progress' as ActiveView, icon: BarChart3 },
              { label: 'Settings', view: 'settings' as ActiveView, icon: SettingsIcon },
              { label: 'Cultural Heritage', view: 'culture' as ActiveView, icon: BookOpen },
              { label: 'Safety & Privacy', view: 'privacy' as ActiveView, icon: Shield },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-[#1C382B] dark:text-[#FAF7F2] hover:bg-[#F3ECE2] dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                >
                  <Icon className="w-4 h-4 text-[#4D7E78]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Profile & Setup Wizard */}
          <div className="pt-2 border-t border-[#1C382B]/10 dark:border-white/10 flex flex-col gap-2">
            {auth.isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    soundSynth.playSoftClick();
                    setIsMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#C99738] text-[#13271E] font-bold text-xs shadow-xs cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{patientName}'s Profile & Preferences</span>
                </button>

                <button
                  onClick={() => {
                    soundSynth.playSoftClick();
                    setIsMobileMenuOpen(false);
                    auth.logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 font-semibold text-xs border border-red-200 dark:border-red-900 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  soundSynth.playSoftClick();
                  handleNavClick('login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#C99738] text-[#13271E] font-bold text-xs shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            {onOpenOnboarding && (
              <button
                onClick={() => {
                  soundSynth.playGentleChime();
                  setIsMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white dark:bg-[#1A2620] text-[#1C382B] dark:text-[#FAF7F2] font-medium text-xs border border-[#1C382B]/15 dark:border-white/15 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C99738]" />
                <span>5-Step Guided Setup</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
