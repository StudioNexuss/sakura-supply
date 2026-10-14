import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Lock, 
  LogIn, 
  UserPlus, 
  ShoppingBag, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone
} from 'lucide-react';
import { CherryBlossomTreeIcon } from './Header';

export default function AuthPromptModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    pendingCartItem, 
    login, 
    register 
  } = useStore();

  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    paypalEmail: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setError('');
    setAuthModalOpen(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = login(identifier, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!registerData.username || !registerData.email || !registerData.password) {
      setError('Username, email, and password are required.');
      return;
    }
    setLoading(true);
    const res = register(registerData);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Account registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#101018] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-sakura-500/40 space-y-6 relative animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-sakura-300 hover:text-white hover:bg-sakura-950 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-sakura-950/80 border border-sakura-500/40 flex items-center justify-center mx-auto shadow-inner text-sakura-400">
            <CherryBlossomTreeIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'Sign In to Continue' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-sakura-300/80 max-w-xs mx-auto">
            {pendingCartItem 
              ? 'Please sign in or create an account to add this item to your cart and proceed with checkout.' 
              : 'Sign in to access your customer orders and secure checkout.'}
          </p>
        </div>

        {/* Pending Item Badge (if triggered by adding to cart) */}
        {pendingCartItem && pendingCartItem.product && (
          <div className="bg-[#161622] rounded-2xl p-3 border border-sakura-900/50 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-sakura-900/40">
              <img 
                src={pendingCartItem.product.images?.[0] || "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=400&q=80"} 
                alt={pendingCartItem.product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sakura-400 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-sakura-400" />
                Pending Cart Item
              </span>
              <p className="text-xs font-bold text-white truncate">
                {pendingCartItem.quantity}x {pendingCartItem.product.name}
              </p>
              <p className="text-[11px] text-sakura-300/80">
                ${Number(pendingCartItem.finalUnitPrice * pendingCartItem.quantity).toFixed(2)} AUD
              </p>
            </div>
          </div>
        )}

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#161622] rounded-2xl border border-sakura-900/40 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin' 
                ? 'bg-sakura-600 text-white shadow-md' 
                : 'text-sakura-300 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register' 
                ? 'bg-sakura-600 text-white shadow-md' 
                : 'text-sakura-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pl-10"
                />
                <User className="w-4 h-4 text-sakura-400/60 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pl-10"
                />
                <Lock className="w-4 h-4 text-sakura-400/60 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sakura-600 to-sakura-500 hover:from-sakura-500 hover:to-sakura-400 text-white font-black text-xs shadow-lg shadow-sakura-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : (pendingCartItem ? 'Sign In & Add to Cart' : 'Sign In')}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-sakura-200 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  placeholder="alex_collector"
                  className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-sakura-200 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="+61 400 000 000"
                  className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value, paypalEmail: registerData.paypalEmail || e.target.value })}
                placeholder="alex@example.com"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Create a secure password"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sakura-200 mb-1 flex items-center justify-between">
                <span>PayPal Account Email</span>
                <span className="text-[10px] text-sakura-400 font-normal">Required for checkout</span>
              </label>
              <input
                type="email"
                value={registerData.paypalEmail}
                onChange={(e) => setRegisterData({ ...registerData, paypalEmail: e.target.value })}
                placeholder="your.paypal@example.com"
                className="w-full bg-[#161622] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>

            <p className="text-[10px] text-sakura-300/70 leading-relaxed">
              * Upon account creation, you will be prompted to enter your Australian delivery address.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sakura-600 to-sakura-500 hover:from-sakura-500 hover:to-sakura-400 text-white font-black text-xs shadow-lg shadow-sakura-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </form>
        )}

        {/* Security badge footer */}
        <div className="pt-2 border-t border-sakura-900/40 flex items-center justify-center gap-2 text-[10px] text-sakura-400/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Session &bull; Sakura Supply Authentic TCG Guarantee</span>
        </div>
      </div>
    </div>
  );
}
