import React from 'react';
import { Home, Building2, Lightbulb, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface GrowthTrustSectionProps {
  onSelectCategory?: (category: string) => void;
}

const ICONS = [Home, Building2, Lightbulb];

export const GrowthTrustSection: React.FC<GrowthTrustSectionProps> = ({ onSelectCategory }) => {
  const { siteData } = useSiteData();
  const growthTrust = siteData.growthTrust;
  const cards = growthTrust?.cards || [];

  return (
    <section id="brand-story" className="w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-left">
          <span className="text-xs sm:text-sm font-bold text-[#0070d2] tracking-wide">
            {growthTrust?.kicker || '업계에서 가장 소개가 많은 회사'}
          </span>
          <h2 className="text-xl sm:text-3xl md:text-[32px] font-bold text-gray-900 mt-1.5 sm:mt-2 tracking-tight break-keep">
            {growthTrust?.title || '본사는 고객의 신뢰와 함께 성장했습니다.'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-2.5 font-normal leading-relaxed break-keep">
            {growthTrust?.description || '믿고 맡겨주신 고객께서 만족하고 소개해주시며 고객과 함께 성장하는 것이 에어컨신의 자랑입니다.'}
          </p>
        </div>

        {/* Service Feature Cards */}
        <div className={`grid grid-cols-1 ${cards.length === 1 ? 'max-w-lg mx-auto' : cards.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'} gap-4 sm:gap-5 lg:gap-6`}>
          {cards.map((card, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={card.id || idx}
                onClick={() => onSelectCategory && onSelectCategory(card.category || 'residential')}
                className="group relative bg-[#f0f7fd] hover:bg-[#e4f0fb] rounded-2xl p-5 sm:p-7 transition-all duration-300 border border-[#d2e5f8]/70 hover:border-[#aed4f5] hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Icon & Optional Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/95 shadow-xs flex items-center justify-center text-[#0070d2] group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                    </div>
                    {card.badge && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#0070d2] border border-blue-200/80 shadow-2xs">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-4 sm:mt-5 tracking-tight group-hover:text-[#0070d2] transition-colors break-keep">
                    {card.title}
                  </h3>

                  {/* Card Subtext */}
                  <p className="text-xs sm:text-[13px] text-gray-500 mt-2 font-medium leading-relaxed break-keep">
                    {card.description}
                  </p>

                  {/* Card Feature Bullets */}
                  {card.features && card.features.length > 0 && (
                    <div className="mt-3.5 space-y-1 pt-2.5 border-t border-blue-100/60">
                      {card.features.map((ft, fIdx) => (
                        <div key={fIdx} className="text-[11px] sm:text-xs text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0070d2] shrink-0" />
                          <span className="truncate">{ft}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Action Indicator */}
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-blue-100/70 flex items-center justify-between text-xs text-[#0070d2] font-semibold opacity-90 group-hover:opacity-100">
                  <span>{card.actionText || '자세히 보기 & 견적 알아보기'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
