import React from 'react';
import { ShieldCheck, Wind, ThermometerSnowflake, HeartPulse } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            Safe Fish Transport
          </span>
          <h2 className="text-xl sm:text-3xl font-bold font-display text-slate-900 mb-2">
            Why Our Live Fish Arrive Healthy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dedicated quarantine and temperature-regulated transit protocols for every order across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Medical Pure Oxygen</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every shipping bag is pressurized with pure medical oxygen, providing 72+ hours of respiration.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Thermal Insulation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-density molded crates with seasonal gel packs protect live fish from heat and cold transit swings.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Stress-Coat Water</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enriched with organic Indian almond tannins and electrolytes to keep Bettas calm during transit.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Live Arrival Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full transit protection. If any fish does not arrive active and healthy, we issue an instant replacement or refund.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
