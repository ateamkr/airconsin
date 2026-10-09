export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  imageUrl?: string;
}

export interface StatItem {
  id: string;
  value: number;
  unit: string;
  label: string;
  subtext: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  location: string;
  customerName: string;
  rating: number;
  date: string;
  product: string;
  imageUrl: string;
  content: string;
}

export interface AfterServiceData {
  title: string;
  kicker: string;
  subtitle: string;
  centerImageUrl: string;
  steps: {
    number: string;
    title: string;
    desc: string;
  }[];
  description: string;
}

export interface CompanyInfo {
  brandName: string;
  slogan: string;
  phone: string;
  address: string;
  ceo: string;
  businessNumber: string;
  consultationHours?: string;
  copyright?: string;
}

export interface HonestEstimateItem {
  id: string;
  step: string;
  textBefore: string;
  highlight: string;
  textAfter: string;
  detail?: string;
}

export interface HonestEstimateData {
  title: string;
  kicker: string;
  items: HonestEstimateItem[];
}

export interface ConsultationSectionData {
  kicker: string;
  title: string;
  description: string;
  buttonText: string;
  bullet1: string;
  bullet2: string;
}

export interface GrowthTrustCard {
  id: string;
  category: string;
  title: string;
  description: string;
  features?: string[];
  badge?: string;
  actionText?: string;
}

export interface GrowthTrustData {
  kicker: string;
  title: string;
  description: string;
  cards: GrowthTrustCard[];
}

export interface MottoSectionData {
  dashMotif?: string;
  title: string;
  subtitle: string;
  youtubeUrl: string;
}

export interface NavMenuItem {
  id: string;
  label: string;
  enabled: boolean;
  type: 'section' | 'modal' | 'external';
  target: string; // section ID or external URL
}

export interface ConsultationInquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  read?: boolean;
}

export interface SiteSettings {
  customLogoUrl: string;
  kakaoChannelUrl: string;
  notificationEmail: string;
  adminPassword?: string;
}

export interface SiteData {
  company: CompanyInfo;
  settings: SiteSettings;
  navMenu: NavMenuItem[];
  heroSlides: HeroSlide[];
  stats: StatItem[];
  reviews: ReviewItem[];
  afterService: AfterServiceData;
  growthTrust: GrowthTrustData;
  mottoSection?: MottoSectionData;
  honestEstimate: HonestEstimateData;
  consultationSection: ConsultationSectionData;
  inquiries: ConsultationInquiry[];
}
