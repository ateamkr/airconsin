import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface StatsBarProps {
  onOpenKakaoChat?: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = () => {
  const { siteData } = useSiteData();
  const stats = siteData.stats;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white pt-3 pb-10 sm:pb-14 border-b border-gray-100 select-none"
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-8 divide-y-0 md:divide-x divide-gray-100 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center px-2 sm:px-4">
              <div className="flex items-baseline justify-center">
                <CountUpNumber
                  target={stat.value}
                  duration={1800}
                  startAnimation={isVisible}
                />
                <span className="text-lg sm:text-2xl font-bold text-[#0070d2] ml-0.5">
                  {stat.unit}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-gray-800 font-bold mt-1 break-keep">
                {stat.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-normal mt-0.5 break-keep">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Count-Up Animation Component
const CountUpNumber: React.FC<{
  target: number;
  duration?: number;
  startAnimation: boolean;
}> = ({ target, duration = 1800, startAnimation }) => {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(easeOut * target);

      setCurrentVal(value);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, startAnimation]);

  // Formatter: if value >= 1000 and target has 'K' format
  const displayVal = target >= 1000 ? `${(currentVal / 1000).toFixed(currentVal >= 1000 ? 0 : 1)}K` : currentVal.toLocaleString();

  return (
    <span className="text-2xl xs:text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-[#0070d2] font-sans tabular-nums">
      {displayVal}
    </span>
  );
};
