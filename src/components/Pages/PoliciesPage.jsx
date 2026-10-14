import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BUSINESS_INFO } from '../../data/business';
import { CherryBlossomTreeIcon } from '../Header';
import { 
  FileText, 
  ShieldAlert, 
  Truck, 
  RotateCcw, 
  Lock, 
  CheckCircle2
} from 'lucide-react';

export default function PoliciesPage() {
  const { businessInfo } = useStore();
  const activeBusiness = { ...BUSINESS_INFO, ...businessInfo };
  const [activeSection, setActiveSection] = useState('shipping');

  return (
    <div className="min-h-screen bg-[#09090b] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
            <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
            Official Policies & Terms
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Policies & Terms of Service
          </h1>
          <p className="text-sakura-300/70 text-xs sm:text-sm mt-1">
            Official operational policies, customer agreements, and shipping standards for {activeBusiness.name} (ABN {activeBusiness.abn}, Melbourne, VIC).
          </p>
        </div>

        {/* PRIMARY BINDING ACKNOWLEDGMENT ALERT BOX */}
        <div className="bg-[#14141e] border-2 border-sakura-500/40 rounded-3xl p-6 sm:p-7 mb-8 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-sakura-600 text-white rounded-2xl shrink-0 mt-0.5 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                Mandatory Agreement & Policy Acknowledgment
              </h2>
              <p className="text-xs sm:text-sm text-sakura-200/90 leading-relaxed font-medium">
                <strong>PLEASE READ CAREFULLY:</strong> Once an account or order is created on this website, you explicitly 
                <span className="bg-sakura-950 px-1.5 py-0.5 rounded font-bold text-sakura-300 border border-sakura-800/40 ml-1">
                  agree and acknowledge all policies and terms of service
                </span>, 
                including our Shipping & Handling Policy, Pre-Order terms, Transit Risk provisions, and Return Conditions. 
                Placing an order or registering your details signifies full legal acceptance without reservation.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-sakura-400">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Binding upon Order Placement
                </span>
                <span>&bull;</span>
                <span>Protected by PayPal Buyer Protection</span>
                <span>&bull;</span>
                <span>Governed under Victoria, Australia Law</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-sakura-900/40 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveSection('shipping')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeSection === 'shipping'
                ? 'bg-sakura-600 text-white shadow-xs'
                : 'bg-[#12121c] text-sakura-300 hover:bg-[#181824] hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            Shipping & Handling Policy
          </button>

          <button
            onClick={() => setActiveSection('returns')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeSection === 'returns'
                ? 'bg-sakura-600 text-white shadow-xs'
                : 'bg-[#12121c] text-sakura-300 hover:bg-[#181824] hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Returns & Refunds
          </button>

          <button
            onClick={() => setActiveSection('terms')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeSection === 'terms'
                ? 'bg-sakura-600 text-white shadow-xs'
                : 'bg-[#12121c] text-sakura-300 hover:bg-[#181824] hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            Terms of Service
          </button>
        </div>

        {/* Section 1: Shipping & Handling Policy */}
        {activeSection === 'shipping' && (
          <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-8 space-y-6 text-sakura-200/80 text-xs sm:text-sm leading-relaxed shadow-xs">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-sakura-400" />
                Shipping, Handling & Packaging Standards
              </h3>
              <p className="text-sakura-400/60 text-xs mt-0.5">
                Applicable to all domestic and tracked Australian shipments from Melbourne, VIC.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">1. Melbourne Dispatch & Handling</h4>
                <p>
                  Orders are processed and packaged with extreme care directly from our Melbourne facility. Every collectible is wrapped with dedicated corner protectors and shock-absorbing archival materials to prevent shelf wear in transit.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">2. Archival Packaging & Case Add-ons</h4>
                <p>
                  Items ordered with additional protective acrylic cases or vaults are prepared in a clean, controlled environment. Factory seals are never opened, sliced, or tampered with.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">3. Carrier & Tracking Information</h4>
                <p>
                  Shipments are handled via <strong>Australia Post Tracked Parcel</strong>. As soon as your dispatch label is created, an official Australia Post tracking number is logged to your account details.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">4. Pre-Order Delivery Schedules</h4>
                <p>
                  Items designated as <strong>Pre-Order Allocations</strong> will ship immediately upon stock arrival from authorized distributors.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">5. Customer Acknowledgment of Transit Risk</h4>
                <p>
                  By creating an account or completing an order, the customer acknowledges that once an item is lodged with Australia Post, carrier delivery times apply. All parcels are fully tracked and covered by PayPal Buyer Protection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Returns & Refunds */}
        {activeSection === 'returns' && (
          <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-8 space-y-6 text-sakura-200/80 text-xs sm:text-sm leading-relaxed shadow-xs">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-sakura-400" />
                Returns, Cancellations & Refunds
              </h3>
              <p className="text-sakura-400/60 text-xs mt-0.5">
                Compliant with Australian Consumer Law (ACL) and PayPal Merchant Standards.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">1. Sealed Product Integrity Policy</h4>
                <p>
                  Due to the nature of collectible trading cards, booster boxes, and limited-edition numbered statues, <strong>once factory security seals or shrink wraps are broken, opened, or tampered with, returns cannot be accepted</strong> for change-of-mind.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">2. 14-Day Unopened Return Window</h4>
                <p>
                  Unopened items in original, pristine, unaltered factory condition may be returned within 14 days of delivery. Return postage is the responsibility of the purchaser unless the item arrived materially damaged.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">3. Refund Processing via PayPal</h4>
                <p>
                  Approved refunds are returned directly to the original PayPal account utilized at checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Terms of Service */}
        {activeSection === 'terms' && (
          <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-8 space-y-6 text-sakura-200/80 text-xs sm:text-sm leading-relaxed shadow-xs">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-sakura-400" />
                Terms of Service
              </h3>
              <p className="text-sakura-400/60 text-xs mt-0.5">
                Conditions governing website usage, orders, and customer accounts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">1. User Agreement & Capacity</h4>
                <p>
                  By accessing this website, creating a user account, or finalizing a transaction, you represent that you are at least 18 years of age or possess legal parental consent.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">2. Exclusive Payment Gateway</h4>
                <p>
                  To maintain strict fraud protection and merchant compliance, <strong>PayPal is the sole accepted payment method</strong> on this platform.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">3. Limitation of Liability</h4>
                <p>
                  To the maximum extent permitted by the laws of Victoria and the Commonwealth of Australia, {BUSINESS_INFO.name} shall not be liable for indirect or consequential delays arising from postal disruption.
                </p>
              </div>

              <div className="p-4 bg-[#161622] rounded-2xl border border-sakura-900/40">
                <h4 className="font-bold text-white text-sm mb-1">4. Business Registration Credentials</h4>
                <p>
                  Entity Name: <strong>{activeBusiness.name}</strong><br />
                  Location: <strong>{activeBusiness.location}</strong><br />
                  Australian Business Number (ABN): <strong>{activeBusiness.abn}</strong><br />
                  Registered PayPal Identifier: <strong>{activeBusiness.paypalEmail}</strong><br />
                  Contact Email: <strong>{activeBusiness.email}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
