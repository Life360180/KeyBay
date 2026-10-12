import { useState } from 'react';
import { ShieldCheck, Plus, Sparkles, User, Wallet } from 'lucide-react';
import { UserState } from '../types';

interface HeaderProps {
  currentTab: 'marketplace' | 'analytics' | 'memberships' | 'vault';
  onSelectTab: (tab: 'marketplace' | 'analytics' | 'memberships' | 'vault') => void;
  onOpenSellModal: () => void;
  userState: UserState;
}

export default function Header({
  currentTab,
  onSelectTab,
  onOpenSellModal,
  userState,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectTab('marketplace')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-mono text-sm font-extrabold text-white shadow-inner">
            KB
          </span>
          <span className="font-sans font-extrabold tracking-tight">KeyBay</span>
        </button>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'marketplace'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'analytics'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analytics
          </button>

          <button
            onClick={() => onSelectTab('memberships')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'memberships'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Memberships
          </button>

          <button
            onClick={() => onSelectTab('vault')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentTab === 'vault'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Vault ({userState.purchasedKeys.length})
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSellModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>List API Key</span>
          </button>
        </div>

      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-slate-800/60 px-4 py-2 justify-around text-xs font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('marketplace')}
          className={`py-1 ${currentTab === 'marketplace' ? 'text-indigo-400 font-semibold' : ''}`}
        >
          Market
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className={`py-1 ${currentTab === 'analytics' ? 'text-indigo-400 font-semibold' : ''}`}
        >
          Analytics
        </button>
        <button
          onClick={() => onSelectTab('memberships')}
          className={`py-1 ${currentTab === 'memberships' ? 'text-indigo-400 font-semibold' : ''}`}
        >
          Memberships
        </button>
        <button
          onClick={() => onSelectTab('vault')}
          className={`py-1 ${currentTab === 'vault' ? 'text-indigo-400 font-semibold' : ''}`}
        >
          Vault ({userState.purchasedKeys.length})
        </button>
      </div>
    </header>
  );
}
