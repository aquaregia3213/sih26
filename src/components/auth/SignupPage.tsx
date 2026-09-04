import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, User, ArrowRight, ArrowLeft, Users, Stethoscope, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ActiveView, Language } from '../../types';

interface SignupPageProps {
  onNavigate: (view: ActiveView) => void;
  currentLanguage: Language;
  onOpenOnboarding?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onOpenOnboarding }) => {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'elder' | 'caregiver'>('elder');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      await auth.register({
        fullName: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        role: role === 'caregiver' ? 'CAREGIVER' : 'ELDER',
      });
      if (onOpenOnboarding) {
        onOpenOnboarding();
      }
      onNavigate(role === 'caregiver' ? 'caregiver-portal' : 'patient-app');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FDFBF7]" id="view-signup">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-sm font-bold text-[#52635D] hover:text-[#1E3A2F] mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#1E3A2F] to-[#2D4739] flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-[#1E3A2F]">Create Account</h1>
          <p className="text-base text-[#52635D] mt-2">Join our cognitive wellness community</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('elder')}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer font-bold ${
              role === 'elder'
                ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#1E3A2F]'
                : 'bg-white border-[#2D4739]/15 text-[#52635D] hover:border-[#D4AF37]/50'
            }`}
          >
            <Users className="w-7 h-7" />
            <span className="text-sm">I am an Elder</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('caregiver')}
            className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer font-bold ${
              role === 'caregiver'
                ? 'bg-[#C66B44]/10 border-[#C66B44] text-[#1E3A2F]'
                : 'bg-white border-[#2D4739]/15 text-[#52635D] hover:border-[#C66B44]/50'
            }`}
          >
            <Stethoscope className="w-7 h-7" />
            <span className="text-sm">I am a Caregiver</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="block text-sm font-bold text-[#1E3A2F] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-bold text-[#1E3A2F] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-phone" className="block text-sm font-bold text-[#1E3A2F] mb-2">
              Phone Number (Optional if Email provided)
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-12 pr-4 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-bold text-[#1E3A2F] mb-2">
              Create Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full pl-12 pr-12 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#52635D] hover:text-[#1E3A2F] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 focus-accessible mt-6"
            id="btn-signup-submit"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#52635D]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#C66B44] hover:text-[#D4AF37] cursor-pointer transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
