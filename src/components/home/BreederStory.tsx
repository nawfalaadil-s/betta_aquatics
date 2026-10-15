import React from 'react';
import { Heart, ShieldCheck, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const BreederStory: React.FC = () => {
  return (
    <section className="py-16 bg-warm-50 border-b border-warm-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Visual Story (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
              <img
                src="https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80"
                alt="Aquarist gently caring for a living show Betta specimen in natural aquatic plants"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-aqua-300 block">
                  Bengaluru Biosecure Sanctuary
                </span>
                <p className="text-xs font-medium text-slate-200">
                  Individual high-filtration tanks with live Catappa tannins & gentle currents.
                </p>
              </div>
            </div>

            {/* Floating Human Touch Badge */}
            <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-lg border border-warm-200 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div className="text-xs">
                <strong className="block text-slate-900 font-display">100% Ethical Care</strong>
                <span className="text-slate-500 text-[11px]">Conditioned with live artemia</span>
              </div>
            </div>
          </div>

          {/* Right Text & Human Commitments (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 bg-aqua-100/60 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                The People Behind Betta Aquatics
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ocean-950 font-display tracking-tight leading-tight">
                "We’re hobbyists first, breeders second, and sellers last."
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We started Betta Aquatics because we were tired of seeing magnificent living creatures shipped across India in suffocating plastic cups. Every single Betta on this platform is housed in its own individual, planted tank with stable tropical temperatures and conditioned water.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-warm-200/80 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-aqua-600 shrink-0" />
                  <span>Exact Fish You Choose</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  What you see on video is the exact fish packaged for you. Never generic warehouse replacements.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-warm-200/80 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Oxygen-Packed With Love</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Pure medical oxygen & calibrated thermal insulation ensures your fish arrives swimming and hungry.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Talk to Anand (Head Aquarist) on WhatsApp</span>
              </a>
              <span className="text-[11px] text-slate-500 text-center sm:text-left">
                Need help setting up your first tank? We answer in minutes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
