import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { BUSINESS_INFO } from '../data/business';
import { DEFAULT_USERS } from '../data/users';

const StoreContext = createContext();

const INITIAL_PROFILE = {
  username: "",
  email: "",
  phone: "",
  paypalEmail: "",
  shippingAddress: {
    fullName: "",
    street: "",
    city: "Melbourne",
    state: "VIC",
    postalCode: "3000",
    country: "Australia"
  }
};

// Helper to verify if a user has a fully completed delivery address
export const hasCompleteShippingAddress = (user) => {
  if (!user || !user.shippingAddress) return false;
  const addr = user.shippingAddress;
  return Boolean(
    addr.street && String(addr.street).trim().length > 0 &&
    addr.city && String(addr.city).trim().length > 0 &&
    addr.state && String(addr.state).trim().length > 0 &&
    addr.postalCode && String(addr.postalCode).trim().length > 0
  );
};

const INITIAL_ORDERS = [
  {
    orderId: "SKR-904128",
    date: "2026-09-15",
    items: [
      {
        id: "prod-1",
        name: "Pokemon 151 Special Ultra-Premium Collection Box",
        selectedSpecs: { "protectivePackaging": "Heavy-Duty UV Acrylic Display Case" },
        quantity: 1,
        unitPrice: 205.95,
        shippingCost: 0,
        totalPrice: 205.95,
        image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 205.95,
    shippingCost: 0,
    total: 205.95,
    paymentMethod: "PayPal Verified (Buyer Protected)",
    paypalPayerEmail: "collector@gmail.com",
    shippingAddress: "Jack Micic, 18 Flinders Lane, Melbourne VIC 3000, Australia",
    buyerPhone: "+61 412 345 678",
    buyerEmail: "collector@gmail.com",
    emailNotificationSent: true,
    emailSentTo: "sakurasupplyau@gmail.com"
  }
];

// Helper to format buyer's PayPal receipt and shipping address for email notification
const formatOrderEmailReceipt = (order, recipientEmail = "sakurasupplyau@gmail.com") => {
  const itemsText = (order.items || [])
    .map((it, idx) => {
      const specs = it.selectedSpecs && Object.keys(it.selectedSpecs).length > 0
        ? ` (${Object.values(it.selectedSpecs).join(', ')})`
        : '';
      return `${idx + 1}. ${it.name}${specs}\n   Quantity: ${it.quantity} x $${Number(it.unitPrice).toFixed(2)} AUD = $${(it.quantity * it.unitPrice).toFixed(2)} AUD`;
    })
    .join('\n\n');

  const baseSubtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shippingCost || 0);
  const paypalFee = Number(order.paypalFee ?? ((baseSubtotal + shipping) * 0.05));
  const finalTotal = Number(order.total ?? ((baseSubtotal + shipping) * 1.05));

  return `=====================================================
SAKURA SUPPLY - PAID ORDER RECEIPT & SHIPPING DETAILS
=====================================================
Recipient: ${recipientEmail}
Order ID: #${order.orderId}
Order Date: ${order.date}

--- BUYER & PAYMENT DETAILS ---
Payment Method: ${order.paymentMethod || 'PayPal Verified'}
Payer PayPal Email: ${order.paypalPayerEmail || order.buyerEmail || 'Verified PayPal Account'}
Buyer Contact Email: ${order.buyerEmail || 'Not specified'}
Buyer Phone: ${order.buyerPhone || 'Not specified'}

--- ITEMS ORDERED ---
${itemsText}

--- PAYMENT BREAKDOWN (+5% PayPal Processing Fee) ---
Items Subtotal: $${baseSubtotal.toFixed(2)} AUD
Shipping Cost: $${shipping.toFixed(2)} AUD
PayPal Processing Fee (+5%): $${paypalFee.toFixed(2)} AUD
Total Paid at Checkout: $${finalTotal.toFixed(2)} AUD

--- BUYER SHIPPING ADDRESS ---
${order.shippingAddress || 'Address verified on PayPal account'}
=====================================================`;
};

// Auto-email dispatch helper that sends the order receipt & shipping address
const autoDispatchOrderEmail = async (order, recipientEmail = "sakurasupplyau@gmail.com") => {
  return sendOrderReceiptEmails(order, recipientEmail, order.buyerEmail);
};

// Dispatches order receipt to BOTH merchant and buyer automatically without requiring buyer activation.
// By posting to the merchant's verified FormSubmit endpoint with _autoresponse and the buyer's email,
// FormSubmit delivers the receipt directly to the buyer's inbox without asking the buyer to activate anything!
const sendOrderReceiptEmails = async (order, storeEmail = "sakurasupplyau@gmail.com", buyerEmail = null) => {
  const targetBuyerEmail = buyerEmail || order.buyerEmail || order.paypalPayerEmail;
  const merchantReceipt = formatOrderEmailReceipt(order, storeEmail);
  const buyerReceipt = formatOrderEmailReceipt(order, targetBuyerEmail || "Customer");
  const subject = `[Sakura Supply] Paid Order #${order.orderId} - $${Number(order.total).toFixed(2)} AUD`;

  const baseSubtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shippingCost || 0);
  const paypalFee = Number(order.paypalFee ?? ((baseSubtotal + shipping) * 0.05));
  const finalTotal = Number(order.total ?? ((baseSubtotal + shipping) * 1.05));

  // Autoresponse message sent DIRECTLY to the buyer's email without requiring any form activation
  const buyerAutoresponseMessage = `Thank you for your purchase from Sakura Supply!

Your payment has been completed via PayPal. Below is your official order receipt:

${buyerReceipt}

DISPATCH & HANDLING:
Your collectibles are packed with collector-grade corner protection and dispatched from Melbourne, VIC via Australia Post Tracked Parcel.

View your orders anytime by signing into your Sakura Supply customer portal.

Kind regards,
Sakura Supply AU
Melbourne, Victoria, Australia
Support: ${storeEmail}`;

  const payload = {
    _subject: subject,
    _template: "table",
    _captcha: "false",
    email: targetBuyerEmail || storeEmail,
    _replyto: targetBuyerEmail || storeEmail,
    _autoresponse: buyerAutoresponseMessage,
    "Order ID": order.orderId,
    "Order Date": order.date,
    "Total Paid AUD": `$${finalTotal.toFixed(2)} AUD`,
    "Items Subtotal": `$${baseSubtotal.toFixed(2)} AUD`,
    "Shipping Paid": `$${shipping.toFixed(2)} AUD`,
    "PayPal Fee (5%)": `$${paypalFee.toFixed(2)} AUD`,
    "Buyer Name": order.buyerName || "Customer",
    "Buyer Email": targetBuyerEmail || "Not specified",
    "Buyer Phone": order.buyerPhone || "Not specified",
    "Buyer PayPal Account": order.paypalPayerEmail || "Verified PayPal Account",
    "Buyer Shipping Address": order.shippingAddress || "Address verified on PayPal account",
    "Line Items": (order.items || []).map((it) => {
      const specs = it.selectedSpecs && Object.keys(it.selectedSpecs).length > 0 ? ` (${Object.values(it.selectedSpecs).join(', ')})` : '';
      return `${it.quantity}x ${it.name}${specs} @ $${Number(it.unitPrice).toFixed(2)}`;
    }).join(' | '),
    "Full Receipt": merchantReceipt
  };

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(storeEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    console.log(`[Order Email] Dispatched to ${storeEmail} with autoresponse to ${targetBuyerEmail}:`, data);
  } catch (err) {
    console.warn(`[Order Email] Background dispatch notice:`, err);
  }

  return buyerReceipt;
};

// Generates direct mailto link prefilled with buyer receipt and shipping address
const getOrderMailtoUrl = (order, recipientEmail = "sakurasupplyau@gmail.com") => {
  const subject = `[Sakura Supply] Paid Order #${order.orderId} - $${Number(order.total).toFixed(2)} AUD`;
  const body = formatOrderEmailReceipt(order, recipientEmail);
  return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

// Incremental Shipping Rule: First unit pays base shipping, each additional unit pays half the base shipping
const calculateItemShipping = (baseShipping, quantity) => {
  const base = Number(baseShipping) || 0;
  const qty = Number(quantity) || 0;
  if (base <= 0 || qty <= 0) return 0;
  if (qty === 1) return base;
  return base + (qty - 1) * (base * 0.5);
};

export function StoreProvider({ children }) {
  // Navigation
  const [currentView, setCurrentView] = useState('home');

  // Business info state with persistence (ensures sakurasupplyau@gmail.com is set for both PayPal and Contact)
  const [businessInfo, setBusinessInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('sakura_business_info');
      let loaded = saved ? { ...BUSINESS_INFO, ...JSON.parse(saved) } : BUSINESS_INFO;
      // Ensure sakurasupplyau@gmail.com is enforced for contact & PayPal
      if (!loaded.paypalEmail || loaded.paypalEmail.includes('sakurasupply.com.au') || loaded.paypalEmail.includes('moragsausage')) {
        loaded.paypalEmail = 'sakurasupplyau@gmail.com';
      }
      if (!loaded.email || loaded.email.includes('sakurasupply.com.au') || loaded.email.includes('moragsausage')) {
        loaded.email = 'sakurasupplyau@gmail.com';
      }
      return loaded;
    } catch {
      return BUSINESS_INFO;
    }
  });

  const updateBusinessInfo = (updates) => {
    setBusinessInfo((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('sakura_business_info', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const normalizeProduct = (p) => ({
  ...p,
  id: p?.id || `prod-${Date.now()}-${Math.random()}`,
  name: p?.name || 'Untitled Collectible',
  basePrice: Number(p?.basePrice) || 0,
  originalPrice: (p?.originalPrice !== null && p?.originalPrice !== undefined && p?.originalPrice !== '') ? Number(p?.originalPrice) : null,
  shippingCost: Number(p?.shippingCost) || 0,
  stockCount: Number(p?.stockCount) || 0,
  category: p?.category || 'Trading Cards',
  condition: p?.condition || 'Brand New Factory Sealed',
  images: Array.isArray(p?.images) && p?.images.length > 0 ? p?.images : ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80'],
  specifications: Array.isArray(p?.specifications) ? p?.specifications : [],
  itemSpecifics: p?.itemSpecifics && typeof p?.itemSpecifics === 'object' ? p?.itemSpecifics : {}
});

  // Products with full CRUD & localStorage persistence (STRICTLY PRESERVING USER'S CURRENT STOCK)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('sakura_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProduct);
        }
      }
      return PRODUCTS.map(normalizeProduct);
    } catch {
      return PRODUCTS.map(normalizeProduct);
    }
  });

  // Selected product for detailed modal view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Admin inventory manager state
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Customer Auth Prompt & Mandatory Shipping Address Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);

  // Filtering & Sorting
  const [activeSort, setActiveSort] = useState('DEFAULT');
  const [filterType, setFilterType] = useState('all'); // all, inStock, preOrder
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sakura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Users Database Table (Guarantees Jackson Micic admin account exists with Jackson1401 and sakurasupplyau@gmail.com)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('sakura_users');
      let loaded = saved ? JSON.parse(saved) : DEFAULT_USERS;
      if (!Array.isArray(loaded) || loaded.length === 0) {
        loaded = DEFAULT_USERS;
      }
      // Ensure the requested admin account is always up-to-date with sakurasupplyau@gmail.com
      const adminIndex = loaded.findIndex(
        (u) => u.username?.toLowerCase() === 'jackson micic' || u.role === 'admin' || u.email?.toLowerCase() === 'sakurasupplyau@gmail.com' || u.email?.toLowerCase() === 'moragsausage@gmail.com'
      );
      const adminTemplate = DEFAULT_USERS[0];
      if (adminIndex >= 0) {
        loaded[adminIndex] = {
          ...loaded[adminIndex],
          ...adminTemplate,
          email: 'sakurasupplyau@gmail.com',
          paypalEmail: 'sakurasupplyau@gmail.com'
        };
      } else {
        loaded = [adminTemplate, ...loaded];
      }
      return loaded;
    } catch {
      return DEFAULT_USERS;
    }
  });

  // Current Logged-in User Session (null for random web visitors / guests)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('sakura_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = Boolean(currentUser && currentUser.role === 'admin');

  // Persist users database
  useEffect(() => {
    try {
      localStorage.setItem('sakura_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  // Persist current session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('sakura_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('sakura_session');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // User Profile compatibility helper for guest/logged-in users
  const userProfile = currentUser || INITIAL_PROFILE;
  const setUserProfile = (updater) => {
    if (currentUser) {
      const updated = typeof updater === 'function' ? updater(currentUser) : updater;
      setCurrentUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
  };

  // Auth Operations
  const login = (identifier, password) => {
    const cleanId = String(identifier || '').trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.username?.toLowerCase() === cleanId ||
        u.email?.toLowerCase() === cleanId
    );
    if (!found) {
      return { success: false, error: 'No account found with this username or email.' };
    }
    if (found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    setCurrentUser(found);

    // If customer has no complete shipping address, open shipping address modal immediately
    if (!hasCompleteShippingAddress(found)) {
      setAuthModalOpen(false);
      setShippingModalOpen(true);
    } else {
      setAuthModalOpen(false);
      // Auto-commit pending cart item if user already has shipping address
      if (pendingCartItem) {
        const { product, selectedSpecs, quantity, finalUnitPrice, isBuyNow } = pendingCartItem;
        rawAddToCart(product, selectedSpecs, quantity, finalUnitPrice);
        setPendingCartItem(null);
        if (isBuyNow) {
          navigateTo('cart');
        }
      }
    }

    return { success: true, user: found };
  };

  const register = ({ username, email, password, fullName, phone, paypalEmail }) => {
    const cleanUser = String(username || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanUser || !cleanEmail || !password) {
      return { success: false, error: 'Username, email, and password are required.' };
    }
    const exists = users.some(
      (u) =>
        u.username?.toLowerCase() === cleanUser.toLowerCase() ||
        u.email?.toLowerCase() === cleanEmail
    );
    if (exists) {
      return { success: false, error: 'An account with that username or email already exists.' };
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      username: cleanUser,
      displayName: fullName || cleanUser,
      email: cleanEmail,
      password,
      role: 'customer', // Normal customer role - zero admin access!
      phone: phone || '',
      paypalEmail: paypalEmail || cleanEmail,
      shippingAddress: {
        fullName: fullName || cleanUser,
        street: '',
        city: 'Melbourne',
        state: 'VIC',
        postalCode: '3000',
        country: 'Australia'
      },
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    // Mandatory shipping address collection upon registration
    setAuthModalOpen(false);
    setShippingModalOpen(true);

    return { success: true, user: newUser };
  };

  const saveShippingAddress = (newAddress) => {
    if (!currentUser) return false;
    const updatedUser = {
      ...currentUser,
      shippingAddress: {
        ...(currentUser.shippingAddress || {}),
        ...newAddress
      }
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    try {
      localStorage.setItem('sakura_session', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
    setShippingModalOpen(false);

    // Commit any pending cart item now that shipping address is saved
    if (pendingCartItem) {
      const { product, selectedSpecs, quantity, finalUnitPrice, isBuyNow } = pendingCartItem;
      rawAddToCart(product, selectedSpecs, quantity, finalUnitPrice);
      setPendingCartItem(null);
      if (isBuyNow) {
        navigateTo('cart');
      }
    }
    return true;
  };

  const updateUserPaypalEmail = (paypalEmail) => {
    const cleanEmail = String(paypalEmail || '').trim().toLowerCase();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        paypalEmail: cleanEmail
      };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      try {
        localStorage.setItem('sakura_session', JSON.stringify(updatedUser));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sakura_session');
    setAdminModalOpen(false);
    setAuthModalOpen(false);
    setShippingModalOpen(false);
    setPendingCartItem(null);
  };

  const openAdminModal = () => {
    if (isAdmin) {
      setAdminModalOpen(true);
      return true;
    }
    // If guest or customer, navigate to account sign-in
    navigateTo('account');
    return false;
  };

  // Order History
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sakura_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((ord) => {
            const { status, trackingNumber, carrier, ...cleanOrd } = ord;
            return cleanOrd;
          });
        }
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const BASE_ORDER_COUNT = 220;

  // Order count starting at 220, incrementing by 1 per order placed
  const [orderCount, setOrderCount] = useState(() => {
    try {
      const saved = localStorage.getItem('sakura_order_count');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= BASE_ORDER_COUNT) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return BASE_ORDER_COUNT;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sakura_order_count', String(orderCount));
    } catch (e) {
      console.error(e);
    }
  }, [orderCount]);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem('sakura_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('sakura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('sakura_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Self-heal cart if a product's stock count or purchase cap was reduced below cart quantity
  useEffect(() => {
    setCart((prev) => {
      let changed = false;
      const updated = prev.map((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          const maxStock = Number(prod.stockCount) || 0;
          const hasCap = Boolean(prod.hasPurchaseCap && Number(prod.purchaseCap) > 0);
          const effectiveMax = hasCap ? Math.min(maxStock, Number(prod.purchaseCap)) : maxStock;
          if (effectiveMax > 0 && item.quantity > effectiveMax) {
            changed = true;
            return { ...item, quantity: effectiveMax };
          }
        }
        return item;
      });
      return changed ? updated : prev;
    });
  }, [products]);

  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search handler that navigates or scrolls smoothly
  const handleSearch = (term) => {
    setSearchQuery(term);
    if (term && term.trim()) {
      if (currentView === 'home') {
        const el = document.getElementById('home-stock-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (currentView !== 'shop') {
        navigateTo('shop');
      }
    }
  };

  // PRODUCT CRUD METHODS
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`,
      basePrice: Number(newProduct.basePrice) || 0,
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      shippingCost: Number(newProduct.shippingCost !== undefined ? newProduct.shippingCost : 0),
      stockCount: Number(newProduct.stockCount) || 1,
      rating: newProduct.rating || 5.0,
      reviewCount: newProduct.reviewCount || 0,
      images: Array.isArray(newProduct.images) && newProduct.images.length > 0 
        ? newProduct.images 
        : ["https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"],
      specifications: newProduct.specifications || [],
      itemSpecifics: newProduct.itemSpecifics || {}
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const oldBasePrice = Number(item.basePrice) || 0;
          const newBasePrice = updatedFields.basePrice !== undefined ? Number(updatedFields.basePrice) : oldBasePrice;
          
          let originalPrice = updatedFields.originalPrice !== undefined 
            ? (updatedFields.originalPrice ? Number(updatedFields.originalPrice) : null)
            : (item.originalPrice || null);

          // If the price was lowered and no higher originalPrice is explicitly set, preserve old price as originalPrice for strikethrough!
          if (newBasePrice < oldBasePrice && (!originalPrice || originalPrice <= newBasePrice)) {
            originalPrice = oldBasePrice;
          }

          return {
            ...item,
            ...updatedFields,
            basePrice: newBasePrice,
            originalPrice: originalPrice,
            shippingCost: Number(updatedFields.shippingCost !== undefined ? updatedFields.shippingCost : (item.shippingCost || 0)),
            stockCount: Number(updatedFields.stockCount !== undefined ? updatedFields.stockCount : item.stockCount),
          };
        }
        return item;
      })
    );
    // If the currently selected modal item is updated, sync it
    setSelectedProduct((prev) => {
      if (prev && prev.id === id) {
        const oldBasePrice = Number(prev.basePrice) || 0;
        const newBasePrice = updatedFields.basePrice !== undefined ? Number(updatedFields.basePrice) : oldBasePrice;
        let originalPrice = updatedFields.originalPrice !== undefined 
          ? (updatedFields.originalPrice ? Number(updatedFields.originalPrice) : null)
          : (prev.originalPrice || null);

        if (newBasePrice < oldBasePrice && (!originalPrice || originalPrice <= newBasePrice)) {
          originalPrice = oldBasePrice;
        }

        return { 
          ...prev, 
          ...updatedFields,
          basePrice: newBasePrice,
          originalPrice: originalPrice,
          shippingCost: Number(updatedFields.shippingCost !== undefined ? updatedFields.shippingCost : (prev.shippingCost || 0)),
        };
      }
      return prev;
    });
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
  };

  const resetToDefaultProducts = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem('sakura_products');
  };

  // Raw internal cart addition that updates the cart array
  function rawAddToCart(product, selectedSpecs = {}, quantity = 1, finalUnitPrice = null) {
    const unitPrice = finalUnitPrice !== null ? finalUnitPrice : product.basePrice;
    const shippingCost = Number(product.shippingCost) || 0;
    const cartItemId = `${product.id}-${JSON.stringify(selectedSpecs)}`;
    const currentProd = products.find((p) => p.id === product.id) || product;
    const maxStock = Number(currentProd.stockCount) || 0;
    const hasCap = Boolean(currentProd.hasPurchaseCap && Number(currentProd.purchaseCap) > 0);
    const effectiveMax = hasCap ? Math.min(maxStock, Number(currentProd.purchaseCap)) : maxStock;

    let addedQty = 0;

    setCart((prev) => {
      const existingProductQty = prev
        .filter((item) => item.productId === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      const availableToAdd = Math.max(0, effectiveMax - existingProductQty);
      if (availableToAdd <= 0) {
        return prev; // Reached stock limit or customer purchase cap
      }

      const qtyToAdd = Math.min(quantity, availableToAdd);
      addedQty = qtyToAdd;

      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + qtyToAdd, shippingCost }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          basePrice: product.basePrice,
          unitPrice,
          shippingCost,
          quantity: qtyToAdd,
          selectedSpecs,
          image: product.images[0],
          isPreOrder: product.isPreOrder,
          expectedRelease: product.expectedRelease || null
        }
      ];
    });

    return addedQty;
  }

  // Public addToCart with strict authentication & mandatory shipping address guards
  const addToCart = (product, selectedSpecs = {}, quantity = 1, finalUnitPrice = null, isBuyNow = false) => {
    if (!currentUser) {
      setPendingCartItem({ product, selectedSpecs, quantity, finalUnitPrice, isBuyNow });
      setAuthModalOpen(true);
      return 0;
    }
    if (!hasCompleteShippingAddress(currentUser)) {
      setPendingCartItem({ product, selectedSpecs, quantity, finalUnitPrice, isBuyNow });
      setShippingModalOpen(true);
      return 0;
    }
    return rawAddToCart(product, selectedSpecs, quantity, finalUnitPrice);
  };

  const updateQuantity = (cartItemId, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            if (change < 0) {
              const newQty = item.quantity + change;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            if (change > 0) {
              const prod = products.find((p) => p.id === item.productId);
              const maxStock = prod ? Number(prod.stockCount) : item.quantity;
              const hasCap = Boolean(prod && prod.hasPurchaseCap && Number(prod.purchaseCap) > 0);
              const effectiveMax = hasCap ? Math.min(maxStock, Number(prod.purchaseCap)) : maxStock;
              const totalForProduct = prev
                .filter((i) => i.productId === item.productId)
                .reduce((sum, i) => sum + i.quantity, 0);

              if (totalForProduct >= effectiveMax) {
                return item; // Max stock or customer purchase cap reached
              }
              const allowedIncrease = Math.min(change, effectiveMax - totalForProduct);
              return { ...item, quantity: item.quantity + allowedIncrease };
            }
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart shipping and total computations using +5% PayPal fee rule:
  // Base total = items subtotal + shipping
  // PayPal Fee (+5%) = base total * 0.05
  // Final total = base total * 1.05
  const cartSubtotal = cart.reduce((sum, item) => sum + Number(item.unitPrice || 0) * item.quantity, 0);
  const cartShipping = cart.reduce((sum, item) => sum + calculateItemShipping(item.shippingCost, item.quantity), 0);
  const cartBaseTotal = cartSubtotal + cartShipping;
  const cartPaypalFee = cartBaseTotal > 0 ? (cartBaseTotal * 0.05) : 0;
  const cartTotal = cartBaseTotal > 0 ? (cartBaseTotal * 1.05) : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Official PayPal standard checkout integration:
  // Redirects directly to paypal.com where real payments land in businessInfo.paypalEmail
  const redirectToPayPal = ({ cartItems = cart, shipping = cartShipping, customNote = '' } = {}) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.paypal.com/cgi-bin/webscr';
    form.target = '_blank';

    const addField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    };

    addField('cmd', '_cart');
    addField('upload', '1');
    addField('business', businessInfo.paypalEmail);
    addField('currency_code', 'AUD');
    addField('no_shipping', '2'); // Require shipping address on PayPal
    if (customNote) addField('custom', customNote);

    if (shipping > 0) {
      addField('handling_cart', Number(shipping).toFixed(2));
    }

    cartItems.forEach((item, index) => {
      const idx = index + 1;
      let itemName = item.name;
      if (item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0) {
        const specSummary = Object.values(item.selectedSpecs).join(', ');
        itemName += ` (${specSummary})`;
      }
      addField(`item_name_${idx}`, itemName.slice(0, 120));
      addField(`amount_${idx}`, Number(item.unitPrice).toFixed(2));
      addField(`quantity_${idx}`, item.quantity);
    });

    // Add +5% PayPal Processing Fee line item so final PayPal checkout total is (subtotal + shipping) * 1.05
    const itemsSubtotal = cartItems.reduce((sum, item) => sum + Number(item.unitPrice || 0) * item.quantity, 0);
    const baseTotal = itemsSubtotal + Number(shipping || 0);
    const feeAmount = baseTotal * 0.05;
    if (feeAmount > 0) {
      const feeIdx = cartItems.length + 1;
      addField(`item_name_${feeIdx}`, 'PayPal Processing Fee (+5%)');
      addField(`amount_${feeIdx}`, Number(feeAmount).toFixed(2));
      addField(`quantity_${feeIdx}`, '1');
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const createOrder = (orderData) => {
    const formattedShippingAddress = orderData?.shippingAddress || (
      userProfile?.shippingAddress?.fullName
        ? `${userProfile.shippingAddress.fullName}, ${userProfile.shippingAddress.street}, ${userProfile.shippingAddress.city} ${userProfile.shippingAddress.state} ${userProfile.shippingAddress.postalCode}, ${userProfile.shippingAddress.country}`
        : 'Address provided during PayPal checkout'
    );

    const buyerName = userProfile?.shippingAddress?.fullName || userProfile?.name || 'Customer';
    const buyerEmail = userProfile?.email || 'customer@sakurasupply.com.au';
    const buyerPhone = userProfile?.shippingAddress?.phone || userProfile?.phone || '';
    const paypalPayerEmail = orderData?.paypalPayerEmail || userProfile?.paypalEmail || userProfile?.email || 'Verified PayPal Account';

    const storeEmail = (businessInfo && businessInfo.email) || "sakurasupplyau@gmail.com";
    const finalBuyerEmail = buyerEmail || currentUser?.email || userProfile?.email || "";

    const baseTotal = cartSubtotal + cartShipping;
    const paypalFee = baseTotal * 0.05;
    const finalTotal = baseTotal * 1.05;

    const newOrder = {
      orderId: `SKR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      shippingCost: cartShipping,
      paypalFee: paypalFee,
      total: finalTotal,
      paymentMethod: orderData?.paymentMethod || "PayPal Verified (Buyer Protected)",
      paypalPayerEmail,
      buyerName,
      buyerEmail: finalBuyerEmail,
      buyerPhone,
      shippingAddress: formattedShippingAddress,
      emailNotificationSent: true,
      emailSentTo: storeEmail,
      buyerEmailSentTo: finalBuyerEmail,
      ...orderData
    };

    // Explicitly delete status, carrier, and trackingNumber per user instructions
    delete newOrder.status;
    delete newOrder.carrier;
    delete newOrder.trackingNumber;

    // Attach generated receipt text and mailto URL
    const emailReceipt = formatOrderEmailReceipt(newOrder, storeEmail);
    newOrder.emailReceiptText = emailReceipt;
    newOrder.mailtoUrl = getOrderMailtoUrl(newOrder, storeEmail);

    // Trigger auto-email notification dispatch to BOTH store email and buyer email
    sendOrderReceiptEmails(newOrder, storeEmail, finalBuyerEmail);

    // List ordered items as Out of Stock (stockCount: 0) as requested by user
    const orderedItems = [...cart];
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingCartItem = orderedItems.find((item) => item.productId === prod.id);
        if (matchingCartItem) {
          return {
            ...prod,
            stockCount: 0,
            isOutOfStock: true
          };
        }
        return prod;
      })
    );

    // If the currently selected modal item was ordered, sync its stockCount to 0 immediately
    setSelectedProduct((prev) => {
      if (prev && orderedItems.some((item) => item.productId === prev.id)) {
        return {
          ...prev,
          stockCount: 0,
          isOutOfStock: true
        };
      }
      return prev;
    });

    setOrders((prev) => [newOrder, ...prev]);
    setOrderCount((prev) => prev + 1);
    clearCart();
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        navigateTo,
        businessInfo,
        updateBusinessInfo,
        calculateItemShipping,
        redirectToPayPal,
        formatOrderEmailReceipt,
        autoDispatchOrderEmail,
        sendOrderReceiptEmails,
        getOrderMailtoUrl,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaultProducts,
        selectedProduct,
        setSelectedProduct,
        adminModalOpen,
        setAdminModalOpen,
        editingProduct,
        setEditingProduct,
        activeSort,
        setActiveSort,
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        handleSearch,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartShipping,
        cartPaypalFee,
        cartTotal,
        cartCount,
        userProfile,
        setUserProfile,
        orders,
        orderCount,
        createOrder,
        currentUser,
        setCurrentUser,
        isAdmin,
        login,
        register,
        logout,
        openAdminModal,
        users,
        authModalOpen,
        setAuthModalOpen,
        shippingModalOpen,
        setShippingModalOpen,
        pendingCartItem,
        setPendingCartItem,
        saveShippingAddress,
        updateUserPaypalEmail,
        hasCompleteShippingAddress
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
