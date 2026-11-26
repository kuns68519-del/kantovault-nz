import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Printer,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { CartItem, OrderSummary } from './types';
import { formatNzd } from './products';
import { STORE_CONFIG } from './storeConfig';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onOrderComplete: (summary: OrderSummary) => void;
}

const NZ_REGIONS = [
  'Auckland',
  'Wellington',
  'Christchurch / Canterbury',
  'Waikato',
  'Bay of Plenty',
  'Otago',
  "Hawke's Bay",
  'Manawatū-Whanganui',
  'Northland',
  'Taranaki',
  'Southland',
];

const PAYMENT_OPTIONS = [
  'NZ Bank Transfer / Direct Deposit (Instant Tax Invoice)',
  'Auckland Studio Pay on Pickup (EFTPOS / Card)',
  'Online Card / Afterpay Gateway',
] as const;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  onClose,
  onOrderComplete,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [region, setRegion] = useState('Auckland');
  const [courierMethod, setCourierMethod] = useState('Tracked NZ Courier (1–3 days)');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_OPTIONS[0]);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderSummary | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((s, i) => s + i.product.priceNzd * i.quantity, 0);
  const shipping =
    courierMethod === 'Auckland Studio Pickup' ||
    subtotal >= STORE_CONFIG.shipping.freeThresholdNzd ||
    subtotal === 0
      ? 0
      : STORE_CONFIG.shipping.flatRateNzd;
  const total = subtotal + shipping;
  const gstIncluded = Math.round((total * 3) / 23);
  const isGatewaySelected = paymentMethod === 'Online Card / Afterpay Gateway';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGatewaySelected) {
      setGatewayError(
        'Live Card / Afterpay gateway keys are not yet attached on this storefront. Please select NZ Bank Transfer (Instant Tax Invoice) or Auckland Studio Pay on Pickup to complete your order.'
      );
      return;
    }
    setGatewayError(null);
    const orderNum = `KV-NZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const summary: OrderSummary = {
      orderNumber: orderNum,
      customerName: customerName.trim(),
      email: email.trim(),
      region,
      courierMethod,
      paymentMethod,
      items: [...items],
      subtotalNzd: subtotal,
      shippingNzd: shipping,
      totalNzd: total,
      placedAt: new Date().toLocaleString('en-NZ', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };
    setConfirmation(summary);
    onOrderComplete(summary);
  };

  const handleClose = () => {
    setConfirmation(null);
    setGatewayError(null);
    onClose();
  };

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-[#111318]/70 p-4 backdrop-blur-xs"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="New Zealand Checkout"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E5E0D5] bg-[#FAFAF8] p-5 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close checkout"
          className="absolute right-4 top-4 rounded-full border border-[#E5E0D5] bg-white p-2 text-[#4B5563] hover:text-[#111318]"
        >
          <X className="h-4 w-4" />
        </button>

        {confirmation ? (
          <div className="py-2">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/12 text-[#16A34A]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-[#9B6D16]">
                {confirmation.paymentMethod.includes('Pickup')
                  ? 'Reserved for Auckland Studio Pickup'
                  : 'Tax Invoice Issued • Awaiting Bank Transfer'}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#111318]">
                Ngā mihi, {confirmation.customerName}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-[#4B5563]">
                Order <strong className="font-mono">{confirmation.orderNumber}</strong> is reserved
                at {STORE_CONFIG.legalName} ({confirmation.placedAt}) for dispatch to{' '}
                <strong>{confirmation.region}</strong>.
              </p>
            </div>

            {/* GST Tax Invoice Card */}
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-[#ECEAE4] bg-white p-5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3F1EC] pb-3">
                <div>
                  <div className="font-serif text-base font-semibold text-[#111318]">
                    NZ GST Tax Invoice
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {STORE_CONFIG.legalName} • {STORE_CONFIG.address.street},{' '}
                    {STORE_CONFIG.address.city}
                  </div>
                </div>
                <span className="rounded-full bg-[#FAF8F3] px-3 py-1 font-mono font-bold text-[#111318]">
                  {confirmation.orderNumber}
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 border-b border-[#F3F1EC] pb-3">
                {confirmation.items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex justify-between text-[#374151]">
                    <span>
                      <strong className="font-mono">{quantity}×</strong> {product.name} ({product.sku})
                    </span>
                    <span className="font-mono font-semibold text-[#111318]">
                      {formatNzd(product.priceNzd * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-[#4B5563]">
                  <span>Dispatch Method</span>
                  <span className="font-semibold text-[#111318]">{confirmation.courierMethod}</span>
                </div>
                <div className="flex justify-between text-[#4B5563]">
                  <span>Shipping</span>
                  <span className="font-mono font-semibold text-[#15803D]">
                    {confirmation.shippingNzd === 0 ? 'FREE' : formatNzd(confirmation.shippingNzd)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>15% NZ GST (included)</span>
                  <span className="font-mono">
                    {formatNzd(Math.round((confirmation.totalNzd * 3) / 23))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#F3F1EC] pt-2.5 text-sm font-bold text-[#111318]">
                  <span>Total Due (NZD Incl. GST)</span>
                  <span className="font-mono">{formatNzd(confirmation.totalNzd)}</span>
                </div>
              </div>

              {confirmation.paymentMethod.includes('Bank Transfer') ? (
                <div className="mt-4 rounded-xl border border-[#E5DEC9] bg-[#FAF7EE] p-3.5 text-[#374151]">
                  <div className="flex items-center gap-1.5 font-semibold text-[#7A5410]">
                    <Building2 className="h-4 w-4 text-[#C9922B]" />
                    NZ Bank Transfer Payment Instructions
                  </div>
                  <div className="mt-2 grid gap-1 font-mono text-[11px]">
                    <div>Bank: {STORE_CONFIG.bankTransfer.bankName}</div>
                    <div>Account Name: {STORE_CONFIG.bankTransfer.accountName}</div>
                    <div>Account Number: {STORE_CONFIG.bankTransfer.accountNumber}</div>
                    <div>
                      Reference: <strong>{confirmation.orderNumber}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-[#ECEAE4] bg-[#FAFAF8] p-3.5 text-[#374151]">
                  Pay on collection via EFTPOS or card at{' '}
                  <strong>
                    {STORE_CONFIG.address.street}, {STORE_CONFIG.address.city}{' '}
                    {STORE_CONFIG.address.postcode}
                  </strong>{' '}
                  ({STORE_CONFIG.hours}).
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-[#D8D3C8] bg-white px-5 py-3 text-xs font-semibold text-[#111318] hover:border-[#C9922B]"
              >
                <Printer className="h-4 w-4 text-[#C9922B]" />
                Print / Save GST Tax Invoice
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full bg-[#111318] px-7 py-3 text-sm font-semibold text-white hover:bg-[#1F242D]"
              >
                Return to KantoVault NZ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9B6D16]">
              <Lock className="h-3.5 w-3.5" />
              New Zealand Express Checkout
            </div>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#111318]">
              Complete Your Order
            </h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                {/* Buyer Details */}
                <div className="rounded-2xl border border-[#ECEAE4] bg-white p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111318]">
                    1. Customer Details
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Liam Patel"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="liam@builder.co.nz"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        NZ Mobile
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="021 555 0192"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* NZ Delivery Address */}
                <div className="rounded-2xl border border-[#ECEAE4] bg-white p-4">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111318]">
                    <MapPin className="h-3.5 w-3.5 text-[#C9922B]" />
                    2. New Zealand Delivery Address
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="42 Ponsonby Road"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        Suburb / City
                      </label>
                      <input
                        type="text"
                        required
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="Grey Lynn"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        Postcode
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="1021"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 font-mono text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        NZ Region
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-[#FAFAF8] px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      >
                        {NZ_REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Courier & Payment */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#ECEAE4] bg-white p-4">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111318]">
                      <Truck className="h-3.5 w-3.5 text-[#C9922B]" />
                      Courier Option
                    </h3>
                    <div className="mt-2.5 space-y-2 text-xs">
                      {['Tracked NZ Courier (1–3 days)', 'Auckland Studio Pickup'].map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-start gap-2 rounded-xl border border-[#ECEAE4] p-2.5 hover:border-[#C9922B]"
                        >
                          <input
                            type="radio"
                            name="courier"
                            checked={courierMethod === opt}
                            onChange={() => setCourierMethod(opt)}
                            className="mt-0.5 accent-[#C9922B]"
                          />
                          <span className="font-medium text-[#111318]">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#ECEAE4] bg-white p-4">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111318]">
                      <CreditCard className="h-3.5 w-3.5 text-[#C9922B]" />
                      Payment Method
                    </h3>
                    <div className="mt-2.5 space-y-2 text-xs">
                      {PAYMENT_OPTIONS.map((method) => (
                        <label
                          key={method}
                          className="flex cursor-pointer items-start gap-2 rounded-xl border border-[#ECEAE4] p-2 hover:border-[#C9922B]"
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === method}
                            onChange={() => {
                              setPaymentMethod(method);
                              setGatewayError(null);
                            }}
                            className="mt-0.5 accent-[#C9922B]"
                          />
                          <span className="font-medium text-[#111318]">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {isGatewaySelected && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-[#F59E0B]/40 bg-[#FEF3C7]/70 p-3.5 text-xs text-[#78350F]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
                    <span>
                      Online Card / Afterpay gateway keys are not yet attached in this environment.
                      Select <strong>NZ Bank Transfer (Instant Tax Invoice)</strong> or{' '}
                      <strong>Auckland Studio Pay on Pickup</strong> to complete your order now.
                    </span>
                  </div>
                )}

                {gatewayError && (
                  <div className="rounded-xl border border-[#DC2626]/30 bg-[#FEF2F2] p-3 text-xs font-medium text-[#B91C1C]">
                    {gatewayError}
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-[#ECEAE4] bg-white p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#111318]">
                    Order Summary
                  </h3>
                  <ul className="mt-3 max-h-56 space-y-2.5 overflow-y-auto pr-1">
                    {items.map(({ product, quantity }) => (
                      <li key={product.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="line-clamp-1 text-[#374151]">
                          <strong className="font-mono">{quantity}×</strong> {product.name}
                        </span>
                        <span className="shrink-0 font-mono font-semibold text-[#111318]">
                          {formatNzd(product.priceNzd * quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-2 border-t border-[#F0EDE6] pt-3 text-xs">
                    <div className="flex justify-between text-[#4B5563]">
                      <span>Subtotal</span>
                      <span className="font-mono font-semibold">{formatNzd(subtotal)}</span>
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
                      <span>Total NZD (Incl. GST)</span>
                      <span className="font-mono text-base">{formatNzd(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGatewaySelected}
                    className="mt-5 w-full rounded-full bg-[#111318] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C9922B] hover:text-[#111318] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {paymentMethod.includes('Pickup')
                      ? `Reserve Pickup Order • ${formatNzd(total)}`
                      : `Place Order & Issue Tax Invoice • ${formatNzd(total)}`}
                  </button>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C9922B]" />
                    Tracked delivery across New Zealand
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
