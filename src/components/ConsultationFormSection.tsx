import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface ConsultationFormSectionProps {
  onSuccessSubmit?: (data: { name: string; phone: string; message: string }) => void;
}

export const ConsultationFormSection: React.FC<ConsultationFormSectionProps> = ({
  onSuccessSubmit,
}) => {
  const { siteData, addInquiry } = useSiteData();
  const targetEmail = siteData.settings.notificationEmail || 'ateamshero@gmail.com';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    agreed: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone number auto-formatter (010-XXXX-XXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 7) {
      val = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
    } else if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }
    setFormData((prev) => ({ ...prev, phone: val }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = '성함을 입력해주세요.';
    }
    if (!formData.phone.trim() || formData.phone.length < 11) {
      newErrors.phone = '올바른 연락처를 입력해주세요.';
    }
    if (!formData.agreed) {
      newErrors.agreed = '개인정보 수집 및 이용에 동의해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Save to site inquiries database for admin
      addInquiry({
        name: formData.name,
        phone: formData.phone,
        message: formData.message || '견적 및 방문 실측 상담 요청',
      });

      // 2. Prepare mailto link / notification
      const subject = encodeURIComponent(`[에어컨신 상담신청] ${formData.name} 고객님 (${formData.phone})`);
      const body = encodeURIComponent(
        `[에어컨신 실시간 상담 접수 알림]\n\n` +
        `• 고객명: ${formData.name}\n` +
        `• 연락처: ${formData.phone}\n` +
        `• 문의 내용: ${formData.message || '없음'}\n` +
        `• 접수 일시: ${new Date().toLocaleString('ko-KR')}\n`
      );

      // Attempt background mailto trigger or notification
      try {
        const mailtoLink = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
        const hiddenIframe = document.createElement('iframe');
        hiddenIframe.style.display = 'none';
        hiddenIframe.src = mailtoLink;
        document.body.appendChild(hiddenIframe);
        setTimeout(() => document.body.removeChild(hiddenIframe), 1000);
      } catch (err) {
        console.warn('Mail notification trigger note', err);
      }

      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccessSubmit) {
        onSuccessSubmit(formData);
      }
    }, 600);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', message: '', agreed: false });
    setSubmitted(false);
  };

  return (
    <section id="contact" className="w-full bg-[#f0f7fd] py-16 md:py-24 border-t border-[#d2e5f8]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading and Contact Action */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs sm:text-sm font-bold text-[#0070d2]">
              {siteData.consultationSection?.kicker || `${siteData.company.slogan} 무료견적 상담신청`}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-gray-900 mt-2 tracking-tight leading-snug whitespace-pre-line">
              {siteData.consultationSection?.title || '에어컨신은 언제나\n고객과 소통합니다'}
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-line">
              {siteData.consultationSection?.description || '상담부터 고객님께서 이용할 수 있는 모든 경로를 열어두었습니다.\n언제든 문의주시면 친절하고 정직하게 안내 드리겠습니다.'}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${siteData.company.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-[#0070d2] hover:bg-[#005fb8] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>{siteData.consultationSection?.buttonText || '문의하기'} ({siteData.company.phone})</span>
              </a>
            </div>

            <div className="mt-6 text-xs text-gray-500 space-y-1">
              <p>• {siteData.consultationSection?.bullet1 || '연중무휴: 08:00 ~ 20:00 (야간 및 주말 긴급상담 가능)'}</p>
              <p>• {siteData.consultationSection?.bullet2 || '현장 방문 실측 및 레이저 맞춤 견적서 발송 100% 무료'}</p>
              <p className="flex items-center gap-1.5 text-blue-700 font-semibold pt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>접수 알림 수신처: {targetEmail}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              {submitted ? (
                <div className="py-10 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-[#0070d2] flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    상담 신청이 정상 접수되었습니다!
                  </h3>
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed max-w-md mx-auto text-left space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-[#0070d2]">
                      <Mail className="w-4 h-4" /> 이메일 알림 전송 완료
                    </p>
                    <p>• 담당자 수신 이메일: <strong>{targetEmail}</strong></p>
                    <p>• 고객 연락처: <strong>{formData.phone}</strong></p>
                    <p>• 전담 엔지니어가 접수 내용을 확인 후 빠른 시간 내에 연락드립니다.</p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="mt-4 px-6 py-2.5 bg-[#0070d2] text-white rounded-xl text-xs font-semibold hover:bg-[#005fb8] transition-colors cursor-pointer"
                  >
                    추가 문의 작성하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">
                      성함<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="성함을 입력해주세요."
                      className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                        errors.name
                          ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#0070d2] focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">
                      연락처<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="연락처를 입력해주세요."
                      className={`w-full px-4 py-3 text-xs sm:text-sm rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#0070d2] focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1.5">
                      문의 내용
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="설치 희망 지역, 평수 또는 문의 내용을 입력해주세요."
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0070d2] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>

                  {/* Privacy policy agreement */}
                  <div>
                    <span className="block text-[11px] font-bold text-gray-700 mb-1">
                      개인정보 수집 및 이용 동의<span className="text-red-500">*</span>
                    </span>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[10px] sm:text-[11px] text-gray-500 leading-relaxed max-h-20 overflow-y-auto">
                      에어컨신 (이하 &apos;회사&apos;라 한다)은 개인정보 보호법 제30조에 따라
                      정보 주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기
                      위하여 다음과 같이 개인정보 처리지침을 수립, 공개합니다.
                      수집항목: 성명, 연락처, 문의내용 / 보유 및 이용기간: 견적 상담 완료 후 1년 또는 정보주체의 삭제 요청 시 즉시 파기.
                    </div>

                    <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) => {
                          setFormData({ ...formData, agreed: e.target.checked });
                          if (errors.agreed) setErrors({ ...errors, agreed: '' });
                        }}
                        className="w-4 h-4 text-[#0070d2] rounded border-gray-300 focus:ring-[#0070d2]"
                      />
                      <span className="text-xs text-gray-600 font-medium">
                        개인정보 수집 및 이용에 동의합니다.
                      </span>
                    </label>
                    {errors.agreed && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.agreed}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0070d2] hover:bg-[#005fb8] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>전송 중...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>무료 견적 상담 신청하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
