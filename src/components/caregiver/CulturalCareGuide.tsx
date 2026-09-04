import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, Coffee, Users, Music, Lightbulb } from 'lucide-react';
import { INDIGENOUS_CARE_ARTICLES } from '../../data/culturalContent';
import { IndigenousCareArticle } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

export const CulturalCareGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('care-1');

  const filteredArticles = selectedCategory === 'all'
    ? INDIGENOUS_CARE_ARTICLES
    : INDIGENOUS_CARE_ARTICLES.filter(a => a.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Wisdom' },
    { id: 'diet', label: '🍵 Traditional Diet & Herbs' },
    { id: 'storytelling', label: '📖 Morung Storytelling' },
    { id: 'routine', label: '🚶 Community Walks' },
    { id: 'community', label: '🪘 Flute & Rhythm' }
  ];

  return (
    <div className="bg-[#FDFBF7] border-2 border-[#315C4C]/20 rounded-3xl p-6 sm:p-7 shadow-sm text-[#24332E]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#315C4C]/15 gap-3">
        <div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
            Indigenous Cultural Caregiving Guide
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5B55]">
            Documented traditional caregiving practices, dietary remedies, and communal support across North East India
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                soundSynth.playSoftClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#315C4C] text-[#F8F4EA] shadow-xs'
                  : 'bg-[#EDE5D2] text-[#4A5B55] hover:bg-[#F8F4EA]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredArticles.map(article => {
          const isExpanded = expandedId === article.id;
          return (
            <div
              key={article.id}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                isExpanded
                  ? 'bg-[#F8F4EA] border-[#315C4C] shadow-md'
                  : 'bg-[#F8F4EA]/70 border-[#315C4C]/20 hover:border-[#315C4C]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C87552]">
                    {article.region}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDE5D2] text-[#24483C] capitalize">
                    {article.category}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-lg text-[#24483C] leading-snug mb-2">
                  {article.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#4A5B55] leading-relaxed">
                  {article.summary}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-[#315C4C]/15 space-y-2 animate-fadeIn text-xs text-[#24332E]">
                    <p className="leading-relaxed">
                      <strong>Historical & Neurological Insight:</strong> {article.details}
                    </p>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Actionable Care Tip:</strong> {article.recommendedActivity}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#315C4C]/10 flex justify-end">
                <button
                  onClick={() => {
                    soundSynth.playSoftClick();
                    setExpandedId(isExpanded ? null : article.id);
                  }}
                  className="text-xs font-bold text-[#315C4C] hover:text-[#24483C] cursor-pointer"
                >
                  {isExpanded ? 'Show Less ↑' : 'Read Full Care Guidance →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
