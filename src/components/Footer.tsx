import React from 'react';
import { AirconSinLogo } from './AirconSinLogo.tsx';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface FooterProps {
  onNavigateSection: (id: string) => void;
  onOpenQuoteModal: () => void;
  onOpenKakaoChat: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenQuoteModal,
  onOpenKakaoChat,
  onOpenLogin,
}) => {
  const { siteData } = useSiteData();
  const { company } = siteData;

  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-10 sm:pt-12 pb-14 sm:pb-16 text-gray-600">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-gray-100">
          
          {/* Column 1: Company Info */}
          <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
            {/* Logo */}
            <div className="flex items-center">
              <AirconSinLogo className="h-8 sm:h-10" />
            </div>

            {/* Address & Business registration */}
            <div className="text-[12px] sm:text-[13px] text-gray-500 space-y-1.5 leading-relaxed">
              <p className="font-medium text-gray-700">{company.address}</p>
              <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 pt-1 text-[11px] sm:text-xs text-gray-500">
                <span>대표이사 : <strong>{company.ceo}</strong></span>
                <span className="text-gray-300">|</span>
                <span>사업자등록번호 : <strong>{company.businessNumber}</strong></span>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-[#0070d2]">
                  상담번호 : <a href={`tel:${company.phone}`} className="hover:underline">{company.phone}</a>
                </span>
              </div>
              {company.consultationHours && (
                <p className="text-[11px] text-gray-400 pt-0.5">{company.consultationHours}</p>
              )}
            </div>
          </div>

          {/* Column 2: 채널 */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              채널
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>
                <a
                  href="https://blog.naver.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0070d2] transition-colors inline-block py-0.5"
                >
                  공식 블로그
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0070d2] transition-colors inline-block py-0.5"
                >
                  공식 유튜브 채널
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenKakaoChat}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer inline-block py-0.5"
                >
                  카카오 채널
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: 문의 바로가기 */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              문의 바로가기
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>
                <a
                  href={`tel:${company.phone}`}
                  className="hover:text-[#0070d2] transition-colors font-medium text-gray-700 inline-block py-0.5"
                >
                  전화 문의 ({company.phone})
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenKakaoChat}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer inline-block py-0.5"
                >
                  카카오톡 문의하기
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuoteModal}
                  className="hover:text-[#0070d2] transition-colors text-left text-[#0070d2] font-semibold cursor-pointer inline-block py-0.5"
                >
                  간편 견적 산출
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: 페이지 바로가기 */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
              페이지 바로가기
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>
                <button
                  onClick={() => onNavigateSection('brand-story')}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer inline-block py-0.5"
                >
                  브랜드 스토리
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('credentials')}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer inline-block py-0.5"
                >
                  시공자격증
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('portfolio')}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer inline-block py-0.5"
                >
                  시공사례
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('reviews')}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer text-[#0070d2] font-medium inline-block py-0.5"
                >
                  설치후기
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('after-service')}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer text-[#0070d2] font-medium inline-block py-0.5"
                >
                  사후관리 (A/S)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contact')}
                  className="hover:text-[#0070d2] transition-colors text-left cursor-pointer inline-block py-0.5"
                >
                  문의 하기
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & '로그인' Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2 sm:gap-0 text-center sm:text-left">
          <p>{company.copyright || `© 2025 ${company.brandName}. All rights reserved.`}</p>
          <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0 text-[11px]">
            <a href="#" className="hover:underline">이용약관</a>
            <span className="text-gray-300">·</span>
            <a href="#" className="hover:underline font-semibold text-gray-500">개인정보처리방침</a>
            <span className="text-gray-300">·</span>
            {/* Password protected Login Button as requested */}
            <button
              onClick={onOpenLogin}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer font-medium p-1"
            >
              로그인
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
