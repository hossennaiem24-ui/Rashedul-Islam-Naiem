import React from 'react';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../types';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickAdd: (product: Product) => void;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onSelect,
}) => {
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col bg-white border border-neutral-200 hover:border-[#0A0A0A] transition-all duration-200 hover:-translate-y-0.5">
      {/* Studio Image Surface */}
      <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="block w-full h-full text-left"
          aria-label={`View ${product.name}`}
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            fallbackLabel={product.name}
          />
        </button>

        {/* Top-left single subtle status text tag (no pill badge spam) */}
        {(outOfStock || product.onSale || product.isNew) && (
          <span
            className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
              outOfStock
                ? 'bg-neutral-900 text-neutral-300'
                : product.onSale
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-[#0A0A0A] text-white'
            }`}
          >
            {outOfStock ? 'Sold Out' : product.onSale ? 'Online Sale' : 'New'}
          </span>
        )}

        {/* Wishlist Icon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center border transition-colors ${
            isWishlisted
              ? 'bg-[#DC2626] border-[#DC2626] text-white'
              : 'bg-white/95 border-neutral-200 text-[#0A0A0A] hover:border-[#0A0A0A]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Aarong-inspired Bottom-Left '+' Quick-Add Button */}
        {!outOfStock && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            aria-label={`Quick add ${product.name} to bag`}
            title="Quick Add to Bag"
            className="absolute bottom-2.5 left-2.5 w-9 h-9 bg-[#0A0A0A] hover:bg-[#DC2626] text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-1">
            {product.subBrand} · {product.category}
          </p>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="text-left text-[15px] font-semibold text-[#0A0A0A] hover:text-[#DC2626] transition-colors leading-snug line-clamp-2"
          >
            {product.name}
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-[15px] font-bold text-[#0A0A0A]">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
            {outOfStock ? 'Out of stock' : `${product.stock} left`}
          </span>
        </div>
      </div>
    </article>
  );
};
