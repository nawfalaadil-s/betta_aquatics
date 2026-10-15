import React, { useState } from 'react';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryBar } from '../components/home/CategoryBar';
import { FlashDealSection } from '../components/home/FlashDealSection';
import { SpecimenShowcase } from '../components/home/SpecimenShowcase';
import { BreederStory } from '../components/home/BreederStory';
import { CareGuideSection } from '../components/home/CareGuideSection';
import { TrustBadges } from '../components/home/TrustBadges';
import { ReviewCarousel } from '../components/home/ReviewCarousel';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { SEO } from '../components/common/SEO';
import { Product } from '../lib/types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Schema.org Structured Data for WebSite & Organization
  const homepageSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Betta Aquatics',
      url: 'https://bettaaquatics.in/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://bettaaquatics.in/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Betta Aquatics',
      url: 'https://bettaaquatics.in/',
      logo: 'https://bettaaquatics.in/logo-fish.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-98765-43210',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
      sameAs: [
        'https://instagram.com/bettaaquatics',
        'https://wa.me/919876543210',
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Homepage SEO Meta & JSON-LD */}
      <SEO
        title="Betta Aquatics — Pure Strain Ornamental Fish & Aquarium Plants"
        description="India's premier ornamental fish sanctuary. Buy show-grade Halfmoon Bettas, Galaxy Koi Plakats, pure strain guppies, and aquatic plants with 100% Live Arrival Guarantee."
        canonical="https://bettaaquatics.in/"
        jsonLd={homepageSchema}
        keywords={[
          'betta fish online india',
          'buy betta fish bangalore',
          'halfmoon betta price',
          'koi plakat betta',
          'live aquarium plants online',
          'guppy breeding pairs',
          'betta aquatics'
        ]}
      />

      {/* 1. Hero Campaign Banner */}
      <HeroCarousel />

      {/* 2. Category Discovery Strip */}
      <CategoryBar />

      {/* 3. Deal of the Day / Flash Specimen Drop */}
      <FlashDealSection onQuickView={(p) => setQuickViewProduct(p)} />

      {/* 4. Main Living Specimen Showcase (Show Bettas & Strain Tabs) */}
      <SpecimenShowcase onQuickView={(p) => setQuickViewProduct(p)} />

      {/* 5. Human Story: Meet the Breeders Behind Betta Aquatics */}
      <BreederStory />

      {/* 6. Gold Standard Packing & Welfare Trust Badges */}
      <TrustBadges />

      {/* 7. Betta Care & Acclimation Masterclass */}
      <CareGuideSection />

      {/* 8. Verified Customer Feedback */}
      <ReviewCarousel />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
