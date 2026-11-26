import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Lock, MapPin, ShieldCheck, Truck, X } from 'lucide-react';
import { CartItem, OrderSummary } from './types';
import { formatNzd } from './products';

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
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [confirmation, setConfirmation] = useState<OrderSummary | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((s, i) => s + i.product.priceNzd * i.quantity, 0);
  const shipping =
    courierMethod === 'Auckland Studio Pickup' || subtotal >= 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111318]/70 p-4 backdrop-blur-xs"
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
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/12 text-[#16A34A]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-[#9B6D16]">
              Order Confirmed
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-[#111318]">
              Ngā mihi, {confirmation.customerName}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#4B5563]">
              Your order <strong className="font-mono">{confirmation.orderNumber}</strong> is being
              packed at our Auckland studio for dispatch to <strong>{confirmation.region}</strong>.
            </p>

            <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-[#ECEAE4] bg-white p-5 text-left text-xs">
              <div className="flex justify-between border-b border-[#F3F1EC] pb-2.5">
                <span className="text-[#6B7280]">Order Reference</span>
                <span className="font-mono font-bold text-[#111318]">
                  {confirmation.orderNumber}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#F3F1EC] py-2.5">
                <span className="text-[#6B7280]">Dispatch Method</span>
                <span className="font-semibold text-[#111318]">{confirmation.courierMethod}</span>
              </div>
              <div className="flex justify-between border-b border-[#F3F1EC] py-2.5">
                <span className="text-[#6B7280]">Payment</span>
                <span className="font-semibold text-[#111318]">{confirmation.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-3 text-sm font-bold text-[#111318]">
                <span>Total Paid (Incl. GST)</span>
                <span className="font-mono">{formatNzd(confirmation.totalNzd)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full bg-[#111318] px-7 py-3 text-sm font-semibold text-white hover:bg-[#1F242D]"
            >
              Return to KantoVault NZ
            </button>
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
                      {['Credit / Debit Card', 'NZ Bank Transfer / POLi', 'Afterpay (4x NZD)'].map(
                        (method) => (
                          <label
                            key={method}
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#ECEAE4] p-2 hover:border-[#C9922B]"
                          >
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === method}
                              onChange={() => setPaymentMethod(method)}
                              className="accent-[#C9922B]"
                            />
                            <span className="font-medium text-[#111318]">{method}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
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
                    <div className="flex justify-between border-t border-[#F0EDE6] pt-2.5 text-sm font-bold text-[#111318]">
                      <span>Total NZD (Incl. GST)</span>
                      <span className="font-mono text-base">{formatNzd(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-5 w-full rounded-full bg-[#111318] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C9922B] hover:text-[#111318]"
                  >
                    Confirm &amp; Pay {formatNzd(total)}
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
