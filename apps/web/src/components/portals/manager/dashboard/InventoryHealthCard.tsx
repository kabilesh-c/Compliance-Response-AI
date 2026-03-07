"use client";

import { Package, AlertTriangle, Clock, TrendingDown, Brain, Sparkles } from "lucide-react";

export default function InventoryHealthCard() {
  const healthMetrics = {
    stockoutRisk: 12,
    fefoWarnings: 8,
    totalItems: 250,
    healthyStock: 215,
    criticalItems: 5,
  };

  const healthPercentage = (healthMetrics.healthyStock / healthMetrics.totalItems) * 100;

  return (
    <div className="bg-dark-card rounded-card shadow-card p-6 text-white h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Inventory Health</h3>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-yellow/20 text-primary-yellow rounded-full text-xs font-bold">
          <Brain size={12} />
          AI Monitored
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Health Indicator */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={healthPercentage >= 80 ? "#4ADE80" : healthPercentage >= 60 ? "#FBBF24" : "#FF3D3D"}
              strokeWidth="8"
              strokeDasharray={`${(healthPercentage / 100) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{healthPercentage.toFixed(0)}%</span>
            <span className="text-xs text-neutral-400">Health</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-10 h-10 rounded-full bg-status-danger/20 flex items-center justify-center">
              <AlertTriangle size={18} className="text-status-danger" />
            </div>
            <div>
              <div className="text-xl font-bold">{healthMetrics.stockoutRisk}</div>
              <div className="text-xs text-neutral-400">Stockout Risk Items</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-10 h-10 rounded-full bg-status-warning/20 flex items-center justify-center">
              <Clock size={18} className="text-status-warning" />
            </div>
            <div>
              <div className="text-xl font-bold">{healthMetrics.fefoWarnings}</div>
              <div className="text-xs text-neutral-400">FEFO Warnings</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-10 h-10 rounded-full bg-primary-yellow/20 flex items-center justify-center">
              <TrendingDown size={18} className="text-primary-yellow" />
            </div>
            <div>
              <div className="text-xl font-bold">{healthMetrics.criticalItems}</div>
              <div className="text-xs text-neutral-400">Critical Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Sparkles size={12} className="text-primary-yellow" />
          <span>AI predicts 3 items at risk of stockout within 48 hours</span>
        </div>
      </div>
    </div>
  );
}
