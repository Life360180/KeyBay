import { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MembershipPlan, UserState } from '../types';
import { MEMBERSHIP_PLANS } from '../data/initialData';

interface MembershipsProps {
  userState: UserState;
  onUpgradeMembership: (planId: 'starter' | 'pro' | 'enterprise') => void;
}

export default function Memberships({
  userState,
  onUpgradeMembership,
}: MembershipsProps) {
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<MembershipPlan | null>(null);
  const [billingSuccessMessage, setBillingSuccessMessage] = useState('');
  const [cardInput, setCardInput] = useState('4242 •••• •••• 4242');

  const handleSubscribe = (plan: MembershipPlan) => {
    if (plan.id === userState.membership) return;
    setSelectedPlanForCheckout(plan);
  };

  const handleConfirmSubscription = () => {
    if (!selectedPlanForCheckout) return;
    onUpgradeMembership(selectedPlanForCheckout.id);
    setBillingSuccessMessage(`Successfully enrolled in ${selectedPlanForCheckout.name} monthly subscription!`);
    setSelectedPlanForCheckout(null);
    setTimeout(() => setBillingSuccessMessage(''), 4500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Monthly Developer Memberships</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans" style={{ textWrap: 'balance' }}>
          Zero-Fee Trading & High-Quota Relays
        </h1>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          Unlock 0% buyer transaction fees, automated key health pings, priority escrow dispatch, 
          and monthly store credit on all API keys and digital software assets.
        </p>

        {billingSuccessMessage && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>{billingSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
        {MEMBERSHIP_PLANS.map((plan) => {
          const isCurrentPlan = userState.membership === plan.id;
          const isPro = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl border p-8 transition-all ${
                isPro
                  ? 'border-indigo-500 bg-slate-900/90 shadow-2xl shadow-indigo-950/50 ring-1 ring-indigo-500/40'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Plan Label */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.recommended && (
                    <span className="text-[11px] font-mono font-semibold text-indigo-400">
                      MOST POPULAR
                    </span>
                  )}
                  {isCurrentPlan && (
                    <span className="text-[11px] font-mono font-semibold text-emerald-400">
                      ACTIVE PLAN
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-400">{plan.targetAudience}</p>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-extrabold tracking-tight text-white tabular-nums">
                    ${plan.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                {/* Fee rates summary */}
                <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Buyer Platform Fee:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {plan.buyerFeePercent}%
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-slate-400">Seller Commission:</span>
                    <span className="font-mono text-slate-200">
                      {plan.sellerFeePercent}%
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isCurrentPlan
                      ? 'border border-slate-800 bg-slate-950 text-slate-500 cursor-default'
                      : isPro
                      ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500 active:scale-[0.98]'
                      : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isCurrentPlan ? (
                    <span>Current Active Membership</span>
                  ) : (
                    <>
                      <span>{plan.priceMonthly === 0 ? 'Switch to Free Tier' : `Subscribe Monthly ($${plan.priceMonthly}/mo)`}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Membership ROI Value Calculator */}
      <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <h3 className="text-base font-bold text-white">Why Join Developer Pro Monthly?</h3>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-2xl">
          On the Explorer Tier, buyers pay a 6% escrow platform fee. If you purchase more than $315 in API keys or digital licenses per month, 
          the Developer Pro membership ($19/mo) pays for itself in waived fees alone — plus you receive a $10 monthly store voucher, 
          reducing your net membership cost to just $9/month.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500">Spend $200/mo on Keys:</span>
            <div className="mt-1 text-sm font-bold text-white">Save $12 in fees + $10 credit</div>
            <div className="text-[11px] text-emerald-400">Net benefit: +$3.00/mo</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500">Spend $500/mo on Keys:</span>
            <div className="mt-1 text-sm font-bold text-white">Save $30 in fees + $10 credit</div>
            <div className="text-[11px] text-emerald-400">Net benefit: +$21.00/mo</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-500">Spend $1,000/mo on Keys:</span>
            <div className="mt-1 text-sm font-bold text-white">Save $60 in fees + $10 credit</div>
            <div className="text-[11px] text-emerald-400">Net benefit: +$51.00/mo</div>
          </div>
        </div>
      </div>

      {/* Checkout Modal for Subscription */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Confirm Monthly Subscription</h3>
                <p className="text-xs text-slate-400">Billed monthly. Cancel anytime with 1 click.</p>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-white">{selectedPlanForCheckout.name}</span>
                  <p className="text-[11px] text-slate-400">Renews on the 11th of each month</p>
                </div>
                <div className="font-mono text-base font-bold text-indigo-300">
                  ${selectedPlanForCheckout.priceMonthly}/mo
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400">Payment Method (Card)</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={cardInput}
                    onChange={(e) => setCardInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-950 p-2.5 text-[11px] text-slate-400 border border-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant activation. 0% buyer fees applied immediately on checkout.</span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubscription}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 cursor-pointer"
                >
                  <span>Confirm & Subscribe (${selectedPlanForCheckout.priceMonthly}/mo)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
