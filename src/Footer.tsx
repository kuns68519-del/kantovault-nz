import React from 'react';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Era } from './types';
import { ERAS } from './products';
import { STORE_CONFIG } from './storeConfig';

interface FooterProps {
  onNavigate: (path: string) => void;
  onSelectEra: (era: Era) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectEra }) => {
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="border-t border-[#ECEAE4] bg-[#111318] text-[#D1D5DB]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand & Verifiable Contact Column */}
          <div className="md:col-span-4">
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
              <span className="font-serif text-lg font-semibold text-white">
                {STORE_CONFIG.storeName}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#9CA3AF]">
              Aotearoa&apos;s online store for building-block sets — starter kits, vehicles,
              architecture and collector display models.
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-[#D1D5DB]">
              <div className="flex items-start gap-2 text-[#E5B85B]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  {STORE_CONFIG.address.street}, {STORE_CONFIG.address.city}{' '}
                  {STORE_CONFIG.address.postcode}, {STORE_CONFIG.address.country}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Phone className="h-3.5 w-3.5 shrink-0 text-[#C9922B]" />
                <a
                  href={`tel:${STORE_CONFIG.supportPhone.replace(/\s+/g, '')}`}
                  className="font-mono hover:text-white"
                >
                  {STORE_CONFIG.supportPhone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#C9922B]" />
                <a href={`mailto:${STORE_CONFIG.supportEmail}`} className="hover:text-white">
                  {STORE_CONFIG.supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Collections</h4>
            <ul className="mt-3 space-y-2 text-xs">
              {ERAS.map((era) => (
                <li key={era}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEra(era);
                      onNavigate('/');
                      window.setTimeout(() => {
                        document
                          .getElementById('vault-catalog')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }, 60);
                    }}
                    className="text-left text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                  >
                    {era}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Policies &amp; Support
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="/shipping-returns"
                  onClick={(e) => handleLinkClick(e, '/shipping-returns')}
                  className="text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                >
                  Shipping &amp; Returns Policy
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, '/privacy')}
                  className="text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, '/terms')}
                  className="text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                >
                  Contact Auckland Studio
                </a>
              </li>
              <li>
                <a
                  href="/merchant-feed.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] text-[#9CA3AF] transition-colors hover:text-[#E5B85B]"
                >
                  Google Merchant XML Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Assurance */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">NZ Checkout</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {['NZ Bank Transfer', 'GST Tax Invoice', 'Studio Pickup', 'Tracked NZ Courier'].map(
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
          <p>© {new Date().getFullYear()} {STORE_CONFIG.storeName}. All rights reserved.</p>
          <p>Independent New Zealand toy retailer.</p>
        </div>
      </div>
    </footer>
  );
};
