import React from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface FloatingKakaoProps {
  onOpenQuoteModal: () => void;
}

export const FloatingKakao: React.FC<FloatingKakaoProps> = () => {
  const { siteData } = useSiteData();
  const kakaoUrl = siteData.settings.kakaoChannelUrl || 'https://pf.kakao.com';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKakaoClick = () => {
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-3.5 sm:right-5 z-40 flex flex-col items-end gap-2.5 sm:gap-3 select-none">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="상단으로 이동"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md hover:shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 active:scale-90"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* KakaoTalk Floating Button - Direct New Window Link */}
      <div className="relative group">
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오톡 1:1 상담 (새 창 열림)"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FEE500] hover:bg-[#fedb00] active:scale-95 text-[#371D1E] shadow-xl hover:shadow-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer relative"
        >
          {/* Authentic KakaoTalk Bubble Icon */}
          <div className="relative flex flex-col items-center justify-center -space-y-0.5">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#371D1E]"
            >
              <path d="M12 3C6.48 3 2 6.48 2 10.77c0 2.76 1.83 5.18 4.62 6.54l-1.18 4.38c-.1.38.32.7.67.5l5.22-3.46c.22.02.44.04.67.04 5.52 0 10-3.48 10-7.77S17.52 3 12 3z" />
            </svg>
            <span className="text-[9px] sm:text-[10px] font-black tracking-tight text-[#371D1E] leading-none pt-0.5">
              TALK
            </span>
          </div>

          {/* Pulse notification dot */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </a>

        {/* Hover Tooltip showing external link info */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900/95 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:flex items-center gap-1.5 shadow-lg">
          <span>카카오톡 1:1 상담 바로가기</span>
          <ExternalLink className="w-3 h-3 text-yellow-300" />
        </div>
      </div>
    </div>
  );
};
