import React, { useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { NaiemArongLogo } from './NaiemArongLogo';
import { SmartImage } from './SmartImage';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenInfoModal: (topic: 'stores' | 'customer-service' | 'about') => void;
  onOpenAdmin: () => void;
}

const FOOTER_TILES = [
  {
    title: 'WHO WE ARE',
    subtitle: 'Artisan Heritage · Ethical Craft · Our Story',
    image: '/src/assets/images/hero_heritage_crimson_1794898669437.jpg',
    action: 'about' as const,
  },
  {
    title: 'Categories',
    subtitle: 'Women · Men · Kids · Home Décor · Jewellery',
    image: '/src/assets/images/cat_women_saree_1794898669744.jpg',
    action: 'all' as const,
  },
  {
    title: 'Customer Service',
    subtitle: 'Shipping · Exchanges · Store Locator · Help',
    image: '/src/assets/images/cat_gifts_skincare_1794898672578.jpg',
    action: 'customer-service' as const,
  },
  {
    title: 'MORE',
    subtitle: 'Winter 26 · Online Only Sale · Bridal Vault',
    image: '/src/assets/images/hero_winter_editorial_1794898669998.jpg',
    action: 'winter-26' as const,
  },
];

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenInfoModal,
  onOpenAdmin,
}) => {
  const [region, setRegion] = useState<'Bangladesh' | 'Outside Bangladesh'>('Bangladesh');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribedMsg, setSubscribedMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          region,
        }),
      });
      if (res.ok) {
        setSubscribedMsg('Thank you for subscribing to Naiem Arong updates.');
        setEmail('');
        setPhone('');
        window.setTimeout(() => setSubscribedMsg(''), 4000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTileClick = (action: (typeof FOOTER_TILES)[number]['action']) => {
    if (action === 'about' || action === 'customer-service') {
      onOpenInfoModal(action);
    } else {
      onSelectCategory(action);
    }
  };

  return (
    <footer className="mt-auto">
      {/* STAY TUNED Newsletter & SMS Strip modeled directly on Aarong */}
      <div className="bg-[#0A0A0A] text-white border-t border-neutral-800 py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#DC2626] mb-1.5">
              DAILY DISPATCH
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2">
              STAY TUNED
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Don&apos;t miss the opportunity to get daily updates on all that&apos;s new at
              Naiem Arong
            </p>

            {/* Region Selector */}
            <div className="inline-flex border border-neutral-700 mb-6">
              <button
                type="button"
                onClick={() => setRegion('Bangladesh')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  region === 'Bangladesh'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-transparent text-neutral-300 hover:text-white'
                }`}
              >
                I live in Bangladesh
              </button>
              <button
                type="button"
                onClick={() => setRegion('Outside Bangladesh')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  region === 'Outside Bangladesh'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-transparent text-neutral-300 hover:text-white'
                }`}
              >
                I live outside Bangladesh
              </button>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-2xl mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="sm:col-span-5 h-11 px-4 bg-neutral-900 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DC2626]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={
                  region === 'Bangladesh' ? '+880 1XXX-XXXXXX (Optional)' : 'Mobile number (Optional)'
                }
                className="sm:col-span-4 h-11 px-4 bg-neutral-900 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DC2626]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="sm:col-span-3 h-11 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors"
              >
                {submitting ? 'SAVING...' : 'SUBSCRIBE'}
              </button>
            </form>

            {subscribedMsg && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white bg-neutral-900 border border-[#DC2626] px-4 py-2">
                <Check className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>{subscribedMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Column Visual Overlay Tiles modeled on Aarong Footer */}
      <div className="bg-white border-t border-neutral-200 py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOOTER_TILES.map((tile) => (
            <button
              key={tile.title}
              type="button"
              onClick={() => handleTileClick(tile.action)}
              className="group relative h-44 bg-[#0A0A0A] overflow-hidden text-left border border-neutral-200"
            >
              <SmartImage
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover opacity-65 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
                fallbackLabel={tile.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-end">
                  <span className="w-7 h-7 border border-white/40 group-hover:bg-[#DC2626] group-hover:border-[#DC2626] flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold tracking-wide">
                    {tile.title}
                  </h3>
                  <p className="text-[11px] text-neutral-300 mt-1">{tile.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Legal & Brand Bar */}
      <div className="bg-[#0A0A0A] text-white border-t border-neutral-800 py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <NaiemArongLogo variant="light" />

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <button
              type="button"
              onClick={() => onOpenInfoModal('about')}
              className="hover:text-white transition-colors"
            >
              About Naiem Arong
            </button>
            <button
              type="button"
              onClick={() => onOpenInfoModal('stores')}
              className="hover:text-white transition-colors"
            >
              Store Locator
            </button>
            <button
              type="button"
              onClick={() => onOpenInfoModal('customer-service')}
              className="hover:text-white transition-colors"
            >
              Customer Care
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('online-sale')}
              className="text-[#DC2626] hover:text-[#EF233C] transition-colors"
            >
              Online Sale
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-white hover:text-[#DC2626] transition-colors"
            >
              Admin Console
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center md:text-right">
            Copyright © 2026 Naiem Arong. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
