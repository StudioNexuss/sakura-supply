import React from 'react';
import EmbeddedStockGrid from '../Home/EmbeddedStockGrid';
import { CherryBlossomTreeIcon } from '../Header';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#09090b] py-8">
      {/* Top Header Banner for Shop */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-4">
        <div className="bg-[#101018] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-sakura-900/40">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakura-950 text-sakura-300 text-xs font-bold uppercase tracking-wider mb-3 border border-sakura-800/40">
              <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
              Melbourne Warehouse Inventory
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Shop All Stock & Pre-Orders
            </h1>
            <p className="mt-2 text-sakura-200/80 text-xs sm:text-sm leading-relaxed">
              Explore authentic factory-sealed collector cards, booster boxes, and statues with optional protective cases and secure PayPal payments.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Stock Grid */}
      <EmbeddedStockGrid isStandaloneShop={true} />
    </div>
  );
}
