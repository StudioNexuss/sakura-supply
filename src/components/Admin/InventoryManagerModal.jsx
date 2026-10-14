import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Package, 
  Check, 
  Sliders,
  CreditCard,
  Building,
  Lock,
  ShieldAlert
} from 'lucide-react';

const EMPTY_PRODUCT = {
  id: '',
  name: '',
  basePrice: 99.00,
  originalPrice: null,
  shippingCost: 0,
  category: 'Trading Cards',
  isPreOrder: false,
  expectedRelease: '',
  stockCount: 10,
  hasPurchaseCap: false,
  purchaseCap: 1,
  condition: 'Brand New Factory Sealed',
  images: [
    'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80'
  ],
  shortDescription: '',
  description: '',
  itemSpecifics: {
    'Brand': 'Authentic Distributor',
    'Language': 'English',
    'Country/Region of Manufacture': 'Australia'
  },
  // NO duplicate shipping group here! Only custom product add-ons:
  specifications: [
    {
      id: 'packagingProtection',
      name: 'Packaging & Case Options',
      options: [
        { label: 'Standard Factory Seal', priceModifier: 0, default: true },
        { label: 'UV Acrylic Protective Case', priceModifier: 15.00 }
      ]
    }
  ]
};

export default function InventoryManagerModal() {
  const { 
    adminModalOpen, 
    setAdminModalOpen, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToDefaultProducts,
    editingProduct,
    setEditingProduct,
    businessInfo,
    updateBusinessInfo,
    isAdmin,
    currentUser,
    login,
    navigateTo
  } = useStore();

  const [adminAuthUser, setAdminAuthUser] = useState('');
  const [adminAuthPass, setAdminAuthPass] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAdminGateLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = login(adminAuthUser, adminAuthPass);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed.');
      return;
    }
    if (res.user?.role !== 'admin') {
      setAuthError('Access Denied: Logged in account does not have administrator privileges.');
    }
  };

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'editor' | 'settings'
  const [formData, setFormData] = useState(EMPTY_PRODUCT);
  const [notification, setNotification] = useState('');
  const [imageInput, setImageInput] = useState('');

  const [settingsForm, setSettingsForm] = useState({
    name: businessInfo?.name || '',
    abn: businessInfo?.abn || '',
    paypalEmail: businessInfo?.paypalEmail || '',
    email: businessInfo?.email || '',
    location: businessInfo?.location || ''
  });

  useEffect(() => {
    if (businessInfo) {
      setSettingsForm({
        name: businessInfo.name || '',
        abn: businessInfo.abn || '',
        paypalEmail: businessInfo.paypalEmail || '',
        email: businessInfo.email || '',
        location: businessInfo.location || ''
      });
    }
  }, [businessInfo]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (updateBusinessInfo) {
      updateBusinessInfo(settingsForm);
    }
    showNotice('PayPal & Business settings saved! Real payments now route to: ' + settingsForm.paypalEmail);
  };

  // Handle edit selection from outside or inside
  useEffect(() => {
    if (editingProduct) {
      // Remove any lingering shipping add-on groups from specifications if user previously had them
      const cleanedProduct = JSON.parse(JSON.stringify(editingProduct));
      if (cleanedProduct.specifications) {
        cleanedProduct.specifications = cleanedProduct.specifications.filter(
          (spec) => spec.id !== 'transitCover' && !spec.name.toLowerCase().includes('transit cover')
        );
      }
      setFormData({
        ...EMPTY_PRODUCT,
        ...cleanedProduct,
        hasPurchaseCap: Boolean(cleanedProduct.hasPurchaseCap),
        purchaseCap: cleanedProduct.purchaseCap || 1
      });
      setImageInput((editingProduct.images || []).join('\n'));
      setActiveTab('editor');
    }
  }, [editingProduct]);

  if (!adminModalOpen) return null;

  // STRICT ACCESS GATE: Random visitors or standard customers cannot access store admin controls!
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div 
          className="bg-[#0e0e14] text-sakura-100 w-full max-w-md rounded-3xl shadow-2xl border border-sakura-500/40 overflow-hidden p-6 sm:p-7 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-sakura-900/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sakura-600/30 border border-sakura-500/40 flex items-center justify-center text-sakura-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Store Admin Authentication</h3>
                <p className="text-[11px] text-sakura-400/70">Restricted Merchant Portal</p>
              </div>
            </div>
            <button
              onClick={() => setAdminModalOpen(false)}
              className="w-7 h-7 rounded-full bg-[#181824] hover:bg-sakura-900/40 text-sakura-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 bg-[#14141e] border border-sakura-900/40 rounded-2xl text-xs text-sakura-200 space-y-1.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              Administrator Verification Required
            </p>
            <p className="text-[11px] text-sakura-300/80 leading-relaxed">
              Random visitors and customer accounts do not have access to store inventory, pricing, or settings. Only authorized store administrators (Jackson Micic) may proceed.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminGateLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-sakura-200 mb-1">Admin Username or Email</label>
              <input
                type="text"
                value={adminAuthUser}
                onChange={(e) => setAdminAuthUser(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs"
                placeholder="jackson micic or sakurasupplyau@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-sakura-200 mb-1">Admin Password</label>
              <input
                type="password"
                value={adminAuthPass}
                onChange={(e) => setAdminAuthPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs"
                placeholder="Enter administrator password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Verify & Enter Admin Portal
            </button>
          </form>

          <div className="pt-2 border-t border-sakura-900/30 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setAdminModalOpen(false);
                navigateTo('account');
              }}
              className="text-center text-xs text-sakura-400/80 hover:text-sakura-300 hover:underline pt-1"
            >
              Go to Customer Account Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartCreate = () => {
    const newProd = {
      ...EMPTY_PRODUCT,
      id: `prod-${Date.now()}`
    };
    setFormData(newProd);
    setImageInput(newProd.images.join('\n'));
    setEditingProduct(null);
    setActiveTab('editor');
  };

  const handleStartEdit = (prod) => {
    const cleanedProd = JSON.parse(JSON.stringify(prod));
    if (cleanedProd.specifications) {
      cleanedProd.specifications = cleanedProd.specifications.filter(
        (spec) => spec.id !== 'transitCover' && !spec.name.toLowerCase().includes('transit cover')
      );
    }
    setFormData({
      ...EMPTY_PRODUCT,
      ...cleanedProd,
      hasPurchaseCap: Boolean(cleanedProd.hasPurchaseCap),
      purchaseCap: cleanedProd.purchaseCap || 1
    });
    setImageInput((prod.images || []).join('\n'));
    setEditingProduct(prod);
    setActiveTab('editor');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      deleteProduct(id);
      showNotice(`Deleted "${name}" from inventory.`);
    }
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    const parsedImages = imageInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const productPayload = {
      ...formData,
      images: parsedImages.length > 0 ? parsedImages : [EMPTY_PRODUCT.images[0]],
      basePrice: parseFloat(formData.basePrice) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      shippingCost: parseFloat(formData.shippingCost) || 0,
      stockCount: parseInt(formData.stockCount, 10) || 0,
      hasPurchaseCap: Boolean(formData.hasPurchaseCap),
      purchaseCap: formData.hasPurchaseCap ? Math.max(1, parseInt(formData.purchaseCap, 10) || 1) : null,
      // Ensure no duplicate transitCover group
      specifications: (formData.specifications || []).filter(
        (spec) => spec.id !== 'transitCover' && !spec.name.toLowerCase().includes('transit cover')
      )
    };

    if (editingProduct) {
      updateProduct(formData.id, productPayload);
      showNotice(`Updated "${formData.name}".`);
    } else {
      addProduct(productPayload);
      showNotice(`Created new listing "${formData.name}".`);
    }

    setEditingProduct(null);
    setActiveTab('list');
  };

  const handleAddSpecific = () => {
    setFormData((prev) => ({
      ...prev,
      itemSpecifics: {
        ...prev.itemSpecifics,
        [`Attribute ${Object.keys(prev.itemSpecifics || {}).length + 1}`]: 'Value'
      }
    }));
  };

  const handleRemoveSpecific = (keyToRemove) => {
    setFormData((prev) => {
      const copy = { ...prev.itemSpecifics };
      delete copy[keyToRemove];
      return { ...prev, itemSpecifics: copy };
    });
  };

  const handleSpecificChange = (oldKey, newKey, value) => {
    setFormData((prev) => {
      const copy = {};
      Object.entries(prev.itemSpecifics || {}).forEach(([k, v]) => {
        if (k === oldKey) {
          copy[newKey] = value;
        } else {
          copy[k] = v;
        }
      });
      return { ...prev, itemSpecifics: copy };
    });
  };

  const handleAddSpecGroup = () => {
    const newGroup = {
      id: `spec-${Date.now()}`,
      name: 'Custom Addon / Packaging',
      options: [
        { label: 'Standard Option', priceModifier: 0, default: true },
        { label: 'Upgraded Addon', priceModifier: 10.00 }
      ]
    };
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), newGroup]
    }));
  };

  const handleRemoveSpecGroup = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddOptionToGroup = (groupIndex) => {
    setFormData((prev) => {
      const specs = [...prev.specifications];
      specs[groupIndex].options.push({
        label: 'New Option',
        priceModifier: 5.00
      });
      return { ...prev, specifications: specs };
    });
  };

  const handleRemoveOptionFromGroup = (groupIndex, optIndex) => {
    setFormData((prev) => {
      const specs = [...prev.specifications];
      specs[groupIndex].options = specs[groupIndex].options.filter((_, i) => i !== optIndex);
      return { ...prev, specifications: specs };
    });
  };

  const handleOptionChange = (groupIndex, optIndex, field, value) => {
    setFormData((prev) => {
      const specs = [...prev.specifications];
      specs[groupIndex].options[optIndex] = {
        ...specs[groupIndex].options[optIndex],
        [field]: field === 'priceModifier' ? parseFloat(value) || 0 : value
      };
      return { ...prev, specifications: specs };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-[#0e0e14] text-sakura-100 w-full max-w-4xl rounded-3xl shadow-2xl border border-sakura-500/30 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="bg-[#12121c] px-6 py-4 flex items-center justify-between border-b border-sakura-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sakura-600 flex items-center justify-center text-white shadow-md shadow-sakura-600/30">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                Inventory & Listing Manager
                <span className="text-[10px] bg-sakura-500/20 text-sakura-300 font-bold px-2 py-0.5 rounded-full border border-sakura-500/40 uppercase">
                  Admin
                </span>
              </h2>
              <p className="text-xs text-sakura-300/70">Create, edit, price, and delete any stock or pre-order listing</p>
            </div>
          </div>

          <button
            onClick={() => {
              setAdminModalOpen(false);
              setEditingProduct(null);
            }}
            className="w-8 h-8 rounded-full bg-[#181824] hover:bg-sakura-900/40 text-sakura-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-sakura-950/80 border-b border-sakura-500/40 px-6 py-2.5 text-xs font-bold text-sakura-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-sakura-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="bg-[#101018] border-b border-sakura-900/30 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('list');
                setEditingProduct(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-sakura-600 text-white shadow-xs'
                  : 'text-sakura-300 hover:text-white hover:bg-sakura-950/40'
              }`}
            >
              All Listings ({products.length})
            </button>
            <button
              onClick={handleStartCreate}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'editor' && !editingProduct
                  ? 'bg-sakura-600 text-white shadow-xs'
                  : 'text-sakura-300 hover:bg-sakura-950/40'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Listing
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setEditingProduct(null);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-sakura-600 text-white shadow-xs'
                  : 'text-sakura-300 hover:text-white hover:bg-sakura-950/40'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              PayPal & Store Settings
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset catalog back to defaults? Note: your custom edits will be restored to demo items.')) {
                resetToDefaultProducts();
                showNotice('Restored original store product catalog.');
              }
            }}
            className="text-[11px] font-semibold text-sakura-400/70 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6">
          
          {/* TAB 1: PRODUCT LIST VIEW */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-sakura-300/80 pb-2">
                <span>Manage stock, prices, and shipping costs:</span>
                <button
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-sakura-600 hover:bg-sakura-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Product
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-sakura-900/40 bg-[#12121a] hover:border-sakura-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-zinc-900 overflow-hidden shrink-0 border border-sakura-900/40">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sakura-950 text-sakura-300 border border-sakura-800/40">
                            {item.category}
                          </span>
                          {item.stockCount <= 0 ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                              Out of Stock (0)
                            </span>
                          ) : item.isPreOrder ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                              Pre-Order (Stock: {item.stockCount})
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                              Stock: {item.stockCount}
                            </span>
                          )}
                          {item.hasPurchaseCap && item.purchaseCap > 0 && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                              Cap: {item.purchaseCap}/order
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm truncate mt-1">
                          {item.name}
                        </h4>
                        <div className="text-xs text-sakura-300/80 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>Price:</span>
                          {item.originalPrice && item.originalPrice > item.basePrice && (
                            <span className="line-through text-sakura-400/60 font-semibold text-xs">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <strong className="text-sakura-200">${item.basePrice.toFixed(2)} AUD</strong>
                          {item.originalPrice && item.originalPrice > item.basePrice && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                              Deal (-${(item.originalPrice - item.basePrice).toFixed(2)})
                            </span>
                          )}
                          <span className="ml-1 text-sakura-400">
                            &bull; Shipping: {Number(item.shippingCost) > 0 ? `$${Number(item.shippingCost).toFixed(2)} AUD` : 'FREE'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-sakura-900/30">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-sakura-900/40 text-sakura-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-sakura-800/40"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="px-3 py-1.5 bg-[#181824] hover:bg-rose-950 text-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-900/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / EDIT PRODUCT FORM */}
          {activeTab === 'editor' && (
            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-sakura-900/40">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-sakura-400" />
                  {editingProduct ? `Edit Listing: ${formData.name}` : 'Create Brand New Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="text-xs text-sakura-400 hover:text-white"
                >
                  &larr; Back to Listings
                </button>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-sakura-200 mb-1">Product Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pokemon 151 Ultra-Premium Collection Box"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Trading Cards, Statues, Gaming"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Item Condition</label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    placeholder="e.g. Brand New Factory Sealed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Base Price (AUD) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sakura-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400 font-bold"
                    />
                  </div>
                </div>

                {/* ORIGINAL / COMPARE-AT PRICE (FOR STRIKETHROUGH DEALS) */}
                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Original / Retail Price (AUD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sakura-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="Optional (e.g. 249.95)"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400 font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-sakura-400/70 mt-1 block">
                    If set higher than base price, a strikethrough & deal badge appears automatically.
                  </span>
                </div>

                {/* SINGLE DEDICATED SHIPPING COST FIELD (NO DUPLICATE) */}
                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Shipping Cost (AUD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sakura-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                      placeholder="0.00 for Free"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400 font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-sakura-400/70 mt-1 block">
                    Shows accurately on listing and checkout (e.g. $15.01). Set 0 for Free.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400"
                  />
                </div>

                {/* Pre-Order Toggle */}
                <div className="p-3 bg-[#13131c] rounded-xl border border-sakura-800/50 flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sakura-200">
                    <input
                      type="checkbox"
                      checked={formData.isPreOrder}
                      onChange={(e) => setFormData({ ...formData, isPreOrder: e.target.checked })}
                      className="w-4 h-4 rounded text-sakura-600 focus:ring-sakura-500"
                    />
                    <span>Is Pre-Order Listing?</span>
                  </label>
                  {formData.isPreOrder && (
                    <input
                      type="text"
                      placeholder="Expected Release (e.g. Q4 2026 Batch)"
                      value={formData.expectedRelease || ''}
                      onChange={(e) => setFormData({ ...formData, expectedRelease: e.target.value })}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg bg-[#181824] border border-sakura-800/50 text-white text-xs"
                    />
                  )}
                </div>

                {/* Customer Purchase Quantity Cap Toggle & Input */}
                <div className="sm:col-span-2 p-3.5 bg-[#13131c] rounded-xl border border-sakura-800/50 flex flex-col justify-center space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sakura-200">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.hasPurchaseCap)}
                      onChange={(e) => setFormData({
                        ...formData,
                        hasPurchaseCap: e.target.checked,
                        purchaseCap: formData.purchaseCap || 1
                      })}
                      className="w-4 h-4 rounded text-sakura-600 focus:ring-sakura-500"
                    />
                    <span>Limit Quantity Per Customer (Purchase Cap)?</span>
                  </label>
                  <p className="text-[11px] text-sakura-300/70">
                    When ticked, restricts the max units a customer can add to their cart for this item. If not ticked, customers can order standard stock.
                  </p>
                  {formData.hasPurchaseCap && (
                    <div className="pt-2 border-t border-sakura-900/40 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <label className="text-xs font-bold text-white whitespace-nowrap">
                        Maximum Allowed Per Customer / Order:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={formData.stockCount || 9999}
                        value={formData.purchaseCap ?? 1}
                        onChange={(e) => setFormData({
                          ...formData,
                          purchaseCap: Math.max(1, parseInt(e.target.value, 10) || 1)
                        })}
                        className="w-32 px-3 py-1.5 rounded-lg bg-[#181824] border border-sakura-800/60 text-white text-xs font-bold focus:outline-none focus:border-sakura-400"
                      />
                      <span className="text-[10px] text-amber-300 font-medium">
                        (Customers will be capped at {formData.purchaseCap ?? 1} max)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image URLs */}
              <div>
                <label className="block font-bold text-sakura-200 mb-1">
                  Image URLs (One per line)
                </label>
                <textarea
                  rows={3}
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://... image 1&#10;https://... image 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400"
                />
                <span className="text-[10px] text-sakura-400/60">First image is the primary cover photo.</span>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Short Summary</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence preview"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sakura-200 mb-1">Full Detailed Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Complete item details, condition guarantee, packaging notes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#13131c] border border-sakura-800/50 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/40 focus:border-sakura-400"
                  />
                </div>
              </div>

              {/* SPECIFICATIONS & ADDONS MANAGER (NO SECOND SHIPPING GROUP) */}
              <div className="p-5 bg-[#12121c] rounded-2xl border border-sakura-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-sakura-400" />
                      Product Add-on Options & Dynamic Specifications
                    </h4>
                    <p className="text-xs text-sakura-300/70">
                      Configure custom product add-ons (e.g. UV Acrylic Display Case) with price modifiers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecGroup}
                    className="px-3 py-1.5 bg-sakura-600 hover:bg-sakura-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Group
                  </button>
                </div>

                {formData.specifications && formData.specifications.map((group, gIdx) => (
                  <div key={gIdx} className="bg-[#181824] rounded-xl border border-sakura-900/40 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => {
                          const specs = [...formData.specifications];
                          specs[gIdx].name = e.target.value;
                          setFormData({ ...formData, specifications: specs });
                        }}
                        className="font-bold text-white text-xs px-2 py-1 bg-[#101018] border border-sakura-800/40 rounded-lg flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecGroup(gIdx)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove Group
                      </button>
                    </div>

                    <div className="space-y-2">
                      {group.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) => handleOptionChange(gIdx, oIdx, 'label', e.target.value)}
                            placeholder="Option name"
                            className="flex-1 px-2.5 py-1.5 bg-[#101018] border border-sakura-800/40 rounded-lg text-xs text-white"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-sakura-400">+$</span>
                            <input
                              type="number"
                              step="0.5"
                              value={opt.priceModifier || 0}
                              onChange={(e) => handleOptionChange(gIdx, oIdx, 'priceModifier', e.target.value)}
                              className="w-20 px-2 py-1.5 bg-[#101018] border border-sakura-800/40 rounded-lg text-xs font-bold text-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionFromGroup(gIdx, oIdx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOptionToGroup(gIdx)}
                        className="text-[11px] font-bold text-sakura-300 hover:underline flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Option to this Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ITEM SPECIFICS TABLE MANAGER */}
              <div className="p-5 bg-[#12121c] rounded-2xl border border-sakura-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Item Specifics Table</h4>
                    <p className="text-xs text-sakura-300/70">Key-value table shown on the product listing (e.g. Brand, Language, Year).</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecific}
                    className="px-2.5 py-1 bg-[#181824] hover:bg-sakura-900/40 text-sakura-200 border border-sakura-800/40 rounded-lg text-xs font-bold"
                  >
                    + Add Row
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.itemSpecifics && Object.entries(formData.itemSpecifics).map(([key, val], idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => handleSpecificChange(key, e.target.value, val)}
                        className="w-1/3 px-2.5 py-1.5 bg-[#101018] border border-sakura-800/40 rounded-lg text-xs font-semibold text-white"
                      />
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleSpecificChange(key, key, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-[#101018] border border-sakura-800/40 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecific(key)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-sakura-900/40 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2.5 rounded-xl border border-sakura-800/50 text-sakura-300 font-bold hover:bg-[#181824] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sakura-600 hover:bg-sakura-700 text-white font-extrabold shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Listing Changes
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: PAYPAL & STORE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="bg-[#14141e] border border-sakura-900/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-sakura-900/40 text-white font-extrabold text-sm">
                  <CreditCard className="w-4 h-4 text-sakura-400" />
                  <span>Merchant PayPal & Checkout Settings</span>
                </div>

                <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed">
                  <strong>Important:</strong> All customer payments made through the official PayPal checkout button are credited directly to this PayPal address. Update this email whenever you want customer payments to land in a different PayPal account.
                </div>

                <div>
                  <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                    Receiving PayPal Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsForm.paypalEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, paypalEmail: e.target.value })}
                    className="w-full bg-[#181824] border border-sakura-800/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sakura-400 font-mono"
                    placeholder="e.g. payments@sakurasupply.com.au or your-email@gmail.com"
                  />
                  <p className="text-[10px] text-sakura-400/70 mt-1">
                    Customer orders and AUD funds are deposited directly to this verified PayPal account.
                  </p>
                </div>
              </div>

              <div className="bg-[#14141e] border border-sakura-900/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-sakura-900/40 text-white font-extrabold text-sm">
                  <Building className="w-4 h-4 text-sakura-400" />
                  <span>Business Registration & Contacts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full bg-[#181824] border border-sakura-800/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sakura-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                      Australian Business Number (ABN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.abn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, abn: e.target.value })}
                      className="w-full bg-[#181824] border border-sakura-800/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sakura-400 font-mono"
                      placeholder="e.g. 52 839 124 901"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                      Customer Support Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-[#181824] border border-sakura-800/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sakura-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sakura-200 mb-1.5">
                      Location / Dispatch Facility
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full bg-[#181824] border border-sakura-800/60 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sakura-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-sakura-600 hover:bg-sakura-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Payment & Business Settings
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
