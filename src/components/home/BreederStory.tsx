import React from 'react';
import { Heart, ShieldCheck, MessageCircle, CheckCircle2 } from 'lucide-react';

export const BreederStory: React.FC = () => {
  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Story (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white relative">
              <img
                src="https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80"
                alt="Aquarist caring for Betta fish in natural planted tanks"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                  Bengaluru Facility
                </span>
                <p className="text-xs text-slate-200 mt-0.5">
                  Individual filtered tanks with natural Catappa leaf tannins.
                </p>
              </div>
            </div>

            {/* Floating Human Touch Badge */}
            <div className="absolute -top-3 -right-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div className="text-xs">
                <strong className="block text-slate-900 font-bold">Ethical Fishkeeping</strong>
                <span className="text-slate-500 text-[11px]">Conditioned with live food</span>
              </div>
            </div>
          </div>

          {/* Right Text & Human Commitments (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full inline-block mb-2.5 font-mono border border-teal-200">
                Direct From Hobbyist Breeders
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display tracking-tight leading-tight">
                "We are hobbyists first, breeders second, and sellers last."
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We started Betta Aquatics to bring genuine animal welfare to online ornamental fish keeping in India. Every single Betta on our store is housed in its own individual, planted tank with stable tropical temperatures, filtered water, and high-protein nutrition.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>WYSIWYG: Exact Fish Pictured</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  The photograph you see is the exact live specimen packaged for you.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pure Medical Oxygen Packing</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Sealed with pure oxygen to ensure your fish arrives swimming and active.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask our Aquarist on WhatsApp</span>
              </a>
              <span className="text-[11px] text-slate-500">
                Need tank cycling advice or water parameters? We reply daily.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
