import { ShieldCheck, Zap, Server, KeyRound, ExternalLink, ArrowRight } from 'lucide-react';
import { ProductListing } from '../types';

interface ProductCardProps {
  product: ProductListing;
  onBuy: (product: ProductListing) => void;
  onQuickView: (product: ProductListing) => void;
}

export default function ProductCard({ product, onBuy, onQuickView }: ProductCardProps) {
  const savingsAmount = (product.originalPrice - product.askingPrice).toFixed(2);

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-indigo-950/20">
      
      {/* Top row: Category & Key Type (Unboxed text with middot separator - Zero-Pill rule) */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-indigo-400">{product.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{product.keyType}</span>
          </div>
          <span className="font-mono text-emerald-400 font-medium">
            {product.discountPercent}% OFF
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
          {product.title}
        </h3>

        {/* Quota & Description */}
        <div className="mt-2 text-xs font-medium text-slate-300 flex items-center gap-2">
          <Server className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{product.quotaOrDuration}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400 truncate">{product.rateLimit}</span>
        </div>

        <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Seller Info & Trust Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-slate-300">@{product.seller.username}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-medium">{product.seller.rating}★</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{product.seller.completedSales} sales</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            <span>Pinged {product.lastPingTime}</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-bold tracking-tight text-white tabular-nums">
              ${product.askingPrice.toFixed(2)}
            </span>
            <span className="font-mono text-xs text-slate-500 line-through tabular-nums">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium">
            Save ${savingsAmount} vs direct
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onQuickView(product)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white cursor-pointer"
            title="Inspect key parameters & test payload"
          >
            Inspect
          </button>
          <button
            onClick={() => onBuy(product)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] cursor-pointer"
          >
            <span>Buy Key</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

    </article>
  );
}
