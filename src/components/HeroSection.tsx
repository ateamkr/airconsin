import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onOpenQuoteModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuoteModal }) => {
  const { siteData } = useSiteData();
  const slides = siteData.heroSlides;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [textKey, setTextKey] = useState(0);

  // Auto-play timer for rolling slides (5 seconds)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      setTextKey((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTextKey((prev) => prev + 1);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setTextKey((prev) => prev + 1);
  };

  const handleGoToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setTextKey((prev) => prev + 1);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0d161d] text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Visual Background Slides Container */}
      <div className="relative w-full min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex items-center justify-center">
        
        {/* Render all slides for smooth crossfade transitions */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide.imageUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                >
                  {/* Gentle gradient overlay: keeps image clearly visible while ensuring text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/40" />
                </div>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${
                    slide.bgGradient || 'from-[#0d161d] via-[#1a2530] to-[#0c141a]'
                  }`}
                />
              )}
            </div>
          );
        })}

        {/* Main Central Hero Content with Text Action */}
        <div className="relative z-20 max-w-[1100px] mx-auto px-6 pt-16 pb-24 md:py-24 w-full flex flex-col items-center text-center">
          
          {/* Badge (Text only, no icons) */}
          <div
            key={`badge-${textKey}`}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0070d2]/90 border border-blue-400/40 text-white text-xs sm:text-sm font-bold mb-4 backdrop-blur-md shadow-sm transition-all duration-700"
          >
            <span>{currentSlide.badge}</span>
          </div>

          {/* Animated Main Headline */}
          <h1
            key={`title-${textKey}`}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-white mb-4 drop-shadow-md leading-tight transition-all duration-700"
            style={{
              animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {currentSlide.title}
          </h1>

          {/* Animated Subtitle */}
          <p
            key={`sub-${textKey}`}
            className="text-sm sm:text-base md:text-lg text-slate-100 font-medium mb-8 max-w-2xl transition-all duration-700 drop-shadow-sm leading-relaxed"
            style={{
              animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {currentSlide.subtitle}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenQuoteModal) {
                  onOpenQuoteModal();
                } else {
                  const contactEl = document.getElementById('contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 rounded-full bg-[#0070d2] hover:bg-[#005fb8] active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
            >
              무료 견적 상담 신청하기
            </button>
            <button
              type="button"
              onClick={() => {
                const portfolioEl = document.getElementById('portfolio');
                if (portfolioEl) portfolioEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/30 transition-all cursor-pointer"
            >
              시공사례 둘러보기
            </button>
          </div>

          {/* Slide Navigation Controls & Indicators */}
          <div className="mt-8 flex items-center gap-4">
            {/* Prev Button */}
            <button
              onClick={handlePrevSlide}
              aria-label="이전 슬라이드"
              className="p-2 rounded-full bg-black/40 hover:bg-black/65 text-white transition-all cursor-pointer backdrop-blur-sm border border-white/20 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id || idx}
                    onClick={() => handleGoToSlide(idx)}
                    aria-label={`슬라이드 ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-8 bg-[#0070d2]'
                        : 'w-2.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextSlide}
              aria-label="다음 슬라이드"
              className="p-2 rounded-full bg-black/40 hover:bg-black/65 text-white transition-all cursor-pointer backdrop-blur-sm border border-white/20 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Curved Swoop Mask */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1440 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative block w-full h-[45px] sm:h-[65px] md:h-[85px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,85 C240,85 360,20 720,20 C1080,20 1200,85 1440,85 L1440,85 L0,85 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
