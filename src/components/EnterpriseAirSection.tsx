import React from 'react';
import { Wind, Sparkles, CheckCircle } from 'lucide-react';

export const EnterpriseAirSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 md:space-y-28">
        
        {/* Row 1: Enterprise Recognition (LG & Samsung) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left: Award Plaques / Certificates */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-[#f8fafc] p-4 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Plaque 1: LG 우수 파트너점 */}
                <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-3.5 sm:p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col justify-between min-h-[220px] sm:min-h-[230px] text-white">
                  <div className="text-center pt-1">
                    <div className="w-6 h-6 mx-auto rounded-full bg-[#A50034] text-white text-[8px] font-bold flex items-center justify-center mb-1 shadow-sm">
                      LG
                    </div>
                    <span className="text-[10px] sm:text-[10px] text-slate-300 font-semibold tracking-wider">
                      LG전자 공식 인증
                    </span>
                    <h5 className="text-sm font-bold text-amber-300 mt-2 border-b border-slate-600/70 pb-2">
                      우수 파트너점
                    </h5>
                  </div>

                  <div className="text-center my-2 text-[9px] sm:text-[8px] text-slate-300 space-y-1">
                    <p className="font-semibold text-white">상호: 에어컨신 (airconSIN)</p>
                    <p className="text-amber-200">대표: 문필주</p>
                    <p className="text-[8.5px] sm:text-[6.5px] text-slate-400 break-keep">
                      귀하는 LG전자 시스템에어컨 품질 표준 및 고객 만족 최우수 시공점으로 선정되었기에 본 패를 수여합니다.
                    </p>
                  </div>

                  <div className="border-t border-slate-700 pt-2 flex items-center justify-between text-[8px] sm:text-[7px] text-slate-400">
                    <span>LG전자 에어솔루션</span>
                    <span className="text-amber-400 font-bold">인증 파트너</span>
                  </div>
                </div>

                {/* Plaque 2: Samsung 우수 SFA 인증서 */}
                <div className="bg-gradient-to-b from-[#422006] via-[#291305] to-[#1c0d02] p-3.5 sm:p-4 rounded-xl shadow-lg border border-amber-900/60 flex flex-col justify-between min-h-[220px] sm:min-h-[230px] text-amber-100">
                  <div className="text-center pt-1">
                    <div className="inline-block bg-[#0047AB] text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-wider mb-1">
                      SAMSUNG
                    </div>
                    <p className="text-[9px] sm:text-[8px] text-amber-200/70">삼성전자 시스템가전</p>
                    <h5 className="text-sm font-bold text-amber-300 mt-2 border-b border-amber-800/80 pb-2">
                      우수 SFA 인증서
                    </h5>
                  </div>

                  <div className="text-center my-2 text-[9px] sm:text-[8px] text-amber-200/90 space-y-1">
                    <p className="font-semibold text-white">상호: 에어컨신</p>
                    <p className="text-amber-200">대표: 문필주</p>
                    <p className="text-[8.5px] sm:text-[6.5px] text-amber-300/80 break-keep">
                      당사 프리미엄 시스템에어컨 설치 및 서비스 전문 대리점으로서 최상의 품질과 시공 기술력을 공식 인증합니다.
                    </p>
                  </div>

                  <div className="border-t border-amber-900/70 pt-2 flex items-center justify-between text-[8px] sm:text-[7px] text-amber-400">
                    <span>삼성전자 주식회사</span>
                    <span className="font-bold text-amber-300">최우수 SFA</span>
                  </div>
                </div>

              </div>

              {/* Caption under plaques */}
              <p className="text-xs text-center text-gray-500 font-semibold mt-4">
                우수 파트너점, 우수 SFA 인증서
              </p>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 text-left">
            <span className="text-xs sm:text-sm font-bold text-[#0070d2]">
              LG전자 우수파트너사, 삼성전자 우수 SFA 선정
            </span>
            <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mt-1.5 sm:mt-2 tracking-tight break-keep">
              대기업도 인정한 에어컨신
            </h3>

            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal break-keep">
              <p>
                저희 에어컨신은 업계 최고의 기술력과 신뢰를 바탕으로, 국내 2대 대기업인
                LG전자와 삼성전자로부터 그 우수성을 인정받아 왔습니다.
              </p>
              <p>
                LG전자의 우수 파트너사로서 인정받았을 뿐만 아니라, 삼성전자로부터도 우수 SFA로 선정되어
                뛰어난 시공 품질과 서비스를 제공하고 있습니다. 저희 에어컨신은 고객에게
                최고의 만족을 드리기 위해 지속적인 품질 관리와 혁신을 추구하고 있습니다.
              </p>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#0070d2]">
              <span className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" /> LG전자 정품 배관 자재 원칙
              </span>
              <span className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" /> 삼성 스마트 싱스 연동 감리
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Clean Air Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-6 text-left">
            <span className="text-xs sm:text-sm font-bold text-[#0070d2]">
              믿을 수 있는 공기 전문가
            </span>
            <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mt-1.5 sm:mt-2 tracking-tight break-keep">
              깨끗하고 신선한 실내 공기를 위한 솔루션
            </h3>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal break-keep">
              저희 에어컨신은 철저한 선별 과정을 거친 최상의 제품만을 제공합니다.
            </p>

            <div className="mt-5 sm:mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0070d2] flex items-center justify-center shrink-0 mt-0.5">
                  <Wind className="w-3 h-3" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-gray-900 break-keep">미세먼지 청정 극세 필터 공기질 케어</h5>
                  <p className="text-xs text-gray-500 mt-0.5 break-keep">
                    초미세먼지 99.9% 집진 및 공기 정화 모듈 완벽 세팅
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0070d2] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-gray-900 break-keep">배관 진공 작업 및 고압 누설 테스트 100%</h5>
                  <p className="text-xs text-gray-500 mt-0.5 break-keep">
                    0.5Torr 이하 완벽 진공도 유지로 냉각 효율 및 압축기 수명 극대화
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Circular High-Fidelity Clean Air Art Visual */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-60 h-60 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-xl border-4 border-white bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#bae6fd] flex items-center justify-center group shrink-0">
              {/* Radial clean air glow aura */}
              <div className="absolute inset-0 bg-radial from-blue-300/30 via-transparent to-transparent pointer-events-none" />

              {/* Ceiling recessed AC Unit View inside circle */}
              <div className="absolute top-8 w-48 sm:w-60 md:w-72 h-16 sm:h-20 bg-white rounded-lg shadow-md border border-slate-200 p-2 flex flex-col justify-between z-10">
                <div className="h-6 sm:h-8 bg-slate-100 rounded flex flex-col justify-around px-2">
                  <div className="h-0.5 bg-slate-300 rounded-full w-full" />
                  <div className="h-0.5 bg-slate-300 rounded-full w-full" />
                </div>
                {/* Air discharge louver */}
                <div className="h-4 bg-slate-200 rounded flex items-center justify-between px-2">
                  <div className="w-full h-1 bg-slate-400 rounded-full opacity-60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#38bdf8] ml-2 shrink-0 animate-ping" />
                </div>
              </div>

              {/* Cool Blue Airflow Streams Sweeping Downward */}
              <div className="absolute top-24 sm:top-28 inset-x-0 bottom-0 flex justify-center items-center pointer-events-none">
                <svg
                  viewBox="0 0 300 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full opacity-90 transition-transform duration-700 group-hover:scale-105"
                >
                  <path
                    d="M150 10 C 130 50, 60 120, 40 220"
                    stroke="#0284c7"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  <path
                    d="M150 10 C 140 60, 100 130, 90 220"
                    stroke="#38bdf8"
                    strokeWidth="16"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  <path
                    d="M150 10 C 150 70, 150 140, 150 230"
                    stroke="#0ea5e9"
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  <path
                    d="M150 10 C 160 60, 200 130, 210 220"
                    stroke="#38bdf8"
                    strokeWidth="16"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  <path
                    d="M150 10 C 170 50, 240 120, 260 220"
                    stroke="#0284c7"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  <circle cx="120" cy="140" r="3" fill="#ffffff" className="animate-pulse" />
                  <circle cx="180" cy="160" r="4" fill="#ffffff" className="animate-pulse" />
                  <circle cx="150" cy="180" r="3.5" fill="#ffffff" className="animate-pulse" />
                </svg>
              </div>

              {/* Label inside bubble */}
              <div className="absolute bottom-5 z-20 bg-white/90 backdrop-blur-xs px-3.5 py-1 rounded-full text-[10px] font-bold text-[#0070d2] shadow-xs">
                airconSIN CLEAN AIR
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
