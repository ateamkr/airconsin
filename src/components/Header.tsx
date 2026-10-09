import React, { useState } from 'react';
import { Menu, X, PhoneCall, Calculator, Award, Star, ShieldCheck, Wrench, Send, BookOpen } from 'lucide-react';
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

  // Helper to map icons for navigation items
  const getNavIcon = (item: { label: string; target: string; type: string }) => {
    if (item.type === 'modal' || item.label.includes('견적')) return Calculator;
    if (item.target.includes('story') || item.label.includes('스토리')) return BookOpen;
    if (item.target.includes('cred') || item.label.includes('자격')) return Award;
    if (item.target.includes('port') || item.label.includes('사례')) return ShieldCheck;
    if (item.target.includes('rev') || item.label.includes('후기')) return Star;
    if (item.target.includes('after') || item.label.includes('사후') || item.label.includes('A/S')) return Wrench;
    if (item.target.includes('contact') || item.label.includes('문의')) return Send;
    return BookOpen;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Main Top Header Bar */}
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 h-[64px] sm:h-[74px] flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center group cursor-pointer shrink-0"
          aria-label="에어컨신 홈으로 이동"
        >
          <AirconSinLogo className="h-8 sm:h-10 transition-transform duration-200 group-hover:scale-[1.02]" />
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

        {/* Right CTA Actions: Visible on BOTH Desktop and Mobile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Phone Call Button (Always visible on mobile & desktop) */}
          <a
            href={`tel:${siteData.company.phone}`}
            className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-800 bg-blue-50 hover:bg-blue-100 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-200/80 transition-all shadow-2xs group shrink-0"
            aria-label={`전화 상담 연결 ${siteData.company.phone}`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0070d2] group-hover:animate-bounce" />
            <span className="hidden xs:inline tracking-wide">{siteData.company.phone}</span>
            <span className="xs:hidden tracking-tight font-extrabold text-[#0070d2]">전화상담</span>
          </a>

          {/* Quick Quote modal shortcut button on mobile header */}
          <button
            onClick={onOpenQuoteModal}
            className="xl:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0070d2] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
            aria-label="간편 견적 산출"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden min-[400px]:inline">견적</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-700 hover:text-gray-900 rounded-lg focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Quick Navigation Bar (Dynamically reflects admin-configured navMenu) */}
      <div className="xl:hidden border-t border-gray-100 bg-slate-50/70 overflow-x-auto no-scrollbar py-2 px-3 flex items-center gap-1.5 scroll-smooth">
        {navLinks.map((item) => {
          const Icon = getNavIcon(item);
          if (item.type === 'modal') {
            return (
              <button
                key={item.id}
                onClick={onOpenQuoteModal}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100/70 text-[#0070d2] font-bold text-[11px] border border-blue-200 hover:bg-blue-200/60 transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
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
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-gray-700 font-medium text-[11px] border border-gray-200 hover:border-[#0070d2] hover:text-[#0070d2] transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <Icon className="w-3 h-3 text-gray-500" />
                <span>{item.label}</span>
              </a>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => onNavigateSection(item.target)}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-gray-700 font-medium text-[11px] border border-gray-200 hover:border-[#0070d2] hover:text-[#0070d2] transition-colors whitespace-nowrap active:scale-95 cursor-pointer"
            >
              <Icon className="w-3 h-3 text-gray-500" />
              <span>{item.label}</span>
            </button>
          );
        })}
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
                  className="w-full text-left py-2.5 text-sm font-semibold text-[#0070d2] flex items-center justify-between border-b border-gray-100 cursor-pointer"
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
                  className="block py-2.5 text-sm font-medium text-gray-700 hover:text-[#0070d2] border-b border-gray-100"
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
                className="w-full text-left py-2.5 text-sm font-medium text-gray-700 hover:text-[#0070d2] border-b border-gray-100 cursor-pointer"
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3">
            <a
              href={`tel:${siteData.company.phone}`}
              className="flex items-center justify-center gap-2 w-full bg-[#0070d2] hover:bg-[#005fb8] text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>전화 상담 바로 연결 ({siteData.company.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
