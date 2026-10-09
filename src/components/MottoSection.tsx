import React from 'react';
import { Play } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

// Helper to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // Matches youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Matches youtube.com/embed/<id>
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // Matches youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Fallback regex
  const anyMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  return anyMatch ? anyMatch[1] : '';
}

export const MottoSection: React.FC = () => {
  const { siteData } = useSiteData();
  const motto = siteData.mottoSection || {
    dashMotif: '----',
    title: '정직한 시공으로 오로지 고객을 남기겠습니다.',
    subtitle: '믿고 맡기는 에어컨설치 — 우리가족이 사는 집처럼, 내 가게처럼 생각하며 정성을 다하여 시공하겠습니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  };

  const videoId = getYouTubeVideoId(motto.youtubeUrl);
  // YouTube embed params:
  // autoplay=1 (자동 실행)
  // mute=1 (무음 기본 - 브라우저 정책상 자동재생을 위해 mute 필수)
  // playsinline=1 (모바일 인라인 재생)
  // loop=1&playlist=${videoId} (반복 재생)
  // rel=0&modestbranding=1
  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=1&rel=0&modestbranding=1`
    : '';

  return (
    <section className="w-full bg-white py-14 border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left / Top Text Block */}
          <div className="lg:col-span-6 text-left space-y-4">
            {/* Subtle blue dash motif */}
            <div className="flex items-center gap-1 text-[#0070d2] tracking-widest text-lg font-bold">
              <span>{motto.dashMotif || '----'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 tracking-tight leading-snug">
              {motto.title}
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
              {motto.subtitle}
            </p>
          </div>

          {/* Right / Bottom Video Player Block */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-16/9 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-950 group">
              {videoId ? (
                <iframe
                  className="w-full h-full object-cover"
                  src={embedSrc}
                  title="에어컨신 시공 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white">
                  <Play className="w-12 h-12 text-[#0070d2] mb-3 opacity-80" />
                  <p className="text-sm font-bold">등록된 유튜브 영상이 없습니다</p>
                  <p className="text-xs text-gray-400 mt-1">관리자 페이지에서 유튜브 주소를 등록해 주세요.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
