import React, { useState } from 'react';
import { Eye, Heart, Plus, ShieldCheck } from 'lucide-react';
import { Product } from './types';
import { formatNzd } from './products';

interface ProductCardProps {
  product: Product;
  isWatched: boolean;
  onToggleWatchlist: (id: string) => void;
  onInspect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWatched,
  onToggleWatchlist,
  onInspect,
  onAddToCart,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const isGrail =
    product.badge === 'Vault Grail' ||
    product.badge === 'Most Demanded' ||
    product.badge === '1st Edition';

  return (
    <article
      onClick={() => onInspect(product)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#ECEAE4] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9922B]/55 hover:shadow-[0_14px_34px_-18px_rgba(17,19,24,0.22)]"
    >
      {/* Top Badges Row */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-[#F4F2EC] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#374151]">
            {product.year}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${
              isGrail
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

      {/* Real Collector Photography Container */}
      <div className="relative mx-4 mt-2 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[#F5F3EE] bg-[#F4F1EA]">
        {!imgFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.currentTarget;
              if (!usingFallback) {
                setUsingFallback(true);
                img.src = product.fallbackImageUrl;
              } else {
                setImgFailed(true);
              }
            }}
            className={
              usingFallback
                ? 'h-full w-full bg-white object-contain p-5 transition-transform duration-500 group-hover:scale-105'
                : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            }
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-[#9B6D16]">
            <ShieldCheck className="h-10 w-10 opacity-70" />
            <span className="mt-2 font-mono text-xs font-semibold">{product.sku}</span>
          </div>
        )}

        {/* Quick Inspect Hover Pill */}
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-[#111318]/88 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Eye className="h-3 w-3 text-[#E5B85B]" />
          Inspect
        </span>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B6D16]">
          <span className="truncate">{product.setName}</span>
          <span className="shrink-0 text-[#6B7280]">{product.stock} left</span>
        </div>

        <h3 className="mt-1 line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-[#111318] transition-colors group-hover:text-[#8F6311]">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-1 text-xs text-[#6B7280]">{product.category}</p>

        {/* Bottom Pricing + CTA Row */}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#F3F1EC] pt-3.5">
          <div>
            <div className="font-mono text-lg font-bold tracking-tight text-[#111318]">
              {formatNzd(product.priceNzd)}
            </div>
            <div className="text-[10px] font-medium text-[#6B7280]">NZD • GST incl.</div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="inline-flex items-center gap-1 rounded-full bg-[#111318] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#C9922B] hover:text-[#111318] active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
