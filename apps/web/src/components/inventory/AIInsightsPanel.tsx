"use client";

import { Brain, AlertTriangle, Clock, DollarSign, HelpCircle } from "lucide-react";

interface InsightItem {
  icon: typeof AlertTriangle;
  text: string;
  value: string;
  color: string;
  tooltip: string;
}

const insights: InsightItem[] = [
  {
    icon: AlertTriangle,
    text: "Predicted stockouts in 3 days",
    value: "12 items",
    color: "text-status-warning",
    tooltip: "Based on current sales velocity and stock levels"
  },
  {
    icon: Clock,
    text: "Batches at expiry risk this month",
    value: "8 batches",
    color: "text-status-danger",
    tooltip: "Flagged using FEFO analysis and sales patterns"
  },
  {
    icon: DollarSign,
    text: "Estimated wastage prevented",
    value: "₹18,200",
    color: "text-status-success",
    tooltip: "Savings from AI-driven reorder and expiry alerts"
  }
];

export default function AIInsightsPanel() {
  return (
    <div className="bg-primary-yellow/5 border-2 border-primary-yellow rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary-yellow/20 flex items-center justify-center">
          <Brain size={16} className="text-primary-yellow-dark" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm">AI Insights</h3>
          <p className="text-[10px] text-neutral-500">Real-time intelligence</p>
        </div>
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div 
              key={index} 
              className="flex items-center gap-2 p-2 bg-white rounded-xl border border-neutral-100 group relative"
            >
              <Icon size={14} className={insight.color} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-600 leading-tight">{insight.text}</p>
                <p className={`text-sm font-bold ${insight.color}`}>{insight.value}</p>
              </div>
              <div className="relative">
                <button className="p-0.5 text-neutral-400 hover:text-neutral-600">
                  <HelpCircle size={12} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 p-2 bg-neutral-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  {insight.tooltip}
                  <div className="absolute -top-1 right-2 w-2 h-2 bg-neutral-800 rotate-45" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-400 mt-2 text-center">
        Updated 5 minutes ago
      </p>
    </div>
  );
}
