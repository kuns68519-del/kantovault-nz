import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Era, Product } from './types';
import { formatNzd } from './products';

interface HeroProps {
  featuredProducts: Product[];
  onInspectProduct: (product: Product) => void;
  onExploreAll: () => void;
  onFilterEra: (era: Era) => void;
}

export const Hero: React.FC<HeroProps> = ({
  featuredProducts,
  onInspectProduct,
  onExploreAll,
  onFilterEra,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = featuredProducts[activeIndex] ?? featuredProducts[0];

  return (
    <section id="top" className="relative overflow-hidden border-b border-[#ECEAE4] bg-[#FAFAF8]">
      {/* Subtle archival radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[520px] rounded-full bg-gradient-to-br from-[#C9922B]/12 via-[#E5B85B]/6 to-transparent blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
        {/* Left Editorial Column */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E0D5] bg-white px-3.5 py-1.5 text-xs font-medium text-[#4B5563] shadow-2xs">
            <MapPin className="h-3.5 w-3.5 text-[#C9922B]" />
            <span>Auckland Vault • Direct NZ Dispatch • No Import Duties</span>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[#111318] sm:text-5xl lg:text-[54px]">
            Factory-Sealed Vintage Pokémon Boxes.{' '}
            <span className="italic text-[#9B6D16]">Curated for NZ Collectors.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4B5563] sm:text-lg">
            40 hand-authenticated Wizards of the Coast, EX-era, XY, and Special Edition sealed
            boxes &amp; collector grails—every single piece verified in New Zealand and capped at{' '}
            <span className="font-mono font-semibold text-[#111318]">NZ$1,600</span> or less.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onExploreAll}
              className="inline-flex items-center gap-2 rounded-full bg-[#111318] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1F242D] active:scale-[0.99]"
            >
              <span>Explore 40-Item Vault</span>
              <ArrowRight className="h-4 w-4 text-[#E5B85B]" />
            </button>

            <button
              type="button"
              onClick={() => onFilterEra('WOTC 1999–2001')}
              className="inline-flex items-center gap-2 rounded-full border border-[#D8D3C8] bg-white px-6 py-3.5 text-sm font-semibold text-[#111318] transition-all hover:border-[#C9922B] hover:bg-[#FCFBF8]"
            >
              <Sparkles className="h-4 w-4 text-[#C9922B]" />
              <span>Shop WOTC 1999–2001</span>
            </button>
          </div>

          {/* 3 Concise Vault Metrics */}
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#E9E5DC] pt-6">
            <div>
              <div className="font-mono text-2xl font-bold text-[#111318]">40</div>
              <div className="mt-0.5 text-xs font-medium text-[#6B7280]">Real Sealed Items</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#9B6D16]">≤ NZ$1,600</div>
              <div className="mt-0.5 text-xs font-medium text-[#6B7280]">Collector Price Cap</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#111318]">1–2 Day</div>
              <div className="mt-0.5 text-xs font-medium text-[#6B7280]">Insured NZ Courier</div>
            </div>
          </div>
        </div>

        {/* Right Interactive Featured Vault Showcase */}
        <div className="lg:col-span-5">
          {activeProduct && (
            <div className="relative rounded-3xl border border-[#E6E2D8] bg-white p-5 shadow-[0_20px_50px_-24px_rgba(17,19,24,0.16)] sm:p-6">
              {/* Top Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111318] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#E5B85B]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  VAULT SPOTLIGHT
                </span>
                <span className="font-mono text-xs font-medium text-[#6B7280]">
                  {activeProduct.sku} • {activeProduct.year}
                </span>
              </div>

              {/* Studio Image */}
              <button
                type="button"
                onClick={() => onInspectProduct(activeProduct)}
                className="group relative mt-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#F0EDE6] bg-[#F4F1EA]"
              >
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== activeProduct.fallbackImageUrl) {
                      img.src = activeProduct.fallbackImageUrl;
                    }
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-[#E5E0D5] bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#111318] shadow-xs backdrop-blur-xs">
                  <CheckCircle2 className="h-3 w-3 text-[#16A34A]" />
                  Factory Seal Verified
                </span>
              </button>

              {/* Product Details */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#9B6D16]">
                  <span>{activeProduct.setName}</span>
                  <span>{activeProduct.category}</span>
                </div>
                <h2 className="mt-1 line-clamp-1 font-serif text-xl font-semibold text-[#111318]">
                  {activeProduct.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6B7280]">
                  {activeProduct.shortSpec}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#F0EDE6] pt-4">
                  <div>
                    <div className="font-mono text-2xl font-bold text-[#111318]">
                      {formatNzd(activeProduct.priceNzd)}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">NZD • GST Included</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectProduct(activeProduct)}
                    className="rounded-full bg-[#C9922B] px-4 py-2 text-xs font-bold text-[#111318] transition-colors hover:bg-[#B88322]"
                  >
                    Quick Inspect
                  </button>
                </div>
              </div>

              {/* 3 Spotlight Switcher Tabs */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {featuredProducts.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`rounded-xl border px-2.5 py-2 text-left transition-all ${
                      idx === activeIndex
                        ? 'border-[#111318] bg-[#111318] text-white'
                        : 'border-[#ECEAE4] bg-[#FAFAF8] text-[#4B5563] hover:border-[#C9922B]/60'
                    }`}
                  >
                    <div className="truncate font-mono text-[10px] opacity-75">{item.year}</div>
                    <div className="truncate text-[11px] font-semibold">{item.setName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
