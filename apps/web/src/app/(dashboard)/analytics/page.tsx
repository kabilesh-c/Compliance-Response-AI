"use client";

import { useState } from "react";
import { Calendar, Download, RefreshCw, Brain, BarChart3 } from "lucide-react";
import AnalyticsMetrics from "@/components/analytics/AnalyticsMetrics";
import SalesChart from "@/components/analytics/SalesChart";
import StockMovementChart from "@/components/analytics/StockMovementChart";
import WasteAnalytics from "@/components/analytics/WasteAnalytics";
import WhatIfSimulator from "@/components/analytics/WhatIfSimulator";
import AIInsightsCharts from "@/components/analytics/AIInsightsCharts";
import { useAuthStore } from "@/stores/authStore";

type DateRange = "7d" | "30d" | "90d" | "1y";
type ViewMode = "normal" | "ai";

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuthStore();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Only Admin and Manager can access this page (enforced by Sidebar)
  const canExport = user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics & Reports</h1>
          <p className="text-neutral-500">Track sales, inventory movement, and waste metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("normal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "normal"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <BarChart3 size={16} />
              Normal
            </button>
            <button
              onClick={() => setViewMode("ai")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "ai"
                  ? "bg-primary-yellow text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Brain size={16} />
              AI Insights
            </button>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2">
            <Calendar size={18} className="text-neutral-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium text-neutral-700"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>

          {canExport && (
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-yellow text-neutral-900 rounded-xl font-medium hover:bg-primary-yellow-dark transition-colors">
              <Download size={18} />
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      <AnalyticsMetrics />

      {/* View Mode Content */}
      {viewMode === "normal" ? (
        <>
          {/* Normal View - Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <SalesChart dateRange={dateRange} />
            </div>
            <StockMovementChart dateRange={dateRange} />
            <WasteAnalytics />
          </div>

          {/* Quick Insights */}
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-white/70 mb-1">Top Selling Category</p>
                <p className="font-semibold">Painkillers</p>
                <p className="text-xs text-white/50 mt-1">32% of total sales</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-white/70 mb-1">Peak Hours</p>
                <p className="font-semibold">10 AM - 1 PM</p>
                <p className="text-xs text-white/50 mt-1">45% of daily orders</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-white/70 mb-1">Recommended Restock</p>
                <p className="font-semibold">Paracetamol 500mg</p>
                <p className="text-xs text-white/50 mt-1">Expected stockout in 3 days</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* AI Insights View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIInsightsCharts dateRange={dateRange} />
            </div>
            <div className="space-y-6">
              <WhatIfSimulator />
            </div>
          </div>

          {/* AI Summary Banner */}
          <div className="bg-gradient-to-r from-primary-yellow/20 to-primary-yellow/10 rounded-2xl p-6 border border-primary-yellow/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-yellow rounded-xl flex items-center justify-center">
                <Brain size={24} className="text-neutral-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900">AI Performance Summary</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  This month, AI-powered features have prevented <span className="font-bold text-status-success">₹45,200</span> in potential losses 
                  through demand forecasting and FEFO enforcement. Stockout incidents reduced by <span className="font-bold text-status-success">87%</span> compared to last quarter.
                </p>
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">₹1.2L</p>
                    <p className="text-xs text-neutral-500">Total savings YTD</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">2,340</p>
                    <p className="text-xs text-neutral-500">AI decisions made</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">94%</p>
                    <p className="text-xs text-neutral-500">Accuracy rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
