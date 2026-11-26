import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { Product } from './types';
import { formatNzd } from './products';

interface ProductModalProps {
  product: Product | null;
  isWatched: boolean;
  onClose: () => void;
  onToggleWatchlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number, sourceEl: HTMLElement | null) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isWatched,
  onClose,
  onToggleWatchlist,
  onAddToCart,
}) => {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-[#111318]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E5E0D5] bg-[#FAFAF8] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute right-4 top-4 z-10 rounded-full border border-[#E5E0D5] bg-white p-2 text-[#4B5563] transition-colors hover:text-[#111318]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Studio Gallery */}
          <div className="lg:col-span-5">
            <div
              key={product.id}
              ref={imgWrapRef}
              className="shine-once flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#ECEAE4] bg-[#F4F1EA]"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== product.fallbackImageUrl) {
                    img.src = product.fallbackImageUrl;
                  }
                }}
                className="animate-float h-full w-full object-cover"
              />
            </div>

            {/* Sealed Box Ribbon */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E5DEC9] bg-[#F7F3E7] px-3.5 py-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#7A5410]">
                <ShieldCheck className="h-4 w-4 text-[#C9922B]" />
                Brand New • Sealed Box
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#4B5563]">
                {product.sku}
              </span>
            </div>
          </div>

          {/* Right Inspection Details */}
          <div className="flex flex-col lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#111318] px-3 py-1 text-[11px] font-semibold text-[#E5B85B]">
                {product.era}
              </span>
              <span className="rounded-full bg-[#C9922B]/15 px-3 py-1 text-[11px] font-bold text-[#8F6311]">
                {product.badge}
              </span>
              <span className="rounded-full border border-[#DC2626]/25 bg-[#DC2626]/8 px-3 py-1 text-[11px] font-semibold text-[#B91C1C]">
                Only {product.stock} left in stock
              </span>
            </div>

            <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-[#111318] sm:text-3xl">
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-[#111318]">
                {formatNzd(product.priceNzd)}
              </span>
              <span className="text-xs font-medium text-[#6B7280]">
                NZD • 15% GST Included
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">{product.description}</p>

            {/* Metadata Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-[#ECEAE4] bg-white p-4 text-xs sm:grid-cols-4">
              <div>
                <div className="text-[#6B7280]">Series</div>
                <div className="mt-0.5 font-semibold text-[#111318]">{product.setName}</div>
              </div>
              <div>
                <div className="text-[#6B7280]">Pieces</div>
                <div className="mt-0.5 font-mono font-semibold text-[#111318]">
                  {product.pieces.toLocaleString('en-NZ')}
                </div>
              </div>
              <div>
                <div className="text-[#6B7280]">Ages</div>
                <div className="mt-0.5 font-mono font-semibold text-[#111318]">{product.age}</div>
              </div>
              <div>
                <div className="text-[#6B7280]">Type</div>
                <div className="mt-0.5 font-semibold text-[#111318]">{product.category}</div>
              </div>
            </div>

            {/* What's Inside */}
            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111318]">
                <PackageCheck className="h-4 w-4 text-[#C9922B]" />
                What&apos;s Inside
              </div>
              <ul className="mt-2.5 space-y-1.5">
                {product.contents.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-xs text-[#374151]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NZ Dispatch Notice */}
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#E5E0D5] bg-white px-3.5 py-2.5 text-xs text-[#374151]">
              <Truck className="h-4 w-4 shrink-0 text-[#C9922B]" />
              <span>
                Ships from our <strong>Auckland studio</strong> via tracked NZ courier (Free over
                NZ$100, otherwise NZ$10).
              </span>
            </div>

            {/* Quantity + Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[#DCD7CB] bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full p-1.5 text-[#4B5563] hover:bg-[#F3F1EC] hover:text-[#111318]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center font-mono text-sm font-semibold text-[#111318]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="rounded-full p-1.5 text-[#4B5563] hover:bg-[#F3F1EC] hover:text-[#111318]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, quantity, imgWrapRef.current);
                  onClose();
                }}
                className="flex-1 rounded-full bg-[#111318] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C9922B] hover:text-[#111318]"
              >
                Add to Vault Bag • {formatNzd(product.priceNzd * quantity)}
              </button>

              <button
                type="button"
                onClick={() => onToggleWatchlist(product.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-3 text-xs font-semibold transition-all ${
                  isWatched
                    ? 'border-[#DC2626] bg-[#DC2626]/10 text-[#B91C1C]'
                    : 'border-[#DCD7CB] bg-white text-[#374151] hover:border-[#C9922B]'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWatched ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
                <span>{isWatched ? 'Saved' : 'Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
