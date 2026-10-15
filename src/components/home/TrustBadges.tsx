import React from 'react';
import { ShieldCheck, Wind, ThermometerSnowflake, HeartPulse } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-ocean-950 via-ocean-900 to-ocean-950 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-aqua-400 block mb-1">
            Gold Standard Animal Welfare
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">
            Why Our Live Fish Travel Safer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            We operate the most technologically advanced packing facility in Indian aquaculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-ocean-900/60 border border-ocean-800 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-aqua-500/20 border border-aqua-400/40 text-aqua-300 flex items-center justify-center mb-3 shadow-glow-aqua">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Medical Pure Oxygen</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every bag is pressurized with 99.5% medical oxygen, guaranteeing 72+ hours of active respiration for the fish.
            </p>
          </div>

          <div className="bg-ocean-900/60 border border-ocean-800 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-aqua-500/20 border border-aqua-400/40 text-aqua-300 flex items-center justify-center mb-3 shadow-glow-aqua">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">EPS Thermal Insulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-density molded thermocol crates with calibrated heating or cooling gel packs shield livestock against transit temperature swings.
            </p>
          </div>

          <div className="bg-ocean-900/60 border border-ocean-800 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-aqua-500/20 border border-aqua-400/40 text-aqua-300 flex items-center justify-center mb-3 shadow-glow-aqua">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">Stress-Coat Conditioning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enriched with organic Catappa tannins and slime-coat electrolytes so your Betta arrives relaxed and vibrant.
            </p>
          </div>

          <div className="bg-ocean-900/60 border border-ocean-800 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-aqua-500/20 border border-aqua-400/40 text-aqua-300 flex items-center justify-center mb-3 shadow-glow-aqua">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1.5">100% Live Arrival Cover</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If any fish fails to arrive in prime health, our 2-hour unboxing policy guarantees an immediate replacement or full store credit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
