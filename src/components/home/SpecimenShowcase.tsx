import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDb } from '../../lib/mockDatabase';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../lib/types';

interface SpecimenShowcaseProps {
  onQuickView?: (product: Product) => void;
}

const STRAIN_TABS = [
  { id: 'all', label: 'All Bettas' },
  { id: 'Halfmoon', label: 'Halfmoon' },
  { id: 'Plakat', label: 'Koi Plakat' },
  { id: 'Crowntail', label: 'Crowntail' },
  { id: 'Dumbo', label: 'Dumbo Ear' },
];

export const SpecimenShowcase: React.FC<SpecimenShowcaseProps> = ({ onQuickView }) => {
  const [activeTab, setActiveTab] = useState('all');
  const allProducts = mockDb.getProducts();

  const bettaProducts = allProducts.filter((p) => p.category_id === 'cat-betta');

  const filtered = bettaProducts.filter((p) => {
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
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Live Stock Catalog
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 font-display">
              Bettas by Variety & Tail Type
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a strain to filter our Bangalore quarantined live inventory.
            </p>
          </div>

          {/* Strain Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {STRAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
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
            to="/shop?cat=cat-betta"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
          >
            <span>Explore All {bettaProducts.length} Bettas</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};
