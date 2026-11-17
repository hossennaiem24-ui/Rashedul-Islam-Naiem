import React, { useState } from 'react';
import { Check, Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import type { Product } from '../types';
import { SmartImage } from './SmartImage';

interface ProductModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (id: string) => void;
  onAddToBag: (product: Product, size: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToBag,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes?.[0] || 'Free Size',
  );
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (!product) return null;

  const activeSize = product.sizes.includes(selectedSize)
    ? selectedSize
    : product.sizes[0] || 'One Size';
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    onAddToBag(product, activeSize, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl bg-white border border-neutral-200 max-h-[92vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product preview"
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-white border border-neutral-300 hover:bg-[#0A0A0A] hover:text-white text-[#0A0A0A] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image Column */}
        <div className="bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200 flex items-center justify-center min-h-[300px] md:min-h-[460px]">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            fallbackLabel={product.name}
          />
        </div>

        {/* Right Contiguous Purchase Module */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-1.5">
              {product.subBrand} · {product.category} · {product.sku}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#0A0A0A] leading-tight mb-3">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 font-mono tabular-nums mb-5 pb-4 border-b border-neutral-200">
              <span className="text-2xl font-bold text-[#0A0A0A]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="ml-auto text-xs font-semibold text-neutral-600">
                {outOfStock ? 'Out of Stock' : `${product.stock} units ready`}
              </span>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed mb-5">
              {product.description}
            </p>

            <div className="text-xs text-neutral-600 mb-6">
              <span className="font-bold uppercase tracking-wider text-[#0A0A0A]">
                Craft &amp; Material:{' '}
              </span>
              <span>{product.fabricOrMaterial}</span>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A0A0A] mb-2">
                Select Size / Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      activeSize === size
                        ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                        : 'bg-white border-neutral-300 text-[#0A0A0A] hover:border-[#0A0A0A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0A0A0A]">
                Quantity
              </span>
              <div className="inline-flex items-center border border-neutral-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-mono font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(Math.max(1, product.stock), q + 1))
                  }
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              disabled={outOfStock}
              onClick={handleAdd}
              className={`flex-1 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                outOfStock
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : addedFeedback
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{outOfStock ? 'SOLD OUT' : 'ADD TO BAG'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Toggle wishlist"
              className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                isWishlisted
                  ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                  : 'border-neutral-300 text-[#0A0A0A] hover:border-[#0A0A0A]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
