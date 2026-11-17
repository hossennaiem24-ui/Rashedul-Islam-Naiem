import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  compact?: boolean;
  subtitle?: string;
}

export const NaiemArongLogo: React.FC<LogoProps> = ({
  variant = 'dark',
  compact = false,
  subtitle = 'HANDCRAFTED HERITAGE',
}) => {
  const isLight = variant === 'light';
  const primaryText = isLight ? 'text-white' : 'text-[#0A0A0A]';
  const mutedText = isLight ? 'text-neutral-400' : 'text-neutral-500';
  const frameStroke = isLight ? '#FFFFFF' : '#0A0A0A';

  return (
    <div className="inline-flex items-center gap-2.5 select-none shrink-0">
      {/* Bespoke Naiem Arong Geometric Loom & Lotus Emblem */}
      <svg
        viewBox="0 0 40 40"
        className={compact ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          stroke={frameStroke}
          strokeWidth="1.75"
        />
        {/* Digital Red Diamond Core */}
        <path d="M20 7L29 20L20 33L11 20L20 7Z" fill="#DC2626" />
        {/* Intersecting Handloom Warp & Weft Accent */}
        <path
          d="M20 12L25 20L20 28L15 20L20 12Z"
          fill={isLight ? '#0A0A0A' : '#FFFFFF'}
        />
        <circle cx="20" cy="20" r="2.2" fill="#DC2626" />
        <path
          d="M7 20H11M29 20H33"
          stroke={frameStroke}
          strokeWidth="1.5"
        />
      </svg>

      <div className="flex flex-col leading-none">
        <div className={`flex items-baseline gap-1 tracking-[0.14em] uppercase ${primaryText}`}>
          <span className={`font-serif font-bold ${compact ? 'text-base' : 'text-lg md:text-xl'}`}>
            NAIEM
          </span>
          <span
            className={`font-sans font-extrabold text-[#DC2626] ${
              compact ? 'text-base' : 'text-lg md:text-xl'
            }`}
          >
            ARONG
          </span>
        </div>
        {!compact && (
          <span
            className={`text-[9px] font-semibold tracking-[0.26em] uppercase mt-1 ${mutedText}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
