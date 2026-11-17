import React from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartItem } from '../types';
import { SmartImage } from './SmartImage';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}) => {
  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 120;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside className="relative z-10 w-full max-w-md bg-white h-full flex flex-col border-l border-neutral-200">
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#DC2626]" />
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">
              Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="p-1.5 text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery bar */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 text-xs">
          {subtotal === 0 ? (
            <span className="text-neutral-600">
              Complimentary delivery across Bangladesh on orders over{' '}
              <strong className="font-mono">৳5,000</strong>.
            </span>
          ) : remainingForFree > 0 ? (
            <span className="text-neutral-700">
              Add <strong className="font-mono text-[#DC2626]">৳{remainingForFree.toLocaleString()}</strong>{' '}
              more for complimentary delivery.
            </span>
          ) : (
            <span className="font-semibold text-[#0A0A0A]">
              Complimentary Bangladesh delivery unlocked.
            </span>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-200 px-6">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="font-serif text-xl text-[#0A0A0A] mb-1">
                Your shopping bag is empty
              </p>
              <p className="text-xs text-neutral-500">
                Explore Naiem Arong&apos;s Jamdani sarees, Panjabis, jewellery, and home craft.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="py-4 flex gap-4"
              >
                <div className="w-20 h-20 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                  <SmartImage
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    fallbackLabel={item.product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#0A0A0A] leading-snug line-clamp-2">
                      {item.product.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      aria-label="Remove item"
                      className="text-neutral-400 hover:text-[#DC2626] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Size: {item.selectedSize} · {item.product.sku}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-neutral-300">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, item.selectedSize, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, item.selectedSize, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-mono font-bold text-[#0A0A0A] tabular-nums">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono font-semibold tabular-nums text-[#0A0A0A]">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Delivery</span>
              <span className="font-mono font-semibold tabular-nums text-[#0A0A0A]">
                {shippingFee === 0 ? 'Complimentary' : `৳${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#0A0A0A] pt-2 border-t border-neutral-200">
              <span>Total</span>
              <span className="font-mono tabular-nums">
                ৳{(subtotal + shippingFee).toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              className="w-full h-12 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
