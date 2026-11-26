import React, { useEffect, useRef, useState } from 'react';
import { Check, Eye, Heart, Plus, ShieldCheck } from 'lucide-react';
import { Product } from './types';
import { formatNzd } from './products';

interface ProductCardProps {
  product: Product;
  index: number;
  isWatched: boolean;
  onNavigate: (path: string) => void;
  onToggleWatchlist: (id: string) => void;
  onInspect: (product: Product) => void;
  onAddToCart: (product: Product, sourceEl: HTMLElement | null) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  isWatched,
  onNavigate,
  onToggleWatchlist,
  onInspect,
  onAddToCart,
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    el.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - py) * 10).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const productHref = `/product/${product.id}`;
  const isFeaturedBadge =
    product.badge === 'Best Seller' ||
    product.badge === 'Limited Run' ||
    product.badge === 'Staff Pick';

  const handleOpenProductPage = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onNavigate(productHref);
    }
  };

  return (
    <article
      ref={cardRef}
      onClick={() => onNavigate(productHref)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${(index % 4) * 80}ms` }}
      className={`tilt-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#ECEAE4] bg-white hover:-translate-y-0.5 hover:border-[#C9922B]/55 hover:shadow-[0_24px_50px_-20px_rgba(201,146,43,0.45)] ${
        visible ? 'animate-card-in' : 'opacity-0'
      }`}
    >
      {/* Top Badges Row */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-[#F4F2EC] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#374151]">
            {product.pieces.toLocaleString('en-NZ')} pcs
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${
              isFeaturedBadge
                ? 'bg-[#DC2626]/10 text-[#B91C1C]'
                : 'bg-[#C9922B]/14 text-[#8F6311]'
            }`}
          >
            {product.badge}
          </span>
        </div>

        <button
          type="button"
          aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(product.id);
          }}
          className="rounded-full p-1.5 text-[#9CA3AF] transition-colors hover:bg-[#FAF7F0] hover:text-[#DC2626]"
        >
          <Heart className={`h-4 w-4 ${isWatched ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
        </button>
      </div>

      {/* Product Photography Container */}
      <a
        href={productHref}
        onClick={handleOpenProductPage}
        className="relative mx-4 mt-2 block aspect-square overflow-hidden rounded-xl border border-[#F5F3EE] bg-[#F4F1EA]"
      >
        <div ref={imgWrapRef} className="flex h-full w-full items-center justify-center">
          {!imgFailed ? (
            <>
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!usingFallback && product.fallbackImageUrl !== product.imageUrl) {
                    setUsingFallback(true);
                    img.src = product.fallbackImageUrl;
                  } else {
                    setImgFailed(true);
                  }
                }}
                className={
                  usingFallback
                    ? 'h-full w-full bg-white object-contain p-5 transition-transform duration-700 group-hover:scale-110'
                    : 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                }
              />
              <span
                aria-hidden="true"
                className="holo-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-[#9B6D16]">
              <ShieldCheck className="h-10 w-10 opacity-70" />
              <span className="mt-2 font-mono text-xs font-semibold">{product.sku}</span>
            </div>
          )}
        </div>

        {/* Quick Inspect Modal Trigger Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInspect(product);
          }}
          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-[#111318]/88 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity duration-200 hover:bg-[#111318] group-hover:opacity-100"
        >
          <Eye className="h-3 w-3 text-[#E5B85B]" />
          Inspect
        </button>
      </a>

      {/* Product Metadata */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B6D16]">
          <span className="truncate">{product.setName}</span>
          {product.stock === 1 ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[#B91C1C]">
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
              Last one
            </span>
          ) : (
            <span className="shrink-0 text-[#6B7280]">{product.stock} left</span>
          )}
        </div>

        <h3 className="mt-1 line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-[#111318] transition-colors group-hover:text-[#8F6311]">
          <a href={productHref} onClick={handleOpenProductPage} className="hover:underline">
            {product.name}
          </a>
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-[#6B7280]">
          {product.category} • Ages {product.age}
        </p>

        {/* Bottom Pricing + CTA Row */}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#F3F1EC] pt-3.5">
          <div>
            <div className="font-mono text-lg font-bold tracking-tight text-[#111318]">
              {formatNzd(product.priceNzd)}
            </div>
            <div className="text-[10px] font-medium text-[#6B7280]">NZD • GST incl.</div>
          </div>

          <button
            key={justAdded ? 'added' : 'add'}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, imgWrapRef.current);
              setJustAdded(true);
              window.setTimeout(() => setJustAdded(false), 1400);
            }}
            className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 ${
              justAdded
                ? 'animate-added-pop bg-[#C9922B] text-[#111318]'
                : 'bg-[#111318] text-white hover:bg-[#C9922B] hover:text-[#111318]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
