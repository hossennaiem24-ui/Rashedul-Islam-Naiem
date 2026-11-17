import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { NaiemArongLogo } from './NaiemArongLogo';

interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenInfoModal: (topic: 'stores' | 'customer-service' | 'about') => void;
}

const NAV_ITEMS = [
  { label: 'All', slug: 'all' },
  { label: 'Women', slug: 'women' },
  { label: 'Men', slug: 'men' },
  { label: "Kids'", slug: 'kids' },
  { label: 'Home Décor', slug: 'home-decor' },
  { label: 'Jewellery', slug: 'jewellery' },
  { label: 'Skin & Hair', slug: 'skin-hair' },
  { label: 'Gifts & Crafts', slug: 'gifts-crafts' },
  { label: 'Wedding', slug: 'wedding' },
  { label: 'Winter 26', slug: 'winter-26' },
  { label: 'Online Only Sale', slug: 'online-sale', highlight: true },
];

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenAdmin,
  onOpenInfoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleNavClick = (slug: string) => {
    onSelectCategory(slug);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* Slim Top Utility & Sub-Brand Bar (<= 36px height) */}
      <div className="bg-[#0A0A0A] text-white border-b border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-9 flex items-center justify-between text-[11px] font-medium tracking-[0.1em] uppercase">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleNavClick('all')}
              className="whitespace-nowrap shrink-0 text-white hover:text-[#DC2626] transition-colors"
            >
              NAIEM ARONG
            </button>
            <span className="text-neutral-700 hidden sm:inline">·</span>
            <button
              type="button"
              onClick={() => handleNavClick('winter-26')}
              className="whitespace-nowrap shrink-0 text-neutral-300 hover:text-white transition-colors hidden sm:inline"
            >
              NA STUDIO
            </button>
            <span className="text-neutral-700 hidden md:inline">·</span>
            <button
              type="button"
              onClick={() => handleNavClick('wedding')}
              className="whitespace-nowrap shrink-0 text-neutral-300 hover:text-white transition-colors hidden md:inline"
            >
              NA HERITAGE
            </button>
            <span className="text-neutral-700 hidden lg:inline">·</span>
            <button
              type="button"
              onClick={() => handleNavClick('jewellery')}
              className="whitespace-nowrap shrink-0 text-neutral-300 hover:text-white transition-colors hidden lg:inline"
            >
              NA NOIR
            </button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onOpenInfoModal('stores')}
              className="hidden md:inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <MapPin className="w-3 h-3 text-[#DC2626]" />
              FIND A STORE
            </button>
            <button
              type="button"
              onClick={() => onOpenInfoModal('customer-service')}
              className="hidden lg:inline-flex items-center text-neutral-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              CUSTOMER SERVICE
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3 h-3" />
              ADMIN PANEL
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#0A0A0A] hover:text-[#DC2626] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-left focus:outline-none"
            aria-label="Naiem Arong Home"
          >
            <NaiemArongLogo variant="dark" />
          </button>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Jamdani, Panjabi, Jewellery, Kantha..."
              className="w-full h-10 pl-10 pr-4 bg-neutral-50 border border-neutral-200 text-sm text-[#0A0A0A] placeholder:text-neutral-400 focus:outline-none focus:border-[#0A0A0A] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-700 pr-2 border-r border-neutral-200">
            <span className="w-2 h-2 bg-[#DC2626] inline-block" />
            <span>BGD · BDT ৳</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="md:hidden p-2 text-[#0A0A0A] hover:text-[#DC2626] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0A0A0A] hover:text-[#DC2626] transition-colors whitespace-nowrap shrink-0"
            aria-label="Account & Track Order"
          >
            <User className="w-4 h-4" />
            <span className="hidden lg:inline">Orders</span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2 text-[#0A0A0A] hover:text-[#DC2626] transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-[#0A0A0A] text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono tabular-nums bg-white text-[#0A0A0A] px-1.5 py-0.5 text-[10px] leading-none font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white border-t border-neutral-100">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search handcrafted products..."
              className="w-full h-10 pl-9 pr-4 bg-neutral-50 border border-neutral-300 text-sm focus:outline-none focus:border-[#0A0A0A]"
            />
          </div>
        </div>
      )}

      {/* Desktop Category Navigation Bar */}
      <nav
        className="hidden lg:block border-t border-neutral-100 bg-white"
        aria-label="Main Categories"
      >
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-center gap-6 xl:gap-8 h-11 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = activeCategory === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => handleNavClick(item.slug)}
                className={`relative h-full flex items-center text-xs font-semibold uppercase tracking-[0.09em] whitespace-nowrap shrink-0 transition-colors ${
                  item.highlight
                    ? 'text-[#DC2626] hover:text-[#B91C1C] font-bold'
                    : isActive
                      ? 'text-[#0A0A0A]'
                      : 'text-neutral-600 hover:text-[#0A0A0A]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#DC2626]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full flex flex-col z-10 border-r border-neutral-200">
            <div className="h-16 px-5 bg-[#0A0A0A] text-white flex items-center justify-between">
              <NaiemArongLogo variant="light" compact />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-300 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Collections
              </div>
              {NAV_ITEMS.map((item) => {
                const isActive = activeCategory === item.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => handleNavClick(item.slug)}
                    className={`w-full px-5 py-3 text-left text-sm font-semibold flex items-center justify-between border-b border-neutral-100 ${
                      item.highlight
                        ? 'text-[#DC2626]'
                        : isActive
                          ? 'text-[#0A0A0A] bg-neutral-50'
                          : 'text-neutral-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  </button>
                );
              })}

              <div className="mt-4 px-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 px-4 bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open Admin Panel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="w-full py-2.5 px-4 border border-[#0A0A0A] text-[#0A0A0A] text-xs font-bold uppercase tracking-wider"
                >
                  Track Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
