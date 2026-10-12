import { useState } from 'react';
import { X, Plus, ShieldCheck, Tag, Info, Server, KeyRound, AlertTriangle } from 'lucide-react';
import { ProductListing, CategoryType, UserState } from '../types';

interface SellListingModalProps {
  userState: UserState;
  onClose: () => void;
  onSubmitListing: (newListing: ProductListing) => void;
}

export default function SellListingModal({
  userState,
  onClose,
  onSubmitListing,
}: SellListingModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('ai-llm');
  const [keyType, setKeyType] = useState<ProductListing['keyType']>('Direct Secret Key');
  const [originalPrice, setOriginalPrice] = useState<string>('100');
  const [askingPrice, setAskingPrice] = useState<string>('49');
  const [quotaOrDuration, setQuotaOrDuration] = useState('');
  const [rateLimit, setRateLimit] = useState('5,000 RPM');
  const [description, setDescription] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [curlSnippet, setCurlSnippet] = useState('curl https://api.example.com/v1/models -H "Authorization: Bearer $KEY"');

  const origNum = parseFloat(originalPrice) || 0;
  const askNum = parseFloat(askingPrice) || 0;
  const discountPercent = origNum > askNum && origNum > 0 ? Math.round(((origNum - askNum) / origNum) * 100) : 0;
  const savings = origNum > askNum ? (origNum - askNum).toFixed(2) : '0.00';

  // Seller commission according to membership
  const sellerFeePercent = userState.membership === 'enterprise' ? 1.5 : userState.membership === 'pro' ? 4 : 8;
  const netEarnings = Math.max(0, askNum - (askNum * (sellerFeePercent / 100))).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !askingPrice || !keyValue) return;

    const categoryLabels: Record<CategoryType, string> = {
      'all': 'Digital Asset',
      'ai-llm': 'AI & LLM API',
      'scraping-proxies': 'Scraping & Proxies',
      'cloud-compute': 'Cloud & Database',
      'media-audio': 'Audio & Media API',
      'dev-tools': 'Developer Tools',
    };

    const newListing: ProductListing = {
      id: `prod-${Date.now()}`,
      title,
      category,
      categoryLabel: categoryLabels[category] || 'API Key',
      seller: {
        username: userState.username,
        rating: 5.0,
        completedSales: userState.userListings.length,
        isVerified: true,
      },
      originalPrice: origNum,
      askingPrice: askNum,
      discountPercent,
      quotaOrDuration: quotaOrDuration || 'Standard Quota Balance',
      keyType,
      description: description || 'Verified developer API credentials ready for instant deployment.',
      verificationStatus: 'Tested & Active',
      lastPingTime: 'Just now',
      rateLimit: rateLimit || 'Standard Tier',
      keyValue,
      curlSnippet: curlSnippet || 'curl -H "Authorization: Bearer $KEY" https://api.service.com',
      isSold: false,
      views: 1,
      createdAt: new Date().toISOString(),
    };

    onSubmitListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Sell an API Key or Digital Asset</h3>
            <p className="text-xs text-slate-400">List surplus API balances, proxies, and developer licenses for sale.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs">
          
          {/* Title */}
          <div>
            <label className="font-semibold text-slate-300">Listing Title / Service Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. OpenAI Tier-5 Project Key ($150 credit) or Claude 3.5 Endpoint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Category & Key Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-300">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="ai-llm">AI & LLM APIs</option>
                <option value="scraping-proxies">Scraping & Residential Proxies</option>
                <option value="cloud-compute">Cloud & Database Services</option>
                <option value="media-audio">Audio, Vision & Media</option>
                <option value="dev-tools">Developer Tools & Licenses</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300">Delivery Format *</label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value as any)}
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="Direct Secret Key">Direct Secret API Key</option>
                <option value="Reverse Proxy Endpoint">Reverse Proxy Endpoint</option>
                <option value="License Token">License Token / Voucher Code</option>
                <option value="Sub-Account Credential">Sub-Account Credential</option>
              </select>
            </div>
          </div>

          {/* Pricing & Savings calculation */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="font-semibold text-slate-300">Retail / Original Value ($) *</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="100.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-8 pr-3 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Your Asking Price ($) *</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="49.00"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-8 pr-3 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Savings & Commission Breakdown */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3 text-xs font-mono">
              <div className="text-emerald-400">
                Buyer Discount: <span className="font-bold">{discountPercent}% OFF</span> (Saves ${savings})
              </div>
              <div className="text-slate-400">
                Seller Fee ({sellerFeePercent}%): <span className="text-slate-300">${(askNum * (sellerFeePercent / 100)).toFixed(2)}</span> · You Net: <span className="text-white font-bold">${netEarnings}</span>
              </div>
            </div>
          </div>

          {/* Quota & Rate Limit */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-300">Remaining Quota / Duration *</label>
              <input
                type="text"
                required
                placeholder="e.g. $100 Credits, 50k calls, 6-Months remaining"
                value={quotaOrDuration}
                onChange={(e) => setQuotaOrDuration(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300">Rate Limit / Throughput</label>
              <input
                type="text"
                placeholder="e.g. 10,000 RPM or Tier 5 Unlimited"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Key / Secret Token Input (Encrypted) */}
          <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" />
                <span>API Secret Key or Access Token *</span>
              </label>
              <span className="text-[10px] text-slate-400">Encrypted in browser before escrow</span>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Paste the raw API secret key, proxy URL, or token code here..."
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Only revealed to the buyer once the payment gateway successfully secures funds in escrow.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-300">Listing Description & Usage Notes</label>
            <textarea
              rows={3}
              placeholder="Explain how to integrate the key, whether it is an organization key or dedicated cluster, model capabilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Terms Compliance Box */}
          <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>
              By listing, you verify that this key or digital voucher was legally acquired and you have authority to sub-allocate or transfer access. Escrow guarantees buyer validation before payout.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publish Listing to Marketplace</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
