import React, { useState } from 'react';
import { Star, MapPin, Calendar, CheckCircle2, ChevronRight, X, MessageSquareQuote } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';
import { ReviewItem } from '../types/siteData.ts';

interface ReviewSectionProps {
  onOpenReviewDetail?: (review: ReviewItem) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = () => {
  const { siteData } = useSiteData();
  const reviews = siteData.reviews;
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  return (
    <section id="reviews" className="w-full bg-[#f8fbfe] py-20 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0070d2] text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-[#0070d2]" />
              <span>실제 고객 100% 리얼 설치후기</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-gray-900 tracking-tight">
              고객님이 직접 검증한 에어컨신 시공 후기
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-normal">
              거품 없는 정직한 견적과 정밀한 시공으로 보답하는 에어컨신의 생생한 시공 현장입니다.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-2xs text-xs">
            <span className="text-gray-500">평균 만족도</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-extrabold text-gray-900 ml-1">5.0 / 5.0</span>
          </div>
        </div>

        {/* 6 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              onClick={() => setSelectedReview(rev)}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-[#0070d2] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer transform hover:-translate-y-1"
            >
              {/* Photo Area with Tag */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={rev.imageUrl}
                  alt={rev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to placeholder if broken
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>시공완료</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {rev.date}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Stars & Location */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-600">{rev.customerName}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#0070d2] transition-colors line-clamp-1">
                    {rev.title}
                  </h3>

                  {/* Installed Model */}
                  <p className="text-xs font-semibold text-[#0070d2] mt-1 bg-blue-50/70 inline-block px-2 py-0.5 rounded">
                    {rev.product}
                  </p>

                  {/* Content Preview */}
                  <p className="text-xs text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                    &ldquo;{rev.content}&rdquo;
                  </p>
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="truncate max-w-[170px]">{rev.location}</span>
                  </span>
                  <span className="text-[#0070d2] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    상세보기 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={selectedReview.imageUrl}
                alt={selectedReview.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                {selectedReview.product}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-gray-900 font-bold ml-2 text-sm">5.0점</span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {selectedReview.date}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedReview.title}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedReview.location}</span>
                  <span className="text-gray-300">·</span>
                  <span className="font-semibold text-gray-700">{selectedReview.customerName}</span>
                </p>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <MessageSquareQuote className="w-6 h-6 text-[#0070d2] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {selectedReview.content}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 space-y-1.5 border border-gray-200">
                <p>• <strong>시공 책임:</strong> 에어컨신 (airconSIN) 본사 직영 시공팀</p>
                <p>• <strong>배관 사양:</strong> 100% 정품 동배관 규격 및 고밀도 보온재 적용</p>
                <p>• <strong>무상 보증:</strong> 시공 하자 100% 무상 책임 사후관리(A/S)</p>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="w-full py-3 bg-[#0070d2] text-white rounded-xl text-xs font-bold hover:bg-[#005fb8] transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
