import React from 'react';
import HeroBanner from '../Home/HeroBanner';
import BusinessIntro from '../Home/BusinessIntro';
import StockShowcase from '../Home/StockShowcase';
import CustomerReviews from '../Home/CustomerReviews';
import EmbeddedStockGrid from '../Home/EmbeddedStockGrid';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Hero & Welcome Banner */}
      <HeroBanner />

      {/* 2. Simple rundown of the contact & business credentials (ABN, PayPal, Email) */}
      <BusinessIntro />

      {/* 3. Photos of stock / visual showcase */}
      <StockShowcase />

      {/* 4. Customer reviews with star ratings */}
      <CustomerReviews />

      {/* 5. Embedded Shop / Stock Grid (if you scroll down a little bit it has all of the stock) */}
      <EmbeddedStockGrid isStandaloneShop={false} />
    </div>
  );
}
