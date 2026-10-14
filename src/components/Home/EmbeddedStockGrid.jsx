import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, 
  Calendar, 
  Check, 
  SlidersHorizontal, 
  ChevronRight,
  PackagePlus,
  X,
  Truck
} from 'lucide-react';

export default function EmbeddedStockGrid({ isStandaloneShop = false }) {
  const { 
    products, 
    setSelectedProduct, 
    activeSort, 
    setActiveSort, 
    filterType, 
    setFilterType, 
    searchQuery, 
    setSearchQuery,
    setAdminModalOpen,
    isAdmin 
  } = useStore();

  // Filter products by search & type
  let filtered = products.filter((item) => {
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = q === '' || 
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(q)) ||
      (item.condition && item.condition.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'inStock') return !item.isPreOrder && Number(item.stockCount) > 0;
    if (filterType === 'preOrder') return item.isPreOrder;
    return true;
  });

  // Sort products: NAME A-Z, NAME Z-A, LOWEST PRICE, HIGHEST PRICE
  filtered.sort((a, b) => {
    if (activeSort === 'AZ') {
      return a.name.localeCompare(b.name);
    }
    if (activeSort === 'ZA') {
      return b.name.localeCompare(a.name);
    }
    if (activeSort === 'PRICE_LOW') {
      return a.basePrice - b.basePrice;
    }
    if (activeSort === 'PRICE_HIGH') {
      return b.basePrice - a.basePrice;
    }
    return 0;
  });

  return (
    <section id="home-stock-section" className="py-12 bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
              <Package className="w-3.5 h-3.5" />
              {isStandaloneShop ? 'Complete Catalog' : 'Live Inventory'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isStandaloneShop ? 'All Available Stock & Guaranteed Pre-Orders' : 'All Available Stock & Pre-Orders'}
            </h2>
            <p className="text-sakura-300/70 text-xs sm:text-sm mt-1">
              Click any item to view full specifications, add-ons, and detailed photos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-sakura-300/80">
              <strong className="text-white font-bold">{filtered.length}</strong> items found
            </span>
            {isAdmin && (
              <button
                onClick={() => setAdminModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#14141e] hover:bg-sakura-950 text-sakura-200 border border-sakura-900/50 hover:border-sakura-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <PackagePlus className="w-3.5 h-3.5 text-sakura-400" />
                <span>Edit / Add Listings</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-[#101016] border border-sakura-900/40 rounded-3xl p-4 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter Tabs (All / In-Stock / Pre-Orders) */}
            <div className="flex items-center gap-1.5 bg-[#171722] p-1 rounded-2xl self-start overflow-x-auto max-w-full border border-sakura-950/40">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filterType === 'all'
                    ? 'bg-sakura-600 text-white shadow-xs'
                    : 'text-sakura-300/80 hover:text-white'
                }`}
              >
                All Items ({products.length})
              </button>
              <button
                onClick={() => setFilterType('inStock')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filterType === 'inStock'
                    ? 'bg-sakura-600 text-white shadow-xs'
                    : 'text-sakura-300/80 hover:text-white'
                }`}
              >
                In Stock ({products.filter(p => !p.isPreOrder).length})
              </button>
              <button
                onClick={() => setFilterType('preOrder')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filterType === 'preOrder'
                    ? 'bg-sakura-600 text-white shadow-xs'
                    : 'text-sakura-300/80 hover:text-white'
                }`}
              >
                Pre-Orders ({products.filter(p => p.isPreOrder).length})
              </button>
            </div>

            {/* Sorting controls & Active Search feedback */}
            <div className="flex flex-wrap items-center gap-3">
              
              {searchQuery && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sakura-950 border border-sakura-600/40 text-sakura-200 rounded-xl text-xs font-semibold">
                  <span>Search: "<strong>{searchQuery}</strong>"</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 hover:bg-sakura-900 rounded-full"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5 text-sakura-400" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-semibold text-sakura-300/80">
                <SlidersHorizontal className="w-4 h-4 text-sakura-400" />
                <span>Sort by:</span>
              </div>
              
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-[#14141e] border border-sakura-900/50 text-sakura-200 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-sakura-500/20 focus:border-sakura-400 focus:outline-none transition-all cursor-pointer"
                aria-label="Sort products"
              >
                <option value="DEFAULT">Featured Sort</option>
                <option value="AZ">NAME A-Z</option>
                <option value="ZA">NAME Z-A</option>
                <option value="PRICE_LOW">LOWEST PRICE</option>
                <option value="PRICE_HIGH">HIGHEST PRICE</option>
              </select>

            </div>

          </div>
        </div>

        {/* Product Grid - Compact 3-col on lg */}
        {filtered.length === 0 ? (
          <div className="bg-[#101016] rounded-3xl border border-sakura-900/40 p-12 text-center">
            <Package className="w-12 h-12 text-sakura-800 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No items match your search or filter</h3>
            <p className="text-xs text-sakura-300/70 mt-1">Try searching for another keyword or resetting filters.</p>
            <button
              onClick={() => {
                setFilterType('all');
                setActiveSort('DEFAULT');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 bg-sakura-600 text-white rounded-xl text-xs font-bold hover:bg-sakura-700 shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => {
              const shipping = Number(product.shippingCost) || 0;
              const hasAddons = product.specifications && product.specifications.length > 0;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-[#111118] rounded-3xl border border-sakura-900/40 shadow-md hover:shadow-xl hover:border-sakura-500/60 transition-all cursor-pointer flex flex-col overflow-hidden"
                >
                  {/* Photo & Badges */}
                  <div className="relative aspect-4/3 w-full bg-[#181822] overflow-hidden">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.stockCount <= 0 ? (
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-zinc-900/95 text-rose-300 border border-rose-500/40 shadow-md uppercase tracking-wider flex items-center gap-1">
                          <X className="w-3 h-3 text-rose-400" />
                          Out of Stock
                        </span>
                      ) : product.isPreOrder ? (
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-amber-500 text-zinc-950 shadow-md uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Pre-Order
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-sakura-600 text-white shadow-md uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          In Stock ({product.stockCount})
                        </span>
                      )}
                      {product.hasPurchaseCap && product.purchaseCap > 0 && product.stockCount > 0 && (
                        <span className="px-2.5 py-0.5 text-[9px] font-black rounded-lg bg-purple-950/90 text-purple-300 border border-purple-500/40 shadow-md uppercase tracking-wider">
                          Limit {product.purchaseCap}/person
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Condition */}
                      <div className="flex items-center justify-between text-xs text-sakura-400 mb-2">
                        <span className="font-semibold text-sakura-400">{product.category}</span>
                        <span className="bg-[#181824] px-2 py-0.5 rounded text-[10px] font-medium text-sakura-300 border border-sakura-900/40">
                          {product.condition}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-sakura-300 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-sakura-200/70 mt-2 line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* ADDONS AVAILABLE BADGE (As requested by user: "addons available") */}
                      {hasAddons && (
                        <div className="mt-3 pt-3 border-t border-sakura-900/30 text-[11px] text-sakura-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sakura-400" />
                          <span className="font-semibold text-sakura-300">Addons available</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Shipping Row */}
                    <div className="mt-5 pt-4 border-t border-sakura-900/30 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-sakura-400/80 uppercase tracking-wider flex items-center gap-1.5">
                          <span>{product.isPreOrder ? 'Pre-Order Price' : 'Price (AUD)'}</span>
                          {product.originalPrice && Number(product.originalPrice) > Number(product.basePrice) && (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                              SAVE ${(Number(product.originalPrice) - Number(product.basePrice)).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">
                            ${Number(product.basePrice || 0).toFixed(2)}
                          </span>
                          {product.originalPrice && Number(product.originalPrice) > Number(product.basePrice) && (
                            <span className="text-xs text-sakura-400/60 line-through font-bold">
                              ${Number(product.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-sakura-300/80 flex items-center gap-1 mt-0.5 font-medium">
                          <Truck className="w-3 h-3 text-sakura-400" />
                          <span>{shipping > 0 ? `+ $${shipping.toFixed(2)} Shipping` : 'Free Shipping'}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors border ${
                          product.stockCount <= 0
                            ? 'bg-zinc-850 text-rose-300 border-zinc-700/60 hover:bg-zinc-800'
                            : 'bg-sakura-600/30 group-hover:bg-sakura-600 text-sakura-200 group-hover:text-white border-sakura-500/40'
                        }`}
                      >
                        <span>{product.stockCount <= 0 ? 'Out of Stock' : 'View'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
