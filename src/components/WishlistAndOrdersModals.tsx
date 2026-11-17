import React from 'react';
import { Heart, MapPin, Package, PhoneCall, Plus, Sparkles, X } from 'lucide-react';
import type { Order, Product } from '../types';
import { SmartImage } from './SmartImage';

interface WishlistModalProps {
  open: boolean;
  products: Product[];
  wishlistIds: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onQuickAdd: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  open,
  products,
  wishlistIds,
  onClose,
  onRemove,
  onQuickAdd,
}) => {
  if (!open) return null;
  const saved = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/65" onClick={onClose} />
      <aside className="relative z-10 w-full max-w-md bg-white h-full flex flex-col border-l border-neutral-200">
        <div className="h-16 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#DC2626] fill-current" />
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]">
              Saved Wishlist ({saved.length})
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-neutral-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {saved.length === 0 ? (
            <div className="py-20 text-center">
              <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="font-serif text-xl text-[#0A0A0A] mb-1">No saved pieces yet</p>
              <p className="text-xs text-neutral-500">
                Tap the heart icon on any Naiem Arong creation to curate your list.
              </p>
            </div>
          ) : (
            saved.map((p) => (
              <div
                key={p.id}
                className="flex gap-3.5 border border-neutral-200 p-3 bg-white"
              >
                <div className="w-20 h-20 bg-neutral-100 shrink-0">
                  <SmartImage
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    fallbackLabel={p.name}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {p.category}
                    </p>
                    <h3 className="text-sm font-semibold text-[#0A0A0A] truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm font-mono font-bold text-[#DC2626] mt-0.5 tabular-nums">
                      ৳{p.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      disabled={p.stock <= 0}
                      onClick={() => onQuickAdd(p)}
                      className="flex-1 h-8 bg-[#0A0A0A] hover:bg-[#DC2626] disabled:bg-neutral-300 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      className="h-8 px-2.5 border border-neutral-300 hover:border-[#DC2626] text-xs font-semibold text-neutral-600 hover:text-[#DC2626]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

interface RecentOrdersModalProps {
  open: boolean;
  orders: Order[];
  onClose: () => void;
}

export const RecentOrdersModal: React.FC<RecentOrdersModalProps> = ({
  open,
  orders,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white border border-neutral-200 max-h-[85vh] flex flex-col">
        <div className="h-14 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
            <Package className="w-4 h-4 text-[#DC2626]" />
            <span>Your Orders &amp; Tracking</span>
          </div>
          <button type="button" onClick={onClose} className="text-neutral-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-xl text-[#0A0A0A] mb-1">
                No recent orders placed in this session
              </p>
              <p className="text-xs text-neutral-500">
                Complete checkout from your shopping bag to track live fulfillment status.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-neutral-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#0A0A0A]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-500 ml-2">
                      · {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#0A0A0A] text-white">
                    {order.status}
                  </span>
                </div>
                <div className="py-2.5 space-y-1">
                  {order.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedSize}`}
                      className="flex justify-between text-xs text-neutral-700"
                    >
                      <span>
                        {item.name} ({item.selectedSize}) × {item.quantity}
                      </span>
                      <span className="font-mono tabular-nums">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-neutral-100 flex justify-between text-xs font-bold">
                  <span>{order.paymentMethod}</span>
                  <span className="font-mono tabular-nums text-[#DC2626]">
                    Total: ৳{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface InfoModalProps {
  topic: 'stores' | 'customer-service' | 'about' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white border border-neutral-200">
        <div className="h-14 px-6 bg-[#0A0A0A] text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.18em]">
            {topic === 'stores'
              ? 'Naiem Arong Flagship Studios'
              : topic === 'customer-service'
                ? 'Customer Service & Care'
                : 'Who We Are · Naiem Arong'}
          </span>
          <button type="button" onClick={onClose} className="text-neutral-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-neutral-700 leading-relaxed">
          {topic === 'stores' && (
            <>
              <div className="flex items-start gap-3 border-b border-neutral-200 pb-3">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#0A0A0A]">Dhaka Flagship — Gulshan Avenue</h4>
                  <p className="text-xs text-neutral-600">
                    Plot 42, Gulshan North Avenue, Dhaka 1212 · Open Daily 10:00 AM – 9:30 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b border-neutral-200 pb-3">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#0A0A0A]">Dhanmondi Heritage House</h4>
                  <p className="text-xs text-neutral-600">
                    Road 27 (Old), Dhanmondi, Dhaka 1209 · Open Daily 10:00 AM – 9:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#0A0A0A]">Chattogram Studio</h4>
                  <p className="text-xs text-neutral-600">
                    221 Nasirabad C/A, Chattogram 4000 · Open Daily 10:30 AM – 9:00 PM
                  </p>
                </div>
              </div>
            </>
          )}

          {topic === 'customer-service' && (
            <>
              <div className="flex items-start gap-3">
                <PhoneCall className="w-4 h-4 text-[#DC2626] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#0A0A0A]">Concierge &amp; Order Support</h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Hotline: +880 9612-884400 (10:00 AM – 8:00 PM BST) · Email:
                    care@naiemarong.com
                  </p>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                <p>
                  <strong className="text-[#0A0A0A]">Express Delivery:</strong> 24–48 hours inside
                  Dhaka, 3–5 business days nationwide. Free delivery on orders above ৳5,000.
                </p>
                <p>
                  <strong className="text-[#0A0A0A]">Easy Exchanges:</strong> 14-day unworn exchange
                  at any Naiem Arong studio with original tag and digital invoice.
                </p>
              </div>
            </>
          )}

          {topic === 'about' && (
            <>
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#DC2626] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-xl font-semibold text-[#0A0A0A]">
                    Contemporary Craftsmanship by Naiem Arong
                  </h4>
                  <p className="mt-2">
                    Naiem Arong partners directly with rural weavers, Jamdani masters in Narayanganj,
                    Nakshi Kantha embroiderers in Rajshahi, and heritage silversmiths across
                    Bangladesh to bring timeless handcraft into a sharp, contemporary Digital Red,
                    White, and Obsidian aesthetic.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
