import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, ArrowRight, Globe, Heart } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { NER_LANGUAGES } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (view: ActiveView) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  currentLanguage,
  onSelectLanguage,
}) => {
  const auth = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      await auth.login(phone.trim(), password);
      onNavigate('patient-app');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" id="view-login">
      {/* Left: Illustration Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] items-center justify-center overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#C66B44]/12 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-ner-weave-dark opacity-40 pointer-events-none" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Decorative illustration */}
          <div className="w-40 h-40 mx-auto mb-8 rounded-3xl bg-[#D4AF37]/20 border-2 border-[#D4AF37]/30 flex items-center justify-center animate-companion-breathe">
            <span className="text-8xl">🧠</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#FDFBF7] leading-tight mb-4">
            Keep Your Mind<br />Active & Connected
          </h2>
          <p className="text-base text-[#EAE2D2]/80 leading-relaxed">
            Personalized cognitive activities designed to support memory, attention and everyday mental wellness — in your language.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#D4AF37]/80">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              Voice-First
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
            <span>6 NER Languages</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
            <span>100% Offline</span>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FDFBF7]">
        <div className="w-full max-w-md">
          {/* Language selector at top */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#2D4739]/15 shadow-sm">
              <Globe className="w-4 h-4 text-[#6A9B96]" />
              <select
                value={currentLanguage}
                onChange={(e) => onSelectLanguage(e.target.value as Language)}
                className="bg-transparent text-sm font-bold text-[#1E3A2F] focus:outline-none cursor-pointer"
                aria-label="Select language"
              >
                {NER_LANGUAGES.slice(0, 6).map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.nativeScript}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A2F] to-[#2D4739] flex items-center justify-center shadow-lg">
                <span className="text-3xl">🌿</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">Vanika</h1>
                <p className="text-xs text-[#52635D] font-semibold">Cognitive Wellness</p>
              </div>
            </div>
            <p className="text-lg font-bold text-[#1E3A2F]">Welcome back</p>
            <p className="text-sm text-[#52635D] mt-1">Sign in to continue your wellness journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Phone / Email */}
            <div>
              <label htmlFor="login-phone" className="block text-sm font-bold text-[#1E3A2F] mb-2">
                Phone Number or Email
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
                <input
                  id="login-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-12 pr-4 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-[#1E3A2F] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#52635D] hover:text-[#1E3A2F] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-bold text-[#C66B44] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center">
                {errorMessage}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 focus-accessible"
              id="btn-login-submit"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#2D4739]/15" />
            <span className="text-xs font-bold text-[#52635D] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[#2D4739]/15" />
          </div>

          {/* Create Account */}
          <button
            onClick={() => onNavigate('signup')}
            className="w-full py-4 rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] font-bold text-base hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer focus-accessible"
            id="btn-login-create-account"
          >
            Create New Account
          </button>

          {/* Skip to demo */}
          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm font-semibold text-[#52635D] hover:text-[#C66B44] transition-colors cursor-pointer underline decoration-dashed underline-offset-4"
            >
              Skip to demo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
