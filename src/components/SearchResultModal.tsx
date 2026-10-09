import React from 'react';
import { X, MapPin, CheckCircle, ArrowRight, Building } from 'lucide-react';

interface CaseStudy {
  id: string;
  name: string;
  region: string;
  type: string;
  units: string;
  brand: string;
  date: string;
  priceRange: string;
  note: string;
}

interface SearchResultModalProps {
  query: string;
  onClose: () => void;
  onSelectEstimate: (caseStudy: CaseStudy) => void;
}

const mockDatabase: CaseStudy[] = [
  {
    id: '1',
    name: '다산신도시 자연앤자이',
    region: '경기 남양주시 다산동',
    type: '주거용 아파트 (신축 입주)',
    units: '4대 (거실18평 + 안방6평 + 침실1 5평 + 침실2 5평)',
    brand: 'LG 휘센 MULTI V 프리미엄 1-WAY',
    date: '2024.11 시공완료',
    priceRange: '480만원 ~ 530만원 (배관 및 실외기 일체 포함)',
    note: '남양주 본사 직영 당일 책임 시공, 규격 감리 필증 발급 완료',
  },
  {
    id: '2',
    name: '별내 아이파크 2차',
    region: '경기 남양주시 별내동',
    type: '주거용 아파트 (거주 중 시공)',
    units: '3대 (거실 + 안방 + 서재)',
    brand: '삼성 무풍 시스템에어컨 SAC 1-WAY',
    date: '2024.10 시공완료',
    priceRange: '420만원 ~ 470만원',
    note: '살고 계신 집 100% 먼지 방지 완벽 비닐 보양 후 원데이 시공',
  },
  {
    id: '3',
    name: '진건 현대아파트',
    region: '경기 남양주시 진건읍',
    type: '구축 아파트 (노후 시스템 교체)',
    units: '3대 (올교체)',
    brand: 'LG 휘센 인버터 고효율 1등급',
    date: '2024.12 시공완료',
    priceRange: '390만원 ~ 440만원',
    note: '기존 노후 10년 차 장비 철거 및 질소 브로잉 배관 세척 후 신규 교체',
  },
  {
    id: '4',
    name: '반포 자이 아파트',
    region: '서울 서초구 반포동',
    type: '주거용 아파트 (단내림 인테리어 공사)',
    units: '4대 (무풍 1-WAY)',
    brand: '삼성 무풍 시스템 SAC',
    date: '2024.09 시공완료',
    priceRange: '510만원 ~ 560만원',
    note: '인테리어 목공 팀과 단내림 및 간접 조명 박스 정밀 협업 시공',
  },
  {
    id: '5',
    name: '래미안 대치팰리스',
    region: '서울 강남구 대치동',
    type: '주거용 아파트',
    units: '4대 (1등급 다배관)',
    brand: 'LG 휘센 시스템에어컨 올인원',
    date: '2024.08 시공완료',
    priceRange: '530만원 ~ 580만원',
    note: '거주 중 보양 작업 100% 철저 진행, 원데이(1일) 완공',
  },
  {
    id: '6',
    name: '구리 갈매역 아이파크',
    region: '경기 구리시 갈매동',
    type: '신축 아파트 공동구매 단지',
    units: '4대 기준 공동구매 특가',
    brand: 'LG / 삼성 선택형',
    date: '2024.11 공동구매 진행',
    priceRange: '450만원 ~ 490만원 (공동구매 특별 프로모션가)',
    note: '입주자협의회 공식 추천 에어컨신 직영 특가 적용',
  },
];

export const SearchResultModal: React.FC<SearchResultModalProps> = ({
  query,
  onClose,
  onSelectEstimate,
}) => {
  const filtered = mockDatabase.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.region.toLowerCase().includes(query.toLowerCase()) ||
      item.brand.toLowerCase().includes(query.toLowerCase()) ||
      query === ''
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070d2]" />
              <h3 className="text-sm sm:text-lg font-bold text-gray-900">
                {query ? `"${query}" 검색 결과` : '전국 주요 시공사례 및 표준 견적'}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 break-keep">
              에어컨신(airconSIN)의 실측 기반 100% 정직한 실제 시공 데이터입니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-gray-500 space-y-3">
              <p className="text-sm font-semibold break-keep">
                검색하신 &apos;{query}&apos;에 대한 데이터가 아직 등록되지 않았습니다.
              </p>
              <p className="text-xs text-gray-400 break-keep">
                대한민국 전 지역 모든 아파트/건물 맞춤 무료 실측 견적이 가능합니다.
              </p>
              <button
                onClick={() => {
                  onClose();
                  const formElem = document.getElementById('contact');
                  if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-3 px-5 py-2.5 bg-[#0070d2] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                1:1 맞춤 무료 견적 요청하기
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-5 rounded-2xl border border-gray-200 hover:border-[#0070d2] hover:bg-[#f6faff] transition-all duration-200 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#0070d2] transition-colors break-keep">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{item.region}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-blue-600 font-medium">{item.type}</span>
                      </p>
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 shrink-0 bg-gray-100 px-2 py-0.5 rounded">
                      {item.date}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs bg-white p-2.5 sm:p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block text-[10.5px] sm:text-[11px]">설치 구성</span>
                      <span className="font-semibold text-gray-800 break-keep">{item.units}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10.5px] sm:text-[11px]">적용 모델</span>
                      <span className="font-semibold text-gray-800 break-keep">{item.brand}</span>
                    </div>
                    <div className="sm:col-span-2 pt-1 border-t border-gray-50">
                      <span className="text-gray-400 block text-[10.5px] sm:text-[11px]">실제 시공 견적가</span>
                      <span className="font-extrabold text-[#0070d2] text-xs sm:text-sm">
                        {item.priceRange}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5 break-keep">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{item.note}</span>
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-end">
                  <button
                    onClick={() => {
                      onSelectEstimate(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0070d2] group-hover:underline cursor-pointer"
                  >
                    <span>이 조건으로 빠른 상담 신청</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          모든 견적은 표준 기본배관(15m/대) 및 기본 단내림 기준이며, 현장 조건에 따라 무료 실측 후 정밀 견적서를 제공합니다.
        </div>
      </div>
    </div>
  );
};
