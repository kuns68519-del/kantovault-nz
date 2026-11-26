import React, { useState } from 'react';
import { Award, ChevronDown, Lock, Mail, RefreshCw, ShieldCheck, Truck } from 'lucide-react';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Multi-Point Factory Seal Inspection',
    body: 'Every WOTC cellophane tear-strip, foil crimp, and shrink-wrap seam is inspected under stereo magnification in Auckland before listing.',
  },
  {
    icon: Lock,
    title: 'Climate-Controlled Auckland Vault',
    body: 'Stored at stable 45% humidity away from UV light, with rigid acrylic box/pack protectors included on high-tier grails.',
  },
  {
    icon: Truck,
    title: 'Insured Overnight NZ Courier',
    body: 'Double-boxed, bubble-cradled dispatch via NZ Post Express & PBT Signature Courier across North & South Islands—no customs delays.',
  },
  {
    icon: RefreshCw,
    title: 'Local NZ Collector Buyback',
    body: 'Looking to trade or upgrade your sealed collection? We offer transparent NZD buyback quotes for authenticated vintage sealed boxes.',
  },
];

const FAQS = [
  {
    q: 'Are all vintage packs and boxes guaranteed unweighed and factory sealed?',
    a: 'Yes. Loose vintage packs come from verified box-breaks or tamper-evident retail blisters, and every boxed product is inspected for intact factory cellophane, seams, and zero reseal glue residue.',
  },
  {
    q: 'Why is the vault capped at NZ$1,600 per item?',
    a: 'We specialize in high-demand investment-grade vintage sealed pieces that Kiwi collectors can realistically acquire without five-figure auction premiums—every single item sits at or below NZ$1,600.',
  },
  {
    q: 'Are GST and import duties already included?',
    a: 'Yes! Every item is already housed inside New Zealand. Prices are listed in NZD inclusive of 15% GST, with zero surprise overseas customs fees.',
  },
  {
    q: 'How fast is shipping to Wellington, Christchurch, or regional NZ?',
    a: 'Orders placed before 2:00 PM NZT ship same-day from Auckland on overnight signature-required courier (1–2 business days nationwide; free over NZ$500).',
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
            The KantoVault Standard
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#111318] sm:text-4xl">
            Built on collector trust across Aotearoa.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4B5563] sm:text-base">
            Buying 1999–2021 sealed Pokémon product requires certainty. Every piece in our catalog
            is stocked locally in Auckland and backed by our 100% authenticity guarantee.
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

        {/* FAQ + Collector Drop Alert */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl font-semibold text-[#111318]">
              Collector Questions
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
                  NZ VAULT DROPS
                </span>
                <h3 className="mt-4 font-serif text-2xl font-semibold">
                  Get early access to new vintage arrivals.
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#B9BEC9]">
                  Receive weekly Auckland Vault restock alerts when 1st Edition WOTC decks, EX tins,
                  and XY Evolutions boxes under NZ$1,600 clear authentication.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="mt-6">
                {subscribed ? (
                  <div className="rounded-2xl border border-[#16A34A]/40 bg-[#16A34A]/15 px-4 py-3 text-xs font-medium text-[#86EFAC]">
                    You&apos;re on the KantoVault NZ early-access list. Watch your inbox every
                    Thursday at 7:00 PM NZT.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="collector@email.co.nz"
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
