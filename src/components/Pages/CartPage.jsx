import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BUSINESS_INFO } from '../../data/business';
import { CherryBlossomTreeIcon } from '../Header';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Copy,
  Check,
  Mail
} from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    products,
    cartSubtotal, 
    cartShipping, 
    cartTotal,
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    navigateTo, 
    createOrder,
    userProfile,
    businessInfo,
    redirectToPayPal,
    calculateItemShipping,
    formatOrderEmailReceipt,
    getOrderMailtoUrl,
    currentUser,
    setAuthModalOpen,
    shippingModalOpen,
    setShippingModalOpen,
    hasCompleteShippingAddress,
    updateUserPaypalEmail
  } = useStore();

  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState(false);
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Mandatory PayPal Email state
  const [paypalEmailInput, setPaypalEmailInput] = useState(currentUser?.paypalEmail || userProfile?.paypalEmail || '');
  const [paypalError, setPaypalError] = useState('');

  useEffect(() => {
    if (currentUser?.paypalEmail) {
      setPaypalEmailInput(currentUser.paypalEmail);
    }
  }, [currentUser]);

  const handleStartCheckout = () => {
    // 1. Unsigned-in customer must sign in
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    // 2. Customer must have a complete delivery address
    if (!hasCompleteShippingAddress(currentUser)) {
      setShippingModalOpen(true);
      return;
    }

    // 3. Customer must provide a valid PayPal account email address
    const cleanPaypal = String(paypalEmailInput || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanPaypal || !emailRegex.test(cleanPaypal)) {
      setPaypalError('PayPal account email is required before checkout. Please enter your PayPal email.');
      return;
    }
    setPaypalError('');
    if (updateUserPaypalEmail && cleanPaypal !== currentUser?.paypalEmail) {
      updateUserPaypalEmail(cleanPaypal);
    }

    // 4. Policy agreement
    if (!policyAgreed) {
      setAgreementError(true);
      return;
    }
    setAgreementError(false);

    setPaypalModalOpen(true);
  };

  const handleConfirmPaypal = () => {
    const finalBuyerPaypal = String(paypalEmailInput || currentUser?.paypalEmail || userProfile?.paypalEmail || '').trim();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newOrder = createOrder({
        policyAgreed: true,
        paypalPayerEmail: finalBuyerPaypal,
        buyerEmail: currentUser?.email || finalBuyerPaypal,
        paymentMethod: "PayPal Verified"
      });
      setCompletedOrder(newOrder);
      setPaypalModalOpen(false);
    }, 1200);
  };

  const handleRealPaypalCheckout = () => {
    const finalBuyerPaypal = String(paypalEmailInput || currentUser?.paypalEmail || userProfile?.paypalEmail || '').trim();
    const currentMerchantEmail = (businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail;
    const newOrder = createOrder({
      policyAgreed: true,
      paypalPayerEmail: finalBuyerPaypal,
      buyerEmail: currentUser?.email || finalBuyerPaypal,
      paymentMethod: `Official PayPal Gateway (Merchant: ${currentMerchantEmail})`
    });
    
    // Redirect to official PayPal Standard checkout
    if (redirectToPayPal) {
      redirectToPayPal({
        cartItems: newOrder.items,
        shipping: newOrder.shippingCost,
        customNote: `Sakura Supply Order #${newOrder.orderId}`
      });
    }

    setCompletedOrder(newOrder);
    setPaypalModalOpen(false);
  };

  if (completedOrder) {
    return (
      <div className="min-h-[70vh] bg-[#09090b] py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-[#111118] max-w-lg w-full rounded-3xl p-8 border border-sakura-500/40 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-950 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border text-emerald-300 bg-emerald-950/80 border-emerald-700/50">
              Payment Completed via PayPal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              Order #{completedOrder.orderId} Created
            </h2>
            <p className="text-sakura-300/80 text-xs sm:text-sm mt-2">
              Thank you for your purchase! A confirmation receipt has been sent to <strong className="text-white">{completedOrder.buyerEmail || 'your account email'}</strong>.
            </p>
          </div>

          <div className="bg-[#161622] rounded-2xl p-4 text-left text-xs space-y-2.5 border border-sakura-900/40">
            <div className="flex justify-between">
              <span className="text-sakura-400">Order Number:</span>
              <span className="font-bold text-white">{completedOrder.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sakura-400">Items Subtotal:</span>
              <span className="font-bold text-white">${completedOrder.subtotal.toFixed(2)} AUD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sakura-400">Shipping:</span>
              <span className="font-bold text-sakura-300">
                {completedOrder.shippingCost > 0 ? `$${completedOrder.shippingCost.toFixed(2)} AUD` : 'FREE'}
              </span>
            </div>
            <div className="flex justify-between border-t border-sakura-900/40 pt-2 text-sm">
              <span className="text-white font-extrabold">Total:</span>
              <span className="font-black text-white">${completedOrder.total.toFixed(2)} AUD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sakura-400">Payment Merchant:</span>
              <span className="font-bold text-sakura-300">Sakura Supply ({(businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sakura-400">Confirmation Sent:</span>
              <span className="font-bold text-emerald-400">{completedOrder.buyerEmail || 'Your Account Email'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sakura-400">Delivery Address:</span>
              <span className="font-bold text-white text-right">{completedOrder.shippingAddress}</span>
            </div>
          </div>

          {/* Quick Customer Receipt Tool */}
          <div className="pt-1 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                const text = completedOrder.emailReceiptText || (formatOrderEmailReceipt && formatOrderEmailReceipt(completedOrder, completedOrder.buyerEmail));
                if (text && navigator?.clipboard) {
                  navigator.clipboard.writeText(text);
                  setCopiedReceipt(true);
                  setTimeout(() => setCopiedReceipt(false), 3000);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] text-sakura-200 hover:text-white border border-sakura-800/40 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sakura-400" />}
              {copiedReceipt ? 'Receipt Copied to Clipboard!' : 'Copy Order Receipt'}
            </button>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigateTo('account')}
              className="px-6 py-3 rounded-2xl bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              View in Account & Orders
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 rounded-2xl bg-[#181824] hover:bg-[#202030] text-sakura-200 font-semibold text-xs sm:text-sm transition-colors border border-sakura-900/40"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#09090b] py-16 px-4 flex items-center justify-center">
        <div className="bg-[#111118] max-w-md w-full rounded-3xl p-8 border border-sakura-900/40 text-center shadow-xl">
          <div className="w-16 h-16 bg-sakura-950 border border-sakura-700/40 text-sakura-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-sakura-300/70 mt-2">
            You haven't added any items or pre-orders yet. Browse our verified inventory to find sealed collectibles.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-colors"
          >
            Explore Stock & Pre-Orders
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
            <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
            Order Review & Checkout
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Your Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => {
              const product = (products || []).find((p) => p.id === item.productId);
              const maxStock = product ? Number(product.stockCount) : item.quantity;
              const hasCap = Boolean(product && product.hasPurchaseCap && Number(product.purchaseCap) > 0);
              const purchaseCap = hasCap ? Number(product.purchaseCap) : null;
              const effectiveMax = hasCap ? Math.min(maxStock, purchaseCap) : maxStock;
              const totalForProductInCart = cart
                .filter((i) => i.productId === item.productId)
                .reduce((s, i) => s + i.quantity, 0);
              const isAtMaxStock = totalForProductInCart >= effectiveMax;

              const itemBaseShipping = Number(item.shippingCost) || 0;
              const itemShipping = calculateItemShipping 
                ? calculateItemShipping(itemBaseShipping, item.quantity) 
                : (itemBaseShipping > 0 ? itemBaseShipping + (item.quantity - 1) * (itemBaseShipping * 0.5) : 0);

              return (
                <div 
                  key={item.cartItemId}
                  className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#181822] overflow-hidden shrink-0 border border-sakura-900/40">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {item.isPreOrder && (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-zinc-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                        Pre-Order
                      </span>
                    )}
                  </div>

                  {/* Info & Specifications */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                        {item.name}
                      </h3>
                      {hasCap && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 shrink-0">
                          Limit: Max {purchaseCap}
                        </span>
                      )}
                    </div>

                    {/* Specifications included */}
                    {item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(item.selectedSpecs).map(([key, val]) => (
                          <div key={key} className="text-xs text-sakura-200 bg-[#181824] px-2.5 py-1 rounded-lg inline-block mr-2 border border-sakura-900/40">
                            <span className="font-bold text-sakura-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Unit price & individual item shipping notice with incremental calculation */}
                    <div className="mt-2 text-xs text-sakura-300/80">
                      Unit Price: <span className="font-bold text-white">${item.unitPrice.toFixed(2)} AUD</span>
                      {itemShipping > 0 ? (
                        <span className="ml-2 text-sakura-400 font-semibold">
                          &bull; Shipping: ${itemShipping.toFixed(2)} AUD
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-sakura-300/70 ml-1">
                              (${itemBaseShipping.toFixed(2)} base + ${(itemShipping - itemBaseShipping).toFixed(2)} add'l)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="ml-2 text-emerald-400 font-semibold">&bull; Free Shipping</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Remove with Stock Cap */}
                  <div className="flex sm:flex-col items-center justify-between sm:items-end w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-sakura-950/60">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-sakura-400 block sm:hidden">Line Total</span>
                      <span className="text-base sm:text-lg font-black text-white">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center border border-sakura-800/60 rounded-xl overflow-hidden bg-[#181824]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-1 hover:bg-sakura-950 text-sakura-300 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-extrabold text-white min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          disabled={isAtMaxStock}
                          className={`p-1 text-sakura-300 transition-colors ${
                            isAtMaxStock ? 'opacity-25 cursor-not-allowed' : 'hover:bg-sakura-950 cursor-pointer'
                          }`}
                          aria-label="Increase quantity"
                          title={isAtMaxStock ? (hasCap && totalForProductInCart >= purchaseCap ? `Purchase cap (${purchaseCap}) reached` : `Max listing stock (${maxStock}) reached`) : 'Increase quantity'}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-sakura-400/70 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isAtMaxStock && (
                      <span className="text-[10px] text-amber-400 font-bold block sm:text-right">
                        {hasCap && totalForProductInCart >= purchaseCap 
                          ? `Order limit reached (Max ${purchaseCap} per customer)`
                          : `Max stock reached (${maxStock})`}
                      </span>
                    )}
                  </div>

                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs font-bold text-sakura-400 hover:underline"
              >
                &larr; Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-sakura-400/60 hover:text-rose-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right Column: Checkout & PayPal Payment Section */}
          <div className="lg:col-span-5">
            <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-7 shadow-sm sticky top-24 space-y-6">
              
              <div className="border-b border-sakura-900/40 pb-4">
                <h2 className="text-base font-black text-white">Order Summary</h2>
                <p className="text-xs text-sakura-300/70">Sakura Supply Checkout via PayPal</p>
              </div>

              {/* Price Breakdown - ACCURATE DYNAMIC SHIPPING COST (e.g. $15.01) */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-sakura-200">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-white">${cartSubtotal.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between text-sakura-200">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-sakura-400" />
                    <span>Domestic Shipping:</span>
                  </span>
                  <span className="font-bold text-white">
                    {cartShipping > 0 ? (
                      <span className="text-sakura-300">${cartShipping.toFixed(2)} AUD</span>
                    ) : (
                      <span className="text-emerald-400">FREE</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sakura-200">
                  <span>Collector Packaging:</span>
                  <span className="font-bold text-emerald-400">INCLUDED</span>
                </div>
                <div className="flex justify-between text-sakura-400/80">
                  <span>Estimated GST (10%):</span>
                  <span>Included in price</span>
                </div>

                <div className="border-t border-sakura-900/40 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-extrabold text-white">Total:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">${cartTotal.toFixed(2)}</span>
                    <span className="text-xs font-bold text-sakura-400 ml-1">AUD</span>
                  </div>
                </div>
              </div>

              {/* Shipping Destination Summary */}
              {!currentUser ? (
                <div className="bg-[#161622] border border-amber-900/50 rounded-2xl p-4 text-xs text-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      Sign-In Required for Checkout
                    </span>
                    <button 
                      type="button"
                      onClick={() => setAuthModalOpen(true)} 
                      className="text-sakura-400 font-extrabold text-[11px] underline hover:text-white cursor-pointer"
                    >
                      Sign In / Register
                    </button>
                  </div>
                  <p className="text-sakura-300/80 leading-relaxed">
                    Please sign in or create an account to attach your delivery address and complete checkout.
                  </p>
                </div>
              ) : !hasCompleteShippingAddress(currentUser) ? (
                <div className="bg-[#18141e] border border-rose-900/60 rounded-2xl p-4 text-xs text-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Truck className="w-4 h-4 text-rose-400 shrink-0" />
                      Delivery Address Missing
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShippingModalOpen(true)} 
                      className="text-sakura-400 font-extrabold text-[11px] underline hover:text-white cursor-pointer"
                    >
                      Add Address Now
                    </button>
                  </div>
                  <p className="text-sakura-300/80 leading-relaxed">
                    A complete street address is required for Australia Post dispatch and buyer protection.
                  </p>
                </div>
              ) : (
                <div className="bg-[#161622] border border-sakura-900/40 rounded-2xl p-3.5 text-xs text-sakura-200">
                  <div className="flex items-center justify-between font-bold text-white mb-1">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Shipping Destination:</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShippingModalOpen(true)} 
                      className="text-sakura-400 text-[11px] hover:underline font-semibold cursor-pointer"
                    >
                      Edit Address
                    </button>
                  </div>
                  <p className="text-sakura-300/80 font-medium">
                    {currentUser.shippingAddress.fullName}, {currentUser.shippingAddress.street}, {currentUser.shippingAddress.city} {currentUser.shippingAddress.state} {currentUser.shippingAddress.postalCode}
                  </p>
                </div>
              )}

              {/* MANDATORY BUYER PAYPAL ACCOUNT EMAIL */}
              <div className={`p-4 rounded-2xl border transition-all ${
                paypalError 
                  ? 'bg-rose-950/70 border-rose-500/70 ring-2 ring-rose-500/30' 
                  : 'bg-[#151522] border-sakura-800/40'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="italic font-black text-blue-400">Pay</span>
                    <span className="italic font-black text-blue-200 -ml-1">Pal</span>
                    <span>Account Email:</span>
                    <span className="text-[10px] text-rose-400 font-bold">*Required</span>
                  </label>
                  {currentUser?.paypalEmail && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved on file
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={paypalEmailInput}
                    onChange={(e) => {
                      setPaypalEmailInput(e.target.value);
                      if (paypalError) setPaypalError('');
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && val.includes('@') && updateUserPaypalEmail) {
                        updateUserPaypalEmail(val);
                      }
                    }}
                    placeholder="Enter your buyer PayPal email (e.g. buyer@gmail.com)"
                    className="w-full bg-[#101018] border border-sakura-900/50 focus:border-sakura-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pl-9"
                  />
                  <Mail className="w-4 h-4 text-sakura-400/60 absolute left-3 top-3" />
                </div>
                <p className="mt-1 text-[10px] text-sakura-300/70 leading-relaxed">
                  Required before checkout. Receipt and payment confirmation will link to this verified PayPal account.
                </p>
                {paypalError && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{paypalError}</span>
                  </div>
                )}
              </div>

              {/* MANDATORY POLICY & SHIPPING ACKNOWLEDGMENT CHECKBOX */}
              <div className={`p-4 rounded-2xl border transition-all ${
                agreementError ? 'bg-rose-950/70 border-rose-500/60 ring-2 ring-rose-500/30' : 'bg-[#151522] border-sakura-800/40'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policyAgreed}
                    onChange={(e) => {
                      setPolicyAgreed(e.target.checked);
                      if (e.target.checked) setAgreementError(false);
                    }}
                    className="mt-1 w-4 h-4 rounded text-sakura-600 focus:ring-sakura-500 border-sakura-700 cursor-pointer"
                  />
                  <div className="text-xs text-sakura-200 leading-snug">
                    <span className="font-bold text-white">Policies & Shipping Acknowledgment:</span>
                    <p className="mt-1 text-sakura-300/80">
                      I acknowledge and agree that placing this order constitutes full agreement to the{" "}
                      <button 
                        type="button" 
                        onClick={() => navigateTo('policies')} 
                        className="text-sakura-400 font-bold underline hover:text-white"
                      >
                        Shipping Policy, Handling Times, Return Terms, and Policies & Terms of Service
                      </button>.
                    </p>
                  </div>
                </label>

                {agreementError && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>Please agree to the Policies & Shipping Terms before checking out.</span>
                  </div>
                )}
              </div>

              {/* PayPal Payment Action */}
              <div className="space-y-3">
                <button
                  onClick={handleStartCheckout}
                  className="w-full py-4 px-6 rounded-2xl bg-[#ffc439] hover:bg-[#f4bb34] text-zinc-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="text-xs font-bold text-zinc-900">
                    {!currentUser 
                      ? 'Sign In to Checkout with' 
                      : !hasCompleteShippingAddress(currentUser)
                        ? 'Add Address to Checkout with'
                        : 'Checkout with'}
                  </span>
                  <div className="flex items-baseline -space-x-0.5">
                    <span className="italic font-black text-blue-900 text-xl tracking-tight">Pay</span>
                    <span className="italic font-black text-blue-600 text-xl tracking-tight">Pal</span>
                  </div>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-sakura-400/70">
                  <Lock className="w-3.5 h-3.5 text-sakura-400" />
                  <span>Only PayPal is accepted &bull; Protected by PayPal Buyer Protection</span>
                </div>
              </div>

              {/* Business Credential Verification */}
              <div className="border-t border-sakura-900/40 pt-3 text-[11px] text-sakura-400/60 text-center space-y-0.5">
                <div>Merchant: <strong className="text-sakura-200">{(businessInfo && businessInfo.name) || BUSINESS_INFO.name}</strong></div>
                <div>ABN: {(businessInfo && businessInfo.abn) || BUSINESS_INFO.abn} &bull; PayPal: {(businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail}</div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Official & Simulated PayPal Modal */}
      {paypalModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101018] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-sakura-500/30 space-y-6">
            
            {/* PayPal Branding Header */}
            <div className="flex items-center justify-between border-b border-sakura-900/40 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="italic font-black text-blue-400 text-2xl">Pay</span>
                <span className="italic font-black text-blue-200 text-2xl -ml-1">Pal</span>
              </div>
              <span className="text-xs font-semibold text-sakura-400">Secure Express Checkout</span>
            </div>

            {/* Merchant Details */}
            <div className="bg-[#161624] rounded-2xl p-4 border border-sakura-900/40 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-sakura-400">Pay To Merchant:</span>
                <span className="font-bold text-white">{(businessInfo && businessInfo.name) || BUSINESS_INFO.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sakura-400">Merchant PayPal:</span>
                <span className="font-semibold text-sakura-300">{(businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sakura-400">Items Subtotal:</span>
                <span className="font-semibold text-white">${cartSubtotal.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sakura-400">Shipping:</span>
                <span className="font-semibold text-sakura-300">
                  {cartShipping > 0 ? `$${cartShipping.toFixed(2)} AUD` : 'FREE'}
                </span>
              </div>
              <div className="border-t border-sakura-900/40 pt-2 flex justify-between font-extrabold text-sm">
                <span className="text-white">Total Amount:</span>
                <span className="text-white text-base font-black">${cartTotal.toFixed(2)} AUD</span>
              </div>
            </div>

            {/* Note on destination account */}
            <div className="p-3 rounded-xl bg-[#14141e] border border-sakura-800/40 text-[11px] text-sakura-300/90 leading-relaxed">
              Real customer transactions are processed securely through PayPal and credited directly to: <strong className="text-white break-all">{(businessInfo && businessInfo.paypalEmail) || BUSINESS_INFO.paypalEmail}</strong>.
            </div>

            {/* Buyer Account */}
            <div className="text-xs text-sakura-300 space-y-1">
              <div className="font-bold text-white">Your PayPal Account:</div>
              <div className="p-3 bg-[#181824] rounded-xl border border-sakura-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{paypalEmailInput || currentUser?.paypalEmail || userProfile.paypalEmail || userProfile.email}</div>
                  <div className="text-[10px] text-sakura-400">Linked Bank / Card Verified</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-sakura-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Primary: Real Official PayPal Gateway */}
              <button
                onClick={handleRealPaypalCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f4bb34] text-zinc-950 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span className="italic font-black text-blue-900 text-base">Pay</span>
                <span className="italic font-black text-blue-700 text-base -ml-1">Pal</span>
                <span>Pay Now ${cartTotal.toFixed(2)} AUD (Official Live Gateway)</span>
              </button>

              {/* Secondary: Simulate Test Order */}
              <button
                onClick={handleConfirmPaypal}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-[#181824] hover:bg-[#202030] text-sakura-300 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-sakura-800/50 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Authorizing simulation...</span>
                ) : (
                  <span>Simulate Test Order (Demo Mode)</span>
                )}
              </button>

              <button
                onClick={() => setPaypalModalOpen(false)}
                disabled={isProcessing}
                className="w-full py-2 text-xs font-semibold text-sakura-400 hover:text-white cursor-pointer"
              >
                Cancel and return to cart
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
