import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CherryBlossomTreeIcon } from '../Header';
import { CheckCircle2, Package } from 'lucide-react';

export default function StockShowcase() {
  const { setSelectedProduct, products } = useStore();

  // ONLY use live, non-deleted listings from the store (up to 4 items)
  const liveShowcaseItems = products.slice(0, 4);

  if (!liveShowcaseItems || liveShowcaseItems.length === 0) {
    return null; // Don't render section if there are no live products
  }

  return (
    <section className="py-12 bg-[#09090b] border-b border-sakura-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
              <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
              Verified Inventory Photography
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Real Stock & Pre-Order Showcase
            </h2>
            <p className="text-sakura-300/70 text-xs sm:text-sm mt-1">
              Photographed directly from our Melbourne inventory. Pristine collector packaging.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-sakura-300 bg-[#12121a] px-3 py-1.5 rounded-xl border border-sakura-900/40 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Factory Sealed Packaging</span>
          </div>
        </div>

        {/* Dynamic Visual Showcase Grid - Adapts to live product count (e.g. 1, 2, 3, or 4 items) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${
          liveShowcaseItems.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
        } gap-5`}>
          {liveShowcaseItems.map((product) => {
            const isOut = Number(product.stockCount) <= 0;
            const badgeText = isOut
              ? 'Out of Stock'
              : product.isPreOrder 
                ? 'Pre-Order Allocation' 
                : `In Stock (${product.stockCount || 1})`;

            return (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group relative bg-[#111118] rounded-3xl overflow-hidden border border-sakura-900/40 shadow-xs hover:shadow-xl hover:border-sakura-500/50 transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-[#181824] overflow-hidden">
                  <img 
                    src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-xs border ${
                      isOut
                        ? 'bg-zinc-900/95 text-rose-300 border-rose-500/40'
                        : 'bg-black/80 backdrop-blur-xs text-white border-sakura-900/40'
                    }`}>
                      {badgeText}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-sakura-300 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-sakura-300/70 mt-1 line-clamp-2">
                      {product.shortDescription || product.condition || "Authentic collector stock."}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-sakura-900/30 flex items-center justify-between text-xs">
                    <span className="text-sakura-400 font-bold">${Number(product.basePrice).toFixed(2)} AUD</span>
                    <span className="text-sakura-400 font-bold group-hover:underline">View Details &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
