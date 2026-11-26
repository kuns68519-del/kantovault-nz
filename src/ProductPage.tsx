import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Era, Product } from './types';
import { PRODUCTS, formatNzd } from './products';
import { STORE_CONFIG } from './storeConfig';

interface ProductPageProps {
  product: Product;
  isWatched: boolean;
  onNavigate: (path: string) => void;
  onSelectEra: (era: Era) => void;
  onToggleWatchlist: (id: string) => void;
  onAddToCart: (product: Product, quantity: number, sourceEl: HTMLElement | null) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  isWatched,
  onNavigate,
  onSelectEra,
  onToggleWatchlist,
  onAddToCart,
  onBuyNow,
}) => {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const relatedProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => p.era === product.era && p.id !== product.id)
        .sort((a, b) => b.demandScore - a.demandScore)
        .slice(0, 4),
    [product.era, product.id]
  );

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [product.id]);

  useEffect(() => {
    const canonicalUrl = `${STORE_CONFIG.domain}/product/${product.id}`;
    const fullImageUrl = `${STORE_CONFIG.domain}${product.imageUrl}`;
    const shippingRate =
      product.priceNzd >= STORE_CONFIG.shipping.freeThresholdNzd
        ? '0.00'
        : STORE_CONFIG.shipping.flatRateNzd.toFixed(2);

    document.title = `${product.name} (${product.pieces.toLocaleString('en-NZ')} pcs) — ${STORE_CONFIG.storeName}`;

    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalUrl;

    let jsonLdEl = document.getElementById('product-jsonld') as HTMLScriptElement | null;
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script');
      jsonLdEl.id = 'product-jsonld';
      jsonLdEl.type = 'application/ld+json';
      document.head.appendChild(jsonLdEl);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.sku,
      mpn: product.sku,
      image: [fullImageUrl],
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: 'KantoVault',
      },
      category: `Toys & Games > Toys > Building Toys > ${product.category}`,
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: STORE_CONFIG.shipping.currency,
        price: `${product.priceNzd}.00`,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: STORE_CONFIG.legalName,
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: shippingRate,
            currency: STORE_CONFIG.shipping.currency,
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: STORE_CONFIG.address.countryCode,
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: STORE_CONFIG.shipping.handlingDaysMin,
              maxValue: STORE_CONFIG.shipping.handlingDaysMax,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: STORE_CONFIG.shipping.transitDaysMin,
              maxValue: STORE_CONFIG.shipping.transitDaysMax,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: STORE_CONFIG.address.countryCode,
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: STORE_CONFIG.returns.windowDays,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
    };

    jsonLdEl.textContent = JSON.stringify(schema);

    return () => {
      document.title = `${STORE_CONFIG.storeName} — Building Block Sets for Builders of All Ages`;
      const existingScript = document.getElementById('product-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, [product]);

  const qualifiesForFreeShipping = product.priceNzd >= STORE_CONFIG.shipping.freeThresholdNzd;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280]">
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              onNavigate('/');
            }
          }}
          className="font-medium transition-colors hover:text-[#111318]"
        >
          Home
        </a>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          type="button"
          onClick={() => {
            onSelectEra(product.era);
            onNavigate('/');
          }}
          className="font-medium transition-colors hover:text-[#111318]"
        >
          {product.era}
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-[#111318]">{product.name}</span>
      </nav>

      {/* Main 2-Column Product Showcase */}
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left: Product Image & Assurance Cards */}
        <div className="lg:col-span-6">
          <div
            key={product.id}
            ref={imgWrapRef}
            className="shine-once flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-[#ECEAE4] bg-[#F4F1EA] shadow-xs"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#E5DEC9] bg-[#F7F3E7] px-4 py-3 text-xs">
            <span className="inline-flex items-center gap-2 font-semibold text-[#7A5410]">
              <ShieldCheck className="h-4 w-4 text-[#C9922B]" />
              {product.condition}
            </span>
            <span className="font-mono font-semibold text-[#4B5563]">SKU: {product.sku}</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ECEAE4] bg-white p-3.5 text-xs">
              <Truck className="h-4 w-4 text-[#C9922B]" />
              <div className="mt-2 font-semibold text-[#111318]">1–3 Day NZ Courier</div>
              <div className="mt-0.5 text-[11px] text-[#6B7280]">Tracked from Auckland</div>
            </div>
            <div className="rounded-2xl border border-[#ECEAE4] bg-white p-3.5 text-xs">
              <RefreshCw className="h-4 w-4 text-[#C9922B]" />
              <div className="mt-2 font-semibold text-[#111318]">30-Day Returns</div>
              <div className="mt-0.5 text-[11px] text-[#6B7280]">Unopened sets</div>
            </div>
            <div className="rounded-2xl border border-[#ECEAE4] bg-white p-3.5 text-xs">
              <PackageCheck className="h-4 w-4 text-[#C9922B]" />
              <div className="mt-2 font-semibold text-[#111318]">15% GST Included</div>
              <div className="mt-0.5 text-[11px] text-[#6B7280]">No import duties</div>
            </div>
          </div>
        </div>

        {/* Right: Product Info, Pricing, Actions & Specs */}
        <div className="flex flex-col lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#111318] px-3 py-1 text-[11px] font-semibold text-[#E5B85B]">
              {product.setName}
            </span>
            <span className="rounded-full bg-[#C9922B]/15 px-3 py-1 text-[11px] font-bold text-[#8F6311]">
              {product.badge}
            </span>
            <span className="rounded-full border border-[#16A34A]/30 bg-[#16A34A]/10 px-3 py-1 text-[11px] font-semibold text-[#15803D]">
              In Stock in Auckland ({product.stock} available)
            </span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#111318] sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-[#111318]">
              {formatNzd(product.priceNzd)}.00 NZD
            </span>
            <span className="text-xs font-medium text-[#6B7280]">15% GST included</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#374151]">
            <Truck className="h-4 w-4 text-[#C9922B]" />
            {qualifiesForFreeShipping ? (
              <span className="font-semibold text-[#15803D]">
                Free Tracked NZ Shipping (dispatches from Auckland within 1 business day)
              </span>
            ) : (
              <span>
                NZ${STORE_CONFIG.shipping.flatRateNzd} Tracked NZ Courier —{' '}
                <strong>Free on orders over NZ${STORE_CONFIG.shipping.freeThresholdNzd}</strong>
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[#4B5563] sm:text-base">
            {product.description}
          </p>

          {/* Quantity + Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[#ECEAE4] py-5">
            <div className="inline-flex items-center rounded-full border border-[#DCD7CB] bg-white px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded-full p-1.5 text-[#4B5563] hover:bg-[#F3F1EC] hover:text-[#111318]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-9 text-center font-mono text-sm font-semibold text-[#111318]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="rounded-full p-1.5 text-[#4B5563] hover:bg-[#F3F1EC] hover:text-[#111318]"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product, quantity, imgWrapRef.current);
                setJustAdded(true);
                window.setTimeout(() => setJustAdded(false), 1400);
              }}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
                justAdded
                  ? 'animate-added-pop bg-[#C9922B] text-[#111318]'
                  : 'bg-[#111318] text-white hover:bg-[#C9922B] hover:text-[#111318]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added to Vault Bag</span>
                </>
              ) : (
                <span>Add to Vault Bag • {formatNzd(product.priceNzd * quantity)}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(product, quantity)}
              className="rounded-full border border-[#111318] bg-white px-5 py-3.5 text-sm font-semibold text-[#111318] transition-colors hover:bg-[#111318] hover:text-white"
            >
              Buy Now
            </button>

            <button
              type="button"
              onClick={() => onToggleWatchlist(product.id)}
              aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-3.5 text-xs font-semibold transition-all ${
                isWatched
                  ? 'border-[#DC2626] bg-[#DC2626]/10 text-[#B91C1C]'
                  : 'border-[#DCD7CB] bg-white text-[#374151] hover:border-[#C9922B]'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWatched ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
            </button>
          </div>

          {/* What's Inside the Box */}
          <div className="mt-6">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111318]">
              <PackageCheck className="h-4 w-4 text-[#C9922B]" />
              What&apos;s Inside the Box
            </h2>
            <ul className="mt-3 space-y-2">
              {product.contents.map((line) => (
                <li key={line} className="flex items-start gap-2 text-xs text-[#374151] sm:text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#ECEAE4] bg-white">
            <div className="border-b border-[#F0EDE6] bg-[#FAF8F3] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#111318]">
              Technical Specifications
            </div>
            <dl className="divide-y divide-[#F3F1EC] text-xs">
              {[
                ['SKU / MPN', product.sku],
                ['Brand', 'KantoVault'],
                ['Series', product.setName],
                ['Piece Count', `${product.pieces.toLocaleString('en-NZ')} pieces`],
                ['Recommended Age', `Ages ${product.age}`],
                ['Collection', product.era],
                ['Format', product.category],
                ['Condition', 'New (Sealed Retail Packaging)'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-[#6B7280]">{label}</dt>
                  <dd className="font-medium text-[#111318]">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Shipping & Returns Summary */}
          <div className="mt-5 rounded-2xl border border-[#ECEAE4] bg-white p-4 text-xs text-[#4B5563]">
            <div className="font-semibold text-[#111318]">Shipping &amp; 30-Day Returns</div>
            <p className="mt-1 leading-relaxed">
              Orders placed before {STORE_CONFIG.shipping.cutoffTime} dispatch same business day
              from {STORE_CONFIG.address.street}, {STORE_CONFIG.address.city}. Unopened sets can be
              returned within {STORE_CONFIG.returns.windowDays} days for a full refund.{' '}
              <a
                href="/shipping-returns"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    onNavigate('/shipping-returns');
                  }
                }}
                className="font-semibold text-[#9B6D16] underline hover:text-[#111318]"
              >
                Read full Shipping &amp; Returns Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Related Building Sets */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-[#ECEAE4] pt-12">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9B6D16]">
                More in {product.era}
              </span>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#111318]">
                Related Building Sets
              </h2>
            </div>
            <a
              href="/"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  onNavigate('/');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9B6D16] hover:text-[#111318]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to All Sets
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rel) => (
              <a
                key={rel.id}
                href={`/product/${rel.id}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    onNavigate(`/product/${rel.id}`);
                  }
                }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#ECEAE4] bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-[#C9922B]/60 hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-[#F4F1EA]">
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#9B6D16]">
                  {rel.pieces.toLocaleString('en-NZ')} pcs • Ages {rel.age}
                </div>
                <div className="mt-1 line-clamp-1 text-sm font-semibold text-[#111318] group-hover:text-[#8F6311]">
                  {rel.name}
                </div>
                <div className="mt-2 font-mono text-base font-bold text-[#111318]">
                  {formatNzd(rel.priceNzd)}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
