import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Check, 
  Edit3,
  PackageCheck
} from 'lucide-react';

export default function ProductDetailModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    cart,
    addToCart, 
    navigateTo, 
    setAdminModalOpen, 
    setEditingProduct,
    calculateItemShipping,
    businessInfo,
    isAdmin,
    currentUser,
    setAuthModalOpen,
    setPendingCartItem,
    hasCompleteShippingAddress,
    setShippingModalOpen
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [addedNotice, setAddedNotice] = useState(false);

  // Live stock counts, purchase cap, and bounds
  const currentInCart = (cart || [])
    .filter((item) => item.productId === selectedProduct?.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const maxStock = Number(selectedProduct?.stockCount) || 0;
  const hasCap = Boolean(selectedProduct?.hasPurchaseCap && Number(selectedProduct?.purchaseCap) > 0);
  const purchaseCap = hasCap ? Number(selectedProduct.purchaseCap) : null;
  const effectiveMax = hasCap ? Math.min(maxStock, purchaseCap) : maxStock;
  const remainingStock = Math.max(0, effectiveMax - currentInCart);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedImage(0);
      const inCart = (cart || [])
        .filter((item) => item.productId === selectedProduct.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      const mStock = Number(selectedProduct.stockCount) || 0;
      const hCap = Boolean(selectedProduct.hasPurchaseCap && Number(selectedProduct.purchaseCap) > 0);
      const effMax = hCap ? Math.min(mStock, Number(selectedProduct.purchaseCap)) : mStock;
      const available = Math.max(0, effMax - inCart);
      setQuantity(available > 0 ? 1 : 0);
      setAddedNotice(false);

      const defaults = {};
      if (selectedProduct.specifications) {
        selectedProduct.specifications.forEach((spec) => {
          // Skip any old duplicate shipping group
          if (spec.id === 'transitCover' || spec.name.toLowerCase().includes('transit cover')) return;
          const defaultOpt = spec.options.find((opt) => opt.default) || spec.options[0];
          defaults[spec.id] = defaultOpt ? defaultOpt.label : '';
        });
      }
      setSelectedSpecs(defaults);
    }
  }, [selectedProduct, cart]);

  if (!selectedProduct) return null;

  // Filter out any duplicate shipping group from specifications
  const activeSpecifications = (selectedProduct.specifications || []).filter(
    (spec) => spec.id !== 'transitCover' && !spec.name.toLowerCase().includes('transit cover')
  );

  // Calculate live dynamic price based on chosen specifications
  let extraCost = 0;
  activeSpecifications.forEach((spec) => {
    const chosenLabel = selectedSpecs[spec.id];
    const option = spec.options.find((opt) => opt.label === chosenLabel);
    if (option && option.priceModifier) {
      extraCost += Number(option.priceModifier);
    }
  });

  const finalUnitPrice = selectedProduct.basePrice + extraCost;
  const finalTotalPrice = finalUnitPrice * quantity;

  // Strikethrough Deal Comparison:
  // Triggered when product has originalPrice > basePrice, or an option reduces the price (extraCost < 0)
  let referencePrice = null;
  if (selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.basePrice) {
    referencePrice = selectedProduct.originalPrice + Math.max(0, extraCost);
  } else if (extraCost < 0) {
    referencePrice = selectedProduct.basePrice;
  }
  const isDeal = referencePrice !== null && referencePrice > finalUnitPrice;
  const savingsPerUnit = isDeal ? referencePrice - finalUnitPrice : 0;
  const itemShippingCost = Number(selectedProduct.shippingCost) || 0;
  const calculatedShipping = calculateItemShipping 
    ? calculateItemShipping(itemShippingCost, quantity) 
    : (itemShippingCost > 0 ? itemShippingCost + (quantity - 1) * (itemShippingCost * 0.5) : 0);

  const handleSpecChange = (specId, optionLabel) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [specId]: optionLabel
    }));
  };

  const handleAddToCart = () => {
    if (remainingStock <= 0) return;
    if (!currentUser) {
      setPendingCartItem({
        product: selectedProduct,
        selectedSpecs,
        quantity,
        finalUnitPrice,
        isBuyNow: false
      });
      setAuthModalOpen(true);
      return;
    }
    if (!hasCompleteShippingAddress(currentUser)) {
      setPendingCartItem({
        product: selectedProduct,
        selectedSpecs,
        quantity,
        finalUnitPrice,
        isBuyNow: false
      });
      setShippingModalOpen(true);
      return;
    }
    const added = addToCart(selectedProduct, selectedSpecs, quantity, finalUnitPrice);
    if (added > 0) {
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
      }, 3000);
    }
  };

  const handleBuyNow = () => {
    if (remainingStock <= 0) return;
    if (!currentUser) {
      setPendingCartItem({
        product: selectedProduct,
        selectedSpecs,
        quantity,
        finalUnitPrice,
        isBuyNow: true
      });
      setAuthModalOpen(true);
      return;
    }
    if (!hasCompleteShippingAddress(currentUser)) {
      setPendingCartItem({
        product: selectedProduct,
        selectedSpecs,
        quantity,
        finalUnitPrice,
        isBuyNow: true
      });
      setShippingModalOpen(true);
      return;
    }
    addToCart(selectedProduct, selectedSpecs, quantity, finalUnitPrice, true);
    setSelectedProduct(null);
    navigateTo('cart');
  };

  const handleOpenEdit = () => {
    setEditingProduct(selectedProduct);
    setSelectedProduct(null);
    setAdminModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#0e0e14] text-sakura-100 w-full max-w-4xl rounded-3xl shadow-2xl border border-sakura-500/30 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Listing Top Bar */}
        <div className="bg-[#12121c] border-b border-sakura-900/40 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-sakura-300">
            <span className="font-extrabold text-sakura-300 tracking-wider uppercase text-[10px] bg-sakura-950 border border-sakura-700/50 px-2 py-0.5 rounded-md">
              Item Details & Specifications
            </span>
            <span>&bull;</span>
            <span className="text-sakura-400/80">SKU #{selectedProduct.id.replace('prod-', 'SKR-')}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline text-sakura-400/80">Seller: <strong className="text-white">{(businessInfo && businessInfo.name) || BUSINESS_INFO.name}</strong> (Melbourne, VIC)</span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleOpenEdit}
                className="text-xs text-sakura-300 hover:text-white font-semibold px-2.5 py-1 rounded-lg bg-[#181824] border border-sakura-800/40 flex items-center gap-1 transition-colors"
                title="Edit this listing"
              >
                <Edit3 className="w-3.5 h-3.5 text-sakura-400" />
                <span className="hidden sm:inline">Edit Listing</span>
              </button>
            )}
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-8 h-8 rounded-full bg-[#181824] hover:bg-sakura-900/40 text-sakura-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Primary Image */}
              <div className="relative aspect-4/3 sm:aspect-square w-full bg-[#161622] rounded-3xl overflow-hidden border border-sakura-900/40 flex items-center justify-center">
                <img
                  src={selectedProduct.images[selectedImage] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />

                {/* Pre-Order / In Stock Tag */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {Number(selectedProduct.stockCount) <= 0 ? (
                    <span className="px-3 py-1 bg-zinc-900 text-rose-300 border border-rose-500/50 font-black text-xs rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1">
                      <X className="w-3.5 h-3.5 text-rose-400" />
                      Out of Stock
                    </span>
                  ) : selectedProduct.isPreOrder ? (
                    <span className="px-3 py-1 bg-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-md uppercase tracking-wider">
                      Pre-Order Allocation
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-sakura-600 text-white font-black text-xs rounded-xl shadow-md uppercase tracking-wider">
                      Factory Sealed
                    </span>
                  )}
                  {hasCap && (
                    <span className="px-2.5 py-0.5 bg-purple-950/90 text-purple-300 border border-purple-500/40 font-bold text-[10px] rounded-lg shadow-md uppercase tracking-wider">
                      Limit {purchaseCap} per customer
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails row */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-18 h-18 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === idx ? 'border-sakura-500 ring-2 ring-sakura-500/30' : 'border-sakura-950 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badge Box */}
              <div className="bg-[#12121c] border border-sakura-900/40 rounded-2xl p-4 text-xs space-y-1.5 text-sakura-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-sakura-400" />
                  <span>PayPal Buyer Protection Guaranteed</span>
                </div>
                <p className="text-[11px] leading-relaxed text-sakura-300/70">
                  Dispatched directly from Melbourne, VIC. Guaranteed factory sealed.
                </p>
              </div>

            </div>

            {/* Right Column: Listing Details & Dynamic Pricing Dropdowns */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {selectedProduct.name}
                </h1>

                {/* Condition row */}
                <div className="mt-3 py-2 px-3 bg-[#13131c] rounded-xl border border-sakura-900/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sakura-400">Condition:</span>
                    <span className="font-bold text-white">{selectedProduct.condition}</span>
                  </div>
                  <span className="text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded font-semibold text-[10px] border border-emerald-800/40">
                    Verified Pristine
                  </span>
                </div>

                {/* Dynamic Price Display */}
                <div className="mt-4 p-4 rounded-2xl bg-[#141420] border border-sakura-500/30">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sakura-400">
                          {selectedProduct.isPreOrder ? 'Pre-Order Price:' : 'Unit Price:'}
                        </span>
                        {isDeal && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Deal &bull; Save ${savingsPerUnit.toFixed(2)} AUD
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-baseline gap-2.5 mt-1">
                        <span className="text-3xl font-black text-white">
                          ${finalUnitPrice.toFixed(2)}
                        </span>
                        {isDeal && (
                          <span className="text-base sm:text-lg text-sakura-400/60 line-through font-bold">
                            ${referencePrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-sakura-400">AUD</span>
                      </div>
                    </div>

                    {extraCost !== 0 && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                        extraCost < 0 
                          ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700/50' 
                          : 'text-sakura-200 bg-sakura-950 border-sakura-700/50'
                      }`}>
                        {extraCost > 0 ? `Includes +$${extraCost.toFixed(2)} options` : `Includes -$${Math.abs(extraCost).toFixed(2)} option discount`}
                      </span>
                    )}
                  </div>

                  {quantity > 1 && (
                    <div className="text-xs text-sakura-300 mt-2 font-medium flex items-center justify-between border-t border-sakura-950 pt-2">
                      <span>Total ({quantity} items): <strong className="text-white">${finalTotalPrice.toFixed(2)} AUD</strong></span>
                      {isDeal && (
                        <span className="text-emerald-400 font-bold text-[11px]">
                          Total Savings: ${(savingsPerUnit * quantity).toFixed(2)} AUD
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dropdown Specifications / Add-ons (Single Source, No Duplicate Shipping) */}
                {activeSpecifications.length > 0 && (
                  <div className="mt-5 space-y-3.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-sakura-300 flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-sakura-400" />
                      <span>Specifications & Add-on Packaging:</span>
                    </div>

                    {activeSpecifications.map((spec) => (
                      <div key={spec.id} className="space-y-1.5">
                        <label className="block text-xs font-semibold text-sakura-200">
                          {spec.name}:
                        </label>
                        <select
                          value={selectedSpecs[spec.id] || ''}
                          onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                          className="w-full bg-[#161622] border border-sakura-800/50 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-sakura-500/30 focus:border-sakura-400 focus:outline-none transition-all cursor-pointer font-medium"
                        >
                          {spec.options.map((opt, i) => {
                            const mod = Number(opt.priceModifier) || 0;
                            let modLabel = '';
                            if (mod > 0) modLabel = `(+ $${mod.toFixed(2)})`;
                            if (mod < 0) modLabel = `(- $${Math.abs(mod).toFixed(2)} Discount)`;
                            return (
                              <option key={i} value={opt.label} className="bg-[#161622] text-white">
                                {opt.label} {modLabel}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Selector with Strict Stock Limits */}
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-xs font-bold text-sakura-300">Quantity:</span>
                  <div className="inline-flex items-center border border-sakura-800/60 rounded-xl overflow-hidden bg-[#161622]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-sakura-300 hover:bg-sakura-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity <= 1 || remainingStock <= 0}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-extrabold text-white min-w-10 text-center">
                      {remainingStock <= 0 ? 0 : quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(remainingStock, quantity + 1))}
                      className="px-3 py-1.5 text-sm font-bold text-sakura-300 hover:bg-sakura-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity >= remainingStock || remainingStock <= 0}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="text-sakura-300 font-semibold">
                      {maxStock > 0 ? `${maxStock} in stock` : 'Out of stock'}
                    </span>
                    {hasCap && (
                      <span className="text-[10px] text-purple-300 font-bold">
                        Limit: Max {purchaseCap} per customer
                      </span>
                    )}
                    {currentInCart > 0 && (
                      <span className="text-[10px] text-amber-400 font-medium">
                        ({currentInCart} in cart{remainingStock <= 0 ? (hasCap && currentInCart >= purchaseCap ? ' - Order limit reached' : ' - Max reached') : ''})
                      </span>
                    )}
                  </div>
                </div>

                {/* EXACT SHIPPING COST DISPLAY WITH INCREMENTAL RATE RULE */}
                <div className="mt-5 pt-4 border-t border-sakura-900/40 space-y-2 text-xs text-sakura-200">
                  {itemShippingCost > 0 && (
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-sakura-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Shipping:</strong>{" "}
                        <span className="font-bold text-sakura-300">
                          ${calculatedShipping.toFixed(2)} AUD
                        </span>
                        {quantity > 1 ? (
                          <span className="text-[11px] text-sakura-400/80 ml-1.5">
                            (${itemShippingCost.toFixed(2)} base + ${(calculatedShipping - itemShippingCost).toFixed(2)} for {quantity - 1} add'l {quantity - 1 > 1 ? 'units' : 'unit'})
                          </span>
                        ) : (
                          <span className="text-[11px] text-sakura-400/80 ml-1.5">
                            (+${(itemShippingCost * 0.5).toFixed(2)} AUD per additional unit)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sakura-400 shrink-0" />
                    <span><strong className="text-white">Payment:</strong> Protected under PayPal Buyer Protection</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-sakura-900/40 space-y-3">
                
                {addedNotice && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Added to Cart with selected options!
                    </span>
                    <button 
                      onClick={() => { setSelectedProduct(null); navigateTo('cart'); }}
                      className="underline text-emerald-300 font-extrabold hover:text-white"
                    >
                      Go to Cart &rarr;
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={remainingStock <= 0}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                      remainingStock <= 0
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
                        : 'bg-sakura-600 hover:bg-sakura-500 text-white cursor-pointer'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {remainingStock <= 0
                      ? currentInCart > 0
                        ? (hasCap && currentInCart >= purchaseCap ? `Limit Reached (Max ${purchaseCap})` : 'Max Stock in Cart')
                        : 'Out of Stock'
                      : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={remainingStock <= 0}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all ${
                      remainingStock <= 0
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
                        : 'bg-[#ffc439] hover:bg-[#f4bb34] text-zinc-950 cursor-pointer'
                    }`}
                  >
                    <span className="italic font-black text-blue-900 text-base">Pay</span>
                    <span className="italic font-black text-blue-700 text-base -ml-1">Pal</span>
                    <span className="text-zinc-900 text-xs font-bold ml-1">
                      {remainingStock <= 0 ? 'Out of Stock' : 'Checkout'}
                    </span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-sakura-400/60">
                  By placing an order, you agree to our Terms of Service & Shipping Policies.
                </p>
              </div>

            </div>

          </div>

          {/* Item Specifics Table */}
          <div className="mt-8 pt-6 border-t border-sakura-900/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sakura-400 mb-3">
              Item Specifics & Attributes
            </h3>

            <div className="bg-[#12121c] border border-sakura-900/40 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
              {selectedProduct.itemSpecifics && Object.entries(selectedProduct.itemSpecifics).map(([key, value]) => (
                <div key={key} className="flex border-b border-sakura-950/60 pb-2">
                  <span className="w-1/2 text-sakura-400 font-semibold">{key}:</span>
                  <span className="w-1/2 text-white font-bold">{value}</span>
                </div>
              ))}
              <div className="flex border-b border-sakura-950/60 pb-2">
                <span className="w-1/2 text-sakura-400 font-semibold">Location / Dispatch:</span>
                <span className="w-1/2 text-white font-bold">Melbourne, VIC, Australia</span>
              </div>
              <div className="flex border-b border-sakura-950/60 pb-2">
                <span className="w-1/2 text-sakura-400 font-semibold">Verified Merchant ABN:</span>
                <span className="w-1/2 text-white font-bold">{(businessInfo && businessInfo.abn) || BUSINESS_INFO.abn}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 pt-5 border-t border-sakura-900/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sakura-400 mb-2">
              Description & Packaging Standard
            </h3>
            <p className="text-xs sm:text-sm text-sakura-200/80 leading-relaxed whitespace-pre-line">
              {selectedProduct.description}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
