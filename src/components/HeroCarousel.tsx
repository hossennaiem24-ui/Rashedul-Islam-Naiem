import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroBanner } from '../types';
import { SmartImage } from './SmartImage';

interface HeroCarouselProps {
  banners: HeroBanner[];
  onExplore: (targetCategory: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners, onExplore }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const safeBanners = banners.length > 0 ? banners : [];
  const currentIndex = index >= safeBanners.length ? 0 : index;

  useEffect(() => {
    if (paused || safeBanners.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeBanners.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, safeBanners.length]);

  if (safeBanners.length === 0) return null;

  const active = safeBanners[currentIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured Campaigns"
    >
      <div className="relative h-[420px] sm:h-[500px] lg:h-[600px] w-full">
        <SmartImage
          src={active.image}
          alt={active.title}
          className="w-full h-full object-cover object-center transition-opacity duration-500"
          fallbackLabel={active.title}
        />

        {/* Editorial Contrast Scrim */}
        <div
          className={`absolute inset-0 ${
            active.theme === 'light'
              ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
              : active.theme === 'crimson'
                ? 'bg-gradient-to-r from-[#0A0A0A]/90 via-[#450a0a]/55 to-transparent'
                : 'bg-gradient-to-r from-black/85 via-black/45 to-transparent'
          }`}
        />

        {/* Editorial Content Block */}
        <div className="absolute inset-0 max-w-[1440px] mx-auto px-6 md:px-14 flex items-center">
          <div className="max-w-xl text-white">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 h-[2px] bg-[#DC2626]" />
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-neutral-200">
                {active.eyebrow}
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-semibold leading-[1.08] tracking-tight mb-4">
              {active.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed mb-7 max-w-md">
              {active.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onExplore(active.targetCategory)}
                className="inline-flex items-center gap-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
              >
                <span>{active.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onExplore('all')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#0A0A0A] border border-white/40 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
              >
                VIEW CATALOG
              </button>
            </div>
          </div>
        </div>

        {/* Prev / Next Controls */}
        {safeBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length)
              }
              aria-label="Previous Slide"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#DC2626] text-white flex items-center justify-center transition-colors border border-white/15"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1) % safeBanners.length)}
              aria-label="Next Slide"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#DC2626] text-white flex items-center justify-center transition-colors border border-white/15"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {safeBanners.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {safeBanners.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-[#DC2626]'
                    : 'w-3 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
