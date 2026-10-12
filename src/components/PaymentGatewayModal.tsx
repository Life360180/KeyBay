import { useState, useId } from 'react';
import { 
  X, ShieldCheck, Lock, CreditCard, CheckCircle2, 
  Copy, Check, Terminal, ArrowRight, Sparkles, AlertCircle, Coins, Wallet 
} from 'lucide-react';
import { ProductListing, UserState } from '../types';

interface PaymentGatewayModalProps {
  product: ProductListing;
  userState: UserState;
  onClose: () => void;
  onSuccess: (product: ProductListing, txHash: string) => void;
  onOpenMemberships: () => void;
}

export default function PaymentGatewayModal({
  product,
  userState,
  onClose,
  onSuccess,
  onOpenMemberships,
}: PaymentGatewayModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'balance'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('883');
  const [cardName, setCardName] = useState('Alex Mercer');
  const [postalCode, setPostalCode] = useState('94107');
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [processingState, setProcessingState] = useState<'idle' | 'authorizing' | 'securing_escrow' | 'completed'>('idle');
  const [copiedKey, setCopiedKey] = useState(false);
  const [showRawKey, setShowRawKey] = useState(false);
  const [generatedTxHash, setGeneratedTxHash] = useState('');

  // Fee calculation: Starter membership pays 6%, Pro and Enterprise pay 0%!
  const isMemberZeroFee = userState.membership !== 'starter';
  const basePrice = product.askingPrice;
  const platformFee = isMemberZeroFee ? 0 : Number((basePrice * 0.05).toFixed(2));
  const totalAmount = Math.max(0, Number((basePrice + platformFee - couponDiscount).toFixed(2)));

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'KEYBAY10' || couponCode.toUpperCase() === 'PRODEV') {
      setCouponDiscount(10);
      setCouponApplied(true);
    } else if (couponCode.trim().length > 0) {
      setCouponDiscount(5);
      setCouponApplied(true);
    }
  };

  const handleProcessPayment = () => {
    setProcessingState('authorizing');
    const tx = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setGeneratedTxHash(tx);

    setTimeout(() => {
      setProcessingState('securing_escrow');
      setTimeout(() => {
        setProcessingState('completed');
        onSuccess(product, tx);
      }, 900);
    }, 1100);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(product.keyValue);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted Escrow Gateway</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Processing State Animation */}
        {processingState === 'authorizing' || processingState === 'securing_escrow' ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/40 bg-indigo-950/60 text-indigo-400">
              <Lock className="h-8 w-8 animate-pulse text-indigo-400" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white">
              {processingState === 'authorizing'
                ? 'Processing payment verification...'
                : 'Cryptographically securing escrow contract...'}
            </h3>
            <p className="mt-2 text-xs text-slate-400 max-w-sm leading-relaxed">
              Verifying seller credentials and locking funds in smart escrow. 
              API credentials will be decrypted and delivered instantly.
            </p>
          </div>
        ) : processingState === 'completed' ? (
          /* Success & Key Reveal View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Payment Confirmed · Key Delivered!</h3>
                <p className="text-xs text-slate-400">Escrow Contract ID: <span className="font-mono text-slate-300">{generatedTxHash.slice(0, 14)}...</span></p>
              </div>
            </div>

            {/* Revealed Key Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Decrypted Master Credential</span>
                <button
                  onClick={() => setShowRawKey(!showRawKey)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  {showRawKey ? 'Mask Secret' : 'Reveal Secret'}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5">
                <code className="font-mono text-xs text-indigo-300 break-all select-all">
                  {showRawKey ? product.keyValue : `${product.keyValue.slice(0, 10)}••••••••••••••••${product.keyValue.slice(-4)}`}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 shrink-0 cursor-pointer"
                >
                  {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                Saved to your personal <strong className="text-white">Vault</strong>. 24h buyer protection is active.
              </p>
            </div>

            {/* Test cURL Command snippet */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Immediate Terminal Test (cURL)</span>
                </div>
                <button
                  onClick={() => {
                    const fullSnippet = product.curlSnippet.replace('$KEY', product.keyValue);
                    navigator.clipboard.writeText(fullSnippet);
                  }}
                  className="text-xs text-slate-400 hover:text-indigo-400 cursor-pointer"
                >
                  Copy cURL
                </button>
              </div>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-2.5 font-mono text-xs text-slate-300">
                {product.curlSnippet.replace('$KEY', product.keyValue)}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 cursor-pointer"
              >
                Go to My Vault
              </button>
            </div>
          </div>
        ) : (
          /* Standard Checkout Form */
          <div className="p-6 space-y-6">
            
            {/* Item Summary */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
                    {product.categoryLabel} · {product.keyType}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{product.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 font-mono">
                    Seller: @{product.seller.username} ({product.seller.rating}★ rating)
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    ${product.askingPrice.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 line-through tabular-nums">
                    Retail: ${product.originalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-300">Select Payment Method</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="h-4 w-4 mb-1" />
                  <span>Card / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === 'crypto'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Coins className="h-4 w-4 mb-1" />
                  <span>USDC / Crypto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('balance')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === 'balance'
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Wallet className="h-4 w-4 mb-1" />
                  <span>Balance (${userState.balance.toFixed(2)})</span>
                </button>
              </div>
            </div>

            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                <div>
                  <label className="text-[11px] font-medium text-slate-400">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400">Card Number</label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">Expiration</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">CVC / CVV</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">Instant Web3 Escrow Settlement</p>
                <p className="text-slate-400 text-[11px]">
                  Pay using USDC on Base, Solana, or Polygon. 0 gas network fees absorbed by KeyBay.
                </p>
                <div className="mt-2 rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-slate-300 border border-slate-800">
                  Recipient: 0x82a9...d40c (KeyBay Multi-Sig Escrow)
                </div>
              </div>
            )}

            {paymentMethod === 'balance' && (
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Available Balance:</span>
                  <span className="font-mono font-bold text-white">${userState.balance.toFixed(2)}</span>
                </div>
                {userState.balance < totalAmount && (
                  <p className="mt-2 text-[11px] text-amber-400">
                    Your balance is lower than total amount. Top up or select Card/Crypto.
                  </p>
                )}
              </div>
            )}

            {/* Coupon Code input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. KEYBAY10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                Apply
              </button>
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 border-t border-slate-800 pt-3 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Key Subtotal:</span>
                <span className="text-slate-200">${basePrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span>Buyer Platform Fee:</span>
                  {isMemberZeroFee ? (
                    <span className="text-[10px] text-emerald-400 font-sans">0% (Pro Member)</span>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenMemberships}
                      className="text-[10px] text-indigo-400 underline font-sans hover:text-indigo-300 cursor-pointer"
                    >
                      Waive with Pro
                    </button>
                  )}
                </span>
                <span className="text-slate-200">${platformFee.toFixed(2)}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Applied:</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                <span className="font-sans">Total Due:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Escrow Guarantee Note */}
            <div className="flex items-center gap-2 rounded-lg bg-indigo-950/30 p-2.5 text-[11px] text-indigo-300 border border-indigo-900/40">
              <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-400" />
              <span>
                24-Hour Buyer Inspection Escrow. Seller receives payment only after you confirm key quota validity.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98] cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Authorize & Unlock Key (${totalAmount.toFixed(2)})</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
