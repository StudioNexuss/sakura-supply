import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Home, 
  Tag, 
  Search, 
  PackagePlus 
} from 'lucide-react';

// Custom Minimalist Pink Cherry Blossom Tree SVG Logo
export function CherryBlossomTreeIcon({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        d="M32 58V40C32 35 28 30 24 26M32 40C35 34 40 29 44 25M32 32C32 26 31 20 28 16M32 28C34 23 37 19 39 15" 
        stroke="#fda4b8" 
        strokeWidth="2.75" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M26 58C29 57 32 58 35 58C37 58 38 58 40 58" 
        stroke="#fda4b8" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      <circle cx="32" cy="14" r="5.5" fill="#f43f6e" fillOpacity="0.85" />
      <circle cx="26" cy="16" r="4.5" fill="#fb7193" fillOpacity="0.9" />
      <circle cx="38" cy="15" r="4.5" fill="#fda4b8" fillOpacity="0.9" />
      <circle cx="20" cy="24" r="6" fill="#f43f6e" fillOpacity="0.8" />
      <circle cx="16" cy="20" r="4.5" fill="#fda4b8" fillOpacity="0.9" />
      <circle cx="24" cy="20" r="5" fill="#fb7193" fillOpacity="0.85" />
      <circle cx="45" cy="23" r="6" fill="#f43f6e" fillOpacity="0.8" />
      <circle cx="49" cy="19" r="4.5" fill="#fda4b8" fillOpacity="0.9" />
      <circle cx="41" cy="20" r="5" fill="#fb7193" fillOpacity="0.85" />
      <ellipse cx="21" cy="36" rx="2" ry="1" transform="rotate(-25 21 36)" fill="#fb7193" />
      <ellipse cx="44" cy="38" rx="2" ry="1.2" transform="rotate(30 44 38)" fill="#f43f6e" />
      <ellipse cx="37" cy="46" rx="1.8" ry="1" transform="rotate(-15 37 46)" fill="#fda4b8" />
    </svg>
  );
}

export default function Header() {
  const { 
    currentView, 
    navigateTo, 
    cartCount, 
    searchQuery, 
    handleSearch, 
    setAdminModalOpen,
    businessInfo,
    currentUser,
    isAdmin
  } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home, desc: 'Welcome, stock showcase & reviews' },
    { id: 'shop', label: 'Shop All Stock', icon: Tag, desc: 'Full stock, pre-orders & listings' },
    { id: 'cart', label: 'Cart & Checkout', icon: ShoppingBag, desc: 'View cart, items & PayPal pay' },
    { id: 'account', label: 'Account Details', icon: User, desc: 'PayPal info, past orders & addresses' },
    { id: 'policies', label: 'Policies & Terms', icon: FileText, desc: 'Terms of service & shipping policy' },
    { id: 'contact', label: 'Contact Business', icon: Mail, desc: 'ABN, business info & inquiry form' },
  ];

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-sakura-900/40 shadow-md">
      
      {/* Top Minimalist Dark/Pink Notice Bar */}
      <div className="bg-[#050507] text-sakura-300 text-xs py-1.5 px-4 font-medium border-b border-sakura-950/60">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sakura-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-sakura-400 animate-pulse" />
              Melbourne, VIC &bull; Australian Registered
            </span>
            <span className="hidden sm:inline text-sakura-900">|</span>
            <span className="hidden sm:inline text-sakura-400/80">ABN: <strong className="text-sakura-200">{(businessInfo && businessInfo.abn) || BUSINESS_INFO.abn}</strong></span>
            <span className="hidden md:inline text-sakura-900">|</span>
            <span className="hidden md:inline text-sakura-400/80">PayPal: <span className="text-sakura-200">{(businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail}</span></span>
          </div>
          <div className="flex items-center gap-3 text-sakura-300">
            <span className="inline-flex items-center gap-1 text-sakura-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              PayPal Buyer Protection
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar - Compact max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* LEFT SIDE: Cart, Account, Shop All, Menu Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Universal Dropdown Navigation Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                  dropdownOpen
                    ? 'bg-sakura-950 text-sakura-200 border-sakura-500/50 ring-2 ring-sakura-500/20'
                    : 'bg-[#121218] text-sakura-300 border-sakura-900/40 hover:bg-sakura-950/40 hover:border-sakura-500/30'
                }`}
                aria-expanded={dropdownOpen}
                aria-label="Site Navigation Menu"
              >
                <Menu className="w-4 h-4 text-sakura-400" />
                <span className="hidden md:inline font-bold">Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 text-sakura-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Content */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-[#0e0e14] rounded-2xl shadow-2xl border border-sakura-500/30 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-sakura-900/40 mb-1 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sakura-400">Sakura Supply</p>
                      <p className="text-xs text-sakura-200">Navigation Menu</p>
                    </div>
                    <span className="text-[10px] text-sakura-400/60">Melbourne, VIC</span>
                  </div>

                  <div className="py-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = currentView === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => {
                            navigateTo(link.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                            isActive
                              ? 'bg-sakura-950/80 text-white font-bold border-l-2 border-sakura-400'
                              : 'text-sakura-300 hover:bg-[#14141e] hover:text-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-sakura-600 text-white' : 'bg-[#181824] text-sakura-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-bold">{link.label}</span>
                              {link.id === 'cart' && cartCount > 0 && (
                                <span className="bg-sakura-600 text-white text-xs px-2 py-0.5 rounded-full font-black">
                                  {cartCount}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-sakura-400/60 truncate">{link.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Owner Admin Quick Access - STRICTLY PROTECTED FOR ADMIN ONLY */}
                  {isAdmin && (
                    <div className="mt-2 pt-2 border-t border-sakura-900/40 px-3">
                      <button
                        onClick={() => {
                          setAdminModalOpen(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-sakura-950 hover:bg-sakura-900 text-sakura-200 text-xs font-bold flex items-center justify-between transition-colors border border-sakura-800/40"
                      >
                        <span className="flex items-center gap-1.5">
                          <PackagePlus className="w-3.5 h-3.5 text-sakura-400" />
                          Manage Inventory (Admin)
                        </span>
                        <span className="text-[10px] bg-sakura-600 text-white px-1.5 py-0.5 rounded">
                          Edit
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shop All Button */}
            <button
              onClick={() => navigateTo('shop')}
              className={`inline-flex items-center px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                currentView === 'shop'
                  ? 'bg-sakura-950 text-white border border-sakura-500/40'
                  : 'text-sakura-300 hover:text-white hover:bg-sakura-950/40'
              }`}
            >
              Shop All
            </button>

            {/* Account Button */}
            <button
              onClick={() => navigateTo('account')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                currentView === 'account'
                  ? 'bg-sakura-950 text-white border border-sakura-500/40'
                  : 'text-sakura-300 hover:text-white hover:bg-sakura-950/40'
              }`}
              title={currentUser ? (isAdmin ? `Admin: ${currentUser.displayName || currentUser.username}` : `Account: ${currentUser.displayName || currentUser.username}`) : 'Sign In / Register'}
            >
              <User className="w-4 h-4 text-sakura-400" />
              <span className="hidden sm:inline">
                {currentUser 
                  ? (isAdmin ? `Admin: ${currentUser.username}` : (currentUser.displayName || currentUser.username))
                  : 'Sign In'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigateTo('cart')}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'cart'
                  ? 'bg-sakura-600 text-white shadow-xs'
                  : 'bg-[#14141c] text-sakura-200 border border-sakura-900/40 hover:bg-sakura-950 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-sakura-300" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-black rounded-full ${
                  currentView === 'cart' ? 'bg-white text-sakura-800' : 'bg-sakura-600 text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

          </div>

          {/* CENTER: Cherry Blossom Tree Logo & SAKURA SUPPLY */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex flex-col items-center justify-center cursor-pointer group shrink-0"
            title="Sakura Supply - Home"
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <CherryBlossomTreeIcon className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            
            <div className="text-center -mt-0.5">
              <div className="font-extrabold text-base sm:text-lg tracking-widest text-white group-hover:text-sakura-400 transition-colors">
                SAKURA <span className="text-sakura-400 font-black">SUPPLY</span>
              </div>
              <p className="text-[9px] tracking-widest text-sakura-400/80 uppercase font-semibold">
                Melbourne &bull; Authentics
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Search Bar with Icon Placed to the Left (No Overlap!) */}
          <div className="flex items-center justify-end max-w-xs sm:max-w-sm flex-1">
            <form onSubmit={onSearchSubmit} className="relative w-full">
              <div className="flex items-center bg-[#12121a] border border-sakura-500/30 rounded-full px-3 py-1.5 focus-within:border-sakura-400 focus-within:ring-2 focus-within:ring-sakura-500/20 w-full transition-all">
                {/* Search Icon positioned to the left of the input field */}
                <Search className="w-4 h-4 text-sakura-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-transparent text-sakura-100 placeholder-sakura-400/50 text-xs sm:text-sm focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearch('')}
                    className="text-sakura-400 hover:text-white shrink-0 ml-1.5 p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </header>
  );
}
