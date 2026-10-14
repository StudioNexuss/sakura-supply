import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BUSINESS_INFO } from '../../data/business';
import { CherryBlossomTreeIcon } from '../Header';
import { Building2, CreditCard, Mail, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function BusinessIntro() {
  const { navigateTo, businessInfo } = useStore();
  const activeBusiness = { ...BUSINESS_INFO, ...businessInfo };

  return (
    <section className="py-12 bg-[#09090b] border-b border-sakura-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Container with modern clean dark card styling */}
        <div className="bg-[#101016] border border-sakura-900/40 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Business Overview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakura-950 text-sakura-300 text-xs font-bold tracking-wide uppercase border border-sakura-800/40">
                <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
                About Sakura Supply & Credentials
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Authentic Australian Merchant & Verified Protection
              </h2>

              <p className="text-sakura-200/80 text-xs sm:text-sm leading-relaxed">
                {activeBusiness.shortIntro}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-sakura-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-sakura-400" />
                  Melbourne, Victoria, Australia
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Australian Registered ABN: {activeBusiness.abn}
                </span>
              </div>
            </div>

            {/* Right Column: Contact Credentials Rundown Card */}
            <div className="lg:col-span-5 bg-[#14141e] border border-sakura-900/50 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-sakura-900/40 pb-3">
                <h3 className="font-bold text-white text-sm">Official Contact & Legal Details</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-800/50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {/* ABN */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sakura-950 border border-sakura-800/40 flex items-center justify-center text-sakura-400 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold text-sakura-400/80 uppercase tracking-wider">Australian Business Number (ABN)</div>
                    <div className="font-bold text-white">{activeBusiness.abn}</div>
                  </div>
                </div>

                {/* PAYPAL */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sakura-950 border border-sakura-800/40 flex items-center justify-center text-sakura-400 shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold text-sakura-400/80 uppercase tracking-wider">Official PayPal ID</div>
                    <div className="font-bold text-sakura-300 break-all">{activeBusiness.paypalEmail}</div>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sakura-950 border border-sakura-800/40 flex items-center justify-center text-sakura-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold text-sakura-400/80 uppercase tracking-wider">Direct Business Support</div>
                    <div className="font-bold text-sakura-200 break-all">{activeBusiness.email}</div>
                  </div>
                </div>
              </div>

              {/* Action to full Contact Form */}
              <div className="pt-2 border-t border-sakura-900/40 flex items-center justify-between">
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-sakura-200 bg-sakura-950 hover:bg-sakura-900 border border-sakura-800/40 rounded-xl transition-colors"
                >
                  Contact Form & Inquiries
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
