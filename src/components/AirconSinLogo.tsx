import React from 'react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface AirconSinLogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // light: for white/light bg; dark: for dark header/footer
  showText?: boolean;
}

export const AirconSinLogo: React.FC<AirconSinLogoProps> = ({
  className = 'h-9',
  variant = 'light',
  showText = true,
}) => {
  const { siteData } = useSiteData();
  const customLogo = siteData?.settings?.customLogoUrl;
  const isDark = variant === 'dark';

  // If a custom logo image has been uploaded by the admin, display it!
  if (customLogo) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={customLogo}
          alt={siteData.company.brandName}
          className="h-full w-auto max-h-12 object-contain"
        />
      </div>
    );
  }

  // Default Crisp Vector SVG matching 가로logo.png
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 460 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-full"
      >
        <defs>
          <linearGradient id="badgeBlue" x1="20" y1="20" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0079db" />
            <stop offset="1" stopColor="#005fb8" />
          </linearGradient>

          <path id="textArc" d="M 32,82 A 44,44 0 0,0 98,82" fill="none" />
        </defs>

        {/* --- LEFT CIRCULAR EMBLEM --- */}
        <g id="emblem" transform="translate(10, 0)">
          <circle cx="60" cy="60" r="52" fill="url(#badgeBlue)" />
          <circle cx="60" cy="60" r="50" stroke="#ffffff" strokeWidth="2.5" />

          {/* Air Conditioner Indoor Unit */}
          <g transform="translate(24, 25)">
            <path
              d="M 12 10 L 62 18 L 58 42 L 8 34 Z"
              fill="#ffffff"
              stroke="#0b3b6f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 12 10 C 6 12 4 22 8 34 L 12 34 Z"
              fill="#ffffff"
              stroke="#0b3b6f"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M 12 10 L 62 18 L 60 21 L 10 13 Z"
              fill="#e2effa"
              stroke="#0b3b6f"
              strokeWidth="1.5"
            />
            <path
              d="M 10 32 L 56 40 L 55 43 L 9 35 Z"
              fill="#0b3b6f"
            />
            <line x1="42" y1="31" x2="52" y2="33" stroke="#0b3b6f" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Dynamic Cool Breeze Wave Ribbons */}
          <path
            d="M 28 62 C 45 60, 60 70, 85 58 C 75 72, 50 68, 28 65 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          <path
            d="M 24 70 C 42 66, 62 76, 92 68 C 80 80, 52 76, 24 74 Z"
            fill="#ffffff"
            opacity="0.9"
          />
          <path
            d="M 28 77 C 46 74, 62 82, 88 78 C 76 86, 50 83, 28 80 Z"
            fill="#80c2f8"
            opacity="0.75"
          />

          <text
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="800"
            fontFamily="'Pretendard', 'Arial Black', sans-serif"
            letterSpacing="0.8"
          >
            <textPath href="#textArc" startOffset="50%" textAnchor="middle">
              airconSIN
            </textPath>
          </text>
        </g>

        {/* --- RIGHT BRAND WORDMARK: "에어컨신" --- */}
        {showText && (
          <g
            id="brandText"
            transform="translate(136, 0) skewX(-7)"
            fontFamily="'Pretendard', 'Noto Sans KR', sans-serif"
            fontWeight="900"
          >
            <text
              x="0"
              y="78"
              fontSize="68"
              fill={isDark ? '#ffffff' : '#2d2d2d'}
              letterSpacing="-2.5"
              style={{ fontFeatureSettings: '"palt"' }}
            >
              에어컨
            </text>

            <text
              x="198"
              y="78"
              fontSize="70"
              fill="#006ec7"
              letterSpacing="-2.5"
              style={{ fontFeatureSettings: '"palt"' }}
            >
              신
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
