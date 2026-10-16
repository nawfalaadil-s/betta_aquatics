import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';

export const CategoryBar: React.FC = () => {
  const categories = mockDb.getCategories();
  const products = mockDb.getProducts();

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 block mb-1">
              Curated Collections
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-ocean-950 font-display">
              Explore By Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-aqua-700 hover:text-aqua-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category Carousel on Mobile / Grid on Desktop */}
        <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pb-2 snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/shop?cat=${cat.id}`}
                className="w-32 shrink-0 snap-start sm:w-auto group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-aqua-400 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col p-2 text-center"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-ocean-950/20 group-hover:bg-ocean-950/10 transition-colors" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-aqua-700 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {count} {count === 1 ? 'Variety' : 'Varieties'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
