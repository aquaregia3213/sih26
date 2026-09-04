import React from 'react';

interface VanikaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const VanikaLogo: React.FC<VanikaLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
      role={onClick ? 'button' : 'group'}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Unique Organic Leaf & Sun Tea emblem */}
      <div
        className={`rounded-2xl bg-gradient-to-br from-[#1E3A2F] to-[#2D4739] text-[#FDFBF7] flex items-center justify-center border-2 border-[#D4AF37] shadow-md group-hover:scale-105 transition-all relative overflow-hidden shrink-0 ${
          isSm ? 'w-9 h-9' : isLg ? 'w-14 h-14' : 'w-11 h-11'
        }`}
      >
        {/* Soft Sun Glow */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37]/30 rounded-full blur-xs" />
        
        {/* Custom SVG Tea Leaf & Sacred Banyan Emblem */}
        <svg
          viewBox="0 0 32 32"
          className={`${isSm ? 'w-5 h-5' : isLg ? 'w-8 h-8' : 'w-6 h-6'} text-[#D4AF37] transition-transform group-hover:rotate-6`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer Leaf Curve */}
          <path d="M16 4C10 8 6 15 8 23C13 25 21 24 25 18C28 12 24 6 16 4Z" fill="#D4AF37" fillOpacity="0.35" stroke="#D4AF37" />
          {/* Leaf Vein */}
          <path d="M11 20C14 16 16 12 16 4" stroke="#FDFBF7" strokeWidth="1.8" />
          <path d="M14 14L18 16" stroke="#FDFBF7" strokeWidth="1.5" />
          <path d="M12 18L15 19.5" stroke="#FDFBF7" strokeWidth="1.5" />
          {/* Golden Sun Dot */}
          <circle cx="23" cy="8" r="2.5" fill="#D4AF37" stroke="none" />
        </svg>
      </div>

      {/* Crisp Dark High-Contrast Wordmark */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-0.5">
          <span
            className={`font-heading font-extrabold tracking-tight text-brand-dark dark:text-[#FDFBF7] ${
              isSm ? 'text-xl' : isLg ? 'text-3xl' : 'text-2xl'
            }`}
          >
            Vanika
            <span className="text-brand-terracotta font-black inline-block ml-0.5">
              .
            </span>
          </span>
        </div>

        {showTagline && (
          <p className="text-[10px] sm:text-xs font-black text-brand-forest dark:text-[#EAE2D2] tracking-wider whitespace-nowrap block mt-0.5">
            Remember. Play. Connect.
          </p>
        )}
      </div>
    </div>
  );
};
