import React from 'react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDb } from '../../lib/mockDatabase';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../lib/types';

interface FlashDealSectionProps {
  onQuickView?: (product: Product) => void;
}

export const FlashDealSection: React.FC<FlashDealSectionProps> = ({ onQuickView }) => {
  const products = mockDb.getProducts().filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 4);

  return (
    <section className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Promotional Pricing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Weekly Featured Fish & Special Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Healthy quarantine-approved specimens ready for immediate dispatch.
            </p>
          </div>

          <Link
            to="/shop?filter=sale"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 shrink-0"
          >
            <span>View All Specials</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
};
