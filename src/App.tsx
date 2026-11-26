import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Filter, Heart, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, ERAS, PRODUCTS, formatNzd } from './products';
import { CartItem, Era, OrderSummary, Product, ProductCategory } from './types';
import { Header } from './Header';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { ProductPage } from './ProductPage';
import { PolicyPages, PolicySlug } from './PolicyPages';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { TrustSection } from './TrustSection';
import { Footer } from './Footer';

type SortOption = 'featured' | 'price-desc' | 'price-asc' | 'pieces-desc' | 'pieces-asc';
type PriceTier = 'all' | 'under-60' | '60-150' | 'over-150';

const CART_STORAGE_KEY = 'kantovault_nz_cart_v2';
const WATCH_STORAGE_KEY = 'kantovault_nz_watch_v2';

const POLICY_SLUGS: PolicySlug[] = ['/shipping-returns', '/privacy', '/terms', '/contact'];

function normalizePath(raw: string): string {
  const clean = raw.replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
}

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [priceTier, setPriceTier] = useState<PriceTier>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartPulse, setCartPulse] = useState(0);

  const navigate = useCallback((to: string) => {
    const target = normalizePath(to);
    if (normalizePath(window.location.pathname) !== target) {
      window.history.pushState({}, '', target);
    }
    setCurrentPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed: { id: string; quantity: number }[] = JSON.parse(saved);
      return parsed
        .map((entry) => {
          const prod = PRODUCTS.find((p) => p.id === entry.id);
          return prod ? { product: prod, quantity: Math.min(prod.stock, entry.quantity) } : null;
        })
        .filter((x): x is CartItem => x !== null);
    } catch {
      return [];
    }
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart.map((c) => ({ id: c.product.id, quantity: c.quantity })))
      );
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WATCH_STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
      // ignore storage quota errors
    }
  }, [watchlist]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const featuredProducts = useMemo(() => {
    const spotlightCodes = [1028, 1019, 1004];
    return spotlightCodes
      .map((code) => PRODUCTS.find((p) => p.code === code))
      .filter((p): p is Product => Boolean(p));
  }, []);

  const eraCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PRODUCTS.length };
    for (const era of ERAS) {
      counts[era] = PRODUCTS.filter((p) => p.era === era).length;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (selectedEra !== 'All' && p.era !== selectedEra) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (showWatchlistOnly && !watchlist.includes(p.id)) return false;

      if (priceTier === 'under-60' && p.priceNzd >= 60) return false;
      if (priceTier === '60-150' && (p.priceNzd < 60 || p.priceNzd > 150)) return false;
      if (priceTier === 'over-150' && p.priceNzd <= 150) return false;

      if (q) {
        const hay = `${p.name} ${p.setName} ${p.era} ${p.category} ${p.pieces} ${p.pieces} pcs ages ${p.age} ${p.sku} ${p.badge}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-desc') return b.priceNzd - a.priceNzd;
      if (sortBy === 'price-asc') return a.priceNzd - b.priceNzd;
      if (sortBy === 'pieces-desc') return b.pieces - a.pieces || b.priceNzd - a.priceNzd;
      if (sortBy === 'pieces-asc') return a.pieces - b.pieces || a.priceNzd - b.priceNzd;
      return b.demandScore - a.demandScore || b.priceNzd - a.priceNzd;
    });
  }, [searchQuery, selectedEra, selectedCategory, priceTier, sortBy, showWatchlistOnly, watchlist]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceNzd * item.quantity, 0);

  const flyToCart = (imgSrc: string, sourceEl?: HTMLElement | null) => {
    if (!sourceEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCartPulse((p) => p + 1);
      return;
    }
    const target = document.getElementById('vault-bag-button');
    if (!target) {
      setCartPulse((p) => p + 1);
      return;
    }

    const srcRect = sourceEl.getBoundingClientRect();
    const dstRect = target.getBoundingClientRect();

    const ghost = document.createElement('img');
    ghost.src = imgSrc;
    ghost.alt = '';
    ghost.style.position = 'fixed';
    ghost.style.left = `${srcRect.left}px`;
    ghost.style.top = `${srcRect.top}px`;
    ghost.style.width = `${srcRect.width}px`;
    ghost.style.height = `${srcRect.height}px`;
    ghost.style.objectFit = 'cover';
    ghost.style.borderRadius = '16px';
    ghost.style.zIndex = '9999';
    ghost.style.pointerEvents = 'none';
    ghost.style.boxShadow = '0 20px 40px -12px rgba(17,19,24,0.45)';
    document.body.appendChild(ghost);

    const dx = dstRect.left + dstRect.width / 2 - (srcRect.left + srcRect.width / 2);
    const dy = dstRect.top + dstRect.height / 2 - (srcRect.top + srcRect.height / 2);

    const anim = ghost.animate(
      [
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        {
          transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 90}px) scale(0.5) rotate(-8deg)`,
          opacity: 1,
          offset: 0.6,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(0.06) rotate(14deg)`, opacity: 0.5 },
      ],
      { duration: 780, easing: 'cubic-bezier(0.55, 0, 0.3, 1)' }
    );
    anim.onfinish = () => {
      ghost.remove();
      setCartPulse((p) => p + 1);
    };
    anim.oncancel = () => {
      ghost.remove();
    };
  };

  const addItemsToCart = (product: Product, qty = 1, sourceEl?: HTMLElement | null) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + qty);
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { product, quantity: Math.min(product.stock, qty) }];
    });
    flyToCart(product.imageUrl, sourceEl);
    setToastMessage(`Added ${product.name} (${formatNzd(product.priceNzd)}) to Vault Bag`);
  };

  const handleBuyNow = (product: Product, qty = 1) => {
    addItemsToCart(product, qty, null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(item.product.stock, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWatchlist = (productId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      setToastMessage(exists ? 'Removed from Watchlist' : 'Saved to Watchlist');
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEra('All');
    setSelectedCategory('All');
    setPriceTier('all');
    setSortBy('featured');
    setShowWatchlistOnly(false);
  };

  const handleOrderComplete = (summary: OrderSummary) => {
    setCart([]);
    setToastMessage(`Order ${summary.orderNumber} reserved for ${summary.region}`);
  };

  const scrollToCatalog = () => {
    document.getElementById('vault-catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Match route
  const matchedProduct = currentPath.startsWith('/product/')
    ? PRODUCTS.find((p) => p.id === currentPath.slice('/product/'.length))
    : undefined;
  const matchedPolicy = POLICY_SLUGS.includes(currentPath as PolicySlug)
    ? (currentPath as PolicySlug)
    : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#111318]">
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartPulse={cartPulse}
        watchlistCount={watchlist.length}
        showWatchlistOnly={showWatchlistOnly}
        onNavigate={navigate}
        onToggleWatchlistFilter={() => setShowWatchlistOnly((v) => !v)}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectEra={(era) => setSelectedEra(era)}
      />

      <main>
        {matchedProduct ? (
          <ProductPage
            product={matchedProduct}
            isWatched={watchlist.includes(matchedProduct.id)}
            onNavigate={navigate}
            onSelectEra={(era) => setSelectedEra(era)}
            onToggleWatchlist={handleToggleWatchlist}
            onAddToCart={addItemsToCart}
            onBuyNow={handleBuyNow}
          />
        ) : matchedPolicy ? (
          <PolicyPages path={matchedPolicy} onNavigate={navigate} />
        ) : (
          <>
            <Hero
              featuredProducts={featuredProducts}
              onInspectProduct={(p) => navigate(`/product/${p.id}`)}
              onExploreAll={() => {
                handleResetFilters();
                scrollToCatalog();
              }}
              onFilterEra={(era) => {
                setSelectedEra(era);
                setShowWatchlistOnly(false);
                scrollToCatalog();
              }}
            />

            {/* Brick Catalog Section */}
            <section
              id="vault-catalog"
              className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
            >
              {/* Catalog Heading & Search */}
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#9B6D16]">
                    In Stock • {PRODUCTS.length} Building Sets
                  </span>
                  <h2 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-[#111318] sm:text-4xl">
                    The KantoVault Brick Collection
                  </h2>
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search castle, rocket, starter, 1000 pcs..."
                    aria-label="Search building block sets"
                    className="w-full rounded-full border border-[#DFDAD0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111318] placeholder-[#9CA3AF] shadow-2xs focus:border-[#C9922B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Collection Filter Tabs */}
              <div className="mt-7 flex flex-wrap gap-2">
                {(['All', ...ERAS] as const).map((era) => {
                  const active = selectedEra === era;
                  return (
                    <button
                      key={era}
                      type="button"
                      onClick={() => setSelectedEra(era)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                        active
                          ? 'border-[#111318] bg-[#111318] text-white shadow-xs'
                          : 'border-[#E5E0D5] bg-white text-[#4B5563] hover:border-[#C9922B]/70 hover:text-[#111318]'
                      }`}
                    >
                      <span>{era === 'All' ? 'All Collections' : era}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                          active ? 'bg-[#C9922B] text-[#111318]' : 'bg-[#F3F1EC] text-[#6B7280]'
                        }`}
                      >
                        {eraCounts[era]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Filter Bar: Type, Price Tier, Sort */}
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#ECEAE4] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280]">
                    <Filter className="h-3.5 w-3.5 text-[#C9922B]" />
                    Type:
                  </span>
                  {(['All', ...CATEGORIES] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#C9922B]/18 font-semibold text-[#8F6311]'
                          : 'bg-[#F7F6F2] text-[#4B5563] hover:bg-[#EFECE4]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-[#F3F1EC] pt-3 lg:border-t-0 lg:pt-0">
                  {/* Price Tier Select */}
                  <div className="inline-flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#9B6D16]" />
                    <select
                      aria-label="Filter by NZD price tier"
                      value={priceTier}
                      onChange={(e) => setPriceTier(e.target.value as PriceTier)}
                      className="rounded-full border border-[#E5E0D5] bg-[#FAFAF8] px-3 py-1.5 text-xs font-medium text-[#111318] focus:border-[#C9922B] focus:outline-none"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-60">Under NZ$60</option>
                      <option value="60-150">NZ$60 – NZ$150</option>
                      <option value="over-150">Over NZ$150</option>
                    </select>
                  </div>

                  {/* Sort Select */}
                  <select
                    aria-label="Sort building sets"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-full border border-[#E5E0D5] bg-[#FAFAF8] px-3 py-1.5 text-xs font-medium text-[#111318] focus:border-[#C9922B] focus:outline-none"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="pieces-desc">Most Pieces</option>
                    <option value="pieces-asc">Fewest Pieces</option>
                  </select>
                </div>
              </div>

              {/* Live Results Count */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
                <div>
                  Showing{' '}
                  <strong className="font-mono text-[#111318]">{filteredProducts.length}</strong> of{' '}
                  <strong className="font-mono text-[#111318]">{PRODUCTS.length}</strong> building
                  sets
                  {showWatchlistOnly && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#DC2626]/10 px-2 py-0.5 font-semibold text-[#B91C1C]">
                      <Heart className="h-3 w-3 fill-[#DC2626]" />
                      Watchlist Filter Active
                    </span>
                  )}
                </div>

                {(searchQuery ||
                  selectedEra !== 'All' ||
                  selectedCategory !== 'All' ||
                  priceTier !== 'all' ||
                  showWatchlistOnly) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 font-semibold text-[#9B6D16] hover:text-[#111318]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset all filters
                  </button>
                )}
              </div>

              {/* Product Grid or Empty State */}
              {filteredProducts.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-[#DAD4C8] bg-white px-6 py-16 text-center">
                  <p className="font-serif text-xl font-semibold text-[#111318]">
                    No sets match those filters.
                  </p>
                  <p className="mt-1.5 text-xs text-[#6B7280]">
                    Try broadening your collection, price range, or search keyword.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#111318] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#C9922B] hover:text-[#111318]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Show All {PRODUCTS.length} Products
                  </button>
                </div>
              ) : (
                <div
                  key={selectedEra + selectedCategory + priceTier + sortBy}
                  className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      isWatched={watchlist.includes(product.id)}
                      onNavigate={navigate}
                      onToggleWatchlist={handleToggleWatchlist}
                      onInspect={(p) => setInspectedProduct(p)}
                      onAddToCart={(p, el) => addItemsToCart(p, 1, el)}
                    />
                  ))}
                </div>
              )}
            </section>

            <TrustSection />
          </>
        )}
      </main>

      <Footer onNavigate={navigate} onSelectEra={(era) => setSelectedEra(era)} />

      {/* Modals & Drawers */}
      <ProductModal
        product={inspectedProduct}
        isWatched={inspectedProduct ? watchlist.includes(inspectedProduct.id) : false}
        onClose={() => setInspectedProduct(null)}
        onNavigate={navigate}
        onToggleWatchlist={handleToggleWatchlist}
        onAddToCart={(p, qty, el) => addItemsToCart(p, qty, el)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="animate-fade-up fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[#2C313D] bg-[#111318] px-4 py-2.5 text-xs font-medium text-white shadow-xl"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E5B85B]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
