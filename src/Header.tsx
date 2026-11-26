import React from 'react';
import { Heart, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Era } from './types';
import { formatNzd } from './products';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  cartPulse: number;
  watchlistCount: number;
  showWatchlistOnly: boolean;
  onToggleWatchlistFilter: () => void;
  onOpenCart: () => void;
  onSelectEra: (era: Era | 'All') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  cartPulse,
  watchlistCount,
  showWatchlistOnly,
  onToggleWatchlistFilter,
  onOpenCart,
  onSelectEra,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#ECEAE4] bg-[#FAFAF8]/92 backdrop-blur-md">
      {/* Top NZ Announcement Bar */}
      <div className="bg-[#111318] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-[#F3EFE6] sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-[#E5B85B]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Aotearoa&apos;s Building Block Store
          </span>
          <span className="hidden text-[#5B5F6B] sm:inline">•</span>
          <span>Free NZ Shipping Over NZ$100</span>
          <span className="hidden text-[#5B5F6B] md:inline">•</span>
          <span className="hidden md:inline">All Prices in NZD Incl. 15% GST</span>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111318] shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
              <circle cx="32" cy="32" r="20" fill="none" stroke="#C9922B" strokeWidth="3.5" />
              <path d="M12 32h13a7 7 0 0 0 14 0h13" fill="none" stroke="#C9922B" strokeWidth="3.5" />
              <circle cx="32" cy="32" r="5" fill="#C9922B" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-semibold tracking-tight text-[#111318] sm:text-xl">
                KantoVault
              </span>
              <span className="rounded bg-[#C9922B]/15 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#9B6D16]">
                NZ
              </span>
            </div>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[#6B7280] sm:block">
              Auckland Brick Studio
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#4B5563] md:flex">
          <button
            type="button"
            onClick={() => {
              onSelectEra('All');
              scrollToSection('vault-catalog');
            }}
            className="transition-colors hover:text-[#111318]"
          >
            Shop All
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectEra('City & Vehicles');
              scrollToSection('vault-catalog');
            }}
            className="transition-colors hover:text-[#111318]"
          >
            City &amp; Vehicles
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectEra('Architecture & Landmarks');
              scrollToSection('vault-catalog');
            }}
            className="transition-colors hover:text-[#111318]"
          >
            Architecture
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('authentication')}
            className="transition-colors hover:text-[#111318]"
          >
            Why KantoVault
          </button>
        </nav>

        {/* Actions: Watchlist + Cart */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              onToggleWatchlistFilter();
              scrollToSection('vault-catalog');
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
              showWatchlistOnly
                ? 'border-[#DC2626] bg-[#DC2626]/10 text-[#B91C1C]'
                : 'border-[#E5E2DA] bg-white text-[#374151] hover:border-[#C9922B]/60 hover:text-[#111318]'
            }`}
            title="Filter saved watchlist items"
          >
            <Heart className={`h-3.5 w-3.5 ${showWatchlistOnly ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
            <span className="hidden sm:inline">Watchlist</span>
            <span className="font-mono text-[11px]">{watchlistCount}</span>
          </button>

          <button
            id="vault-bag-button"
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#111318] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1F232C] active:scale-[0.98]"
          >
            <span
              key={`w-${cartPulse}`}
              className={cartPulse > 0 ? 'inline-flex animate-cart-wiggle' : 'inline-flex'}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#E5B85B]" />
            </span>
            <span>Vault Bag</span>
            <span
              key={cartPulse}
              className={`rounded-full bg-[#C9922B] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#111318] ${
                cartPulse > 0 ? 'animate-badge-pop' : ''
              }`}
            >
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="hidden font-mono text-[11px] text-[#E5B85B] sm:inline">
                {formatNzd(cartTotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
