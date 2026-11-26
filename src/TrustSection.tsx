import React, { useState } from 'react';
import { Award, ChevronDown, Lock, Mail, PackageCheck, RefreshCw, Truck } from 'lucide-react';

const PILLARS = [
  {
    icon: Truck,
    title: 'Fast Auckland Dispatch',
    body: 'Orders placed before 2:00 PM NZT ship same day from our Auckland studio via tracked NZ courier—free on orders over NZ$100.',
  },
  {
    icon: RefreshCw,
    title: '30-Day Easy Returns',
    body: 'Changed your mind on a gift or project? Return any unopened set within 30 days for a straightforward refund or swap.',
  },
  {
    icon: Lock,
    title: 'Cash on Delivery & Pickup',
    body: 'Pay smoothly in New Zealand Dollars via Cash on Delivery on arrival or Cash / EFTPOS at our Auckland Studio, with 15% GST included.',
  },
  {
    icon: PackageCheck,
    title: 'Gift-Ready Packing',
    body: 'Every retail box is cushioned inside sturdy double-walled outer cartons so corners stay crisp from Auckland to your doorstep.',
  },
];

const FAQS = [
  {
    q: 'Do your bricks work with other brick brands?',
    a: 'Yes. Our sets use the standard stud size common across the hobby, so they combine smoothly with most bricks you already own.',
  },
  {
    q: 'What age are the sets for?',
    a: 'Every set lists an age guide on its product card—ranging from 4+ bulk brick tubs and 5+ starter kits up to 16+ and 18+ collector display models.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Tracked courier delivery takes 1–3 business days nationwide across North and South Islands, and shipping is free on all orders over NZ$100.',
  },
  {
    q: 'Are GST and duties included?',
    a: 'Yes. All stock is held in Auckland, NZD prices include 15% GST, and there are zero overseas import fees or customs delays.',
  },
];

export const TrustSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section id="authentication" className="border-t border-[#ECEAE4] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#9B6D16]">
            <Award className="h-4 w-4" />
            The KantoVault Promise
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#111318] sm:text-4xl">
            Built for Kiwi builders.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4B5563] sm:text-base">
            Whether you&apos;re picking up a weekend starter kit or a 2,600-piece centerpiece, every
            box ships locally from Auckland with clear pricing and zero guesswork.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8] p-6 transition-colors hover:border-[#C9922B]/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111318] text-[#E5B85B]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-[#111318]">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#4B5563]">{body}</p>
            </div>
          ))}
        </div>

        {/* FAQ + New Set Drops Alert */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl font-semibold text-[#111318]">
              Builder Questions
            </h3>
            <div className="mt-4 divide-y divide-[#ECEAE4] rounded-2xl border border-[#ECEAE4] bg-[#FAFAF8]">
              {FAQS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q} className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-[#111318]"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#6B7280] transition-transform ${
                          isOpen ? 'rotate-180 text-[#9B6D16]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs leading-relaxed text-[#4B5563]">{item.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drop Alert Card */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-3xl bg-[#111318] p-7 text-white shadow-lg">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9922B]/20 px-3 py-1 font-mono text-[11px] font-semibold text-[#E5B85B]">
                  <Mail className="h-3.5 w-3.5" />
                  NEW SET DROPS
                </span>
                <h3 className="mt-4 font-serif text-2xl font-semibold">
                  Be first to hear about new sets and restocks.
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#B9BEC9]">
                  Get Auckland restock updates when popular modular buildings, space models, and bulk
                  brick tubs arrive in stock.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="mt-6">
                {subscribed ? (
                  <div className="rounded-2xl border border-[#16A34A]/40 bg-[#16A34A]/15 px-4 py-3 text-xs font-medium text-[#86EFAC]">
                    You&apos;re on the KantoVault NZ update list. We&apos;ll email you when new sets
                    land in Auckland.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="builder@email.co.nz"
                      className="flex-1 rounded-full border border-[#2D323E] bg-[#1A1E27] px-4 py-3 text-xs text-white placeholder-[#7C8290] focus:border-[#C9922B] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#C9922B] px-5 py-3 text-xs font-bold text-[#111318] transition-colors hover:bg-[#DDA53B]"
                    >
                      Notify Me
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
