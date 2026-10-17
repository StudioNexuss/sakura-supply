import React from 'react';
import { useStore } from '../../context/StoreContext';
import { REVIEWS } from '../../data/reviews';
import { CherryBlossomTreeIcon } from '../Header';
import { Star, CheckCircle2 } from 'lucide-react';

export default function CustomerReviews() {
  const { orderCount } = useStore();
  const displayOrders = orderCount || 220;
  return (
    <section className="py-12 bg-[#09090b] border-b border-sakura-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
              <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
              Verified Australian Collector Feedback
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Customer Reviews & Experiences
            </h2>
            <p className="text-sakura-300/70 text-xs sm:text-sm mt-1">
              Independent reviews from Australian collectors protected with PayPal Buyer Protection.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#12121a] border border-sakura-900/40 px-4 py-2 rounded-2xl">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-white">4.98 / 5.0</span>
              <span className="text-sakura-400/70 ml-1.5">({displayOrders}+ orders)</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((rev) => (
            <div 
              key={rev.id}
              className="bg-[#101018] hover:bg-[#141420] border border-sakura-900/40 rounded-3xl p-5 flex flex-col justify-between transition-all hover:border-sakura-500/40"
            >
              <div>
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Comment quote */}
                <p className="text-sakura-200/90 text-xs leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-3 border-t border-sakura-950 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{rev.author}</span>
                  <span className="text-sakura-400/60 text-[10px]">{rev.location}</span>
                </div>
                <div className="text-[11px] text-sakura-400 font-medium truncate mt-0.5">
                  Ordered: {rev.product}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
