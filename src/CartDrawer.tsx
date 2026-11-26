import React from 'react';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { CartItem } from './types';
import { PRODUCTS, formatNzd } from './products';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_COURIER_NZD = 10;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.priceNzd * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_COURIER_NZD;
  const total = subtotal + shipping;
  const gstIncluded = Math.round((total * 3) / 23);
  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex justify-end bg-[#111318]/55 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vault Bag"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-in-right flex h-full w-full max-w-md flex-col bg-[#FAFAF8] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECEAE4] bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#C9922B]" />
            <h2 className="font-serif text-lg font-semibold text-[#111318]">
              Your Vault Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="rounded-full p-1.5 text-[#6B7280] hover:bg-[#F3F1EC] hover:text-[#111318]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Tracked NZ Shipping Progress Bar */}
        <div className="border-b border-[#ECEAE4] bg-[#F6F3EB] px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#374151]">
            <Truck className="h-4 w-4 shrink-0 text-[#C9922B]" />
            {subtotal === 0 ? (
              <span>Free tracked NZ shipping on orders over NZ$100</span>
            ) : remainingForFree === 0 ? (
              <span className="font-semibold text-[#15803D]">
                Unlocked: Free Tracked NZ Courier
              </span>
            ) : (
              <span>
                Add <strong className="font-mono">{formatNzd(remainingForFree)}</strong> more for
                free tracked NZ shipping
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5DFD2]">
            <div
              className="h-full rounded-full bg-[#C9922B] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs">
                <ShoppingBag className="h-6 w-6 text-[#9B6D16]" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-[#111318]">
                Your Vault Bag is empty
              </h3>
              <p className="mt-1 max-w-xs text-xs text-[#6B7280]">
                Explore our {PRODUCTS.length} building sets, from starter kits to collector displays.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-full bg-[#111318] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1F242D]"
              >
                Browse Brick Catalog
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3.5 rounded-2xl border border-[#ECEAE4] bg-white p-3.5"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F3F1EC] bg-[#F4F1EA]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B6D16]">
                          {product.setName} • {product.pieces.toLocaleString('en-NZ')} pcs
                        </div>
                        <h4 className="line-clamp-2 text-xs font-semibold text-[#111318]">
                          {product.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="rounded p-1 text-[#9CA3AF] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2.5">
                      <div className="inline-flex items-center rounded-full border border-[#E5E0D5] bg-[#FAFAF8] px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, -1)}
                          className="rounded-full p-1 text-[#4B5563] hover:text-[#111318]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-semibold text-[#111318]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, 1)}
                          disabled={quantity >= product.stock}
                          className="rounded-full p-1 text-[#4B5563] hover:text-[#111318] disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="font-mono text-sm font-bold text-[#111318]">
                        {formatNzd(product.priceNzd * quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Totals & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[#ECEAE4] bg-white p-5">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#4B5563]">
                <span>Subtotal (NZD)</span>
                <span className="font-mono font-semibold text-[#111318]">
                  {formatNzd(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Tracked NZ Courier</span>
                <span className="font-mono font-semibold text-[#15803D]">
                  {shipping === 0 ? 'FREE' : formatNzd(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>15% NZ GST (included)</span>
                <span className="font-mono">{formatNzd(gstIncluded)}</span>
              </div>
              <div className="flex justify-between border-t border-[#F0EDE6] pt-2.5 text-sm font-bold text-[#111318]">
                <span>Total (NZD)</span>
                <span className="font-mono text-base">{formatNzd(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#111318] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C9922B] hover:text-[#111318]"
            >
              <span>Proceed to NZ Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C9922B]" />
              <span>30-Day Easy Returns on Unopened Sets</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
