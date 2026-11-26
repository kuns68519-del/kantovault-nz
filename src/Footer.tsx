import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import { Era } from './types';
import { ERAS } from './products';

interface FooterProps {
  onSelectEra: (era: Era) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectEra }) => {
  return (
    <footer className="border-t border-[#ECEAE4] bg-[#111318] text-[#D1D5DB]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2D323E] bg-[#191C24]">
                <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                  <circle cx="32" cy="32" r="20" fill="none" stroke="#C9922B" strokeWidth="3.5" />
                  <path
                    d="M12 32h13a7 7 0 0 0 14 0h13"
                    fill="none"
                    stroke="#C9922B"
                    strokeWidth="3.5"
                  />
                  <circle cx="32" cy="32" r="5" fill="#C9922B" />
                </svg>
              </div>
              <span className="font-serif text-lg font-semibold text-white">KantoVault NZ</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#9CA3AF]">
              Aotearoa&apos;s online store for building-block sets — starter kits, vehicles,
              architecture and collector display models.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#E5B85B]">
              <MapPin className="h-3.5 w-3.5" />
              <span>Auckland Studio • Ships Nationwide Across NZ</span>
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Browse Collections
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {ERAS.map((era) => (
                <li key={era}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEra(era);
                      document.getElementById('vault-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                  >
                    {era}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Assurance */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              NZ Checkout
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Visa / Mastercard', 'NZ Bank / POLi', 'Afterpay NZD', 'Tracked NZ Courier'].map(
                (pill) => (
                  <span
                    key={pill}
                    className="rounded-lg border border-[#2A2F3B] bg-[#181B23] px-2.5 py-1 text-[11px] font-medium text-[#D1D5DB]"
                  >
                    {pill}
                  </span>
                )
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#9CA3AF]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#C9922B]" />
              <span>All prices in New Zealand Dollars (NZD) inclusive of 15% GST.</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#222630] pt-6 text-[11px] text-[#6B7280] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} KantoVault NZ. All rights reserved.</p>
          <p>Independent New Zealand toy retailer.</p>
        </div>
      </div>
    </footer>
  );
};
