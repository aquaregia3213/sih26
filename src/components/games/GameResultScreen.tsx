import React, { useEffect, useState } from 'react';
import { Trophy, Target, Clock, TrendingUp, ArrowRight, Home, Star, Sparkles, Heart } from 'lucide-react';
import { ActiveView, GameResult } from '../../types';
import { DEFAULT_GAME_RESULT } from '../../data/mockData';

interface GameResultScreenProps {
  result?: GameResult;
  onNavigate: (view: ActiveView) => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  result = DEFAULT_GAME_RESULT,
  onNavigate,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Stagger the entrance animation
    setTimeout(() => setShowContent(true), 300);

    // Animate score counting up
    const target = result.accuracy;
    const duration = 1200;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [result.accuracy]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6" id="view-game-result">
      <div className="max-w-2xl mx-auto">

        {/* Celebration Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#E5C45B] flex items-center justify-center text-6xl shadow-lg mb-6 animate-companion-breathe">
            🎉
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-[#1E3A2F] mb-3">
            Well Done!
          </h1>
          <p className="text-lg text-[#52635D]">
            You completed <strong className="text-[#1E3A2F]">{result.gameName}</strong> beautifully.
          </p>
        </div>

        {/* Score Circle */}
        <div className={`flex justify-center mb-10 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative w-44 h-44">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#F5EFE6" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                stroke={animatedScore >= 80 ? '#2D4739' : animatedScore >= 60 ? '#D4AF37' : '#C66B44'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - animatedScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#1E3A2F]">{animatedScore}%</span>
              <span className="text-sm font-bold text-[#6A9B96]">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 text-center shadow-sm">
            <Trophy className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-[#1E3A2F]">{result.score}/{result.totalQuestions}</span>
            <span className="block text-xs font-bold text-[#52635D]">Score</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 text-center shadow-sm">
            <Target className="w-6 h-6 text-[#C66B44] mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-[#1E3A2F]">{result.accuracy}%</span>
            <span className="block text-xs font-bold text-[#52635D]">Accuracy</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 text-center shadow-sm">
            <Clock className="w-6 h-6 text-[#6A9B96] mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-[#1E3A2F]">{formatTime(result.timeSpent)}</span>
            <span className="block text-xs font-bold text-[#52635D]">Time</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 text-center shadow-sm">
            <Star className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-[#1E3A2F]">{result.difficulty}</span>
            <span className="block text-xs font-bold text-[#52635D]">Difficulty</span>
          </div>
        </div>

        {/* What You Did Well */}
        <div className={`bg-emerald-50 rounded-3xl p-6 border border-emerald-200 mb-6 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-extrabold text-emerald-900">What You Did Well</h3>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 font-semibold">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        {result.improvements.length > 0 && (
          <div className={`bg-[#D4AF37]/10 rounded-3xl p-6 border border-[#D4AF37]/30 mb-8 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-lg font-extrabold text-[#1E3A2F]">Your Improvement</h3>
            </div>
            <ul className="space-y-2">
              {result.improvements.map((improvement, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#2D4739] font-semibold">
                  <span className="text-[#D4AF37] mt-0.5">↑</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Recommendation */}
        <div className={`transition-all duration-700 delay-600 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-lg font-extrabold text-[#1E3A2F] mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            Next Recommended Activity
          </h3>
          <button
            onClick={() => onNavigate(result.nextRecommendation.view)}
            className="card-lift w-full flex items-center gap-4 p-5 rounded-2xl bg-white border-2 border-[#2D4739]/10 shadow-sm cursor-pointer text-left hover:border-[#D4AF37] transition-all focus-accessible group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#6A9B96]/15 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
              {result.nextRecommendation.icon}
            </div>
            <div className="flex-1">
              <span className="block text-base font-extrabold text-[#1E3A2F]">{result.nextRecommendation.name}</span>
              <span className="block text-xs font-bold text-[#6A9B96]">{result.nextRecommendation.category}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-[#D4AF37] shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className={`mt-8 flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => onNavigate(result.nextRecommendation.view)}
            className="flex-1 py-4 rounded-2xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer focus-accessible"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('patient-app')}
            className="flex-1 py-4 rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] font-bold text-base flex items-center justify-center gap-2 hover:border-[#D4AF37] transition-all cursor-pointer focus-accessible"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
