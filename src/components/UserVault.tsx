import { useState } from 'react';
import { 
  KeyRound, ShieldCheck, Copy, Check, Terminal, 
  ExternalLink, Trash2, Plus, Sparkles, CheckCircle2, Eye, EyeOff, Play 
} from 'lucide-react';
import { UserState, ProductListing } from '../types';

interface UserVaultProps {
  userState: UserState;
  onDelistProduct: (productId: string) => void;
  onOpenSellModal: () => void;
  onOpenMemberships: () => void;
  onTestKey: (product: ProductListing) => void;
}

export default function UserVault({
  userState,
  onDelistProduct,
  onOpenSellModal,
  onOpenMemberships,
  onTestKey,
}: UserVaultProps) {
  const [activeTab, setActiveTab] = useState<'purchased' | 'selling'>('purchased');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [unmaskedKeys, setUnmaskedKeys] = useState<Record<string, boolean>>({});

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleMask = (id: string) => {
    setUnmaskedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Top Profile Summary Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 mb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 font-mono text-lg font-bold text-white shadow-inner">
              {userState.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">@{userState.username}</h2>
                <span className="font-mono text-xs text-indigo-400 font-semibold uppercase">
                  [{userState.membership.toUpperCase()} MEMBER]
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{userState.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 px-4 font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-lg font-bold text-white">${userState.balance.toFixed(2)}</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 px-4 font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Keys Secured</span>
              <span className="text-lg font-bold text-emerald-400">{userState.purchasedKeys.length}</span>
            </div>

            {userState.membership === 'starter' && (
              <button
                onClick={onOpenMemberships}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer"
              >
                Upgrade to Pro (0% Fees)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('purchased')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'purchased'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>My Purchased Keys ({userState.purchasedKeys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('selling')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'selling'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>My Active Listings ({userState.userListings.length})</span>
        </button>
      </div>

      {/* Content: Purchased Keys */}
      {activeTab === 'purchased' && (
        <div>
          {userState.purchasedKeys.length > 0 ? (
            <div className="space-y-4">
              {userState.purchasedKeys.map(({ purchaseId, product, purchasedAt, transactionHash }) => {
                const isUnmasked = unmaskedKeys[purchaseId];
                const isCopied = copiedKeyId === purchaseId;

                return (
                  <div
                    key={purchaseId}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 transition-colors hover:border-slate-700"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-indigo-400">{product.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{product.keyType}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-500">Tx: {transactionHash.slice(0, 10)}...</span>
                        </div>
                        <h3 className="mt-1 text-base font-semibold text-white">{product.title}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Quota: {product.quotaOrDuration} · Rate: {product.rateLimit}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTestKey(product)}
                          className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 cursor-pointer"
                        >
                          <Play className="h-3 w-3" />
                          <span>Test Endpoint Ping</span>
                        </button>
                      </div>
                    </div>

                    {/* Key Box */}
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <KeyRound className="h-4 w-4 text-emerald-400 shrink-0" />
                        <code className="font-mono text-xs text-emerald-300 truncate select-all">
                          {isUnmasked ? product.keyValue : `${product.keyValue.slice(0, 8)}••••••••••••••••${product.keyValue.slice(-4)}`}
                        </code>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleMask(purchaseId)}
                          className="rounded-md border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-white cursor-pointer"
                          title={isUnmasked ? 'Mask Key' : 'Reveal Key'}
                        >
                          {isUnmasked ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>

                        <button
                          onClick={() => handleCopy(purchaseId, product.keyValue)}
                          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{isCopied ? 'Copied' : 'Copy Key'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick cURL snippet */}
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/60">
                      <span className="truncate pr-4 text-[11px] text-slate-400">
                        {product.curlSnippet.replace('$KEY', product.keyValue)}
                      </span>
                      <button
                        onClick={() => handleCopy(`${purchaseId}-curl`, product.curlSnippet.replace('$KEY', product.keyValue))}
                        className="text-indigo-400 hover:underline shrink-0 text-[11px] cursor-pointer"
                      >
                        Copy cURL
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Purchased: {new Date(purchasedAt).toLocaleDateString()}</span>
                      <span className="text-emerald-400">24h Escrow Protection Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
              <KeyRound className="mx-auto h-8 w-8 text-slate-600" />
              <h3 className="mt-3 text-base font-semibold text-white">No keys in your vault yet</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Explore the marketplace to purchase wholesale API keys with instant decryption.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Content: User Active Listings */}
      {activeTab === 'selling' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400">Items you currently have listed on the exchange</span>
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>List Another Key</span>
            </button>
          </div>

          {userState.userListings.length > 0 ? (
            <div className="space-y-3">
              {userState.userListings.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-indigo-400">{item.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-400">{item.discountPercent}% OFF</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-0.5">{item.title}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Quota: {item.quotaOrDuration} · {item.views} marketplace views
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-white">${item.askingPrice.toFixed(2)}</div>
                      <div className="text-[11px] text-slate-500">Retail: ${item.originalPrice.toFixed(2)}</div>
                    </div>

                    <button
                      onClick={() => onDelistProduct(item.id)}
                      className="rounded-lg border border-rose-900/50 bg-rose-950/30 p-2 text-rose-400 hover:bg-rose-900/50 cursor-pointer"
                      title="Delist from marketplace"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
              <h3 className="text-base font-semibold text-white">No active listings posted</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Got surplus API quotas or developer vouchers? Sell them to other builders.
              </p>
              <button
                onClick={onOpenSellModal}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>List an API Key for Sale</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
