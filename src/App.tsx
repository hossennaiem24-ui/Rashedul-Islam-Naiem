import { useCallback, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { CategoryGrid } from './components/CategoryGrid';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductModal } from './components/ProductModal';
import { PromoSplitBanners } from './components/PromoSplitBanners';
import { WhatsNewCarousel } from './components/WhatsNewCarousel';
import {
  InfoModal,
  RecentOrdersModal,
  WishlistModal,
} from './components/WishlistAndOrdersModals';
import type { CartItem, Order, Product, StorefrontPayload } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');
  const [storefront, setStorefront] = useState<StorefrontPayload>({
    products: [],
    categories: [],
    heroBanners: [],
    promoBanners: [],
  });
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Interactive State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem('na_cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem('na_wishlist');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    try {
      const saved = window.localStorage.getItem('na_recent_orders');
      return saved ? (JSON.parse(saved) as Order[]) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [infoTopic, setInfoTopic] = useState<'stores' | 'customer-service' | 'about' | null>(
    null,
  );
  const [toastMsg, setToastMsg] = useState('');

  const fetchStorefront = useCallback(async () => {
    try {
      const res = await fetch('/api/storefront');
      if (res.ok) {
        const data = (await res.json()) as StorefrontPayload;
        setStorefront(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  useEffect(() => {
    try {
      window.localStorage.setItem('na_cart', JSON.stringify(cart));
    } catch {
      // ignore storage failure
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem('na_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore storage failure
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem('na_recent_orders', JSON.stringify(recentOrders));
    } catch {
      // ignore storage failure
    }
  }, [recentOrders]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(''), 2400);
  };

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && activeCategory === 'home') {
      setActiveCategory('all');
    }
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleAddToBag = (product: Product, size?: string, quantity = 1) => {
    if (product.stock <= 0) return;
    const chosenSize = size || product.sizes[0] || 'Free Size';
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize,
      );
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: Math.min(product.stock, copy[idx].quantity + quantity),
        };
        return copy;
      }
      return [...prev, { product, selectedSize: chosenSize, quantity }];
    });
    showToast(`Added "${product.name}" to your bag`);
  };

  const handleUpdateCartQty = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: Math.min(item.product.stock || 99, nextQty),
            };
          }
          return item;
        })
        .filter((x): x is CartItem => x !== null),
    );
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)),
    );
  };

  const handleOrderCreated = (order: Order) => {
    setCart([]);
    setRecentOrders((prev) => [order, ...prev]);
    fetchStorefront();
  };

  if (viewMode === 'admin') {
    return (
      <AdminPanel
        onBackToStorefront={() => {
          fetchStorefront();
          setViewMode('storefront');
        }}
        onStorefrontDataChanged={fetchStorefront}
      />
    );
  }

  const showCatalog = activeCategory !== 'home' || searchQuery.trim().length > 0;
  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A]">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cartCount={totalBagCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setOrdersOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
        onOpenInfoModal={(topic) => setInfoTopic(topic)}
      />

      <main className="flex-1">
        {loading ? (
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 space-y-8">
            <div className="h-[460px] bg-neutral-100 animate-pulse border border-neutral-200" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-neutral-100 animate-pulse border border-neutral-200"
                />
              ))}
            </div>
          </div>
        ) : showCatalog ? (
          <CatalogSection
            products={storefront.products}
            categories={storefront.categories}
            activeCategory={activeCategory === 'home' ? 'all' : activeCategory}
            searchQuery={searchQuery}
            wishlistIds={wishlistIds}
            onSelectCategory={handleSelectCategory}
            onClearFilters={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={(p) => handleAddToBag(p)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onBackHome={() => {
              setSearchQuery('');
              setActiveCategory('home');
            }}
          />
        ) : (
          <>
            <HeroCarousel
              banners={storefront.heroBanners}
              onExplore={(slug) => handleSelectCategory(slug || 'all')}
            />
            <CategoryGrid
              categories={storefront.categories}
              onSelectCategory={handleSelectCategory}
            />
            <WhatsNewCarousel
              products={storefront.products}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={(p) => handleAddToBag(p)}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onViewMore={() => handleSelectCategory('all')}
            />
            <PromoSplitBanners
              banners={storefront.promoBanners}
              onExplore={(slug) => handleSelectCategory(slug)}
            />
          </>
        )}
      </main>

      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenInfoModal={(topic) => setInfoTopic(topic)}
        onOpenAdmin={() => setViewMode('admin')}
      />

      {/* Quick Toast Confirmation */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A0A0A] text-white border border-[#DC2626] px-4 py-3 text-xs font-semibold flex items-center gap-2.5 shadow-lg">
          <Check className="w-4 h-4 text-[#DC2626] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        items={cart}
        onClose={() => setCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      <WishlistModal
        open={wishlistOpen}
        products={storefront.products}
        wishlistIds={wishlistIds}
        onClose={() => setWishlistOpen(false)}
        onRemove={handleToggleWishlist}
        onQuickAdd={(p) => {
          handleAddToBag(p);
          setWishlistOpen(false);
          setCartOpen(true);
        }}
      />

      <RecentOrdersModal
        open={ordersOpen}
        orders={recentOrders}
        onClose={() => setOrdersOpen(false)}
      />

      <InfoModal topic={infoTopic} onClose={() => setInfoTopic(null)} />
    </div>
  );
}
