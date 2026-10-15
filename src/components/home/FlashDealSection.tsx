import React, { useState, useEffect } from 'react';
import { Clock, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDb } from '../../lib/mockDatabase';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../lib/types';

interface FlashDealSectionProps {
  onQuickView?: (product: Product) => void;
}

export const FlashDealSection: React.FC<FlashDealSectionProps> = ({ onQuickView }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const products = mockDb.getProducts().filter(p => p.compare_at_price && p.compare_at_price > p.price).slice(0, 4);

  return (
    <section className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        {/* Deal Header with Live Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 p-4 sm:p-6 rounded-3xl text-white shadow-xl border border-ocean-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-coral-500/20 border border-coral-400/40 flex items-center justify-center text-coral-400 shrink-0">
              <Zap className="w-6 h-6 fill-coral-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-coral-400">
                  Daily Special Drops
                </span>
                <span className="text-[10px] bg-coral-500/30 text-coral-200 px-2 py-0.5 rounded-full border border-coral-400/40 font-mono">
                  Up to 25% OFF
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display">
                Show Specimen Flash Sale
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-ocean-900/80 border border-ocean-700/80 px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-aqua-400" />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="bg-ocean-950 text-aqua-300 px-2 py-1 rounded-lg border border-ocean-700">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-aqua-400">:</span>
              <span className="bg-ocean-950 text-aqua-300 px-2 py-1 rounded-lg border border-ocean-700">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-aqua-400">:</span>
              <span className="bg-ocean-950 text-aqua-300 px-2 py-1 rounded-lg border border-ocean-700">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* View all sale items */}
        <div className="mt-8 text-center">
          <Link
            to="/shop?filter=sale"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-aqua-700 hover:text-aqua-800 bg-aqua-50 hover:bg-aqua-100 border border-aqua-200/80 px-6 py-2.5 rounded-xl transition-colors"
          >
            <span>View All Sale Specials & Single Specimen Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
