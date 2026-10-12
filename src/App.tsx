/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Marketplace from './components/Marketplace';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Memberships from './components/Memberships';
import UserVault from './components/UserVault';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import SellListingModal from './components/SellListingModal';
import KeyTestRunnerModal from './components/KeyTestRunnerModal';
import { ProductListing, UserState, TransactionRecord } from './types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './data/initialData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'analytics' | 'memberships' | 'vault'>('marketplace');
  
  // Products inventory: defaults to empty array so if no one is selling anything, it shows 'nothing for sail right now'
  const [products, setProducts] = useState<ProductListing[]>(() => {
    const saved = localStorage.getItem('keybay_products_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return []; // Empty by default: no one is selling anything
  });

  // Real-time market transactions
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('keybay_transactions_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // User account state
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('keybay_user_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      username: 'dev_alex',
      email: 'liamseasyemail@gmail.com',
      balance: 145.00,
      membership: 'starter',
      membershipBillingDate: '2026-11-11',
      purchasedKeys: [],
      userListings: [],
    };
  });

  // Modal states
  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState<ProductListing | null>(null);
  const [activeInspectorProduct, setActiveInspectorProduct] = useState<ProductListing | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('keybay_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('keybay_transactions_v3', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('keybay_user_v3', JSON.stringify(userState));
  }, [userState]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Payment completed
  const handlePaymentSuccess = (product: ProductListing, txHash: string) => {
    // 1. Mark product as sold
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isSold: true } : p))
    );

    // 2. Add to user vault
    setUserState((prev) => ({
      ...prev,
      purchasedKeys: [
        {
          purchaseId: `pur-${Date.now()}`,
          product: { ...product, isSold: true },
          purchasedAt: new Date().toISOString(),
          transactionHash: txHash,
        },
        ...prev.purchasedKeys,
      ],
    }));

    // 3. Record market transaction
    const newTx: TransactionRecord = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      itemTitle: product.title,
      category: product.categoryLabel,
      buyerName: userState.username,
      sellerName: product.seller.username,
      amount: product.askingPrice,
      savings: product.originalPrice - product.askingPrice,
      timestamp: 'Just now',
      status: 'Escrow Secured',
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Purchased "${product.title}"! Key delivered into your vault.`);
  };

  // Add new listing for sale
  const handleSubmitListing = (newListing: ProductListing) => {
    setProducts((prev) => [newListing, ...prev]);
    setUserState((prev) => ({
      ...prev,
      userListings: [newListing, ...prev.userListings],
    }));
    showToast(`Listed "${newListing.title}" on the open marketplace!`);
    setCurrentTab('marketplace');
  };

  // Delist an item
  const handleDelistProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setUserState((prev) => ({
      ...prev,
      userListings: prev.userListings.filter((p) => p.id !== productId),
    }));
    showToast('Listing removed from marketplace.', 'info');
  };

  // Upgrade membership
  const handleUpgradeMembership = (planId: 'starter' | 'pro' | 'enterprise') => {
    setUserState((prev) => ({
      ...prev,
      membership: planId,
    }));
    showToast(`Upgraded to ${planId.toUpperCase()} monthly membership! 0% buyer fees activated.`);
  };

  // Deposit funds to wallet
  const handleDepositFunds = (amount: number) => {
    setUserState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));
    showToast(`Deposited $${amount.toFixed(2)} to your KeyBay wallet!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        userState={userState}
      />

      {/* Toast Notification Banner */}
      {notification && (
        <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{notification.message}</span>
          </div>
        </aside>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'marketplace' && (
          <Marketplace
            products={products}
            onBuyProduct={(prod) => setActiveCheckoutProduct(prod)}
            onQuickViewProduct={(prod) => setActiveInspectorProduct(prod)}
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onOpenMemberships={() => setCurrentTab('memberships')}
            onLoadSampleProducts={() => setProducts(INITIAL_PRODUCTS)}
            onClearAllProducts={() => setProducts([])}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            transactions={transactions}
            products={products}
            userState={userState}
            onDepositFunds={handleDepositFunds}
          />
        )}

        {currentTab === 'memberships' && (
          <Memberships
            userState={userState}
            onUpgradeMembership={handleUpgradeMembership}
          />
        )}

        {currentTab === 'vault' && (
          <UserVault
            userState={userState}
            onDelistProduct={handleDelistProduct}
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onOpenMemberships={() => setCurrentTab('memberships')}
            onTestKey={(prod) => setActiveInspectorProduct(prod)}
          />
        )}
      </main>

      {/* Secure Payment Gateway Modal */}
      {activeCheckoutProduct && (
        <PaymentGatewayModal
          product={activeCheckoutProduct}
          userState={userState}
          onClose={() => setActiveCheckoutProduct(null)}
          onSuccess={handlePaymentSuccess}
          onOpenMemberships={() => {
            setActiveCheckoutProduct(null);
            setCurrentTab('memberships');
          }}
        />
      )}

      {/* Sell API Key / Digital Goods Modal */}
      {isSellModalOpen && (
        <SellListingModal
          userState={userState}
          onClose={() => setIsSellModalOpen(false)}
          onSubmitListing={handleSubmitListing}
        />
      )}

      {/* Sandbox Key Test Runner Inspector Modal */}
      {activeInspectorProduct && (
        <KeyTestRunnerModal
          product={activeInspectorProduct}
          onClose={() => setActiveInspectorProduct(null)}
        />
      )}

      {/* Quiet Anti-Slop Compliant Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-16 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">KeyBay</span>
            <span aria-hidden="true">·</span>
            <span>The Developer API & Digital Goods Exchange</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Marketplace
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Live Analytics
            </button>
            <button
              onClick={() => setCurrentTab('memberships')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Monthly Plans
            </button>
            <button
              onClick={() => setCurrentTab('vault')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vault
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-600">
            Escrow Protected · 256-Bit Cryptographic Settlement
          </div>
        </div>
      </footer>

    </div>
  );
}
