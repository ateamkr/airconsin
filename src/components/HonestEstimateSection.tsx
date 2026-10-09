import React from 'react';
import { useSiteData } from '../context/SiteDataContext.tsx';

export const HonestEstimateSection: React.FC = () => {
  const { siteData } = useSiteData();
  const honestEstimate = siteData.honestEstimate;
  const commitments = honestEstimate?.items || [];

  return (
    <section id="estimate" className="relative w-full bg-[#0070d2] text-white py-14 sm:py-20 md:py-28 overflow-hidden scroll-mt-20">
      {/* Top subtle curve transition */}
      <div className="absolute top-0 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block w-full h-[20px] sm:h-[25px] md:h-[40px]"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C360,35 1080,35 1440,0 L1440,0 L0,0 Z" fill="#ffffff" />
        </svg>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm text-blue-100 font-medium tracking-wide break-keep">
            {honestEstimate?.kicker || '믿고 맡기는 에어컨설치 — 세심한 품질 관리로 신뢰성을 제공합니다'}
          </p>
          <h2 className="text-xl sm:text-3xl md:text-[34px] font-bold text-white mt-1.5 sm:mt-2 tracking-tight break-keep">
            {honestEstimate?.title || '에어컨신의 정직한 견적 이렇게 만들어집니다'}
          </h2>
        </div>

        {/* 4 Cards List */}
        <div className="space-y-3 sm:space-y-4">
          {commitments.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl p-4 sm:p-6 md:py-5 md:px-7 shadow-md transition-all duration-300 hover:shadow-xl hover:translate-x-1 flex flex-col md:flex-row md:items-center justify-between text-gray-800 group"
            >
              <div className="flex items-start md:items-center gap-3 sm:gap-4">
                {/* Step Tag */}
                <span className="shrink-0 bg-slate-100 text-gray-500 font-bold text-xs sm:text-[13px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  {item.step}
                </span>

                {/* Content Text */}
                <p className="text-xs sm:text-sm md:text-[15px] font-medium text-gray-800 leading-snug break-keep">
                  {item.textBefore}
                  <span className="text-[#0070d2] font-extrabold mx-1">{item.highlight}</span>
                  {item.textAfter}
                </p>
              </div>

              {/* Verified badge */}
              <div className="mt-2.5 md:mt-0 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-blue-600 font-semibold self-end md:self-auto shrink-0 bg-blue-50 px-2.5 py-1 rounded-full">
                <span>신뢰 보증 원칙</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom subtle curve transition */}
      <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block w-full h-[20px] sm:h-[25px] md:h-[40px]"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,5 1080,5 1440,40 L1440,40 L0,40 Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
};
