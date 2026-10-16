import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Plane, MessageCircle } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Bangalore Quarantine Facility • Pan-India Delivery</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-[1.15]">
              Hand-Raised Bettas & Ornamental Fish, Delivered Safely to Your Door.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              Every Betta is individually photographed and conditioned in planted tanks. Shipped via certified overnight air cargo in insulated medical oxygen packing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/shop?cat=cat-betta"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
              >
                <span>Shop Show Bettas</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </Link>

              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm transition-all active:scale-95"
              >
                <span>View All Fish & Plants</span>
              </Link>
            </div>

            {/* Trust Highlights Mini Strip */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>100% Live Arrival Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Plane className="w-4 h-4 text-teal-600" />
                <span>Overnight Air Cargo</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Breeder WhatsApp Support</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card (Simple, Lightweight & Natural) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"
                alt="Royal Blue Halfmoon Betta Specimen"
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 block font-mono">
                    WYSIWYG Specimen
                  </span>
                  <span className="font-bold text-xs text-slate-900 block truncate">
                    Royal Blue Halfmoon Betta
                  </span>
                </div>
                <Link
                  to="/product/royal-blue-halfmoon-betta"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
