import React, { useState } from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryBar } from '../components/home/CategoryBar';
import { FlashDealSection } from '../components/home/FlashDealSection';
import { SpecimenShowcase } from '../components/home/SpecimenShowcase';
import { CareGuideSection } from '../components/home/CareGuideSection';
import { TrustBadges } from '../components/home/TrustBadges';
import { ReviewCarousel } from '../components/home/ReviewCarousel';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../lib/types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Campaign Banner */}
      <HeroCarousel />

      {/* 2. Category Discovery Strip */}
      <CategoryBar />

      {/* 3. Deal of the Day / Flash Specimen Drop */}
      <FlashDealSection onQuickView={(p) => setQuickViewProduct(p)} />

      {/* 4. Main Living Specimen Showcase (Show Bettas & Strain Tabs) */}
      <SpecimenShowcase onQuickView={(p) => setQuickViewProduct(p)} />

      {/* 5. Gold Standard Packing & Welfare Trust Badges */}
      <TrustBadges />

      {/* 6. Betta Care & Acclimation Masterclass */}
      <CareGuideSection />

      {/* 7. Verified Customer Feedback */}
      <ReviewCarousel />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
