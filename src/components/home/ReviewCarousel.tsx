import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';

export const ReviewCarousel: React.FC = () => {
  const reviews = mockDb.getReviews();

  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-aqua-700 block mb-1">
            Verified Hobbyist Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ocean-950 font-display mb-2">
            Loved By Over 12,000 Aquarists Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Read real feedback from hobbyists who experienced our transit care and fish vitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-2">
                  "{rev.title}"
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{rev.user_name}</span>
                <span className="text-slate-400 font-medium">Pan-India Express Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
