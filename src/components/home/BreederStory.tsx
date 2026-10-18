import React from 'react';
import { Heart, ShieldCheck, MessageCircle, CheckCircle2 } from 'lucide-react';
import { HomepageSection } from '../../lib/types';

interface BreederStoryProps {
  section?: HomepageSection;
}

export const BreederStory: React.FC<BreederStoryProps> = ({ section }) => {
  const config = section?.config || {};
  const quote = config.quote || '"We are hobbyists first, breeders second, and sellers last."';
  const tag = section?.subtitle || 'Direct From Hobbyist Breeders';
  const description = config.description || 'We started Betta Aquatics to put fish care first. Every Betta lives in its own planted tank with warm, clean water and good food until it heads to your home.';
  const whatsapp = config.whatsapp || '+91 98450 12345';
  const whatsappClean = whatsapp.replace(/[^0-9]/g, '');

  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Story (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white relative">
              <img
                src={config.facilityImage || "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80"}
                alt="Aquarist caring for Betta fish in natural planted tanks"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-white shadow-sm">
                <span className="text-xs font-bold tracking-wide text-white block">
                  Bengaluru Facility ({config.experienceYears || '9+ Years Experience'})
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Individual filtered tanks with natural Catappa leaf tannins.
                </p>
              </div>
            </div>

            {/* Floating Human Touch Badge */}
            <div className="absolute -top-3 -right-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 fill-red-600" />
              </div>
              <div className="text-xs">
                <strong className="block text-slate-900 font-bold">Ethical Fishkeeping</strong>
                <span className="text-slate-600 text-xs">Conditioned with live food</span>
              </div>
            </div>
          </div>

          {/* Right Text & Human Commitments (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full inline-block mb-2.5 border border-blue-200">
                {tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                {quote}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-900 shrink-0" />
                  <span>WYSIWYG: Exact Fish Pictured</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  The photograph you see is the exact live specimen packaged for you.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0" />
                  <span>Pure Medical Oxygen Packing</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
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
                className="btn-primary"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask our Aquarist on WhatsApp</span>
              </a>
              <span className="text-xs text-slate-600">
                Need tank cycling advice or water parameters? We reply daily.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
