import React, { useMemo, useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import type { CategoryItem, Product } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  categories: CategoryItem[];
  activeCategory: string;
  searchQuery: string;
  wishlistIds: string[];
  onSelectCategory: (slug: string) => void;
  onClearFilters: () => void;
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onBackHome: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  categories,
  activeCategory,
  searchQuery,
  wishlistIds,
  onSelectCategory,
  onClearFilters,
  onToggleWishlist,
  onQuickAdd,
  onSelectProduct,
  onBackHome,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>(
    'featured',
  );
  const [subBrandFilter, setSubBrandFilter] = useState<string>('ALL');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => {
        if (activeCategory === 'online-sale') {
          if (!p.onSale) return false;
        } else if (activeCategory !== 'all' && activeCategory !== 'home') {
          if (p.categorySlug !== activeCategory) return false;
        }

        if (subBrandFilter !== 'ALL' && p.subBrand !== subBrandFilter) {
          return false;
        }
        if (onlyInStock && p.stock <= 0) {
          return false;
        }
        if (q) {
          const hay =
            `${p.name} ${p.category} ${p.subBrand} ${p.sku} ${p.fabricOrMaterial}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [products, activeCategory, searchQuery, subBrandFilter, onlyInStock, sortBy]);

  const activeTitle = useMemo(() => {
    if (searchQuery.trim()) return `Search Results for "${searchQuery.trim()}"`;
    if (activeCategory === 'online-sale') return 'Online Only Sale';
    if (activeCategory === 'winter-26') return 'Winter 26 Collection';
    if (activeCategory === 'all' || activeCategory === 'home') return 'Complete Collection';
    const cat = categories.find((c) => c.slug === activeCategory);
    return cat ? cat.name : 'Collection';
  }, [activeCategory, categories, searchQuery]);

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-14 min-h-[60vh]">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 hover:text-[#DC2626] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#0A0A0A]">
            {activeTitle}
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1.5 tabular-nums">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 text-xs text-neutral-500 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#DC2626]" />
            <span className="font-semibold uppercase tracking-wider">Filter:</span>
          </div>

          <select
            value={activeCategory === 'home' ? 'all' : activeCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            aria-label="Filter by category"
            className="h-9 px-3 bg-white border border-neutral-300 text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value="winter-26">Winter 26</option>
            <option value="online-sale">Online Only Sale</option>
          </select>

          <select
            value={subBrandFilter}
            onChange={(e) => setSubBrandFilter(e.target.value)}
            aria-label="Filter by line"
            className="h-9 px-3 bg-white border border-neutral-300 text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
          >
            <option value="ALL">All Lines</option>
            <option value="Naiem Arong">Naiem Arong</option>
            <option value="NA Heritage">NA Heritage</option>
            <option value="NA Studio">NA Studio</option>
            <option value="NA Noir">NA Noir</option>
          </select>

          <label className="inline-flex items-center gap-2 h-9 px-3 border border-neutral-300 bg-white text-xs font-semibold text-[#0A0A0A] select-none cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="accent-[#DC2626]"
            />
            <span>In Stock</span>
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort products"
            className="h-9 px-3 bg-[#0A0A0A] text-white text-xs font-semibold focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="border border-neutral-200 bg-neutral-50 py-16 px-6 text-center">
          <p className="font-serif text-2xl text-[#0A0A0A] mb-2">
            No matching pieces found
          </p>
          <p className="text-sm text-neutral-600 mb-6">
            Try clearing your active search query or switching to another department.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubBrandFilter('ALL');
              setOnlyInStock(false);
              onClearFilters();
            }}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
};
