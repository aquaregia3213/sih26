import React, { useState } from 'react';
import { Search, Clock, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { GAME_CARDS, GAME_CATEGORIES } from '../../data/mockData';

interface GamesHubProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ currentLanguage, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = GAME_CARDS.filter((game) => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Hard': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6" id="view-games-hub">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F]">
                Cognitive Activities
              </h1>
              <p className="text-sm text-[#52635D]">
                Choose an activity — no pressure, no timer. Just peaceful enjoyment.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A9B96]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="w-full pl-12 pr-4 py-4 text-base font-semibold rounded-2xl bg-white border-2 border-[#2D4739]/10 text-[#1E3A2F] placeholder-[#52635D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 transition-all shadow-sm"
            id="input-games-search"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                activeCategory === cat.id
                  ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#1E3A2F] shadow-md'
                  : 'bg-white text-[#52635D] border-[#2D4739]/10 hover:border-[#D4AF37] hover:text-[#1E3A2F]'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game, i) => (
            <button
              key={game.id}
              onClick={() => onNavigate(game.view)}
              className="card-lift group relative overflow-hidden rounded-3xl bg-white border border-[#2D4739]/10 p-6 text-left shadow-sm cursor-pointer focus-accessible"
              style={{ animationDelay: `${i * 50}ms` }}
              id={`game-card-${game.id}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                style={{ background: `radial-gradient(ellipse at top left, ${game.color}12 0%, transparent 70%)` }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${game.color}15` }}
                >
                  {game.icon}
                </div>

                {/* Category tag */}
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide mb-2"
                  style={{ backgroundColor: `${game.color}15`, color: game.color }}
                >
                  {game.category === 'daily-recall' ? 'Daily Recall' : game.category}
                </span>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-lg text-[#1E3A2F] leading-tight mb-2 group-hover:text-[#C66B44] transition-colors">
                  {game.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#52635D] leading-relaxed mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs font-bold text-[#6A9B96]">
                    <Clock className="w-3.5 h-3.5" />
                    {game.estimatedTime}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>

                {/* CTA */}
                <div
                  className="pt-3 border-t border-[#2D4739]/08 flex items-center justify-between text-sm font-bold"
                  style={{ color: game.color }}
                >
                  <span>Start activity</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-[#1E3A2F] mb-2">No activities found</h3>
            <p className="text-sm text-[#52635D]">
              Try a different search term or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
