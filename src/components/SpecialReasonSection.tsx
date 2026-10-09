import React, { useState } from 'react';
import { Award, CheckCircle2, ZoomIn } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

export const SpecialReasonSection: React.FC = () => {
  const { siteData } = useSiteData();
  const [selectedCert, setSelectedCert] = useState<number>(0);
  const [previewModal, setPreviewModal] = useState<string | null>(null);

  const ceoName = siteData?.company?.ceo || '문필주';
  const brandName = siteData?.company?.brandName || '에어컨신';

  const certList = [
    {
      title: 'SAC 및 SI VRF 시공 교육 수료증',
      issuer: '삼성전자 / LG전자 공인 인증',
      description: '시스템에어컨 전문 시공 자격(SAC) 및 대형 빌딩 멀티 V VRF 전문 엔지니어링 과정 정식 이수',
    },
    {
      title: '시스템 에어컨 시공 자격증',
      issuer: '한국냉동공조안전관리원',
      description: '국가공인 냉매 취급 및 고압가스 냉동기계 냉매 배관 용접 정밀 검증 시공 라이선스',
    },
    {
      title: '에어컨 분해세척 마스터 기술 자격증',
      issuer: '전문 케어 공조 기술 협회',
      description: '완전 분해 살균 세척, 열교환기 핀 코팅 및 무균 공조 덕트 정밀 클리닝 마스터 라이선스',
    },
  ];

  return (
    <section id="credentials" className="w-full bg-white py-12 sm:py-16 md:py-24 border-t border-gray-50 scroll-mt-20">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Text & Credential Links */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs sm:text-sm font-bold text-[#0070d2]">
              왜, {brandName}이어야 하나요?
            </span>
            <h2 className="text-xl sm:text-3xl md:text-[34px] font-bold text-gray-900 mt-1.5 sm:mt-2 tracking-tight break-keep">
              {brandName}이 특별한 이유!
            </h2>

            <div className="mt-4 sm:mt-6 space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 break-keep">
                SAC 및 SI VRF, 시공 자격증 보유
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900 break-keep">
                20년 이상의 시스템 에어컨 주거 및 상업공간 전문 업체
              </p>
              <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed pt-2 break-keep">
                저희 {brandName}은 20년 이상의 경험을 바탕으로, 주거 및 상업 공간에
                특화된 시스템 에어컨 설치와 유지 보수 서비스를 제공하는 에어컨 시공 전문 업체입니다.
              </p>
            </div>

            {/* Credential Tags */}
            <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
              {certList.map((cert, index) => {
                const isActive = selectedCert === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCert(index)}
                    className={`w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-[#f0f7fd] border-[#0070d2] text-[#0070d2] shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isActive ? 'bg-[#0070d2]' : 'bg-gray-300 group-hover:bg-blue-400'
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-bold tracking-tight">
                        {cert.title}
                      </span>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 transition-colors shrink-0 ${
                        isActive ? 'text-[#0070d2]' : 'text-gray-300 group-hover:text-blue-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Display of Framed Official Certificates */}
          <div className="lg:col-span-6">
            <div className="bg-[#f0f7fd] rounded-3xl p-4 sm:p-8 border border-[#d2e5f8]/80 shadow-sm relative">
              {/* Background ambient watermark */}
              <div className="absolute top-4 right-4 text-[#0070d2]/10 pointer-events-none">
                <Award className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              {/* Framed Certificates: Responsive 1 col on mobile, 2 cols on tablet/desktop for crystal clear legibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                {/* Certificate 1: Samsung SAC Certificate */}
                <div
                  onClick={() => setPreviewModal('samsung')}
                  className="group relative bg-[#1c222b] p-2.5 sm:p-3 rounded-xl sm:rounded-lg shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-slate-700"
                >
                  {/* Outer Frame Bevel */}
                  <div className="bg-white rounded p-3.5 sm:p-4 text-gray-900 border border-amber-900/20 relative flex flex-col justify-between min-h-[230px] sm:min-h-[260px] text-center">
                    {/* Header */}
                    <div>
                      <div className="inline-block bg-[#0047AB] text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider">
                        SAMSUNG
                      </div>
                      <p className="text-[8px] sm:text-[7px] text-gray-400 mt-1">시스템에어컨 전문 시공 인증</p>
                      <h4 className="text-[12px] sm:text-[11px] font-extrabold text-gray-900 mt-2 border-b border-gray-200 pb-1.5 leading-tight">
                        SAC 설치 엔지니어 과정<br />교육 수료증
                      </h4>
                    </div>

                    {/* Certificate Body */}
                    <div className="my-2.5 text-[9px] sm:text-[8px] text-gray-600 leading-normal space-y-0.5">
                      <p className="font-semibold text-gray-800">성 명 : {ceoName}</p>
                      <p>자격번호 : SAC-2015-KO-0418</p>
                      <p className="pt-1 text-[8px] sm:text-[6.5px] text-gray-500 break-keep">
                        위 사람은 당사 설치기준에 적합한 SAC 설치 엔지니어 전문가 교육과정을 이수하였기에 본 수료증을 수여함.
                      </p>
                    </div>

                    {/* Footer Seal */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[8px] sm:text-[7px] text-gray-500">
                      <span>삼성공조사업부</span>
                      <div className="w-6 h-6 rounded-full border border-red-500 flex items-center justify-center text-red-600 text-[6px] font-bold rotate-6">
                        삼성인
                      </div>
                    </div>

                    {/* Hover Zoom overlay */}
                    <div className="absolute inset-0 bg-[#0070d2]/10 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="bg-white/90 p-1.5 rounded-full shadow-md text-[#0070d2]">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-[10px] text-center text-slate-300 mt-2 font-medium">
                    삼성전자 SAC 시공자격증
                  </p>
                </div>

                {/* Certificate 2: LG Electronics Certificate */}
                <div
                  onClick={() => setPreviewModal('lg')}
                  className="group relative bg-[#1c222b] p-2.5 sm:p-3 rounded-xl sm:rounded-lg shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-slate-700"
                >
                  {/* Outer Frame Bevel */}
                  <div className="bg-white rounded p-3.5 sm:p-4 text-gray-900 border border-amber-900/20 relative flex flex-col justify-between min-h-[230px] sm:min-h-[260px] text-center">
                    {/* Header */}
                    <div>
                      <div className="w-5 h-5 mx-auto rounded-full bg-[#A50034] text-white flex items-center justify-center text-[7px] font-bold mb-1">
                        LG
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold tracking-widest text-gray-900 border-b border-gray-200 pb-1.5">
                        수 료 증
                      </h4>
                      <p className="text-[8px] sm:text-[7px] text-gray-400 mt-1">LG전자 공조전문시공인</p>
                    </div>

                    {/* Certificate Body */}
                    <div className="my-2.5 text-[9px] sm:text-[8px] text-gray-600 leading-normal space-y-0.5">
                      <p className="font-semibold text-gray-800">소 속 : {brandName}</p>
                      <p className="text-gray-700">성 명 : {ceoName}</p>
                      <p>과 정 : MULTI V 시스템에어컨</p>
                      <p className="pt-1 text-[8px] sm:text-[6.5px] text-gray-500 break-keep">
                        귀하는 LG전자 시스템에어컨 시공 및 감리 기술교육 전 과정을 우수한 성적으로 수료하였으므로 이를 증명함.
                      </p>
                    </div>

                    {/* Footer Seal */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[8px] sm:text-[7px] text-gray-500">
                      <span>LG전자 대표이사</span>
                      <div className="w-6 h-6 rounded-full border border-red-600 flex items-center justify-center text-red-600 text-[6px] font-bold">
                        직인생략
                      </div>
                    </div>

                    {/* Hover Zoom overlay */}
                    <div className="absolute inset-0 bg-[#0070d2]/10 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="bg-white/90 p-1.5 rounded-full shadow-md text-[#0070d2]">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-[10px] text-center text-slate-300 mt-2 font-medium">
                    LG전자 공식 수료증
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Enlarged Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 text-center relative shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#0070d2] flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {previewModal === 'samsung'
                ? '삼성전자 SAC 시스템에어컨 시공자격증'
                : 'LG전자 MULTI V 시스템에어컨 공식 수료증'}
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {previewModal === 'samsung'
                ? '대표 문필주 엔지니어가 직접 취득한 삼성전자 SAC 공식 자격으로, 1Way / 4Way 카세트형 및 주거용/상업용 모든 삼성 시스템에어컨의 규격 감리 시공 자격을 보유하고 있습니다.'
                : 'LG전자 창원 에어솔루션 기술원에서 직접 이수한 시스템에어컨 시공, 진공 및 냉매 정밀 주입, 감리 규정 검증 공식 수료증입니다.'}
            </p>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left text-xs text-gray-600 space-y-1.5 border border-gray-200">
              <p>• <strong>시공업체:</strong> 에어컨신 (airconSIN)</p>
              <p>• <strong>대표자:</strong> 문필주</p>
              <p>• <strong>인증기관:</strong> {previewModal === 'samsung' ? '삼성전자(주) 글로벌공조사업부' : 'LG전자(주) 에어서비스아카데미'}</p>
              <p>• <strong>보증기간:</strong> 시공 하자 100% 무상 책임 A/S</p>
            </div>

            <button
              onClick={() => setPreviewModal(null)}
              className="mt-6 w-full py-3 bg-[#0070d2] text-white rounded-xl font-semibold hover:bg-[#005fb8] transition-colors cursor-pointer"
            >
              확인 닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
