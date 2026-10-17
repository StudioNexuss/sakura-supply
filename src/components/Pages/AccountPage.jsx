import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BUSINESS_INFO } from '../../data/business';
import { CherryBlossomTreeIcon } from '../Header';
import OrderReviewCard from '../Reviews/OrderReviewCard';
import { 
  User, 
  CreditCard, 
  Package, 
  MapPin, 
  Phone, 
  Check, 
  CheckCircle2,
  Mail,
  Copy,
  Truck, 
  ShieldCheck, 
  Edit2,
  PackagePlus,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Shield,
  KeyRound,
  AlertCircle,
  Star,
  MessageSquare
} from 'lucide-react';

export default function AccountPage() {
  const { 
    currentUser, 
    isAdmin, 
    login, 
    register, 
    logout, 
    setUserProfile, 
    orders, 
    navigateTo, 
    setAdminModalOpen,
    businessInfo,
    formatOrderEmailReceipt,
    getOrderMailtoUrl,
    reviews,
    hasReviewedOrder,
    getOrderReview
  } = useStore();

  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [openReviewOrderId, setOpenReviewOrderId] = useState(null);

  // Auth portal state for guests / non-logged in visitors
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register'
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    paypalEmail: ''
  });

  // Logged-in profile state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(currentUser?.shippingAddress || {
    fullName: '',
    street: '',
    city: 'Melbourne',
    state: 'VIC',
    postalCode: '3000',
    country: 'Australia'
  });

  const [profileForm, setProfileForm] = useState({
    username: currentUser?.username || '',
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    paypalEmail: currentUser?.paypalEmail || '',
    newPassword: ''
  });

  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        username: currentUser.username || '',
        displayName: currentUser.displayName || currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        paypalEmail: currentUser.paypalEmail || '',
        newPassword: ''
      });
      setAddressForm(currentUser.shippingAddress || {
        fullName: currentUser.displayName || currentUser.username || '',
        street: '',
        city: 'Melbourne',
        state: 'VIC',
        postalCode: '3000',
        country: 'Australia'
      });
    }
  }, [currentUser]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = login(authIdentifier, authPassword);
    if (!res.success) {
      setAuthError(res.error || 'Invalid username, email, or password.');
    } else {
      setSaveMessage('Successfully signed in as ' + (res.user.displayName || res.user.username));
      setTimeout(() => setSaveMessage(''), 3500);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!registerData.username || !registerData.email || !registerData.password) {
      setAuthError('Please fill in username, email, and password.');
      return;
    }
    const res = register(registerData);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed.');
    } else {
      setSaveMessage('Welcome to Sakura Supply! Your customer account is ready.');
      setTimeout(() => setSaveMessage(''), 3500);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      username: profileForm.username,
      displayName: profileForm.displayName,
      email: profileForm.email,
      phone: profileForm.phone,
      paypalEmail: profileForm.paypalEmail,
      ...(profileForm.newPassword ? { password: profileForm.newPassword } : {})
    }));
    setSaveMessage('Account profile updated successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      shippingAddress: addressForm
    }));
    setIsEditingAddress(false);
    setSaveMessage('Shipping address updated successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Orders: If admin, can view all store orders. If customer, view their relevant orders
  const displayOrders = (orders || []).filter((ord) => {
    if (isAdmin) return true;
    if (!currentUser) return false;
    return (
      (ord.userId && ord.userId === currentUser.id) ||
      (ord.buyerEmail && ord.buyerEmail.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (ord.paypalPayerEmail && (
        ord.paypalPayerEmail.toLowerCase() === currentUser.email?.toLowerCase() ||
        (currentUser.paypalEmail && ord.paypalPayerEmail.toLowerCase() === currentUser.paypalEmail.toLowerCase())
      )) ||
      (currentUser.username && ord.shippingAddress && ord.shippingAddress.toLowerCase().includes(currentUser.username.toLowerCase())) ||
      (currentUser.displayName && ord.shippingAddress && ord.shippingAddress.toLowerCase().includes(currentUser.displayName.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-[#09090b] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
              <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
              Customer & Store Portal
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {currentUser ? 'Account Details & Order History' : 'Customer Sign In & Registration'}
            </h1>
            <p className="text-sakura-300/70 text-xs sm:text-sm mt-1">
              {currentUser 
                ? 'Manage personal credentials, customer PayPal link, shipping addresses, and tracked order history.'
                : 'Create a customer account to track Australia Post shipments, save addresses, or sign in.'}
            </p>
          </div>

          {/* Admin Direct Access - ONLY VISIBLE TO LOGGED IN ADMIN */}
          {isAdmin && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-sakura-950 hover:bg-sakura-900 text-sakura-200 border border-sakura-500/50 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <PackagePlus className="w-4 h-4 text-sakura-400" />
              <span>Open Store Admin (Inventory & Settings)</span>
            </button>
          )}

          {/* Sign Out Button for Logged-In Users */}
          {currentUser && (
            <button
              onClick={logout}
              className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-[#14141e] hover:bg-rose-950/60 text-sakura-300 hover:text-rose-200 border border-sakura-900/40 hover:border-rose-800/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 1: USER IS NOT LOGGED IN -> RENDER AUTH PORTAL (GUEST)   */}
        {/* ============================================================== */}
        {!currentUser ? (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Auth Switcher Tabs */}
            <div className="bg-[#111118] p-1.5 rounded-2xl border border-sakura-900/40 flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'signin'
                    ? 'bg-sakura-600 text-white shadow-xs'
                    : 'text-sakura-300/80 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Customer / Admin Sign In</span>
              </button>

              <button
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'register'
                    ? 'bg-sakura-600 text-white shadow-xs'
                    : 'text-sakura-300/80 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Account</span>
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-4 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {authMode === 'signin' && (
              <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-sakura-400" />
                    Sign In to Sakura Supply
                  </h2>
                  <p className="text-xs text-sakura-300/70 mt-1">
                    Enter username or email address and password to sign in.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-sakura-200 mb-1">
                      Username or Email Address
                    </label>
                    <input
                      type="text"
                      required
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder="e.g. jackson micic or sakurasupplyau@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-sakura-200 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
                  >
                    Sign In
                  </button>
                </form>

              </div>
            )}

            {/* TAB 2: REGISTER NEW CUSTOMER */}
            {authMode === 'register' && (
              <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-sakura-400" />
                    Create Customer Account
                  </h2>
                  <p className="text-xs text-sakura-300/70 mt-1">
                    Store accounts are saved securely in the database. Customer accounts enjoy fast checkout, saved delivery details, and PayPal buyer protection.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        placeholder="e.g. ash_ketchum"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                        placeholder="e.g. Jack Smith"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="e.g. customer@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Choose a password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">
                        Contact Phone (Optional)
                      </label>
                      <input
                        type="text"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        placeholder="e.g. +61 412 345 678"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">
                        PayPal Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={registerData.paypalEmail}
                        onChange={(e) => setRegisterData({ ...registerData, paypalEmail: e.target.value })}
                        placeholder="For buyer protection checkout"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#151520] border border-sakura-900/40 rounded-xl text-xs space-y-1 text-sakura-300">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Role: Standard Customer
                    </div>
                    <p className="text-[11px] text-sakura-400/70">
                      Standard customer accounts do not have access to admin pricing or inventory editing controls.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
                  >
                    Create Account & Sign In
                  </button>
                </form>

              </div>
            )}

          </div>
        ) : (

        /* ============================================================== */
        /* CASE 2: USER IS LOGGED IN -> RENDER PROFILE & ORDERS DASHBOARD */
        /* ============================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Account Details, PayPal & Shipping Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Account Credentials Card */}
            <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-sakura-900/40 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-sakura-400" />
                  Profile & Credentials
                </h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold uppercase border ${
                  isAdmin
                    ? 'bg-sakura-950 text-sakura-300 border-sakura-600/50'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700/50'
                }`}>
                  {isAdmin ? 'Admin Account' : 'Customer'}
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-sakura-200 mb-1">Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sakura-200 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sakura-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sakura-200 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sakura-200 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                  />
                  <span className="text-[10px] text-sakura-400/60 mt-1 block">Leave blank to keep existing password</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Customer's PayPal Card */}
            <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-sakura-900/40 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sakura-400" />
                  Customer's PayPal Details
                </h2>
                <span className="text-[10px] bg-sakura-950 text-sakura-300 font-bold px-2 py-0.5 rounded-full border border-sakura-700/50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-sakura-200 mb-1">Linked PayPal Email</label>
                  <input
                    type="email"
                    value={profileForm.paypalEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, paypalEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                  />
                </div>
                
                <div className="p-3 bg-[#151520] border border-sakura-900/40 rounded-xl text-xs space-y-1 text-sakura-300">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    PayPal Buyer Protection Active
                  </div>
                  <p className="text-[11px] text-sakura-400/70">
                    This email is prefilled during checkout. Orders are credited securely to our merchant account ({(businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail}).
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping & Contact Info Card */}
            <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-sakura-900/40 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sakura-400" />
                  Shipping & Contact Address
                </h2>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-sakura-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  {isEditingAddress ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block text-sakura-300 font-medium text-xs mb-1">Full Name</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#161622] border border-sakura-800/40 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sakura-300 font-medium text-xs mb-1">Street Address</label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#161622] border border-sakura-800/40 text-white text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sakura-300 font-medium text-xs mb-1">City / Suburb</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#161622] border border-sakura-800/40 text-white text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sakura-300 font-medium text-xs mb-1">State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#161622] border border-sakura-800/40 text-white text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sakura-300 font-medium text-xs mb-1">Postcode</label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#161622] border border-sakura-800/40 text-white text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sakura-300 font-medium text-xs mb-1">Country</label>
                      <input
                        type="text"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#161622] border border-sakura-800/40 text-white text-xs"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-sakura-600 hover:bg-sakura-700 text-white rounded-lg font-bold text-xs mt-2"
                  >
                    Save Address
                  </button>
                </form>
              ) : (
                <div className="text-xs sm:text-sm text-sakura-200 space-y-1 leading-relaxed bg-[#161622] p-4 rounded-2xl border border-sakura-900/40">
                  <div className="font-bold text-white">{addressForm.fullName || currentUser.displayName}</div>
                  <div>{addressForm.street || 'No street address provided'}</div>
                  <div>{addressForm.city}, {addressForm.state} {addressForm.postalCode}</div>
                  <div>{addressForm.country}</div>
                  <div className="pt-2 text-xs text-sakura-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sakura-400" />
                    <span>{currentUser.phone || 'No phone added'}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Previous Orders */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-sakura-900/40 pb-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-sakura-400" />
                    {isAdmin ? 'All Store Customer Orders' : 'Your Past Orders'} ({displayOrders.length})
                  </h2>
                  <p className="text-xs text-sakura-300/70 mt-0.5">
                    {isAdmin 
                      ? 'Master record of customer purchases and PayPal payment confirmations.'
                      : 'Track past purchases and check item specifications.'}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('shop')}
                  className="text-xs font-bold text-sakura-400 hover:underline"
                >
                  Order More Stock
                </button>
              </div>

              {displayOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-sakura-800 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">No previous orders found.</p>
                  <p className="text-xs text-sakura-400/60 mt-1">Once you complete a PayPal order, it will appear here.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {displayOrders.map((order) => (
                    <div 
                      key={order.orderId}
                      className="border border-sakura-900/40 rounded-2xl p-5 bg-[#14141e] hover:bg-[#161622] transition-colors space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sakura-950 pb-3 text-xs">
                        <div>
                          <span className="font-extrabold text-white text-sm">{order.orderId}</span>
                          <span className="text-sakura-500 mx-2">&bull;</span>
                          <span className="text-sakura-300">{order.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-emerald-400" />
                            Receipt Auto-Emailed to sakurasupplyau@gmail.com
                          </span>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-3">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-sakura-900/40">
                              <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 text-xs">
                              <h4 className="font-bold text-white truncate">{it.name}</h4>
                              {it.selectedSpecs && Object.entries(it.selectedSpecs).map(([k, v]) => (
                                <p key={k} className="text-[11px] text-sakura-300/80">
                                  {k.replace(/([A-Z])/g, ' $1')}: <strong>{v}</strong>
                                </p>
                              ))}
                              <div className="text-sakura-300/70 mt-0.5">
                                Qty: {it.quantity} &times; ${it.unitPrice.toFixed(2)} AUD
                              </div>
                            </div>
                            <div className="font-bold text-white text-xs">
                              ${(it.unitPrice * it.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Shipping Address */}
                      <div className="pt-3 border-t border-sakura-950 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sakura-300 text-xs max-w-md">
                            <span className="text-sakura-400 font-semibold">Shipping Address: </span>
                            <span className="text-white">{order.shippingAddress || 'Address on file'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sakura-400/80 mr-2">Paid via PayPal (incl. 5% fee):</span>
                            <span className="font-black text-white text-sm">${Number(order.total || 0).toFixed(2)} AUD</span>
                          </div>
                        </div>

                        {order.paypalPayerEmail && (
                          <div className="text-[11px] text-sakura-400/80 flex flex-wrap items-center justify-between gap-2 border-t border-sakura-950/60 pt-2">
                            <div>
                              <span className="text-sakura-400/70">Buyer PayPal: </span>
                              <span className="text-sakura-200 font-medium font-mono">{order.paypalPayerEmail}</span>
                            </div>
                            <div className="text-sakura-400/70 text-[10px]">
                              {order.paymentMethod || 'PayPal Verified (Buyer Protected)'}
                            </div>
                          </div>
                        )}

                        {/* Order Email & Copy Actions */}
                        <div className="pt-2 border-t border-sakura-950/60 flex flex-wrap items-center justify-between gap-2">
                          <a
                            href={order.mailtoUrl || (getOrderMailtoUrl && getOrderMailtoUrl(order, "sakurasupplyau@gmail.com"))}
                            className="text-[11px] font-bold text-sakura-300 hover:text-white bg-[#181824] hover:bg-sakura-950 px-2.5 py-1 rounded-lg border border-sakura-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Mail className="w-3 h-3 text-sakura-400" />
                            Email to sakurasupplyau@gmail.com
                          </a>
                          <button
                            onClick={() => {
                              const text = order.emailReceiptText || (formatOrderEmailReceipt && formatOrderEmailReceipt(order, "sakurasupplyau@gmail.com"));
                              if (text && navigator?.clipboard) {
                                navigator.clipboard.writeText(text);
                                setCopiedOrderId(order.orderId);
                                setTimeout(() => setCopiedOrderId(null), 3000);
                              }
                            }}
                            className="text-[11px] font-bold text-sakura-300 hover:text-white bg-[#181824] hover:bg-[#202030] px-2.5 py-1 rounded-lg border border-sakura-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedOrderId === order.orderId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-sakura-400" />}
                            {copiedOrderId === order.orderId ? 'Receipt Copied!' : 'Copy Full Receipt'}
                          </button>
                        </div>
                      </div>

                      {/* Customer Review Section for Order */}
                      <div className="pt-1 border-t border-sakura-950/80">
                        {hasReviewedOrder(order.orderId) ? (
                          <OrderReviewCard order={order} />
                        ) : (
                          <div>
                            {openReviewOrderId === order.orderId ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    Write a Review for Order #{order.orderId}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setOpenReviewOrderId(null)}
                                    className="text-[11px] text-sakura-400 hover:text-white underline cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <OrderReviewCard 
                                  order={order}
                                  title={`Review for Order #${order.orderId}`}
                                  subtitle="Your verified review will be displayed in our store's customer feedback section."
                                  onSuccess={() => setOpenReviewOrderId(null)}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#11111a] p-3 rounded-2xl border border-sakura-900/30">
                                <div>
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    Verified Collector Review
                                  </div>
                                  <p className="text-[11px] text-sakura-300/70">
                                    You haven't reviewed this purchase yet. Share your experience with other collectors.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setOpenReviewOrderId(order.orderId)}
                                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  Leave a Review
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
        )}

      </div>
    </div>
  );
}
