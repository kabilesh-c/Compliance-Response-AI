"use client";

import { TrendingUp, DollarSign, Shield, Sparkles, AlertTriangle } from "lucide-react";

export default function FinancialIntelligenceCard() {
  const metrics = {
    wastagePrevented: 125000,
    revenueRecovered: 89000,
    aiROI: 312,
    potentialSavings: 45000,
  };

  return (
    <div className="bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-card shadow-card p-6 text-white h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Financial Intelligence</h3>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
          <Sparkles size={12} />
          AI Insights
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Wastage Prevented */}
        <div className="bg-white/10 backdrop-blur-sm rounded-button p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-status-success/30 flex items-center justify-center">
              <Shield size={16} className="text-status-success-light" />
            </div>
            <span className="text-xs text-white/70">Wastage Prevented</span>
          </div>
          <div className="text-2xl font-bold">₹{(metrics.wastagePrevented / 1000).toFixed(0)}K</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-status-success" />
            <span className="text-xs text-status-success">+18% vs last month</span>
          </div>
        </div>

        {/* Revenue Recovered */}
        <div className="bg-white/10 backdrop-blur-sm rounded-button p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-blue-light/30 flex items-center justify-center">
              <DollarSign size={16} className="text-primary-blue-light" />
            </div>
            <span className="text-xs text-white/70">Revenue Recovered</span>
          </div>
          <div className="text-2xl font-bold">₹{(metrics.revenueRecovered / 1000).toFixed(0)}K</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-status-success" />
            <span className="text-xs text-status-success">+12% vs last month</span>
          </div>
        </div>

        {/* AI ROI */}
        <div className="bg-white/10 backdrop-blur-sm rounded-button p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-status-warning/30 flex items-center justify-center">
              <Sparkles size={16} className="text-status-warning" />
            </div>
            <span className="text-xs text-white/70">AI ROI</span>
          </div>
          <div className="text-2xl font-bold">{metrics.aiROI}%</div>
          <div className="text-xs text-white/60 mt-1">Return on AI investment</div>
        </div>

        {/* Potential Savings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-button p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-status-danger/30 flex items-center justify-center">
              <AlertTriangle size={16} className="text-status-danger-light" />
            </div>
            <span className="text-xs text-white/70">Potential Savings</span>
          </div>
          <div className="text-2xl font-bold">₹{(metrics.potentialSavings / 1000).toFixed(0)}K</div>
          <div className="text-xs text-white/60 mt-1">Actionable opportunities</div>
        </div>
      </div>
    </div>
  );
}
