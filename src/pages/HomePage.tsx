import React, { useState, useEffect } from 'react';
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
import { Product, HomepageSection } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';
import { useBranding } from '../contexts/BrandingContext';

export const HomePage: React.FC = () => {
  const { branding } = useBranding();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sections, setSections] = useState<HomepageSection[]>(() => {
    const list = mockDb.getHomepageSections();
    return list.filter(s => s.is_active).sort((a, b) => a.display_order - b.display_order);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const list = mockDb.getHomepageSections();
      setSections(list.filter(s => s.is_active).sort((a, b) => a.display_order - b.display_order));
    };
    window.addEventListener('ba_homepage_updated', handleUpdate);
    return () => window.removeEventListener('ba_homepage_updated', handleUpdate);
  }, []);

  const renderSection = (sec: HomepageSection) => {
    switch (sec.type) {
      case 'hero':
        return <HeroCarousel key={sec.id} section={sec} />;
      case 'categories':
        return <CategoryBar key={sec.id} section={sec} />;
      case 'flash_deal':
        return <FlashDealSection key={sec.id} section={sec} onQuickView={(p) => setQuickViewProduct(p)} />;
      case 'specimen_showcase':
      case 'curated_collection':
        return <SpecimenShowcase key={sec.id} section={sec} onQuickView={(p) => setQuickViewProduct(p)} />;
      case 'breeder_story':
        return <BreederStory key={sec.id} section={sec} />;
      case 'trust_badges':
        return <TrustBadges key={sec.id} section={sec} />;
      case 'care_guide':
        return <CareGuideSection key={sec.id} section={sec} />;
      case 'testimonials':
        return <ReviewCarousel key={sec.id} section={sec} />;
      default:
        return null;
    }
  };

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
      name: branding.site_name || 'Betta Aquatics',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://bettaaquatics.in/',
      logo: branding.logo_url?.startsWith('http') ? branding.logo_url : `https://bettaaquatics.in${branding.logo_url || '/logo.jpeg'}`,
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

      {/* Dynamic Database-Driven CMS Sections */}
      {sections.map(renderSection)}

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
