import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { StatsBar } from './components/StatsBar.tsx';
import { GrowthTrustSection } from './components/GrowthTrustSection.tsx';
import { MottoSection } from './components/MottoSection.tsx';
import { SpecialReasonSection } from './components/SpecialReasonSection.tsx';
import { EnterpriseAirSection } from './components/EnterpriseAirSection.tsx';
import { ReviewSection } from './components/ReviewSection.tsx';
import { HonestEstimateSection } from './components/HonestEstimateSection.tsx';
import { AfterServiceSection } from './components/AfterServiceSection.tsx';
import { ConsultationFormSection } from './components/ConsultationFormSection.tsx';
import { Footer } from './components/Footer.tsx';
import { QuickQuoteModal } from './components/QuickQuoteModal.tsx';
import { SearchResultModal } from './components/SearchResultModal.tsx';
import { FloatingKakao } from './components/FloatingKakao.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { PasswordModal } from './components/PasswordModal.tsx';
import { SiteDataProvider } from './context/SiteDataContext.tsx';

function MainApp() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const handleNavigateSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyQuote = (summary: string) => {
    const messageInput = document.querySelector('textarea') as HTMLTextAreaElement | null;
    if (messageInput) {
      messageInput.value = summary;
      messageInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    handleNavigateSection('contact');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#0070d2] selection:text-white">
      {/* 1. Header Navigation Bar (Clean GNB without Admin button) */}
      <Header
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Page Content Flow */}
      <main className="flex-1 w-full">
        {/* 2. Hero Section with 3 Rolling Slides and Text Motion Action */}
        <HeroSection onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

        {/* 3. Metrics Statistics Bar with Count-Up Number Action */}
        <StatsBar
          onOpenKakaoChat={() => {
            const kakaoBtn = document.querySelector('[aria-label="카카오톡 1:1 상담 (새 창 열림)"]') as HTMLButtonElement | null;
            if (kakaoBtn) kakaoBtn.click();
          }}
        />

        {/* 4. Customer Trust & 3 Service Feature Cards */}
        <GrowthTrustSection
          onSelectCategory={() => {
            setIsQuoteModalOpen(true);
          }}
        />

        {/* 5. Integrity Motto Section */}
        <MottoSection />

        {/* 6. Special Reason & Certifications (Samsung SAC & LG Certificates) */}
        <SpecialReasonSection />

        {/* 7. Enterprise Recognition & Clean Air Solution (시공사례 #portfolio) */}
        <div id="portfolio">
          <EnterpriseAirSection />
        </div>

        {/* 8. Customer Installation Review Section (설치후기 #reviews - 6 Items with photo upload) */}
        <ReviewSection />

        {/* 9. The 4 Honest Estimate Commitments (Full-width Banner) */}
        <HonestEstimateSection />

        {/* 10. Reliable After Service Support (사후관리 #after-service with customizable center image) */}
        <AfterServiceSection
          onOpenConsultationModal={() => setIsQuoteModalOpen(true)}
        />

        {/* 11. Quick Consultation & Estimate Lead Capture Form (Sends email alert & logs in inbox) */}
        <ConsultationFormSection
          onSuccessSubmit={() => {}}
        />
      </main>

      {/* 12. Complete Footer (Has '로그인' link with Password 8849 verification) */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onOpenKakaoChat={() => {
          const kakaoBtn = document.querySelector('[aria-label="카카오톡 1:1 상담 (새 창 열림)"]') as HTMLButtonElement | null;
          if (kakaoBtn) kakaoBtn.click();
        }}
        onOpenLogin={() => setIsPasswordModalOpen(true)}
      />

      {/* Floating KakaoTalk Consultation (Opens configurable URL in new window) */}
      <FloatingKakao
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Interactive Quick Quote Estimator Modal */}
      {isQuoteModalOpen && (
        <QuickQuoteModal
          onClose={() => setIsQuoteModalOpen(false)}
          onApplyQuote={handleApplyQuote}
        />
      )}

      {/* Search Result & Case Studies Modal */}
      {searchQuery !== null && (
        <SearchResultModal
          query={searchQuery}
          onClose={() => setSearchQuery(null)}
          onSelectEstimate={(caseItem) => {
            handleApplyQuote(
              `[시공사례 견적문의] ${caseItem.name} (${caseItem.units}, ${caseItem.brand})`
            );
          }}
        />
      )}

      {/* Password Prompt Modal (Verifies '8849' before opening Admin Dashboard) */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => setIsAdminOpen(true)}
      />

      {/* Full Admin Management Dashboard (Menus, Logo, Email, Kakao, Slides, Reviews, A/S, Inquiries) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <MainApp />
    </SiteDataProvider>
  );
}
