import React, { useState, useEffect } from 'react';
import { Brain, Eye, Zap, Flame, Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { Language, WeeklyProgress } from '../../types';
import { MOCK_WEEKLY_PROGRESS } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

interface ProgressPageProps {
  currentLanguage: Language;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ currentLanguage }) => {
  const [weekData, setWeekData] = useState<WeeklyProgress[]>(MOCK_WEEKLY_PROGRESS);
  const [streak, setStreak] = useState(7);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const summary = await apiClient.get<any>('/progress/summary');
        if (summary) {
          // Map API response to WeeklyProgress format if available
          if (summary.currentStreak !== undefined) {
            setStreak(summary.currentStreak);
          }
        }

        const trends = await apiClient.get<any>('/progress/trends?range=7d');
        if (trends && Array.isArray(trends.dataPoints) && trends.dataPoints.length > 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const mapped: WeeklyProgress[] = trends.dataPoints.map((pt: any) => {
            const d = new Date(pt.date || pt.day);
            return {
              day: dayNames[d.getDay()] || pt.dayLabel || 'Day',
              activitiesCompleted: pt.sessionsCompleted || pt.activitiesCompleted || 0,
              minutesActive: pt.totalMinutes || pt.minutesActive || 0,
              memoryScore: pt.avgAccuracy || pt.memoryScore || 0,
              attentionScore: pt.attentionScore || Math.round((pt.avgAccuracy || 0) * 0.95),
              patternScore: pt.patternScore || Math.round((pt.avgAccuracy || 0) * 0.9),
            };
          });
          setWeekData(mapped);
        }
      } catch {
        // Offline or API error — keep mock data
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const totalActivities = weekData.reduce((sum, d) => sum + d.activitiesCompleted, 0);
  const totalMinutes = weekData.reduce((sum, d) => sum + d.minutesActive, 0);
  const avgMemory = Math.round(weekData.reduce((sum, d) => sum + d.memoryScore, 0) / weekData.length);
  const avgAttention = Math.round(weekData.reduce((sum, d) => sum + d.attentionScore, 0) / weekData.length);
  const avgPattern = Math.round(weekData.reduce((sum, d) => sum + d.patternScore, 0) / weekData.length);
  const maxActivities = Math.max(...weekData.map(d => d.activitiesCompleted));

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6" id="view-progress">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#6A9B96]/15 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#6A9B96]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F]">
              Your Progress
            </h1>
            <p className="text-sm text-[#52635D]">
              See how you have been doing this week. You are doing wonderfully!
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-[#2D4739]/10 shadow-sm">
            <Calendar className="w-6 h-6 text-[#D4AF37] mb-3" />
            <span className="block text-3xl font-extrabold text-[#1E3A2F]">{totalActivities}</span>
            <span className="block text-xs font-bold text-[#52635D] mt-1">Activities This Week</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2D4739]/10 shadow-sm">
            <Clock className="w-6 h-6 text-[#6A9B96] mb-3" />
            <span className="block text-3xl font-extrabold text-[#1E3A2F]">{totalMinutes}m</span>
            <span className="block text-xs font-bold text-[#52635D] mt-1">Minutes Active</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2D4739]/10 shadow-sm">
            <Flame className="w-6 h-6 text-[#C66B44] mb-3" />
            <span className="block text-3xl font-extrabold text-[#1E3A2F]">7</span>
            <span className="block text-xs font-bold text-[#52635D] mt-1">Day Streak 🔥</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#2D4739]/10 shadow-sm">
            <Award className="w-6 h-6 text-[#D4AF37] mb-3" />
            <span className="block text-3xl font-extrabold text-[#1E3A2F]">{avgMemory}%</span>
            <span className="block text-xs font-bold text-[#52635D] mt-1">Avg Performance</span>
          </div>
        </div>

        {/* Weekly Activity Chart (Simple bar chart) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D4739]/10 shadow-sm mb-8">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-2">Weekly Activity</h2>
          <p className="text-sm text-[#52635D] mb-6">Number of activities completed each day.</p>
          <div className="flex items-end justify-between gap-3 h-48">
            {weekData.map((day, i) => {
              const height = maxActivities > 0 ? (day.activitiesCompleted / maxActivities) * 100 : 0;
              const isToday = i === weekData.length - 1;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-extrabold text-[#1E3A2F]">{day.activitiesCompleted}</span>
                  <div className="w-full max-w-[48px] relative" style={{ height: '160px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-xl transition-all duration-700 ${
                        isToday
                          ? 'bg-gradient-to-t from-[#D4AF37] to-[#E5C45B]'
                          : 'bg-gradient-to-t from-[#2D4739] to-[#3E6250]'
                      }`}
                      style={{ height: `${Math.max(height, 8)}%`, animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isToday ? 'text-[#D4AF37]' : 'text-[#52635D]'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-[#6A9B96] font-semibold mt-4 text-center">
            ✨ Your activity consistency improved this week — great work!
          </p>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Memory */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C66B44]/15 flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#C66B44]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1E3A2F]">Memory</h3>
                <span className="text-xs text-[#52635D]">Recall & recognition</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-extrabold text-[#1E3A2F]">{avgMemory}%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +6%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F5EFE6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C66B44] to-[#D9835E] progress-animated"
                  style={{ '--progress-target': `${avgMemory}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs text-[#52635D] font-semibold">
              Your memory recall has been steadily improving.
            </p>
          </div>

          {/* Attention */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#6A9B96]/15 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#6A9B96]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1E3A2F]">Attention</h3>
                <span className="text-xs text-[#52635D]">Focus & concentration</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-extrabold text-[#1E3A2F]">{avgAttention}%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +4%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F5EFE6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6A9B96] to-[#7EAFAA] progress-animated"
                  style={{ '--progress-target': `${avgAttention}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs text-[#52635D] font-semibold">
              Focus exercises are showing steady progress.
            </p>
          </div>

          {/* Pattern */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1E3A2F]">Pattern</h3>
                <span className="text-xs text-[#52635D]">Logic & sequences</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-extrabold text-[#1E3A2F]">{avgPattern}%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +8%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F5EFE6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C45B] progress-animated"
                  style={{ '--progress-target': `${avgPattern}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs text-[#52635D] font-semibold">
              Pattern recognition is your fastest-growing area!
            </p>
          </div>
        </div>

        {/* Daily Consistency */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D4739]/10 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-2">Daily Consistency</h2>
          <p className="text-sm text-[#52635D] mb-6">Minutes spent on cognitive activities each day.</p>
          <div className="flex items-end justify-between gap-3">
            {weekData.map((day, i) => {
              const isToday = i === weekData.length - 1;
              return (
                <div key={`${day.day}-min`} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-[#1E3A2F]">{day.minutesActive}m</span>
                  <div className="w-full max-w-[40px] h-2.5 rounded-full bg-[#F5EFE6] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isToday ? 'bg-[#D4AF37]' : 'bg-[#6A9B96]'
                      }`}
                      style={{ width: `${Math.min((day.minutesActive / 30) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isToday ? 'text-[#D4AF37]' : 'text-[#52635D]'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
