import React from 'react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDb } from '../../lib/mockDatabase';
import { ProductCard } from '../common/ProductCard';
import { Product, HomepageSection } from '../../lib/types';

interface FlashDealSectionProps {
  section?: HomepageSection;
  onQuickView?: (product: Product) => void;
}

export const FlashDealSection: React.FC<FlashDealSectionProps> = ({ section, onQuickView }) => {
  const products = mockDb.getProducts().filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 4);

  const title = section?.title || 'Weekly Featured Fish & Special Offers';
  const subtitle = section?.subtitle || 'Healthy quarantine-approved specimens ready for immediate dispatch.';
  const bannerText = section?.config?.bannerText || 'Promotional Pricing';

  return (
    <section className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{bannerText}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {subtitle}
            </p>
          </div>

          <Link
            to="/shop?filter=sale"
            className="text-xs sm:text-sm font-semibold text-red-600 hover:underline flex items-center gap-1 shrink-0"
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
