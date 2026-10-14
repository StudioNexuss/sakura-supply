# Apex Collectibles - Official Storefront

A modern, responsive e-commerce web application featuring eBay-style listing detail views, dynamic packaging specification pricing (e.g. shrink-wrap options), Australian ABN verification, mandatory policy acknowledgment, and PayPal checkout. Designed for GitHub Pages hosting with custom domain support.

---

## 🌟 Key Features

### 1. Home Page
- **Hero & Trust Banner**: Highlights Australian registered ABN, PayPal buyer protection, and sealed stock guarantees.
- **Business Contact Rundown**: Summary card highlighting the business ABN, official PayPal merchant account, and contact email.
- **Stock Photo Showcase**: Real warehouse photography with condition tags ("Brand New Factory Sealed", "Collector Grade").
- **Customer Reviews**: Testimonials from verified Australian buyers with star ratings.
- **Embedded Stock Grid**: Full inventory with search, filtering (In Stock / Pre-Order), and sorting (Name A-Z, Name Z-A, Lowest Price, Highest Price) embedded directly on the home page.

### 2. Shop & eBay-Style Listing Detail View
- **Product Card Grid**: Photo, title, condition badge, price in AUD, pre-order badges.
- **eBay-Style Listing Modal**:
  - Multi-image gallery with thumbnail selection.
  - Dropdown specifications (e.g., *Shrink Wrap / Protective Packaging*, *Transit Insurance*) with **live dynamic price updates**.
  - eBay-style Item Specifics table (Brand, Set, Game, Year, Language, Origin, etc.).
  - Add to Cart and Express PayPal checkout buttons.

### 3. Cart & PayPal Checkout
- Line items with chosen specifications (e.g. shrink-wrap state), unit prices, and quantity selectors.
- Order summary with subtotal, free tracked delivery, and GST inclusion.
- **Mandatory Policy Checkbox**: Confirms agreement that placing an order constitutes acknowledgment of shipping, returns, and terms.
- **Simulated PayPal Checkout**: End-to-end simulated authorization creating confirmed orders with Australia Post tracking.

### 4. Customer Account Details
- Manage profile (Username, Email, Password, Contact Phone).
- Connected customer PayPal account.
- Saved shipping address manager.
- Previous orders list with status, specifications breakdown, and Australia Post tracking numbers.

### 5. Policies & Terms of Service
- Prominent mandatory customer agreement banner.
- Shipping & handling policies (dispatch times, archival packaging, carrier details).
- Return terms (sealed product integrity, ACL compliance).
- Terms of service & legal information.

### 6. Contact & About Section
- Business narrative and Sydney location details.
- Prominent ABN, PayPal identifier, and direct support email.
- Interactive contact form with category selector.

### 7. Universal Header & Footer Navigation Dropdowns
- Every page features a top dropdown menu with immediate access to all sections.
- Every page footer also features a quick jump dropdown navigator.

---

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev

# Build for production
npm run build
```

---

## 🌐 GitHub Hosting & Custom Domain
See [CUSTOM_DOMAIN_AND_DEPLOYMENT.md](file:///Users/jacksonmicic/Documents/antigravity/peaceful-lavoisier/CUSTOM_DOMAIN_AND_DEPLOYMENT.md) for full instructions on automated GitHub Pages deployment and setting up your custom domain DNS records.
