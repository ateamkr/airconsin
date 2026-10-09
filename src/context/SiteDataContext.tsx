import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteData,
  HeroSlide,
  StatItem,
  ReviewItem,
  AfterServiceData,
  CompanyInfo,
  NavMenuItem,
  SiteSettings,
  ConsultationInquiry,
  HonestEstimateData,
  HonestEstimateItem,
  ConsultationSectionData,
  GrowthTrustData,
  GrowthTrustCard,
  MottoSectionData,
} from '../types/siteData.ts';

const STORAGE_KEY = 'airconsin_site_data_v4';

export const DEFAULT_SITE_DATA: SiteData = {
  company: {
    brandName: '에어컨신 (airconSIN)',
    slogan: '믿고 맡기는 에어컨설치',
    phone: '010-4653-8887',
    address: '경기 남양주시 진건읍 경춘로725번안길 76',
    ceo: '문필주',
    businessNumber: '735-17-00967',
    consultationHours: '연중무휴: 08:00 ~ 20:00 (야간 및 주말 긴급상담 가능)',
    copyright: '© 2025 에어컨신 (airconSIN). All rights reserved.',
  },
  settings: {
    customLogoUrl: '',
    kakaoChannelUrl: 'https://pf.kakao.com',
    notificationEmail: 'ateamshero@gmail.com',
    adminPassword: '8849',
  },
  navMenu: [
    { id: 'menu-1', label: '브랜드 스토리', enabled: true, type: 'section', target: 'brand-story' },
    { id: 'menu-2', label: '시공사례', enabled: true, type: 'section', target: 'portfolio' },
    { id: 'menu-3', label: '설치후기', enabled: true, type: 'section', target: 'reviews' },
    { id: 'menu-4', label: '사후관리', enabled: true, type: 'section', target: 'after-service' },
    { id: 'menu-5', label: '문의하기', enabled: true, type: 'section', target: 'contact' },
    { id: 'menu-6', label: '간편견적센터', enabled: true, type: 'modal', target: 'quote' },
    { id: 'menu-7', label: '공식 블로그', enabled: true, type: 'external', target: 'https://blog.naver.com' },
    { id: 'menu-8', label: '공식 유튜브', enabled: true, type: 'external', target: 'https://youtube.com' },
  ],
  heroSlides: [
    {
      id: 'slide-1',
      badge: '믿고 맡기는 에어컨설치',
      title: '정직한 시공, 정직한 견적',
      subtitle: '에어컨신은 \'마진\'이 아닌 \'고객\'을 남기는 정직함으로 시공합니다.',
      bgGradient: 'from-[#0d161d] via-[#1a2530] to-[#0c141a]',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    },
    {
      id: 'slide-2',
      badge: '20년 숙련 엔지니어 직접 시공',
      title: '공간의 가치를 높이는 완벽한 공조 설계',
      subtitle: 'LG · 삼성 공식 인증 설치 마스터가 배관 라인부터 마감까지 티 없이 완벽하게 진행합니다.',
      bgGradient: 'from-[#0b1b2b] via-[#162a3f] to-[#0a1522]',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
    },
    {
      id: 'slide-3',
      badge: '무결점 진공 시공 & 책임 A/S',
      title: '0.5Torr 이하 완벽 진공, 냉매 누설 0%',
      subtitle: '100% 정품 동배관 규격 시공과 철저한 사후 관리로 안심하고 맡기실 수 있습니다.',
      bgGradient: 'from-[#0a2233] via-[#14334a] to-[#081b29]',
      imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1920&q=80',
    },
  ],
  stats: [
    {
      id: 'stat-1',
      value: 200,
      unit: '%',
      label: '~23년 계약 유치',
      subtext: '전년 대비 폭발적 성장',
    },
    {
      id: 'stat-2',
      value: 153,
      unit: '%',
      label: '2024년 계약 유치',
      subtext: '안정적인 신뢰 확보',
    },
    {
      id: 'stat-3',
      value: 175,
      unit: '억',
      label: '2024년 기준 매출',
      subtext: '투명하고 탄탄한 재무 건전성',
    },
    {
      id: 'stat-4',
      value: 4000,
      unit: '+',
      label: '고객 유치',
      subtext: '누적 시공 고객 수',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      title: '다산 자연앤자이 4대 시공 후기',
      location: '경기 남양주시 다산동',
      customerName: '김*현 고객님',
      rating: 5,
      date: '2024.11.20',
      product: 'LG 휘센 MULTI V 4대 (거실/안방/방2/방3)',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      content: '입주 전 시스템에어컨 고민이 많았는데 문필주 대표님이 직접 오셔서 천장 실측부터 꼼꼼히 체크해주셨습니다. 단내림 이음새도 감쪽같고 도배 마감까지 예술입니다! 가격도 거품 없이 정직해서 대만족입니다.',
    },
    {
      id: 'rev-2',
      title: '별내 아이파크 2차 거주 중 시공',
      location: '경기 남양주시 별내동',
      customerName: '이*수 고객님',
      rating: 5,
      date: '2024.10.15',
      product: '삼성 무풍 시스템 SAC 3대',
      imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80',
      content: '살고 있는 집이라 먼지 날릴까 걱정했는데 비닐 보양을 집 전체에 빈틈없이 해주셔서 가구에 먼지 하나 안 묻었습니다. 아침에 시작해서 저녁에 완벽 테스트까지 끝내주셔서 감사했습니다.',
    },
    {
      id: 'rev-3',
      title: '진건 현대아파트 노후 교체 공사',
      location: '경기 남양주시 진건읍',
      customerName: '박*철 고객님',
      rating: 5,
      date: '2024.12.02',
      product: 'LG 프리미엄 1-WAY 올인원 3대',
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      content: '15년 된 구형 에어컨 철거하고 배관 질소 세척까지 깨끗하게 해서 새로 설치했습니다. 소음도 전혀 없고 찬 바람도 정말 강력해요. 동네에서 왜 에어컨신 에어컨신 하는지 알겠네요.',
    },
    {
      id: 'rev-4',
      title: '반포 자이 아파트 인테리어 협업',
      location: '서울 서초구 반포동',
      customerName: '정*우 고객님',
      rating: 5,
      date: '2024.09.28',
      product: '삼성 무풍 시스템 1-WAY 4대',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      content: '인테리어 목공 및 간접조명 박스와 단차 하나 없이 딱 맞추어 주셨습니다. 공조 배관 드레인 기울기까지 레이저 레벨기로 확인시켜 주셔서 믿음이 갔습니다.',
    },
    {
      id: 'rev-5',
      title: '구리 갈매역 아이파크 공동구매',
      location: '경기 구리시 갈매동',
      customerName: '최*민 고객님',
      rating: 5,
      date: '2024.11.08',
      product: 'LG 휘센 인버터 시스템 4대',
      imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=600&q=80',
      content: '입주민 단체 공동구매로 합리적인 가격에 진행했습니다. 배관 진공도 측정 수치 0.5Torr 사진으로 실시간 전송해주시는 꼼꼼함에 감동했습니다. 사후관리도 든든합니다.',
    },
    {
      id: 'rev-6',
      title: '하남 미사 강변도시 신축 입주 시공',
      location: '경기 하남시 미사강변',
      customerName: '오*영 고객님',
      rating: 5,
      date: '2024.08.19',
      product: 'LG MULTI V 프리미엄 5대 (올교체)',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
      content: '방 4개와 거실까지 총 5대 풀 시공했습니다. 실외기실 루버창 높이에 맞게 바람막이 에어가이드까지 완벽 세팅해주셔서 열기 배출도 시원하게 잘 됩니다. 강력 추천합니다!',
    },
  ],
  afterService: {
    title: '에어컨신의 시공은 확실한 A/S까지 포함됩니다.',
    kicker: '저희의 시공은 고객님께서 만족하실 때까지 이어집니다. 따라서 A/S 또한 완벽을 추구합니다!',
    subtitle: '누액 · 누설 · 누수 하자 보수 A/S',
    centerImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    steps: [
      {
        number: '1',
        title: '상황 발생 시 방문 및 초기 상황 파악',
        desc: '접수 즉시 전담 엔지니어 배정, 24시간 내 유선 상담 및 현장 방문 일정 수립',
      },
      {
        number: '2',
        title: '시공 상태 점검 및 문제 분석',
        desc: '디지털 매니폴드 게이지 및 배관 누설 탐지기로 정확한 원인 규명',
      },
      {
        number: '3',
        title: '제품 결함 시 유지보수 연계',
        desc: '제조사(LG/삼성) 공식 서비스센터 긴급 부품 연계 및 책임 하자 보수',
      },
    ],
    description: '상황 발생 시 고객님과의 약속을 통해 방문 일정을 조율하고, 현장에서 문제의 원인을 신속히 파악합니다. 이를 통해 누액, 누설, 누수와 같은 문제를 정확히 진단하고 끝까지 책임집니다.',
  },
  growthTrust: {
    kicker: '업계에서 가장 소개가 많은 회사',
    title: '본사는 고객의 신뢰와 함께 성장했습니다.',
    description: '믿고 맡겨주신 고객께서 만족하고 소개해주시며 고객과 함께 성장하는 것이 에어컨신의 자랑입니다.',
    cards: [
      {
        id: 'gt-1',
        category: 'residential',
        title: '주거용 시스템 에어컨',
        description: '주거용 시공공사 전문, 노후 제품 교체공사 전문',
        features: ['아파트 신축 및 입주 전 시공', '구축 아파트 천장 단내림 공사', '기존 노후 2in1/스탠드 교체'],
      },
      {
        id: 'gt-2',
        category: 'commercial',
        title: '상업용 시스템 에어컨',
        description: '아파트, 상가, 오피스텔 외 매립공사 진행',
        features: ['대형 오피스 및 상가 매립 배관', '카페, 식당 맞춤 4-Way/덕트', '설계부터 인허가 도면 감리'],
      },
      {
        id: 'gt-3',
        category: 'group',
        title: '공동구매 전문점',
        description: '합리적인 가격으로 공동구매를 제안',
        features: ['신규 입주단지 공식 협력사', '동별/단지별 단체 할인 혜택', '동일 라인 배관 규격화 특가'],
      },
    ],
  },
  mottoSection: {
    dashMotif: '----',
    title: '정직한 시공으로 오로지 고객을 남기겠습니다.',
    subtitle: '믿고 맡기는 에어컨설치 — 우리가족이 사는 집처럼, 내 가게처럼 생각하며 정성을 다하여 시공하겠습니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  honestEstimate: {
    title: '에어컨신의 정직한 견적 이렇게 만들어집니다',
    kicker: '믿고 맡기는 에어컨설치 — 세심한 품질 관리로 신뢰성을 제공합니다',
    items: [
      {
        id: 'est-1',
        step: '첫번째',
        textBefore: '어떤 환경에서도 ',
        highlight: '최적의 설치 방법',
        textAfter: '을 찾아 시공합니다.',
        detail: '천장 깊이, 스프링클러 배관, 드레인 배수관 구배를 정밀 레이저 실측하여 최적의 단내림 및 설치 루트를 설계합니다.',
      },
      {
        id: 'est-2',
        step: '두번째',
        textBefore: '',
        highlight: '영업책임배상 보험 가입 업체',
        textAfter: '로서 책임감 있는 견적과 서비스를 가지고 있습니다.',
        detail: '현대해상/삼성화재 5억원 영업배상책임보험 정식 가입으로 시공 중 및 시공 후 발생 가능한 모든 리스크를 100% 보장합니다.',
      },
      {
        id: 'est-3',
        step: '세번째',
        textBefore: '',
        highlight: '20년 넘게 지켜온 양심',
        textAfter: ', 에어컨신의 성장의 근간입니다.',
        detail: '불필요한 과다 자재 청구나 비규격 저가 알루미늄 배관을 일체 사용하지 않으며, 100% 동배관 정품 시공만을 고집합니다.',
      },
      {
        id: 'est-4',
        step: '네번째',
        textBefore: '저렴하게 대충하지 않습니다. ',
        highlight: '합리적으로 완벽하게 진행',
        textAfter: '합니다.',
        detail: '무리한 덤핑 공사로 사후 관리를 포기하지 않고, 정직한 표준 공수가 산정으로 끝까지 책임지는 든든한 A/S를 제공합니다.',
      },
    ],
  },
  consultationSection: {
    kicker: '믿고 맡기는 에어컨설치 무료견적 상담신청',
    title: '에어컨신은 언제나 고객과 소통합니다',
    description: '상담부터 고객님께서 이용할 수 있는 모든 경로를 열어두었습니다. 언제든 문의주시면 친절하고 정직하게 안내 드리겠습니다.',
    buttonText: '문의하기',
    bullet1: '연중무휴: 08:00 ~ 20:00 (야간 및 주말 긴급상담 가능)',
    bullet2: '현장 방문 실측 및 레이저 맞춤 견적서 발송 100% 무료',
  },
  inquiries: [
    {
      id: 'inq-sample-1',
      name: '김태형',
      phone: '010-8912-3456',
      message: '다산자연앤자이 84타입 4대 견적 문의드립니다. 신축 입주 예정입니다.',
      date: '2024.11.25 14:32',
      read: true,
    },
  ],
};

interface SiteDataContextType {
  siteData: SiteData;
  updateCompany: (company: Partial<CompanyInfo>) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateNavMenu: (menu: NavMenuItem[]) => void;
  updateNavMenuItem: (id: string, item: Partial<NavMenuItem>) => void;
  updateHeroSlide: (id: string, slide: Partial<HeroSlide>) => void;
  updateHeroSlides: (slides: HeroSlide[]) => void;
  updateStat: (id: string, stat: Partial<StatItem>) => void;
  updateReview: (id: string, review: Partial<ReviewItem>) => void;
  addReview: (review: Omit<ReviewItem, 'id'>) => void;
  deleteReview: (id: string) => void;
  updateAfterService: (afterService: Partial<AfterServiceData>) => void;
  updateGrowthTrust: (growthTrust: Partial<GrowthTrustData>) => void;
  updateGrowthTrustCard: (id: string, card: Partial<GrowthTrustCard>) => void;
  updateMottoSection: (motto: Partial<MottoSectionData>) => void;
  updateHonestEstimate: (honestEstimate: Partial<HonestEstimateData>) => void;
  updateHonestEstimateItem: (id: string, item: Partial<HonestEstimateItem>) => void;
  updateConsultationSection: (consultationSection: Partial<ConsultationSectionData>) => void;
  addInquiry: (inquiry: Omit<ConsultationInquiry, 'id' | 'date'>) => void;
  deleteInquiry: (id: string) => void;
  resetToDefaults: () => void;
  saveAllData: (partial?: Partial<SiteData>) => Promise<boolean>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInitialSyncDone = React.useRef(false);

  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_DATA,
          ...parsed,
          company: { ...DEFAULT_SITE_DATA.company, ...parsed.company },
          settings: { ...DEFAULT_SITE_DATA.settings, ...parsed.settings },
          navMenu: parsed.navMenu && parsed.navMenu.length > 0 ? parsed.navMenu : DEFAULT_SITE_DATA.navMenu,
          heroSlides:
            parsed.heroSlides && parsed.heroSlides.length > 0
              ? parsed.heroSlides.map((slide: HeroSlide, idx: number) => ({
                  ...DEFAULT_SITE_DATA.heroSlides[idx],
                  ...slide,
                  imageUrl:
                    slide.imageUrl !== undefined
                      ? slide.imageUrl
                      : (DEFAULT_SITE_DATA.heroSlides[idx]?.imageUrl || ''),
                }))
              : DEFAULT_SITE_DATA.heroSlides,
          stats: parsed.stats && parsed.stats.length > 0 ? parsed.stats : DEFAULT_SITE_DATA.stats,
          reviews: parsed.reviews && parsed.reviews.length > 0 ? parsed.reviews : DEFAULT_SITE_DATA.reviews,
          afterService: {
            ...DEFAULT_SITE_DATA.afterService,
            ...parsed.afterService,
            centerImageUrl:
              parsed.afterService?.centerImageUrl !== undefined
                ? parsed.afterService.centerImageUrl
                : DEFAULT_SITE_DATA.afterService.centerImageUrl,
          },
          growthTrust: {
            ...DEFAULT_SITE_DATA.growthTrust,
            ...(parsed.growthTrust || {}),
            cards: parsed.growthTrust?.cards || DEFAULT_SITE_DATA.growthTrust.cards,
          },
          mottoSection: {
            ...DEFAULT_SITE_DATA.mottoSection,
            ...(parsed.mottoSection || {}),
          },
          honestEstimate: {
            ...DEFAULT_SITE_DATA.honestEstimate,
            ...(parsed.honestEstimate || {}),
            items: parsed.honestEstimate?.items || DEFAULT_SITE_DATA.honestEstimate.items,
          },
          consultationSection: {
            ...DEFAULT_SITE_DATA.consultationSection,
            ...(parsed.consultationSection || {}),
          },
          inquiries: parsed.inquiries || DEFAULT_SITE_DATA.inquiries,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved site data from localStorage', e);
    }
    return DEFAULT_SITE_DATA;
  });

  // Fetch persistent server-stored data on initial mount (enables cross-device sync like mobile)
  useEffect(() => {
    let isMounted = true;
    fetch('/api/site-data')
      .then(async (res) => {
        if (res.ok) {
          const ct = res.headers.get('content-type');
          if (ct && ct.includes('application/json')) {
            const data = await res.json();
            if (data && typeof data === 'object' && isMounted) {
              setSiteData((prev) => {
                const merged: SiteData = {
                  ...DEFAULT_SITE_DATA,
                  ...data,
                  company: { ...DEFAULT_SITE_DATA.company, ...(data.company || {}) },
                  settings: { ...DEFAULT_SITE_DATA.settings, ...(data.settings || {}) },
                  navMenu: data.navMenu && data.navMenu.length > 0 ? data.navMenu : prev.navMenu,
                  heroSlides:
                    data.heroSlides && data.heroSlides.length > 0
                      ? data.heroSlides
                      : prev.heroSlides,
                  stats: data.stats && data.stats.length > 0 ? data.stats : prev.stats,
                  reviews: data.reviews && data.reviews.length > 0 ? data.reviews : prev.reviews,
                  afterService: {
                    ...DEFAULT_SITE_DATA.afterService,
                    ...(data.afterService || {}),
                  },
                  growthTrust: {
                    ...DEFAULT_SITE_DATA.growthTrust,
                    ...(data.growthTrust || {}),
                  },
                  mottoSection: {
                    ...DEFAULT_SITE_DATA.mottoSection,
                    ...(data.mottoSection || {}),
                  },
                  honestEstimate: {
                    ...DEFAULT_SITE_DATA.honestEstimate,
                    ...(data.honestEstimate || {}),
                  },
                  consultationSection: {
                    ...DEFAULT_SITE_DATA.consultationSection,
                    ...(data.consultationSection || {}),
                  },
                  inquiries: data.inquiries || prev.inquiries || [],
                };
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch (e) {}
                return merged;
              });
            }
          }
        } else if (res.status === 404) {
          // If server file doesn't exist yet, push current local data to initialize server storage
          const local = localStorage.getItem(STORAGE_KEY);
          const dataToPush = local ? JSON.parse(local) : siteData;
          fetch('/api/site-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToPush),
          }).catch(() => {});
        }
      })
      .catch((err) => {
        console.info('Server sync running in local mode:', err);
      })
      .finally(() => {
        isInitialSyncDone.current = true;
      });

    // Listen to storage events for real-time synchronization across multiple browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setSiteData(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save changes to localStorage and send update to backend API server
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch (e) {
      console.warn('Failed to save site data to localStorage', e);
    }

    // Don't auto-send defaults to server before initial fetch completes
    if (!isInitialSyncDone.current) return;

    const timer = setTimeout(() => {
      fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData),
      }).catch((err) => {
        console.warn('Failed to sync to backend /api/site-data:', err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [siteData]);

  const updateCompany = (company: Partial<CompanyInfo>) => {
    setSiteData((prev) => ({
      ...prev,
      company: { ...prev.company, ...company },
    }));
  };

  const updateSettings = (settings: Partial<SiteSettings>) => {
    setSiteData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  const updateNavMenu = (menu: NavMenuItem[]) => {
    setSiteData((prev) => ({ ...prev, navMenu: menu }));
  };

  const updateNavMenuItem = (id: string, item: Partial<NavMenuItem>) => {
    setSiteData((prev) => ({
      ...prev,
      navMenu: prev.navMenu.map((m) => (m.id === id ? { ...m, ...item } : m)),
    }));
  };

  const updateHeroSlide = (id: string, slide: Partial<HeroSlide>) => {
    setSiteData((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((s) => (s.id === id ? { ...s, ...slide } : s)),
    }));
  };

  const updateHeroSlides = (slides: HeroSlide[]) => {
    setSiteData((prev) => ({ ...prev, heroSlides: slides }));
  };

  const updateStat = (id: string, stat: Partial<StatItem>) => {
    setSiteData((prev) => ({
      ...prev,
      stats: prev.stats.map((st) => (st.id === id ? { ...st, ...stat } : st)),
    }));
  };

  const updateReview = (id: string, review: Partial<ReviewItem>) => {
    setSiteData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) => (r.id === id ? { ...r, ...review } : r)),
    }));
  };

  const addReview = (review: Omit<ReviewItem, 'id'>) => {
    const newId = `rev-${Date.now()}`;
    setSiteData((prev) => ({
      ...prev,
      reviews: [...prev.reviews.slice(0, 5), { id: newId, ...review }],
    }));
  };

  const deleteReview = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
    }));
  };

  const updateAfterService = (data: Partial<AfterServiceData>) => {
    setSiteData((prev) => ({
      ...prev,
      afterService: { ...prev.afterService, ...data },
    }));
  };

  const updateGrowthTrust = (data: Partial<GrowthTrustData>) => {
    setSiteData((prev) => ({
      ...prev,
      growthTrust: { ...prev.growthTrust, ...data },
    }));
  };

  const updateGrowthTrustCard = (id: string, card: Partial<GrowthTrustCard>) => {
    setSiteData((prev) => ({
      ...prev,
      growthTrust: {
        ...prev.growthTrust,
        cards: prev.growthTrust.cards.map((c) => (c.id === id ? { ...c, ...card } : c)),
      },
    }));
  };

  const updateMottoSection = (data: Partial<MottoSectionData>) => {
    setSiteData((prev) => ({
      ...prev,
      mottoSection: {
        ...(prev.mottoSection || DEFAULT_SITE_DATA.mottoSection!),
        ...data,
      },
    }));
  };

  const updateHonestEstimate = (data: Partial<HonestEstimateData>) => {
    setSiteData((prev) => ({
      ...prev,
      honestEstimate: { ...prev.honestEstimate, ...data },
    }));
  };

  const updateHonestEstimateItem = (id: string, item: Partial<HonestEstimateItem>) => {
    setSiteData((prev) => ({
      ...prev,
      honestEstimate: {
        ...prev.honestEstimate,
        items: prev.honestEstimate.items.map((it) => (it.id === id ? { ...it, ...item } : it)),
      },
    }));
  };

  const updateConsultationSection = (data: Partial<ConsultationSectionData>) => {
    setSiteData((prev) => ({
      ...prev,
      consultationSection: { ...prev.consultationSection, ...data },
    }));
  };

  const addInquiry = (inquiry: Omit<ConsultationInquiry, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newInquiry: ConsultationInquiry = {
      id: `inq-${Date.now()}`,
      ...inquiry,
      date: dateStr,
      read: false,
    };
    setSiteData((prev) => ({
      ...prev,
      inquiries: [newInquiry, ...(prev.inquiries || [])],
    }));
  };

  const deleteInquiry = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter((item) => item.id !== id),
    }));
  };

  const resetToDefaults = () => {
    setSiteData(DEFAULT_SITE_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    fetch('/api/site-data/reset', { method: 'POST' }).catch(() => {});
  };

  const saveAllData = async (partial?: Partial<SiteData>): Promise<boolean> => {
    const updated: SiteData = partial ? { ...siteData, ...partial } : siteData;
    setSiteData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
    try {
      const res = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return res.ok;
    } catch (err) {
      console.warn('Backend /api/site-data save error:', err);
      return false;
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        updateCompany,
        updateSettings,
        updateNavMenu,
        updateNavMenuItem,
        updateHeroSlide,
        updateHeroSlides,
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
        addInquiry,
        deleteInquiry,
        resetToDefaults,
        saveAllData,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
