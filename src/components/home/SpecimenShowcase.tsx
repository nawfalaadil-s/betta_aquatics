import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDb } from '../../lib/mockDatabase';
import { ProductCard } from '../common/ProductCard';
import { Product, HomepageSection } from '../../lib/types';

interface SpecimenShowcaseProps {
  section?: HomepageSection;
  onQuickView?: (product: Product) => void;
}

const STRAIN_TABS = [
  { id: 'all', label: 'All Bettas' },
  { id: 'Halfmoon', label: 'Halfmoon' },
  { id: 'Plakat', label: 'Koi Plakat' },
  { id: 'Crowntail', label: 'Crowntail' },
  { id: 'Dumbo', label: 'Dumbo Ear' },
];

export const SpecimenShowcase: React.FC<SpecimenShowcaseProps> = ({ section, onQuickView }) => {
  const [activeTab, setActiveTab] = useState('all');
  const allProducts = mockDb.getProducts();

  const targetCategory = section?.config?.filterCategory || 'cat-betta';
  const categoryProducts = allProducts.filter((p) => p.category_id === targetCategory);

  const title = section?.title || 'Bettas by Variety & Tail Type';
  const subtitle = section?.subtitle || 'Select a strain to filter our Bangalore quarantined live inventory.';
  const ctaLink = section?.config?.ctaLink || `/shop?cat=${targetCategory}`;

  const filtered = categoryProducts.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'Dumbo') return p.strain?.includes('Dumbo');
    if (activeTab === 'Plakat') return p.strain?.includes('Plakat');
    return p.strain?.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-blue-900 block mb-1">
              Live Stock Catalog
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 font-display">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {subtitle}
            </p>
          </div>

          {/* Strain Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {STRAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap ${
                  activeTab === tab.id ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            to={ctaLink}
            className="btn-primary"
          >
            <span>Explore All {categoryProducts.length} Specimens</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
};
