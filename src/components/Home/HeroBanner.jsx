import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BUSINESS_INFO } from '../../data/business';
import { CherryBlossomTreeIcon } from '../Header';
import { ShieldCheck, ArrowRight, Package, CheckCircle2 } from 'lucide-react';

export default function HeroBanner() {
  const { navigateTo, businessInfo } = useStore();
  const currentAbn = (businessInfo && businessInfo.abn) || BUSINESS_INFO.abn;

  const scrollToStock = () => {
    const el = document.getElementById('home-stock-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('shop');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#09090b] text-sakura-100 py-16 sm:py-20 border-b border-sakura-900/40">
      {/* Subtle Sakura Pink Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-sakura-600/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl">
          
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14141e] border border-sakura-500/30 text-sakura-300 text-xs sm:text-sm font-medium mb-6">
            <CherryBlossomTreeIcon className="w-4 h-4" />
            <span>Melbourne, VIC &bull; ABN: {currentAbn}</span>
            <span className="text-sakura-900">&bull;</span>
            <span className="text-sakura-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Factory Sealed
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Authentic Collectibles & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sakura-300 via-sakura-400 to-rose-300">Verified Pre-Orders</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-sakura-200/80 leading-relaxed font-normal">
            Welcome to Sakura Supply. Every collectible is guaranteed factory sealed, tamper-inspected, and packaged with archival protective options from our Melbourne facility. Direct checkout protected under official PayPal Buyer Protection.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToStock}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sakura-600 hover:bg-sakura-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-sakura-600/30 hover:shadow-sakura-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Package className="w-4 h-4" />
              Browse In-Stock & Pre-Orders
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('policies')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#14141e] hover:bg-sakura-950/60 text-sakura-200 border border-sakura-800/40 font-bold text-xs sm:text-sm hover:border-sakura-500/40 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-sakura-400" />
              Shipping Policy & Protection
            </button>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="mt-10 pt-6 border-t border-sakura-900/40 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-sakura-400/80 mt-0.5">Authentic Factory Sealed</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">Melbourne</div>
              <div className="text-xs text-sakura-400/80 mt-0.5">Dispatched from VIC</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">PayPal</div>
              <div className="text-xs text-sakura-400/80 mt-0.5">Official Buyer Protection</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
