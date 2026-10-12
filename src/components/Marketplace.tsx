import { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, Tag, ArrowUpDown, Plus, Sparkles, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { ProductListing, CategoryType } from '../types';
import { CATEGORIES } from '../data/initialData';
import ProductCard from './ProductCard';

interface MarketplaceProps {
  products: ProductListing[];
  onBuyProduct: (product: ProductListing) => void;
  onQuickViewProduct: (product: ProductListing) => void;
  onOpenSellModal: () => void;
  onOpenMemberships: () => void;
  onLoadSampleProducts?: () => void;
  onClearAllProducts?: () => void;
}

export default function Marketplace({
  products,
  onBuyProduct,
  onQuickViewProduct,
  onOpenSellModal,
  onOpenMemberships,
  onLoadSampleProducts,
  onClearAllProducts,
}: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'discount' | 'price-asc' | 'price-desc' | 'rating'>('discount');
  const [maxPrice, setMaxPrice] = useState<number>(350);

  const availableProducts = useMemo(() => {
    return products.filter((p) => !p.isSold);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.quotaOrDuration.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.askingPrice <= maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'price-asc') return a.askingPrice - b.askingPrice;
      if (sortBy === 'price-desc') return b.askingPrice - a.askingPrice;
      if (sortBy === 'rating') return b.seller.rating - a.seller.rating;
      return 0;
    });
  }, [availableProducts, selectedCategory, searchQuery, sortBy, maxPrice]);

  const hasAnyProducts = availableProducts.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <section className="mb-10 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="text-indigo-400 font-semibold">Decentralized Developer Liquidity</span>
            <span aria-hidden="true">·</span>
            <span>24h Escrow Protection</span>
            <span aria-hidden="true">·</span>
            {hasAnyProducts ? (
              <span className="text-emerald-400 font-mono">
                {availableProducts.length} Active Listings
              </span>
            ) : (
              <span className="text-slate-400 font-mono">
                0 Active Listings
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-sans" style={{ textWrap: 'balance' }}>
            Buy & Sell Surplus API Keys for Cheaper.
          </h1>

          <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-2xl">
            Save 40% to 60% on OpenAI, Claude, proxies, database quotas, and developer software licenses. 
            All keys are cryptographically verified and backed by automated 24-hour buyer inspection escrow.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Sell an API Key</span>
            </button>

            <button
              onClick={onOpenMemberships}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <span>Monthly Memberships (0% Fee)</span>
            </button>

            {hasAnyProducts && onClearAllProducts && (
              <button
                onClick={onClearAllProducts}
                className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/20 px-3 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-900/40 cursor-pointer"
                title="Remove all listings to simulate empty market"
              >
                <span>Clear All (Empty Market)</span>
              </button>
            )}

            {!hasAnyProducts && onLoadSampleProducts && (
              <button
                onClick={onLoadSampleProducts}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <span>Load Sample Keys (Demo)</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Toolbar & Filters (Only when there are items, or to search/filter) */}
      <section className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys by model, provider, or seller..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="discount" className="bg-slate-900 text-white">Biggest Discount (%)</option>
                <option value="price-asc" className="bg-slate-900 text-white">Lowest Price ($)</option>
                <option value="price-desc" className="bg-slate-900 text-white">Highest Value ($)</option>
                <option value="rating" className="bg-slate-900 text-white">Seller Trust Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryType)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/70 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of Listings OR Exact Empty State */}
      {filteredProducts.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <span>Showing <span className="font-mono text-white font-semibold">{filteredProducts.length}</span> verified keys</span>
            <span className="font-mono text-emerald-400">Escrow protected</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={onBuyProduct}
                onQuickView={onQuickViewProduct}
              />
            ))}
          </div>
        </section>
      ) : (
        /* EXACT REQUIREMENT: if nothing is for sail just make it say "nothing for sail right now" */
        <div className="my-12 flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center sm:p-14">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 shadow-inner">
            <Tag className="h-7 w-7 text-slate-500" />
          </div>

          {/* EXACT TEXT AS EXPLICITLY REQUESTED */}
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
            nothing for sail right now
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            No one is currently selling any items.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Sell an API Key</span>
            </button>

            {searchQuery || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setMaxPrice(350);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            ) : null}

            {!hasAnyProducts && onLoadSampleProducts && (
              <button
                onClick={onLoadSampleProducts}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
              >
                <span>Load Sample Keys (Demo)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trust & Guarantee Section */}
      <section className="mt-14 border-t border-slate-800/80 pt-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <h4 className="text-sm font-semibold text-white">1. Cryptographic Key Escrow</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              When you purchase, the seller's secret key or proxy token is decrypted in an isolated browser sandbox. 
              Payment is held safely until your initial test calls execute successfully.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <h4 className="text-sm font-semibold text-white">2. Wholesale Price Arbitrage</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Agencies with enterprise commitments and venture grant tiers liquidate unused quotas, 
              giving solo builders and startups direct access to tier-5 rate limits at up to 60% discounts.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <h4 className="text-sm font-semibold text-white">3. Zero-Fee Pro Memberships</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Subscribe to Developer Pro for $19/month to eliminate buyer transaction fees, unlock automated key health monitoring, 
              and receive monthly $10 store credits.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
