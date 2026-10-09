import React, { useState } from 'react';
import { Menu, X, PhoneCall, Calculator } from 'lucide-react';
import { AirconSinLogo } from './AirconSinLogo.tsx';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface HeaderProps {
  onOpenQuoteModal: () => void;
  onNavigateSection: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuoteModal,
  onNavigateSection,
}) => {
  const { siteData } = useSiteData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter enabled menu items from admin settings
  const navLinks = (siteData.navMenu || []).filter((item) => item.enabled);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[74px] flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center group cursor-pointer"
          aria-label="에어컨신 홈으로 이동"
        >
          <AirconSinLogo className="h-9 sm:h-10 transition-transform duration-200 group-hover:scale-[1.02]" />
        </a>

        {/* Dynamic Desktop Navigation Links from Admin */}
        <nav className="hidden xl:flex items-center gap-6 text-[14px] font-medium text-gray-700">
          {navLinks.map((item) => {
            if (item.type === 'modal') {
              return (
                <button
                  key={item.id}
                  onClick={onOpenQuoteModal}
                  className="text-gray-700 hover:text-[#0070d2] transition-colors py-1 cursor-pointer font-medium"
                >
                  {item.label}
                </button>
              );
            }
            if (item.type === 'external') {
              return (
                <a
                  key={item.id}
                  href={item.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#0070d2] transition-colors py-1 cursor-pointer font-medium"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => onNavigateSection(item.target)}
                className="text-gray-700 hover:text-[#0070d2] transition-colors py-1 cursor-pointer font-medium"
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Direct Phone Call CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${siteData.company.phone}`}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-800 bg-blue-50/70 hover:bg-blue-100/80 px-4 py-2 rounded-full border border-blue-200/80 transition-all shadow-2xs hover:shadow-xs group"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0070d2] group-hover:animate-bounce" />
            <span className="tracking-wide">{siteData.company.phone}</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex xl:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg focus:outline-none cursor-pointer"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-5 pt-3 pb-6 space-y-2.5 shadow-lg animate-fadeIn">
          {navLinks.map((item) => {
            if (item.type === 'modal') {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onOpenQuoteModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-semibold text-[#0070d2] flex items-center justify-between border-b border-gray-100 cursor-pointer"
                >
                  <span>{item.label}</span>
                  <Calculator className="w-4 h-4" />
                </button>
              );
            }
            if (item.type === 'external') {
              return (
                <a
                  key={item.id}
                  href={item.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-[#0070d2] border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateSection(item.target);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-medium text-gray-700 hover:text-[#0070d2] border-b border-gray-100 cursor-pointer"
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3">
            <a
              href={`tel:${siteData.company.phone}`}
              className="flex items-center justify-center gap-2 w-full bg-[#0070d2] hover:bg-[#005fb8] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>전화 상담 {siteData.company.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
