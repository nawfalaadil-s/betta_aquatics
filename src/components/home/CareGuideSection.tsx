import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Thermometer, Utensils, HeartHandshake, ArrowRight } from 'lucide-react';

const GUIDES = [
  {
    icon: Droplet,
    title: 'Water Parameters & pH',
    description: 'Bettas thrive in soft, slightly acidic to neutral water (pH 6.5 - 7.5). Avoid sudden chemistry changes and always condition tap water with Catappa tannins.',
    metric: 'pH 6.5 - 7.5',
  },
  {
    icon: Thermometer,
    title: 'Temperature Stability',
    description: 'As tropical labyrinth fish, Bettas require stable temperatures between 24°C and 28°C. A reliable aquarium heater prevents lethargy and immune drop.',
    metric: '24°C - 28°C',
  },
  {
    icon: Utensils,
    title: 'Nutrition & Live Feeds',
    description: 'Feed 3-4 micro-pellets twice daily. Supplement 2-3 times weekly with frozen bloodworms or live daphnia for intense color development and digestion.',
    metric: '2x Daily Small Feeds',
  },
  {
    icon: HeartHandshake,
    title: 'Acclimation & Care',
    description: 'Always float the bag for 15-20 minutes, gradually add tank water over 20 minutes, and never dump transit bag water into your established display tank.',
    metric: 'Float + Drip 30 Mins',
  }
];

export const CareGuideSection: React.FC = () => {
  return (
    <section className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 block mb-1">
            Aquarist Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ocean-950 font-display mb-2">
            The Betta Aquatics Care Masterclass
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to ensure your aquatic jewels thrive for years to come.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GUIDES.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 hover:border-aqua-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-aqua-100 text-aqua-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {g.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Optimal:</span>
                  <span className="font-bold text-ocean-900 font-mono">{g.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/page/shipping-acclimation"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-aqua-700 hover:text-aqua-800"
          >
            <span>Read Complete Acclimation & Live Arrival Guarantee Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
