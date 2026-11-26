import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { STORE_CONFIG } from './storeConfig';

export type PolicySlug = '/shipping-returns' | '/privacy' | '/terms' | '/contact';

interface PolicyPagesProps {
  path: PolicySlug;
  onNavigate: (path: string) => void;
}

const TABS: { path: PolicySlug; label: string; title: string }[] = [
  { path: '/shipping-returns', label: 'Shipping & Returns', title: 'Shipping & Returns Policy' },
  { path: '/privacy', label: 'Privacy Policy', title: 'Privacy Policy (NZ Privacy Act 2020)' },
  { path: '/terms', label: 'Terms of Service', title: 'Terms of Service' },
  { path: '/contact', label: 'Contact Us', title: 'Contact Us & Auckland Studio' },
];

export const PolicyPages: React.FC<PolicyPagesProps> = ({ path, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product & Stock Inquiry');
  const [message, setMessage] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const activeTab = TABS.find((t) => t.path === path) ?? TABS[0];

  useEffect(() => {
    document.title = `${activeTab.title} — ${STORE_CONFIG.storeName}`;
    return () => {
      document.title = `${STORE_CONFIG.storeName} — Building Block Sets for Builders of All Ages`;
    };
  }, [activeTab.title]);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmittedRef(`INQ-NZ-${Math.floor(10000 + Math.random() * 89999)}`);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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
        Back to Brick Collection
      </a>

      {/* Page Switcher Tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = tab.path === path;
          return (
            <a
              key={tab.path}
              href={tab.path}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  onNavigate(tab.path);
                }
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                active
                  ? 'border-[#111318] bg-[#111318] text-white'
                  : 'border-[#E5E0D5] bg-white text-[#4B5563] hover:border-[#C9922B]'
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="mt-6 rounded-3xl border border-[#ECEAE4] bg-white p-6 shadow-xs sm:p-10">
        {path === '/shipping-returns' && (
          <article className="space-y-8 text-sm leading-relaxed text-[#4B5563]">
            <header>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9B6D16]">
                <Truck className="h-4 w-4" />
                New Zealand Delivery &amp; Returns
              </div>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#111318]">
                Shipping &amp; Returns Policy
              </h1>
              <p className="mt-2 text-xs text-[#6B7280]">
                Applies to all orders placed with {STORE_CONFIG.legalName} ({STORE_CONFIG.domain})
                for delivery across New Zealand.
              </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-4">
                <div className="font-semibold text-[#111318]">Free NZ Shipping</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#15803D]">
                  Orders NZ${STORE_CONFIG.shipping.freeThresholdNzd}+
                </div>
                <p className="mt-1 text-xs">
                  Orders under NZ${STORE_CONFIG.shipping.freeThresholdNzd} ship for a flat NZ$
                  {STORE_CONFIG.shipping.flatRateNzd}.00 tracked rate.
                </p>
              </div>
              <div className="rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-4">
                <div className="font-semibold text-[#111318]">Dispatch &amp; Transit</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#111318]">1–3 Days</div>
                <p className="mt-1 text-xs">
                  Orders before {STORE_CONFIG.shipping.cutoffTime} dispatch same business day via{' '}
                  {STORE_CONFIG.shipping.carrier}.
                </p>
              </div>
              <div className="rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-4">
                <div className="font-semibold text-[#111318]">Return Window</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#9B6D16]">
                  {STORE_CONFIG.returns.windowDays} Days
                </div>
                <p className="mt-1 text-xs">
                  Zero restocking fees on unopened sets in original sealed packaging.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                1. Order Handling &amp; New Zealand Shipping Rates
              </h2>
              <p>
                All stock is held locally in Auckland, New Zealand. Orders confirmed before{' '}
                <strong>{STORE_CONFIG.shipping.cutoffTime}</strong> Monday–Friday are dispatched the
                same business day (0–1 business day handling). Delivery via{' '}
                <strong>{STORE_CONFIG.shipping.carrier}</strong> takes 1–2 business days for North
                Island urban addresses and 2–3 business days for South Island and rural deliveries.
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Orders NZ${STORE_CONFIG.shipping.freeThresholdNzd}.00 NZD and over:</strong>{' '}
                  FREE tracked courier shipping anywhere in New Zealand.
                </li>
                <li>
                  <strong>Orders under NZ${STORE_CONFIG.shipping.freeThresholdNzd}.00 NZD:</strong>{' '}
                  Flat NZ${STORE_CONFIG.shipping.flatRateNzd}.00 NZD tracked courier fee.
                </li>
                <li>
                  <strong>Auckland Studio Pickup:</strong> Free pickup by appointment at{' '}
                  {STORE_CONFIG.address.street}, {STORE_CONFIG.address.city}{' '}
                  {STORE_CONFIG.address.postcode}.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                2. 30-Day Change-of-Mind Returns &amp; Exchanges
              </h2>
              <p>
                You may return any unopened building-block set within{' '}
                <strong>{STORE_CONFIG.returns.windowDays} days</strong> of delivery for a full
                refund or exchange, provided the retail box remains{' '}
                {STORE_CONFIG.returns.condition.toLowerCase()}. There is no restocking fee.
              </p>
              <p>
                To initiate a return, email{' '}
                <a
                  href={`mailto:${STORE_CONFIG.supportEmail}`}
                  className="font-semibold text-[#9B6D16] underline"
                >
                  {STORE_CONFIG.supportEmail}
                </a>{' '}
                with your order reference (`KV-NZ-2026-XXXX`). Return parcels should be addressed
                to:
              </p>
              <div className="rounded-xl border border-[#ECEAE4] bg-[#FAFAF8] p-4 font-mono text-xs text-[#111318]">
                {STORE_CONFIG.legalName} — Returns
                <br />
                {STORE_CONFIG.address.street}
                <br />
                {STORE_CONFIG.address.city} {STORE_CONFIG.address.postcode},{' '}
                {STORE_CONFIG.address.country}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                3. Damaged, Missing Parts, &amp; NZ Consumer Guarantees Act
              </h2>
              <p>
                Every customer is fully protected under the{' '}
                <strong>New Zealand Consumer Guarantees Act 1993</strong>. If a parcel arrives
                damaged in transit, an item is faulty, or a bag is missing parts, contact us within
                14 days with photos and we will cover return shipping and supply replacement parts,
                a replacement set, or a full refund. Approved refunds are processed within{' '}
                <strong>{STORE_CONFIG.returns.refundDays}</strong> back to your original payment
                method or NZ bank account.
              </p>
            </section>
          </article>
        )}

        {path === '/privacy' && (
          <article className="space-y-6 text-sm leading-relaxed text-[#4B5563]">
            <header>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9B6D16]">
                <ShieldCheck className="h-4 w-4" />
                New Zealand Privacy Act 2020
              </div>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#111318]">
                Privacy Policy
              </h1>
              <p className="mt-2 text-xs text-[#6B7280]">
                Effective Date: November 2026 • {STORE_CONFIG.legalName}
              </p>
            </header>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                1. Information We Collect
              </h2>
              <p>
                When you place an order or submit an inquiry on {STORE_CONFIG.domain}, we collect
                only the information required to process and deliver your order: your name, email
                address, New Zealand mobile number, and delivery address.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                2. How We Use &amp; Share Your Data
              </h2>
              <p>
                We use your contact and address details solely to issue tax invoices, answer
                support inquiries, and book tracked courier deliveries with New Zealand courier
                partners ({STORE_CONFIG.shipping.carrier}). We never sell, rent, or trade your
                personal details to third-party marketers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                3. Browser Storage &amp; Preferences
              </h2>
              <p>
                Our storefront uses browser `localStorage` strictly to remember items in your Vault
                Bag and Watchlist between page views. No third-party ad-tracking pixels are active
                by default.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                4. Access &amp; Correction Rights
              </h2>
              <p>
                Under the <strong>New Zealand Privacy Act 2020</strong>, you have the right to
                request access to, or correction of, any personal information we hold about you.
                Email{' '}
                <a
                  href={`mailto:${STORE_CONFIG.supportEmail}`}
                  className="font-semibold text-[#9B6D16] underline"
                >
                  {STORE_CONFIG.supportEmail}
                </a>{' '}
                or write to {STORE_CONFIG.address.street}, {STORE_CONFIG.address.city}{' '}
                {STORE_CONFIG.address.postcode}.
              </p>
            </section>
          </article>
        )}

        {path === '/terms' && (
          <article className="space-y-6 text-sm leading-relaxed text-[#4B5563]">
            <header>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9B6D16]">
                <FileText className="h-4 w-4" />
                Store Terms &amp; Conditions
              </div>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#111318]">
                Terms of Service
              </h1>
              <p className="mt-2 text-xs text-[#6B7280]">
                Governing Law: New Zealand • {STORE_CONFIG.legalName}
              </p>
            </header>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                1. Pricing, Currency &amp; GST
              </h2>
              <p>
                All prices listed on {STORE_CONFIG.domain} are in{' '}
                <strong>New Zealand Dollars (NZD)</strong> and are inclusive of 15% New Zealand
                Goods and Services Tax (GST). Shipping fees are shown clearly before order
                confirmation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                2. Orders &amp; Payment
              </h2>
              <p>
                Orders can be placed using NZ Bank Transfer (Direct Deposit with GST Tax Invoice)
                or Pay on Pickup at our Auckland Studio. Bank-transfer orders are held for 48 hours
                awaiting cleared funds before dispatch.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                3. Age Guides &amp; Small Parts Safety
              </h2>
              <p>
                Building-block sets contain small parts and are not suitable for children under 3
                years old. Please observe the recommended age range printed on each product listing
                (`4+` through `18+`).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-[#111318]">
                4. Consumer Guarantees &amp; Governing Law
              </h2>
              <p>
                Nothing in these terms limits your rights under the{' '}
                <strong>New Zealand Consumer Guarantees Act 1993</strong> or the{' '}
                <strong>Fair Trading Act 1986</strong>. These terms are governed by the laws of
                New Zealand.
              </p>
            </section>
          </article>
        )}

        {path === '/contact' && (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9B6D16]">
                  <MapPin className="h-4 w-4" />
                  Auckland Brick Studio
                </div>
                <h1 className="mt-2 font-serif text-3xl font-semibold text-[#111318]">
                  Contact Us
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                  Questions about a set, bulk classroom orders, or Auckland pickup? Reach our local
                  team directly.
                </p>
              </div>

              <div className="space-y-4 rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-5 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9922B]" />
                  <div>
                    <div className="font-semibold text-[#111318]">{STORE_CONFIG.legalName}</div>
                    <div className="text-[#4B5563]">
                      {STORE_CONFIG.address.street}
                      <br />
                      {STORE_CONFIG.address.city} {STORE_CONFIG.address.postcode},{' '}
                      {STORE_CONFIG.address.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#C9922B]" />
                  <a
                    href={`tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}`}
                    className="font-mono font-semibold text-[#111318] hover:text-[#9B6D16]"
                  >
                    {STORE_CONFIG.supportPhone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#C9922B]" />
                  <a
                    href={`mailto:${STORE_CONFIG.supportEmail}`}
                    className="font-semibold text-[#111318] hover:text-[#9B6D16]"
                  >
                    {STORE_CONFIG.supportEmail}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-[#C9922B]" />
                  <span className="text-[#4B5563]">{STORE_CONFIG.hours}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-4 text-xs text-[#4B5563]">
                <div className="flex items-center gap-1.5 font-semibold text-[#111318]">
                  <RefreshCw className="h-3.5 w-3.5 text-[#C9922B]" />
                  Merchant Product Feed
                </div>
                <p className="mt-1">
                  XML feed endpoint:{' '}
                  <a
                    href="/merchant-feed.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-semibold text-[#9B6D16] underline"
                  >
                    /merchant-feed.xml
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submittedRef ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-[#16A34A]/30 bg-[#16A34A]/8 p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-[#111318]">
                    Inquiry Received
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-[#4B5563]">
                    Reference <strong className="font-mono">{submittedRef}</strong> has been logged
                    for our Auckland team. We reply within 1 business day during{' '}
                    {STORE_CONFIG.hours}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="mt-5 rounded-full bg-[#111318] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#C9922B] hover:text-[#111318]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleInquiry}
                  className="space-y-4 rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-6"
                >
                  <h2 className="font-serif text-xl font-semibold text-[#111318]">
                    Send a Message
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563]">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aroha Wilson"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-white px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
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
                        placeholder="aroha@example.co.nz"
                        className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-white px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4B5563]">Topic</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-white px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                    >
                      <option>Product &amp; Stock Inquiry</option>
                      <option>Order Status / Courier Tracking</option>
                      <option>Auckland Studio Pickup</option>
                      <option>Returns &amp; Replacement Parts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#4B5563]">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our Auckland team help?"
                      className="mt-1 w-full rounded-xl border border-[#E2DDD2] bg-white px-3 py-2 text-sm focus:border-[#C9922B] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-[#111318] px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#C9922B] hover:text-[#111318]"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
