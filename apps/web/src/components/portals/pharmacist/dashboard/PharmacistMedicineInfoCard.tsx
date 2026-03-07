"use client";

import { Brain, Sparkles } from "lucide-react";

export default function PharmacistMedicineInfoCard() {
  return (
    <div className="bg-dark-card rounded-card shadow-card p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Medicine Info</h3>
        <span className="group relative flex items-center gap-1 px-2 py-1 bg-primary-green/20 text-primary-green rounded-full text-xs font-bold cursor-help">
          <Brain size={12} />
          AI-Powered
          <span className="absolute right-0 top-full mt-1 px-2 py-1.5 text-xs bg-neutral-800 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
            AI predicts stock needs based on demand trends
          </span>
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 rounded-full bg-dark-card-light flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-3xl font-bold">250</div>
            <div className="text-xs text-neutral-400">Total</div>
          </div>
          {/* AI Prediction Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-green/30 animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-status-success"></div>
            <span className="text-sm">Available: <span className="font-bold">180</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-status-warning"></div>
            <span className="text-sm">Low stock: <span className="font-bold">50</span></span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-status-warning/20 text-status-warning rounded">
              3 CRITICAL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-status-danger"></div>
            <span className="text-sm">Out of stock: <span className="font-bold">20</span></span>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Sparkles size={10} className="text-primary-green" />
              <span>AI: Predict 5 items need reorder this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
