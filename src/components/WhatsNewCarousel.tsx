import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface WhatsNewCarouselProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onViewMore: () => void;
}

export const WhatsNewCarousel: React.FC<WhatsNewCarouselProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
  onViewMore,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const newArrivals = products.filter((p) => p.isNew);
  const displayList = newArrivals.length >= 4 ? newArrivals : products.slice(0, 8);

  const scrollTrack = (dir: -1 | 1) => {
    if (!trackRef.current) return;
    const step = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#F7F7F7] border-y border-neutral-200 py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] mb-1">
              FRESH FROM THE LOOM
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0A0A0A]">
              What&apos;s New
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTrack(-1)}
              aria-label="Previous new arrivals"
              className="w-9 h-9 bg-white border border-neutral-300 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white text-[#0A0A0A] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(1)}
              aria-label="Next new arrivals"
              className="w-9 h-9 bg-white border border-neutral-300 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white text-[#0A0A0A] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal 4-up product row */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {displayList.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] sm:min-w-[280px] lg:min-w-[calc(25%-18px)] max-w-[330px] shrink-0"
            >
              <ProductCard
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
                onSelect={onSelectProduct}
              />
            </div>
          ))}
        </div>

        {/* Centered Obsidian View More Button modeled on Aarong */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onViewMore}
            className="bg-[#0A0A0A] hover:bg-[#DC2626] text-white px-10 py-3.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors"
          >
            VIEW MORE
          </button>
        </div>
      </div>
    </section>
  );
};
