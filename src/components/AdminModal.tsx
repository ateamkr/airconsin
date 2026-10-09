import React, { useState } from 'react';
import {
  X,
  Sliders,
  BarChart3,
  MessageSquare,
  Wrench,
  Building,
  Upload,
  Save,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Plus,
  Image as ImageIcon,
  Menu as MenuIcon,
  Mail,
  ExternalLink,
  Inbox,
  Eye,
  EyeOff,
  PhoneCall,
  KeyRound,
  ShieldCheck,
  Phone,
  TrendingUp,
  Video,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    siteData,
    updateCompany,
    updateSettings,
    updateNavMenu,
    updateNavMenuItem,
    updateHeroSlide,
    updateStat,
    updateReview,
    addReview,
    deleteReview,
    updateAfterService,
    updateGrowthTrust,
    updateGrowthTrustCard,
    updateMottoSection,
    updateHonestEstimate,
    updateHonestEstimateItem,
    updateConsultationSection,
    deleteInquiry,
    resetToDefaults,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<
    'menu' | 'growthTrust' | 'motto' | 'settings' | 'inbox' | 'hero' | 'stats' | 'reviews' | 'estimate' | 'as' | 'contact' | 'company'
  >('menu');

  const [saveToast, setSaveToast] = useState(false);

  // Local state for atomic edits
  const [companyForm, setCompanyForm] = useState(siteData.company);
  const [settingsForm, setSettingsForm] = useState(siteData.settings);
  const [asForm, setAsForm] = useState(siteData.afterService);
  const [estimateForm, setEstimateForm] = useState(siteData.honestEstimate);
  const [contactForm, setContactForm] = useState(siteData.consultationSection);
  const [growthTrustForm, setGrowthTrustForm] = useState(siteData.growthTrust);
  const [mottoForm, setMottoForm] = useState(
    siteData.mottoSection || {
      dashMotif: '----',
      title: '정직한 시공으로 오로지 고객을 남기겠습니다.',
      subtitle: '믿고 맡기는 에어컨설치 — 우리가족이 사는 집처럼, 내 가게처럼 생각하며 정성을 다하여 시공하겠습니다.',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }
  );

  React.useEffect(() => {
    if (isOpen) {
      setCompanyForm(siteData.company);
      setSettingsForm(siteData.settings);
      setAsForm(siteData.afterService);
      setEstimateForm(siteData.honestEstimate);
      setContactForm(siteData.consultationSection);
      setGrowthTrustForm(siteData.growthTrust);
      if (siteData.mottoSection) {
        setMottoForm(siteData.mottoSection);
      }
    }
  }, [isOpen, siteData]);

  if (!isOpen) return null;

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('이미지 파일 크기는 3MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onSuccess(event.target.result);
        triggerSaveToast();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0070d2] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              신
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>에어컨신 통합 관리자 센터</span>
                <span className="text-[11px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                  PW: {siteData.settings.adminPassword || '8849'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                메뉴, 로고, 카카오톡 링크, 견적 문구, 사후관리, 문의하기, 하단정보 실시간 수정
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" /> 저장 완료!
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-slate-100/80 border-b border-gray-200 overflow-x-auto text-xs sm:text-sm font-bold shrink-0">
          {[
            { key: 'menu', label: '메뉴 관리', icon: MenuIcon },
            { key: 'growthTrust', label: '소개 많은 회사', icon: TrendingUp },
            { key: 'motto', label: '유튜브/모토 영상', icon: Video },
            { key: 'estimate', label: '정직한 견적', icon: ShieldCheck },
            { key: 'as', label: '사후관리 (A/S)', icon: Wrench },
            { key: 'contact', label: '문의하기 텍스트', icon: Phone },
            { key: 'hero', label: '메인 슬라이더', icon: Sliders },
            { key: 'stats', label: '수치 통계', icon: BarChart3 },
            { key: 'reviews', label: '설치후기 (6개)', icon: MessageSquare },
            { key: 'settings', label: '로고/이메일/카카오', icon: Mail },
            { key: 'company', label: '하단 정보 / 회사', icon: Building },
            { key: 'inbox', label: `상담접수함 (${siteData.inquiries?.length || 0})`, icon: Inbox },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3.5 px-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#0070d2] text-[#0070d2] bg-white shadow-2xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-800 bg-[#fbfcfd]">
          
          {/* TAB: 메뉴 관리 (NAV MENU MANAGEMENT) */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed flex items-start justify-between">
                <div>
                  <strong>상단 및 하단 네비게이션 메뉴 관리:</strong> 메뉴의 노출 여부(켬/끔), 이름(라벨), 연결 타겟을 자유롭게 수정할 수 있습니다. 변경 사항은 헤더와 푸터에 즉시 반영됩니다.
                </div>
                <button
                  onClick={() => {
                    const newId = `menu-${Date.now()}`;
                    updateNavMenu([
                      ...siteData.navMenu,
                      { id: newId, label: '새 메뉴', enabled: true, type: 'section', target: 'contact' },
                    ]);
                    triggerSaveToast();
                  }}
                  className="ml-3 shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-[#0070d2] text-white text-xs font-bold rounded-xl hover:bg-[#005fb8] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> 메뉴 추가
                </button>
              </div>

              <div className="space-y-3">
                {siteData.navMenu.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-mono text-xs font-bold text-gray-400">
                        #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          updateNavMenuItem(item.id, { enabled: !item.enabled });
                          triggerSaveToast();
                        }}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          item.enabled
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        }`}
                        title={item.enabled ? '노출 중 (클릭 시 숨김)' : '숨김 상태 (클릭 시 노출)'}
                      >
                        {item.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{item.enabled ? '노출' : '숨김'}</span>
                      </button>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            updateNavMenuItem(item.id, { label: e.target.value });
                            triggerSaveToast();
                          }}
                          className="font-bold text-sm text-gray-900 border-b border-gray-200 focus:border-[#0070d2] focus:outline-none pb-0.5 px-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <select
                        value={item.type}
                        onChange={(e) => {
                          updateNavMenuItem(item.id, { type: e.target.value as any });
                          triggerSaveToast();
                        }}
                        className="text-xs p-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none"
                      >
                        <option value="section">페이지 섹션 이동</option>
                        <option value="modal">간편견적 모달 열기</option>
                        <option value="external">외부 링크 열기</option>
                      </select>

                      <input
                        type="text"
                        value={item.target}
                        placeholder={item.type === 'external' ? 'https://...' : '섹션 ID (예: reviews)'}
                        onChange={(e) => {
                          updateNavMenuItem(item.id, { target: e.target.value });
                          triggerSaveToast();
                        }}
                        className="text-xs p-2 rounded-xl border border-gray-200 focus:outline-none w-36 sm:w-48 font-mono"
                      />

                      {siteData.navMenu.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`'${item.label}' 메뉴를 삭제하시겠습니까?`)) {
                              updateNavMenu(siteData.navMenu.filter((m) => m.id !== item.id));
                              triggerSaveToast();
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: 로고 / 이메일 / 카카오 설정 (SETTINGS TAB) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* 1. 로고 이미지 업로드 관리 */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#0070d2]" />
                    <span>홈페이지 로고 이미지 관리</span>
                  </h3>
                  {settingsForm.customLogoUrl && (
                    <button
                      onClick={() => {
                        setSettingsForm((prev) => ({ ...prev, customLogoUrl: '' }));
                        updateSettings({ customLogoUrl: '' });
                        triggerSaveToast();
                      }}
                      className="text-xs text-red-500 hover:underline cursor-pointer"
                    >
                      기본 벡터 SVG 로고로 복원
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="h-16 w-48 rounded-xl border border-gray-200 bg-slate-50 flex items-center justify-center p-2 shrink-0">
                    {settingsForm.customLogoUrl ? (
                      <img
                        src={settingsForm.customLogoUrl}
                        alt="커스텀 로고"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">기본 에어컨신 SVG 로고 사용 중</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0070d2] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#005fb8] transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>로고 이미지 파일 직접 업로드</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) => {
                            setSettingsForm((prev) => ({ ...prev, customLogoUrl: dataUrl }));
                            updateSettings({ customLogoUrl: dataUrl });
                          })
                        }
                      />
                    </label>

                    <input
                      type="text"
                      value={settingsForm.customLogoUrl || ''}
                      placeholder="또는 로고 이미지 웹 URL을 입력하세요"
                      onChange={(e) => {
                        setSettingsForm((prev) => ({ ...prev, customLogoUrl: e.target.value }));
                        updateSettings({ customLogoUrl: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. 상담 알림 수신 이메일 설정 */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Mail className="w-4 h-4 text-[#0070d2]" />
                  <span>상담신청 알림 수신 이메일</span>
                </h3>
                <p className="text-xs text-gray-500">
                  고객이 무료견적 상담 폼을 제출하면 이메일 알림이 전송되는 수신용 이메일 주소입니다.
                </p>
                <div>
                  <input
                    type="email"
                    value={settingsForm.notificationEmail || ''}
                    placeholder="예: ateamshero@gmail.com"
                    onChange={(e) => {
                      setSettingsForm((prev) => ({ ...prev, notificationEmail: e.target.value }));
                      updateSettings({ notificationEmail: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-bold text-[#0070d2] focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
              </div>

              {/* 3. 따라다니는 카카오톡 배너 링크 (새 창 열림) */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                  <span>플로팅 카카오톡 배너 연결 링크 (새 창 열림)</span>
                </h3>
                <p className="text-xs text-gray-500">
                  우측 하단 노란색 카카오톡 TALK 플로팅 배너를 클릭했을 때 새 창으로 열릴 카카오 채널 또는 1:1 채팅 URL입니다.
                </p>
                <div>
                  <input
                    type="url"
                    value={settingsForm.kakaoChannelUrl || ''}
                    placeholder="예: https://pf.kakao.com/_xxxx"
                    onChange={(e) => {
                      setSettingsForm((prev) => ({ ...prev, kakaoChannelUrl: e.target.value }));
                      updateSettings({ kakaoChannelUrl: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono text-gray-800 focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
              </div>

              {/* 4. 관리자 비밀번호 변경 */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <KeyRound className="w-4 h-4 text-[#0070d2]" />
                  <span>관리자 로그인 비밀번호 (기본: 8849)</span>
                </h3>
                <div className="max-w-xs">
                  <input
                    type="text"
                    value={settingsForm.adminPassword || '8849'}
                    onChange={(e) => {
                      setSettingsForm((prev) => ({ ...prev, adminPassword: e.target.value }));
                      updateSettings({ adminPassword: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono font-bold tracking-widest text-center focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: 상담 접수함 (INBOX) */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
                <span>
                  <strong>실시간 접수된 고객 상담 신청 내역:</strong> 고객이 홈페이지에서 무료 견적 상담을 신청하면 이곳에 자동으로 기록됩니다.
                </span>
                <span className="font-bold">총 {siteData.inquiries?.length || 0}건</span>
              </div>

              {(!siteData.inquiries || siteData.inquiries.length === 0) ? (
                <div className="py-16 text-center text-gray-400 space-y-2">
                  <Inbox className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-bold">아직 접수된 상담 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {siteData.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base">{inq.name} 고객님</span>
                          <span className="text-xs text-gray-400 font-mono">({inq.date})</span>
                        </div>
                        <div className="text-xs font-bold text-[#0070d2] flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <a href={`tel:${inq.phone}`} className="hover:underline">{inq.phone}</a>
                        </div>
                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mt-2 leading-relaxed">
                          {inq.message}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <a
                          href={`tel:${inq.phone}`}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>전화걸기</span>
                        </a>
                        <button
                          onClick={() => {
                            if (confirm('이 상담 내역을 삭제하시겠습니까?')) {
                              deleteInquiry(inq.id);
                              triggerSaveToast();
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: 소개 많은 회사 (GROWTH & TRUST) */}
          {activeTab === 'growthTrust' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <strong>&apos;업계에서 가장 소개가 많은 회사&apos; 섹션 문구 관리:</strong> 상단 소제목(Kicker), 메인 타이틀, 서브 설명 문구 및 3가지 대표 서비스 안내 카드(주거용, 상업용, 공동구매)의 제목과 설명을 수정할 수 있습니다.
              </div>

              {/* Title, Kicker & Description */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  섹션 헤드라인 및 소개 문구
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상단 소제목 (Kicker)</label>
                  <input
                    type="text"
                    value={growthTrustForm?.kicker || ''}
                    onChange={(e) => {
                      setGrowthTrustForm((prev) => ({ ...prev, kicker: e.target.value }));
                      updateGrowthTrust({ kicker: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">메인 타이틀</label>
                  <input
                    type="text"
                    value={growthTrustForm?.title || ''}
                    onChange={(e) => {
                      setGrowthTrustForm((prev) => ({ ...prev, title: e.target.value }));
                      updateGrowthTrust({ title: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">서브 설명 문구</label>
                  <textarea
                    rows={2}
                    value={growthTrustForm?.description || ''}
                    onChange={(e) => {
                      setGrowthTrustForm((prev) => ({ ...prev, description: e.target.value }));
                      updateGrowthTrust({ description: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
              </div>

              {/* 3 Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">3가지 서비스 안내 카드</h3>
                {(siteData.growthTrust?.cards || []).map((card, idx) => (
                  <div key={card.id || idx} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-extrabold text-[#0070d2] text-xs">서비스 카드 #{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">카드 제목</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            updateGrowthTrustCard(card.id, { title: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-[#0070d2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">카드 설명 문구</label>
                        <input
                          type="text"
                          value={card.description}
                          onChange={(e) => {
                            updateGrowthTrustCard(card.id, { description: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: 유튜브 & 모토 섹션 (MOTTO & YOUTUBE VIDEO) */}
          {activeTab === 'motto' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <strong>&apos;우리가족이 사는 집처럼, 내 가게처럼...&apos; 모토 및 유튜브 영상 관리:</strong> 문구 및 유튜브 영상 주소를 입력하면 사이트에 영상이 바로 연동되며, 무음으로 자동 재생됩니다.
              </div>

              {/* YouTube Video URL Configuration */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#0070d2]" />
                    <span>유튜브 영상 연동 (기본 무음 자동 재생)</span>
                  </h3>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                    자동 재생 &amp; 무음 지원
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    유튜브 영상 주소 (URL 또는 ID)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mottoForm.youtubeUrl || ''}
                      placeholder="예: https://www.youtube.com/watch?v=... 또는 youtu.be/..."
                      onChange={(e) => {
                        const val = e.target.value;
                        setMottoForm((prev) => ({ ...prev, youtubeUrl: val }));
                        updateMottoSection({ youtubeUrl: val });
                        triggerSaveToast();
                      }}
                      className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                    />
                    {mottoForm.youtubeUrl && (
                      <a
                        href={mottoForm.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs rounded-xl flex items-center gap-1 shrink-0 font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>영상 확인</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    * 일반 유튜브 영상 링크(youtube.com/watch?v=...), 단축 링크(youtu.be/...), 쇼츠(shorts/...) 주소를 그대로 붙여넣으시면 됩니다.
                  </p>
                </div>
              </div>

              {/* Text Fields */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  섹션 텍스트 문구
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">메인 타이틀 (큰 제목)</label>
                  <input
                    type="text"
                    value={mottoForm.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMottoForm((prev) => ({ ...prev, title: val }));
                      updateMottoSection({ title: val });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-[#0070d2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    서브 문구 (우리가족이 사는 집처럼... 텍스트)
                  </label>
                  <textarea
                    rows={2}
                    value={mottoForm.subtitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMottoForm((prev) => ({ ...prev, subtitle: val }));
                      updateMottoSection({ subtitle: val });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상단 디자인 장식 기호</label>
                  <input
                    type="text"
                    value={mottoForm.dashMotif || '----'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMottoForm((prev) => ({ ...prev, dashMotif: val }));
                      updateMottoSection({ dashMotif: val });
                      triggerSaveToast();
                    }}
                    className="w-32 text-xs p-2.5 rounded-xl border border-gray-200 font-mono text-[#0070d2] font-bold focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: 정직한 견적 (ESTIMATE) */}
          {activeTab === 'estimate' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <strong>&apos;에어컨신의 정직한 견적 이렇게 만들어집니다&apos; 섹션 문구 관리:</strong> 메인 파란색 배너의 타이틀, 상단 설명 문구 및 4가지 신뢰 보증 원칙 내용을 수정할 수 있습니다.
              </div>

              {/* Title & Kicker */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  섹션 헤드라인 및 상단 설명
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상단 소제목 (Kicker)</label>
                  <input
                    type="text"
                    value={estimateForm?.kicker || ''}
                    onChange={(e) => {
                      setEstimateForm((prev) => ({ ...prev, kicker: e.target.value }));
                      updateHonestEstimate({ kicker: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">메인 타이틀</label>
                  <input
                    type="text"
                    value={estimateForm?.title || ''}
                    onChange={(e) => {
                      setEstimateForm((prev) => ({ ...prev, title: e.target.value }));
                      updateHonestEstimate({ title: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none focus:border-[#0070d2]"
                  />
                </div>
              </div>

              {/* 4 Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">4가지 정직한 견적 원칙 카드</h3>
                {(siteData.honestEstimate?.items || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-extrabold text-[#0070d2] text-xs">원칙 #{idx + 1} ({item.step})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">단계 라벨 (예: 첫번째)</label>
                        <input
                          type="text"
                          value={item.step}
                          onChange={(e) => {
                            updateHonestEstimateItem(item.id, { step: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">앞 문구 (선택)</label>
                        <input
                          type="text"
                          value={item.textBefore}
                          onChange={(e) => {
                            updateHonestEstimateItem(item.id, { textBefore: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-blue-700 mb-1">파란색 강조 핵심 문구</label>
                        <input
                          type="text"
                          value={item.highlight}
                          onChange={(e) => {
                            updateHonestEstimateItem(item.id, { highlight: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-blue-300 font-bold text-[#0070d2] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">뒤 문구</label>
                        <input
                          type="text"
                          value={item.textAfter}
                          onChange={(e) => {
                            updateHonestEstimateItem(item.id, { textAfter: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AFTER SERVICE (사후관리 텍스트 & 현장 이미지) */}
          {activeTab === 'as' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <strong>사후관리 (A/S) 섹션 문구 및 이미지 관리:</strong> 상단 문구, 3단계 대응 절차, 설명 텍스트 및 가운데 현장 사진을 수정할 수 있습니다.
              </div>

              {/* Titles & Kicker */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  사후관리 섹션 텍스트 문구
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상단 슬로건 / Kicker</label>
                  <input
                    type="text"
                    value={asForm.kicker || ''}
                    onChange={(e) => {
                      setAsForm((prev) => ({ ...prev, kicker: e.target.value }));
                      updateAfterService({ kicker: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">메인 타이틀</label>
                  <input
                    type="text"
                    value={asForm.title || ''}
                    onChange={(e) => {
                      setAsForm((prev) => ({ ...prev, title: e.target.value }));
                      updateAfterService({ title: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">좌측 소제목 (서브 타이틀)</label>
                  <input
                    type="text"
                    value={asForm.subtitle || ''}
                    onChange={(e) => {
                      setAsForm((prev) => ({ ...prev, subtitle: e.target.value }));
                      updateAfterService({ subtitle: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">우측 설명 텍스트 (A/S 상세 설명)</label>
                  <textarea
                    rows={3}
                    value={asForm.description || ''}
                    onChange={(e) => {
                      setAsForm((prev) => ({ ...prev, description: e.target.value }));
                      updateAfterService({ description: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3 Steps */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  사후관리 3단계 A/S 프로세스
                </h3>
                <div className="space-y-4">
                  {(asForm.steps || []).map((st, idx) => (
                    <div key={st.number || idx} className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0070d2] text-white text-[11px] font-bold flex items-center justify-center">
                          {st.number}
                        </span>
                        <input
                          type="text"
                          value={st.title}
                          placeholder="단계 제목"
                          onChange={(e) => {
                            const newSteps = [...asForm.steps];
                            newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                            setAsForm((prev) => ({ ...prev, steps: newSteps }));
                            updateAfterService({ steps: newSteps });
                            triggerSaveToast();
                          }}
                          className="flex-1 text-xs font-bold p-1.5 bg-white rounded-lg border border-gray-200 focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={st.desc}
                        placeholder="단계 세부 설명"
                        onChange={(e) => {
                          const newSteps = [...asForm.steps];
                          newSteps[idx] = { ...newSteps[idx], desc: e.target.value };
                          setAsForm((prev) => ({ ...prev, steps: newSteps }));
                          updateAfterService({ steps: newSteps });
                          triggerSaveToast();
                        }}
                        className="w-full text-xs p-2 bg-white rounded-lg border border-gray-200 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Image Upload */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  가운데 사후관리 현장 이미지 관리
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-32 h-40 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white shadow-md shrink-0 flex items-center justify-center">
                    {asForm.centerImageUrl ? (
                      <img src={asForm.centerImageUrl} alt="A/S 현장" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 text-xs">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                        기본 일러스트 사용 중
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0070d2] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#005fb8] transition-colors shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>새 사진 파일 업로드</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) => {
                            setAsForm((prev) => ({ ...prev, centerImageUrl: dataUrl }));
                            updateAfterService({ centerImageUrl: dataUrl });
                          })
                        }
                      />
                    </label>

                    <input
                      type="text"
                      value={asForm.centerImageUrl || ''}
                      placeholder="또는 이미지 웹 URL을 직접 입력"
                      onChange={(e) => {
                        setAsForm((prev) => ({ ...prev, centerImageUrl: e.target.value }));
                        updateAfterService({ centerImageUrl: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />

                    {asForm.centerImageUrl && (
                      <button
                        onClick={() => {
                          setAsForm((prev) => ({ ...prev, centerImageUrl: '' }));
                          updateAfterService({ centerImageUrl: '' });
                          triggerSaveToast();
                        }}
                        className="text-xs text-red-500 hover:underline cursor-pointer block"
                      >
                        기본 일러스트로 되돌리기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: 문의하기 텍스트 (CONTACT) */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <strong>&apos;문의하기&apos; 상담 신청 섹션 텍스트 관리:</strong> 하단 무료 견적 상담 폼 좌측에 노출되는 헤드라인, 상세 안내 문구, 버튼 텍스트 등을 자유롭게 수정할 수 있습니다.
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상단 소제목 (Kicker)</label>
                  <input
                    type="text"
                    value={contactForm?.kicker || ''}
                    onChange={(e) => {
                      setContactForm((prev) => ({ ...prev, kicker: e.target.value }));
                      updateConsultationSection({ kicker: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">메인 타이틀 (줄바꿈 가능)</label>
                  <textarea
                    rows={2}
                    value={contactForm?.title || ''}
                    onChange={(e) => {
                      setContactForm((prev) => ({ ...prev, title: e.target.value }));
                      updateConsultationSection({ title: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">안내 설명 문구 (줄바꿈 가능)</label>
                  <textarea
                    rows={3}
                    value={contactForm?.description || ''}
                    onChange={(e) => {
                      setContactForm((prev) => ({ ...prev, description: e.target.value }));
                      updateConsultationSection({ description: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">전화 버튼 텍스트</label>
                  <input
                    type="text"
                    value={contactForm?.buttonText || ''}
                    onChange={(e) => {
                      setContactForm((prev) => ({ ...prev, buttonText: e.target.value }));
                      updateConsultationSection({ buttonText: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">안내 항목 1 (운영시간 등)</label>
                    <input
                      type="text"
                      value={contactForm?.bullet1 || ''}
                      onChange={(e) => {
                        setContactForm((prev) => ({ ...prev, bullet1: e.target.value }));
                        updateConsultationSection({ bullet1: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">안내 항목 2 (실측 안내 등)</label>
                    <input
                      type="text"
                      value={contactForm?.bullet2 || ''}
                      onChange={(e) => {
                        setContactForm((prev) => ({ ...prev, bullet2: e.target.value }));
                        updateConsultationSection({ bullet2: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERO SLIDES (3 ITEMS) */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="space-y-6">
                {siteData.heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-extrabold text-[#0070d2] text-sm">
                        슬라이드 {idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          상단 뱃지 / 슬로건
                        </label>
                        <input
                          type="text"
                          value={slide.badge}
                          onChange={(e) => {
                            updateHeroSlide(slide.id, { badge: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#0070d2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          메인 헤드라인 타이틀
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            updateHeroSlide(slide.id, { title: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#0070d2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        서브 설명 텍스트
                      </label>
                      <textarea
                        rows={2}
                        value={slide.subtitle}
                        onChange={(e) => {
                          updateHeroSlide(slide.id, { subtitle: e.target.value });
                          triggerSaveToast();
                        }}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#0070d2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        배경 이미지 업로드 또는 URL
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <input
                          type="text"
                          value={slide.imageUrl || ''}
                          placeholder="이미지 URL을 입력하거나 우측 파일 업로드를 사용하세요"
                          onChange={(e) => {
                            updateHeroSlide(slide.id, { imageUrl: e.target.value });
                            triggerSaveToast();
                          }}
                          className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#0070d2]"
                        />
                        <label className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0070d2] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#005fb8] transition-colors shrink-0 shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>사진 파일 업로드</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (dataUrl) => {
                                updateHeroSlide(slide.id, { imageUrl: dataUrl });
                              })
                            }
                          />
                        </label>
                        {slide.imageUrl && (
                          <button
                            onClick={() => {
                              updateHeroSlide(slide.id, { imageUrl: '' });
                              triggerSaveToast();
                            }}
                            className="text-xs text-red-500 hover:underline cursor-pointer"
                          >
                            초기화
                          </button>
                        )}
                      </div>
                      {slide.imageUrl && (
                        <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={slide.imageUrl}
                            alt={`슬라이드 ${idx + 1} 미리보기`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded">
                            메인 화면 적용 중
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {siteData.stats.map((stat, idx) => (
                  <div key={stat.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                    <span className="font-extrabold text-[#0070d2] text-xs">지표 #{idx + 1}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">수치 (숫자)</label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => {
                            updateStat(stat.id, { value: Number(e.target.value) });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">단위 (%, 억, +)</label>
                        <input
                          type="text"
                          value={stat.unit}
                          onChange={(e) => {
                            updateStat(stat.id, { unit: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">라벨</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          updateStat(stat.id, { label: e.target.value });
                          triggerSaveToast();
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS (총 6개) */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed flex items-center justify-between">
                <div>
                  <strong>설치후기 관리:</strong> 메인 홈페이지에 노출되는 시공 후기(최대 6개)를 관리합니다. 사진 파일 직접 업로드, 고객명, 평점, 설치 제품, 후기 내용을 수정할 수 있습니다.
                </div>
                {siteData.reviews.length < 6 && (
                  <button
                    onClick={() => {
                      addReview({
                        title: '새로운 아파트 시스템에어컨 시공 후기',
                        location: '경기 남양주시',
                        customerName: '고객님',
                        rating: 5,
                        date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
                        product: 'LG 프리미엄 시스템에어컨',
                        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
                        content: '정직하고 꼼꼼한 설치에 매우 만족합니다.',
                      });
                      triggerSaveToast();
                    }}
                    className="ml-3 shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-[#0070d2] text-white text-xs font-bold rounded-xl hover:bg-[#005fb8] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> 후기 추가
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {siteData.reviews.map((rev, idx) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-extrabold text-[#0070d2] text-xs">
                        설치후기 #{idx + 1}
                      </span>
                      {siteData.reviews.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm('이 후기를 삭제하시겠습니까?')) {
                              deleteReview(rev.id);
                              triggerSaveToast();
                            }
                          }}
                          className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shrink-0">
                        <img src={rev.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#0070d2]" />
                          <span>사진 파일 업로드</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (dataUrl) => {
                                updateReview(rev.id, { imageUrl: dataUrl });
                              })
                            }
                          />
                        </label>
                        <input
                          type="text"
                          value={rev.imageUrl}
                          placeholder="또는 이미지 URL"
                          onChange={(e) => {
                            updateReview(rev.id, { imageUrl: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-[11px] p-1.5 rounded-lg border border-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">제목</label>
                      <input
                        type="text"
                        value={rev.title}
                        onChange={(e) => {
                          updateReview(rev.id, { title: e.target.value });
                          triggerSaveToast();
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0070d2]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">위치</label>
                        <input
                          type="text"
                          value={rev.location}
                          onChange={(e) => {
                            updateReview(rev.id, { location: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">고객명</label>
                        <input
                          type="text"
                          value={rev.customerName}
                          onChange={(e) => {
                            updateReview(rev.id, { customerName: e.target.value });
                            triggerSaveToast();
                          }}
                          className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">후기 내용</label>
                      <textarea
                        rows={3}
                        value={rev.content}
                        onChange={(e) => {
                          updateReview(rev.id, { content: e.target.value });
                          triggerSaveToast();
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: 하단 정보 / 회사 기본정보 (COMPANY) */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <strong>홈페이지 하단(Footer) 정보 및 회사 정보 관리:</strong> 상호명, 슬로건, 대표전화, 주소, 대표이사, 사업자번호, 상담시간 및 카피라이트 문구를 수정할 수 있으며 푸터에 즉시 반영됩니다.
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">상호명</label>
                    <input
                      type="text"
                      value={companyForm.brandName}
                      onChange={(e) => {
                        setCompanyForm((prev) => ({ ...prev, brandName: e.target.value }));
                        updateCompany({ brandName: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">대표 슬로건</label>
                    <input
                      type="text"
                      value={companyForm.slogan}
                      onChange={(e) => {
                        setCompanyForm((prev) => ({ ...prev, slogan: e.target.value }));
                        updateCompany({ slogan: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">대표 전화번호 / 상담번호</label>
                    <input
                      type="text"
                      value={companyForm.phone}
                      onChange={(e) => {
                        setCompanyForm((prev) => ({ ...prev, phone: e.target.value }));
                        updateCompany({ phone: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none font-bold text-[#0070d2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">대표이사 성명</label>
                    <input
                      type="text"
                      value={companyForm.ceo}
                      onChange={(e) => {
                        setCompanyForm((prev) => ({ ...prev, ceo: e.target.value }));
                        updateCompany({ ceo: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">사업자등록번호</label>
                    <input
                      type="text"
                      value={companyForm.businessNumber}
                      onChange={(e) => {
                        setCompanyForm((prev) => ({ ...prev, businessNumber: e.target.value }));
                        updateCompany({ businessNumber: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">사업장 주소</label>
                    <input
                      type="text"
                      value={companyForm.address}
                      onChange={(e) => {
                        setCompanyForm((prev) => ({ ...prev, address: e.target.value }));
                        updateCompany({ address: e.target.value });
                        triggerSaveToast();
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">상담 및 운영 시간 안내 문구</label>
                  <input
                    type="text"
                    value={companyForm.consultationHours || ''}
                    placeholder="예: 연중무휴: 08:00 ~ 20:00 (야간 및 주말 긴급상담 가능)"
                    onChange={(e) => {
                      setCompanyForm((prev) => ({ ...prev, consultationHours: e.target.value }));
                      updateCompany({ consultationHours: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">하단 저작권 표기 텍스트 (Copyright)</label>
                  <input
                    type="text"
                    value={companyForm.copyright || ''}
                    placeholder="예: © 2025 에어컨신 (airconSIN). All rights reserved."
                    onChange={(e) => {
                      setCompanyForm((prev) => ({ ...prev, copyright: e.target.value }));
                      updateCompany({ copyright: e.target.value });
                      triggerSaveToast();
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none font-mono text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm('초기 데이터로 되돌리시겠습니까? 직접 입력한 내용은 삭제됩니다.')) {
                resetToDefaults();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기값 복원</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0070d2] hover:bg-[#005fb8] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>저장 및 닫기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
