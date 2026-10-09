import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface AfterServiceSectionProps {
  onOpenConsultationModal: () => void;
}

export const AfterServiceSection: React.FC<AfterServiceSectionProps> = ({
  onOpenConsultationModal,
}) => {
  const { siteData } = useSiteData();
  const data = siteData.afterService;

  return (
    <section id="after-service" className="w-full bg-white py-12 sm:py-16 md:py-20 border-t border-gray-100 scroll-mt-20">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-xs sm:text-sm font-bold text-[#0070d2]">
            {data.kicker}
          </p>
          <h2 className="text-xl sm:text-3xl md:text-[34px] font-bold text-gray-900 mt-1.5 sm:mt-2 tracking-tight break-keep">
            {data.title}
          </h2>
        </div>

        {/* 3 Columns Layout: Left Steps, Center Technician Photo, Right Explanatory Text + Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Reliable Steps */}
          <div className="lg:col-span-4 text-left">
            <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              RELIABLE AFTER SERVICE SUPPORT
            </span>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mt-1 mb-5 sm:mb-6 break-keep">
              {data.subtitle}
            </h3>

            <div className="space-y-4 sm:space-y-5">
              {data.steps.map((step) => (
                <div key={step.number} className="flex items-start gap-3 sm:gap-3.5 group">
                  <div className="w-6 h-6 rounded-full bg-[#0070d2] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-gray-800 leading-snug group-hover:text-[#0070d2] transition-colors break-keep">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed break-keep">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column: Professional HVAC Technician Photo / Uploaded Custom Image */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center my-2 lg:my-0">
            <div className="relative w-full max-w-[240px] sm:max-w-[300px] aspect-3/4 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
              {data.centerImageUrl ? (
                // Only show attached/uploaded image without overlays, badge text or obscuring effects
                <img
                  src={data.centerImageUrl}
                  alt="에어컨신 사후관리 현장"
                  className="w-full h-full object-cover"
                />
              ) : (
                // Fallback realistic HVAC service photo (no overlay text or cartoon character)
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                  alt="에어컨신 사후관리 현장"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Right Column: Explanatory Text & Free Consultation Button */}
          <div className="lg:col-span-4 text-left flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal break-keep">
              {data.description}
            </p>

            <div className="mt-6 sm:mt-8">
              <button
                type="button"
                onClick={onOpenConsultationModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#0070d2] text-[#0070d2] hover:bg-[#0070d2] hover:text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 group cursor-pointer shadow-xs active:scale-95"
              >
                <span>무료상담 신청하기</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
