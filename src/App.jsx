import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/Pages/HomePage';
import ShopPage from './components/Pages/ShopPage';
import CartPage from './components/Pages/CartPage';
import AccountPage from './components/Pages/AccountPage';
import PoliciesPage from './components/Pages/PoliciesPage';
import ContactPage from './components/Pages/ContactPage';
import ProductDetailModal from './components/ProductDetailModal';
import InventoryManagerModal from './components/Admin/InventoryManagerModal';
import AuthPromptModal from './components/AuthPromptModal';
import ShippingAddressModal from './components/ShippingAddressModal';

function MainApp() {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-sakura-100 font-sans selection:bg-sakura-500 selection:text-white">
      {/* Universal Sticky Header with Left-Aligned Tools & Centered Cherry Blossom Logo */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'account' && <AccountPage />}
        {currentView === 'policies' && <PoliciesPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Listing Detail Modal */}
      <ProductDetailModal />

      {/* Admin Inventory Manager Modal (Create, Edit, Delete Listings) */}
      <InventoryManagerModal />

      {/* Customer Auth Prompt Modal (Required for Guest Adding to Cart) */}
      <AuthPromptModal />

      {/* Mandatory Delivery Address Modal (Required Upon Sign-In) */}
      <ShippingAddressModal />

      {/* Universal Footer with Bottom Dropdown & Melbourne Credentials */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
