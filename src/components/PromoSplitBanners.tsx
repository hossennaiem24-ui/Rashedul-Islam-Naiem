import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { PromoBanner } from '../types';
import { SmartImage } from './SmartImage';

interface PromoSplitBannersProps {
  banners: PromoBanner[];
  onExplore: (targetCategory: string) => void;
}

export const PromoSplitBanners: React.FC<PromoSplitBannersProps> = ({
  banners,
  onExplore,
}) => {
  if (banners.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.slice(0, 2).map((banner) => (
          <div
            key={banner.id}
            className="group relative h-[320px] sm:h-[380px] bg-[#0A0A0A] overflow-hidden border border-neutral-200"
          >
            <SmartImage
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              fallbackLabel={banner.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EF233C] mb-1.5">
                {banner.eyebrow}
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight mb-4 max-w-md">
                {banner.title}
              </h3>
              <button
                type="button"
                onClick={() => onExplore(banner.targetCategory)}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#DC2626] text-[#0A0A0A] hover:text-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors"
              >
                <span>{banner.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
