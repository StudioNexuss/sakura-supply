import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';
import { CherryBlossomTreeIcon } from './Header';
import { 
  ShieldCheck, 
  Mail, 
  FileText, 
  User, 
  ShoppingBag, 
  Home, 
  Tag, 
  ChevronUp, 
  PackagePlus,
  Truck,
  Building2,
  Lock
} from 'lucide-react';

export default function Footer() {
  const { currentView, navigateTo, cartCount, setAdminModalOpen, businessInfo, isAdmin } = useStore();
  const activeBusiness = businessInfo || BUSINESS_INFO;
  const [bottomDropdownOpen, setBottomDropdownOpen] = useState(false);
  const bottomDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bottomDropdownRef.current && !bottomDropdownRef.current.contains(event.target)) {
        setBottomDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home Page', icon: Home, desc: 'Overview, reviews & featured stock' },
    { id: 'shop', label: 'Shop All Stock', icon: Tag, desc: 'Grid view, pre-orders & filters' },
    { id: 'cart', label: 'Cart & Checkout', icon: ShoppingBag, desc: 'View cart, items & PayPal pay' },
    { id: 'account', label: 'Account Details', icon: User, desc: 'PayPal info, past orders & addresses' },
    { id: 'policies', label: 'Policies & Terms of Service', icon: FileText, desc: 'Terms of service & shipping policy' },
    { id: 'contact', label: 'Contact Business', icon: Mail, desc: 'ABN, business info & contact form' },
  ];

  return (
    <footer className="bg-[#070709] text-sakura-200/80 pt-16 pb-12 border-t border-sakura-900/40 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Trust Features in Midnight Pink */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pb-12 border-b border-sakura-900/30">
          <div className="flex items-start gap-3 bg-[#0d0d12] p-4 rounded-2xl border border-sakura-900/30">
            <div className="p-2.5 bg-sakura-950 rounded-xl text-sakura-400 border border-sakura-800/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">PayPal Protection</h4>
              <p className="text-xs text-sakura-300/70 mt-1">Official merchant with direct encrypted buyer protection.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0d0d12] p-4 rounded-2xl border border-sakura-900/30">
            <div className="p-2.5 bg-sakura-950 rounded-xl text-sakura-400 border border-sakura-800/40 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Melbourne Dispatch</h4>
              <p className="text-xs text-sakura-300/70 mt-1">Packed securely with Australia Post tracked parcel delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0d0d12] p-4 rounded-2xl border border-sakura-900/30">
            <div className="p-2.5 bg-sakura-950 rounded-xl text-sakura-400 border border-sakura-800/40 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Australian Business</h4>
              <p className="text-xs text-sakura-300/70 mt-1">ABN {activeBusiness.abn}. Registered Melbourne merchant.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#0d0d12] p-4 rounded-2xl border border-sakura-900/30">
            <div className="p-2.5 bg-sakura-950 rounded-xl text-sakura-400 border border-sakura-800/40 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Binding Policies</h4>
              <p className="text-xs text-sakura-300/70 mt-1">Clear shipping, transit risk and return terms acknowledged on order.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-b border-sakura-900/30">
          
          {/* Business Info Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <CherryBlossomTreeIcon className="w-7 h-7" />
              <span className="font-extrabold text-lg text-white tracking-widest">
                SAKURA <span className="text-sakura-400 font-semibold">SUPPLY</span>
              </span>
            </div>
            <p className="text-xs text-sakura-300/70 leading-relaxed pr-4">
              {activeBusiness.shortIntro}
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-sakura-300">
              <div><strong className="text-white">Location:</strong> {activeBusiness.location}</div>
              <div><strong className="text-white">ABN:</strong> {activeBusiness.abn}</div>
              <div><strong className="text-white">Official PayPal:</strong> <span className="text-sakura-400">{activeBusiness.paypalEmail}</span></div>
              <div><strong className="text-white">Support Email:</strong> <span className="text-sakura-400">{activeBusiness.email}</span></div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sakura-400">Site Sections</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => navigateTo('home')} 
                  className={`hover:text-white transition-colors ${currentView === 'home' ? 'text-sakura-400 font-bold' : 'text-sakura-300/70'}`}
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('shop')} 
                  className={`hover:text-white transition-colors ${currentView === 'shop' ? 'text-sakura-400 font-bold' : 'text-sakura-300/70'}`}
                >
                  Shop Stock & Pre-Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('cart')} 
                  className={`hover:text-white transition-colors ${currentView === 'cart' ? 'text-sakura-400 font-bold' : 'text-sakura-300/70'}`}
                >
                  Shopping Cart ({cartCount})
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('account')} 
                  className={`hover:text-white transition-colors ${currentView === 'account' ? 'text-sakura-400 font-bold' : 'text-sakura-300/70'}`}
                >
                  Customer Account Details
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policies Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sakura-400">Customer Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => navigateTo('policies')} 
                  className={`hover:text-white transition-colors ${currentView === 'policies' ? 'text-sakura-400 font-bold' : 'text-sakura-300/70'}`}
                >
                  Policies & Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('policies')} 
                  className="text-sakura-300/70 hover:text-white transition-colors"
                >
                  Shipping & Handling Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('policies')} 
                  className="text-sakura-300/70 hover:text-white transition-colors"
                >
                  Returns & Cancellations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('contact')} 
                  className={`hover:text-white transition-colors ${currentView === 'contact' ? 'text-sakura-400 font-bold' : 'text-sakura-300/70'}`}
                >
                  Contact Us & ABN Details
                </button>
              </li>
            </ul>
          </div>

          {/* BOTTOM NAVIGATION DROPDOWN */}
          <div className="md:col-span-2 space-y-3" ref={bottomDropdownRef}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sakura-400">Page Navigator</h4>
            
            <div className="relative">
              <button
                onClick={() => setBottomDropdownOpen(!bottomDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#121218] hover:bg-sakura-950/60 text-sakura-200 rounded-xl border border-sakura-900/40 text-xs font-semibold shadow-xs"
              >
                <span>Jump to Section...</span>
                <ChevronUp className={`w-4 h-4 text-sakura-400 transition-transform ${bottomDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {bottomDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 sm:right-auto sm:w-64 bg-[#0e0e14] rounded-2xl border border-sakura-500/40 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-sakura-900/40 text-[10px] font-bold text-sakura-400 uppercase tracking-wider">
                    Sakura Supply Navigation
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigateTo(item.id);
                          setBottomDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                          currentView === item.id
                            ? 'bg-sakura-950 text-white font-bold'
                            : 'text-sakura-300/80 hover:bg-[#181824] hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-sakura-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Merchant Inventory Admin Shortcut - ONLY VISIBLE TO LOGGED IN ADMIN */}
            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#121218] hover:bg-sakura-950 text-sakura-300 border border-sakura-900/40 rounded-xl text-xs font-semibold transition-colors"
                >
                  <PackagePlus className="w-3.5 h-3.5 text-sakura-400" />
                  Manage Inventory
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sakura-400/60">
          <p>
            &copy; {new Date().getFullYear()} {activeBusiness.name}. ABN: {activeBusiness.abn}. Melbourne, VIC.
          </p>
          <p className="text-center md:text-right">
            By creating an account or placing an order, customers agree and acknowledge all policies and terms of service.
          </p>
        </div>

      </div>
    </footer>
  );
}
