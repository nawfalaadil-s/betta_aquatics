import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { mockDb } from '../../lib/mockDatabase';

export const ReviewCarousel: React.FC = () => {
  const reviews = mockDb.getReviews();

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            Customer Feedback
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 font-display mb-2">
            Reviews from Fishkeepers Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real feedback on live packaging, temperature maintenance, and fish vitality on arrival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Fishkeeper</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  "{rev.title}"
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{rev.user_name}</span>
                <span className="text-slate-400 text-[11px]">Air Cargo Delivery</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
