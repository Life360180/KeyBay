import { useState } from 'react';
import { X, Play, Terminal, CheckCircle2, Server, ShieldCheck, Zap } from 'lucide-react';
import { ProductListing } from '../types';

interface KeyTestRunnerModalProps {
  product: ProductListing;
  onClose: () => void;
}

export default function KeyTestRunnerModal({
  product,
  onClose,
}: KeyTestRunnerModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<{
    status: number;
    latency: number;
    responseBody: string;
    quotaStatus: string;
  } | null>(null);

  const handleRunPing = () => {
    setIsRunning(true);
    setTestOutput(null);

    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 80) + 95;
      setIsRunning(false);
      setTestOutput({
        status: 200,
        latency: simulatedLatency,
        responseBody: JSON.stringify({
          object: 'list',
          data: [{ id: 'model-verified', permission: [{ allow_create_engine: true }] }],
          quota_verified: true,
          rate_limit_rpm: product.rateLimit,
          escrow_inspection_status: 'PASS',
        }, null, 2),
        quotaStatus: 'Verified Active & Unrevoked',
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Automated Key Ping & Sandbox Inspector</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Product meta */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">{product.title}</span>
            <span className="text-indigo-400 font-mono">{product.categoryLabel}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Rate: {product.rateLimit}</span>
            <span aria-hidden="true">·</span>
            <span>Quota: {product.quotaOrDuration}</span>
          </div>
        </div>

        {/* Terminal Run Box */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Terminal Probe Execution</span>
            <button
              onClick={handleRunPing}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              <Play className="h-3 w-3" />
              <span>{isRunning ? 'Sending Ping...' : 'Execute Test Ping'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs">
            <div className="text-slate-500 select-none">$ executing escrow test request...</div>
            <div className="text-indigo-300 truncate mt-1">
              {product.curlSnippet.replace('$KEY', 'sk-verified-escrow-token')}
            </div>

            {isRunning && (
              <div className="mt-3 flex items-center gap-2 text-amber-400 text-xs">
                <span className="animate-spin">⏳</span>
                <span>Connecting to provider cluster and verifying token signature...</span>
              </div>
            )}

            {testOutput && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>HTTP {testOutput.status} OK</span>
                  <span>Latency: {testOutput.latency}ms</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Status: <strong className="text-emerald-400">{testOutput.quotaStatus}</strong>
                </div>
                <pre className="mt-2 text-[11px] text-slate-400 overflow-x-auto bg-slate-900 p-2 rounded">
                  {testOutput.responseBody}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-950/30 p-2.5 text-[11px] text-emerald-300 border border-emerald-900/40">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Every transaction on KeyBay includes 24 hours of automated validity dispute escrow.</span>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
