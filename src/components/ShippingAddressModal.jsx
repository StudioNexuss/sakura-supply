import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MapPin, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Building, 
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import { CherryBlossomTreeIcon } from './Header';

const AUSTRALIAN_STATES = [
  { code: 'VIC', name: 'Victoria (VIC)' },
  { code: 'NSW', name: 'New South Wales (NSW)' },
  { code: 'QLD', name: 'Queensland (QLD)' },
  { code: 'WA', name: 'Western Australia (WA)' },
  { code: 'SA', name: 'South Australia (SA)' },
  { code: 'TAS', name: 'Tasmania (TAS)' },
  { code: 'ACT', name: 'Australian Capital Territory (ACT)' },
  { code: 'NT', name: 'Northern Territory (NT)' }
];

export default function ShippingAddressModal() {
  const { 
    shippingModalOpen, 
    setShippingModalOpen, 
    currentUser, 
    saveShippingAddress,
    pendingCartItem
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: 'Melbourne',
    state: 'VIC',
    postalCode: '3000',
    phone: '',
    country: 'Australia'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.shippingAddress?.fullName || currentUser.displayName || currentUser.username || '',
        street: currentUser.shippingAddress?.street || '',
        city: currentUser.shippingAddress?.city || 'Melbourne',
        state: currentUser.shippingAddress?.state || 'VIC',
        postalCode: currentUser.shippingAddress?.postalCode || '3000',
        phone: currentUser.phone || currentUser.shippingAddress?.phone || '',
        country: 'Australia'
      });
    }
  }, [currentUser, shippingModalOpen]);

  if (!shippingModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please provide the recipient full name.');
      return;
    }
    if (!formData.street.trim()) {
      setError('Street address is required for Australia Post parcel delivery.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your suburb or city.');
      return;
    }
    if (!formData.postalCode.trim()) {
      setError('Please enter your 4-digit postal code.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      saveShippingAddress(formData);
      setSuccess(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#101018] max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-sakura-500/40 space-y-6 relative animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-sakura-950/80 border border-sakura-500/40 flex items-center justify-center mx-auto shadow-inner text-sakura-400">
            <Truck className="w-7 h-7 text-sakura-400" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Delivery Address Required
          </h2>
          <p className="text-xs text-sakura-300/80 max-w-sm mx-auto leading-relaxed">
            Welcome, <strong className="text-white">{currentUser?.displayName || currentUser?.username}</strong>! Please enter your Australian shipping address so we can route your orders with full buyer transit coverage.
          </p>
        </div>

        {/* Notice for Pending Cart Item */}
        {pendingCartItem && pendingCartItem.product && (
          <div className="bg-[#161622] rounded-2xl p-3 border border-sakura-900/50 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-sakura-900/40">
              <img 
                src={pendingCartItem.product.images?.[0] || "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=400&q=80"} 
                alt={pendingCartItem.product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sakura-400">
                Ready to Add
              </span>
              <p className="text-xs font-bold text-white truncate">
                {pendingCartItem.quantity}x {pendingCartItem.product.name}
              </p>
              <p className="text-[10px] text-emerald-400">
                Will be automatically added to your cart upon saving this address!
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sakura-200 mb-1">
              Recipient Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Jackson Micic"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pl-10"
              />
              <User className="w-4 h-4 text-sakura-400/60 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sakura-200 mb-1">
              Street Address (Unit / House Number and Street) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="e.g. 18 Flinders Lane or Unit 4, 25 Queen St"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pl-10"
              />
              <MapPin className="w-4 h-4 text-sakura-400/60 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Suburb / City <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Melbourne"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                State <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all cursor-pointer"
              >
                {AUSTRALIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code} className="bg-zinc-900 text-white">
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Postcode <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, '') })}
                placeholder="3000"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Contact Phone (For AusPost SMS delivery alerts)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+61 400 000 000"
                  className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pl-10"
                />
                <Phone className="w-4 h-4 text-sakura-400/60 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Country
              </label>
              <input
                type="text"
                readOnly
                value="Australia (Domestic Only)"
                className="w-full bg-[#14141e] border border-sakura-950/80 rounded-xl px-3.5 py-2.5 text-xs text-sakura-400/80 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={success}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sakura-600 to-sakura-500 hover:from-sakura-500 hover:to-sakura-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-sakura-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Address Saved! Adding item to cart...
                </>
              ) : (
                <>
                  <span>Save Shipping Address & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security badge footer */}
        <div className="pt-2 border-t border-sakura-900/40 flex items-center justify-center gap-2 text-[10px] text-sakura-400/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Address securely saved to your verified customer account &bull; Editable anytime in Account Settings</span>
        </div>
      </div>
    </div>
  );
}
