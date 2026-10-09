import React, { useState } from 'react';
import { X, Calculator, Check, ArrowRight } from 'lucide-react';

interface QuickQuoteModalProps {
  onClose: () => void;
  onApplyQuote: (quoteSummary: string) => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  onClose,
  onApplyQuote,
}) => {
  const [spaceType, setSpaceType] = useState<'apartment' | 'commercial' | 'replace'>('apartment');
  const [brand, setBrand] = useState<'lg' | 'samsung'>('lg');
  const [unitCount, setUnitCount] = useState<number>(4);
  const [ceilingType, setCeilingType] = useState<'new' | 'occupied' | 'remodel'>('new');

  // Pricing calculation logic
  const calculatePrice = () => {
    const basePerUnit = brand === 'lg' ? 115 : 120; // 10k KRW (만 원)
    let total = unitCount * basePerUnit;

    if (spaceType === 'commercial') total += 50;
    if (spaceType === 'replace') total -= 30; // utilizing partial existing routes or replace trade-in discount

    if (ceilingType === 'occupied') total += 40; // living space protection / masking
    if (ceilingType === 'remodel') total += 20;

    const min = total - 25;
    const max = total + 25;
    return { min, max };
  };

  const { min, max } = calculatePrice();

  const handleApply = () => {
    const spaceLabel =
      spaceType === 'apartment' ? '아파트 주거용' : spaceType === 'commercial' ? '상업용' : '노후 교체';
    const brandLabel = brand === 'lg' ? 'LG 휘센' : '삼성 무풍';
    const ceilingLabel =
      ceilingType === 'new' ? '입주 전 신축' : ceilingType === 'occupied' ? '거주 중 시공' : '인테리어 공사 병행';

    const summary = `[에어컨신 간편견적] ${spaceLabel} / ${brandLabel} / ${unitCount}대 / ${ceilingLabel} (예상 견적: ${min}~${max}만 원)`;
    onApplyQuote(summary);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0070d2] to-[#005fb8] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">에어컨신 간편견적센터</h3>
              <p className="text-xs text-blue-100">조건을 선택하시면 실시간 표준 견적이 산출됩니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left text-gray-800 text-xs sm:text-sm">
          {/* Step 1: 공간 유형 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              1. 시공 공간 유형
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'apartment', label: '주거용 (아파트)' },
                { key: 'commercial', label: '상업용 (상가/오피스)' },
                { key: 'replace', label: '노후 교체공사' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSpaceType(opt.key as any)}
                  className={`py-3 px-2 rounded-xl text-center font-bold text-xs transition-all border cursor-pointer ${
                    spaceType === opt.key
                      ? 'bg-blue-50 border-[#0070d2] text-[#0070d2] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: 브랜드 선택 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              2. 제조사 브랜드
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBrand('lg')}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  brand === 'lg'
                    ? 'bg-blue-50 border-[#0070d2] text-[#0070d2] font-bold'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#A50034] text-white text-[8px] font-bold flex items-center justify-center">
                    LG
                  </div>
                  <span>LG 휘센 프리미엄</span>
                </div>
                {brand === 'lg' && <Check className="w-4 h-4 text-[#0070d2]" />}
              </button>

              <button
                type="button"
                onClick={() => setBrand('samsung')}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  brand === 'samsung'
                    ? 'bg-blue-50 border-[#0070d2] text-[#0070d2] font-bold'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0047AB] text-white text-[7px] font-bold flex items-center justify-center">
                    SAM
                  </div>
                  <span>삼성 무풍 시스템 SAC</span>
                </div>
                {brand === 'samsung' && <Check className="w-4 h-4 text-[#0070d2]" />}
              </button>
            </div>
          </div>

          {/* Step 3: 설치 대수 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              3. 실내기 설치 대수
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setUnitCount(count)}
                  className={`py-3 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                    unitCount === count
                      ? 'bg-[#0070d2] text-white border-[#0070d2] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {count}대 {count === 4 ? '(국민구성)' : count === 5 ? '이상' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: 시공 환경 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              4. 현재 현장 상태
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'new', label: '신축 입주 전 (공실)' },
                { key: 'occupied', label: '현재 거주 중' },
                { key: 'remodel', label: '인테리어 공사 중' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCeilingType(c.key as any)}
                  className={`py-2.5 px-1.5 rounded-xl text-center text-xs font-medium transition-all border cursor-pointer ${
                    ceilingType === c.key
                      ? 'bg-blue-50 border-[#0070d2] text-[#0070d2] font-bold'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Box */}
          <div className="p-4 rounded-2xl bg-[#f0f7fd] border border-[#d2e5f8] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
              <span className="text-xs text-gray-600 font-semibold">예상 총 견적 범위</span>
              <span className="text-[11px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                100% 정품 동배관 포함
              </span>
            </div>

            <div className="pt-3 flex items-baseline justify-between">
              <span className="text-xs text-gray-500">실내기 {unitCount}대 + 실외기 + 기본시공</span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0070d2]">
                  {min} ~ {max}
                </span>
                <span className="text-sm font-bold text-gray-700 ml-1">만 원</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <ShieldAlertCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>실제 계약 시 추가 금액 발생 없는 정직한 정찰제 견적을 지향합니다.</span>
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="w-2/3 py-3 bg-[#0070d2] hover:bg-[#005fb8] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>이 견적으로 무료 상담 접수하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ShieldAlertCheck = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
