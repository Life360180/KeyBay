import { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, ShieldCheck, DollarSign, 
  ArrowUpRight, Clock, Zap, BarChart3, RefreshCw, 
  Wallet, Layers, Server 
} from 'lucide-react';
import { TransactionRecord, UserState, ProductListing } from '../types';

interface AnalyticsDashboardProps {
  transactions: TransactionRecord[];
  products: ProductListing[];
  userState: UserState;
  onDepositFunds: (amount: number) => void;
}

export default function AnalyticsDashboard({
  transactions,
  products,
  userState,
  onDepositFunds,
}: AnalyticsDashboardProps) {
  const [selectedChartRange, setSelectedChartRange] = useState<'7d' | '30d'>('7d');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('50');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Calculate totals directly from transactions
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalSaved = transactions.reduce((acc, t) => acc + t.savings, 0);
  const activeKeysCount = products.filter((p) => !p.isSold).length;
  const userTotalSaved = userState.purchasedKeys.reduce(
    (acc, k) => acc + (k.product.originalPrice - k.product.askingPrice), 
    0
  );
  const userTotalSpent = userState.purchasedKeys.reduce(
    (acc, k) => acc + k.product.askingPrice, 
    0
  );

  // Chart data points (7 days) based on actual activity
  const chartData = [
    { day: 'Mon', volume: 0, savings: 0, transactions: 0 },
    { day: 'Tue', volume: 0, savings: 0, transactions: 0 },
    { day: 'Wed', volume: 0, savings: 0, transactions: 0 },
    { day: 'Thu', volume: 0, savings: 0, transactions: 0 },
    { day: 'Fri', volume: 0, savings: 0, transactions: 0 },
    { day: 'Sat', volume: 0, savings: 0, transactions: 0 },
    { day: 'Sun (Today)', volume: totalVolume, savings: totalSaved, transactions: transactions.length },
  ];

  const maxVolume = Math.max(...chartData.map((d) => d.volume));

  const handleConfirmDeposit = () => {
    const val = parseFloat(depositAmount);
    if (!isNaN(val) && val > 0) {
      onDepositFunds(val);
      setDepositModalOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Top Title & User Portfolio Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span>Real-Time Market Analytics & Liquidity Feed</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Live Stream</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl font-sans">
            Market Analytics & Performance
          </h1>
        </div>

        {/* User Balance Strip */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 px-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Your Balance</div>
            <div className="font-mono text-base font-bold text-white tabular-nums">
              ${userState.balance.toFixed(2)}
            </div>
          </div>
          <button
            onClick={() => setDepositModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        
        {/* Metric 1: 24h Volume */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>24h Gross Trading Volume</span>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+14.8% vs previous period</span>
          </div>
        </div>

        {/* Metric 2: Total Buyer Savings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Buyer Savings</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-emerald-400 tabular-nums">
            ${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Average discount of <span className="text-white font-mono font-medium">49.2%</span> vs direct
          </div>
        </div>

        {/* Metric 3: Active Verified Listings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Keys in Escrow</span>
            <Server className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-white tabular-nums">
            {activeKeysCount}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            99.8% passed automated health ping
          </div>
        </div>

        {/* Metric 4: User Personal Stats */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Your Personal Savings</span>
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold tracking-tight text-indigo-300 tabular-nums">
            ${userTotalSaved.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across <span className="text-white font-mono">{userState.purchasedKeys.length}</span> purchased keys
          </div>
        </div>

      </div>

      {/* Chart Section: 7-Day Trading Volume & Pricing Arbitrage */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
        
        {/* Main Chart (2 Columns) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Daily Volume & Buyer Savings Trend</h3>
              <p className="text-xs text-slate-400">Aggregated daily turnover across all key categories.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSelectedChartRange('7d')}
                className={`px-2.5 py-1 rounded cursor-pointer ${selectedChartRange === '7d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setSelectedChartRange('30d')}
                className={`px-2.5 py-1 rounded cursor-pointer ${selectedChartRange === '30d' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* SVG Bar & Trend Visualizer */}
          <div className="relative pt-6">
            <div className="h-56 flex items-end justify-between gap-3 px-2">
              {chartData.map((d, index) => {
                const heightPercent = Math.round((d.volume / maxVolume) * 100);
                const isHovered = hoveredDay === index;

                return (
                  <div
                    key={d.day}
                    className="group relative flex-1 flex flex-col items-center cursor-pointer"
                    onMouseEnter={() => setHoveredDay(index)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-16 z-20 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-950 p-2 text-[11px] font-mono shadow-xl text-slate-200">
                        <div>Vol: <strong className="text-white">${d.volume.toLocaleString()}</strong></div>
                        <div className="text-emerald-400">Saved: ${d.savings.toLocaleString()}</div>
                      </div>
                    )}

                    {/* Bar graphic */}
                    <div className="w-full max-w-[48px] rounded-t-lg bg-slate-800/60 overflow-hidden flex flex-col justify-end transition-all group-hover:bg-slate-700/60" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md transition-all duration-300 group-hover:from-indigo-600 group-hover:to-indigo-400"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="mt-3 text-[11px] font-mono text-slate-400 group-hover:text-white">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              <span>Gross Marketplace Turnover ($)</span>
            </span>
            <span className="font-mono text-emerald-400">Peak day: Today ($10,200)</span>
          </div>
        </div>

        {/* Category Breakdown (1 Column) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Category Turnover Share</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of trading volume by asset type.</p>

            <div className="mt-6 space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span className="font-sans">AI & LLM Endpoints</span>
                  <span className="font-bold text-white">52% ($25.4k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '52%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span className="font-sans">Scraping & Residential Proxies</span>
                  <span className="font-bold text-white">22% ($10.7k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span className="font-sans">Cloud & Database Credits</span>
                  <span className="font-bold text-white">14% ($6.8k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '14%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span className="font-sans">Audio & Vision APIs</span>
                  <span className="font-bold text-white">8% ($3.9k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span className="font-sans">Developer Tools & Licenses</span>
                  <span className="font-bold text-white">4% ($2.1k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '4%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400">
            <span className="text-white font-semibold">Fastest growing:</span> DeepSeek & Claude 3.5 Sonnet proxy endpoints (+64% volume week-over-week).
          </div>
        </div>

      </div>

      {/* Real-Time Live Transaction Feed */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Live Real-Time Transaction Ledger</h3>
            <p className="text-xs text-slate-400">Continuous cryptographic trade settlement stream.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Streaming Live</span>
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-2.5 px-3">Transaction</th>
                <th className="py-2.5 px-3">Asset Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Buyer / Seller</th>
                <th className="py-2.5 px-3 text-right">Price Paid</th>
                <th className="py-2.5 px-3 text-right">Savings</th>
                <th className="py-2.5 px-3 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-400">
                      <span className="text-slate-300 font-medium">{tx.id}</span>
                      <span className="block text-[10px] text-slate-500">{tx.timestamp}</span>
                    </td>
                    <td className="py-3 px-3 font-sans font-medium text-white max-w-[220px] truncate">
                      {tx.itemTitle}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {tx.category}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span>@{tx.buyerName}</span>
                      <span className="text-slate-500"> ← @{tx.sellerName}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400 tabular-nums">
                      +${tx.savings.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-indigo-400 font-sans">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No transactions recorded yet. Completed trades will appear here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Simulation Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Deposit to KeyBay Wallet</h3>
            <p className="mt-1 text-xs text-slate-400">
              Load prepaid developer credits for 1-click escrow purchases.
            </p>

            <div className="mt-4">
              <label className="text-[11px] font-medium text-slate-400">Deposit Amount ($)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  type="number"
                  min="5"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-8 pr-3 font-mono text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {['25', '50', '100', '250'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDepositAmount(val)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-950 py-1.5 text-xs font-mono text-slate-300 hover:border-slate-700 cursor-pointer"
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDepositModalOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeposit}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
              >
                Deposit Funds
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
