import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { CategoryItem } from '../types';
import { SmartImage } from './SmartImage';

interface CategoryGridProps {
  categories: CategoryItem[];
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="flex items-end justify-between border-b border-neutral-200 pb-4 mb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DC2626] mb-1">
            CURATED DEPARTMENTS
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0A0A0A]">
            Shop by Category
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0A] hover:text-[#DC2626] inline-flex items-center gap-1 transition-colors"
        >
          <span>Browse All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modeled on Aarong's 2/3/4 responsive department thumbnail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className="group text-left bg-white border border-neutral-200 hover:border-[#0A0A0A] transition-all duration-200 overflow-hidden"
          >
            <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
              <SmartImage
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                fallbackLabel={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="font-serif text-lg md:text-xl font-semibold tracking-tight">
                  {cat.name}
                </span>
                <span className="w-7 h-7 bg-[#DC2626] text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
            <div className="px-3.5 py-2.5 bg-white">
              <p className="text-[11px] font-medium text-neutral-600 truncate">
                {cat.tagline}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
