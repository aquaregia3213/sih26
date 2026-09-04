import React from 'react';

interface CulturalPatternBorderProps {
  className?: string;
  variant?: 'gamusa' | 'weaving' | 'bamboo' | 'hills';
  inverted?: boolean;
}

export const CulturalPatternBorder: React.FC<CulturalPatternBorderProps> = ({
  className = '',
  variant = 'gamusa',
  inverted = false
}) => {
  if (variant === 'gamusa') {
    // Red and cream traditional floral diamond border (Gamusa motif)
    return (
      <div className={`w-full overflow-hidden flex items-center justify-center opacity-70 py-1 ${className}`}>
        <svg
          viewBox="0 0 1200 24"
          className={`w-full h-4 ${inverted ? 'text-[#D9A441]' : 'text-[#C87552]'}`}
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <pattern id={`gamusa-pat-${inverted ? 'inv' : 'reg'}`} width="48" height="24" patternUnits="userSpaceOnUse">
            {/* Diamond motif */}
            <polygon points="24,2 46,12 24,22 2,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="24,6 38,12 24,18 10,12" fill="currentColor" opacity="0.4" />
            <circle cx="24" cy="12" r="2.5" fill="currentColor" />
            {/* Corner dots */}
            <circle cx="0" cy="12" r="1.5" fill="currentColor" />
            <circle cx="48" cy="12" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="24" fill={`url(#gamusa-pat-${inverted ? 'inv' : 'reg'})`} />
        </svg>
      </div>
    );
  }

  if (variant === 'hills') {
    // Gentle rolling mountain contours of North East
    return (
      <div className={`w-full overflow-hidden leading-none ${className}`}>
        <svg
          viewBox="0 0 1200 60"
          className="w-full h-8 md:h-12 text-[#F8F4EA]"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,35 C150,15 350,55 500,28 C650,5 850,45 1050,22 C1150,10 1200,30 1200,60 L0,60 Z" />
        </svg>
      </div>
    );
  }

  // Weave pattern
  return (
    <div className={`w-full h-2 bg-repeat-x opacity-40 ${className}`} style={{
      backgroundImage: `radial-gradient(circle, #315C4C 1px, transparent 1px)`,
      backgroundSize: '12px 6px'
    }} />
  );
};
