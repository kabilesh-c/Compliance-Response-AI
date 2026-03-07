"use client";

import { BarChart3, TrendingUp, Activity, Package, AlertTriangle, Download } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function ManagerAnalyticsPage() {
  const { mode } = useAuthStore();

  if (mode === "HOSPITAL") {
    return <HospitalAnalytics />;
  }

  return <RetailAnalytics />;
}

function HospitalAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Operational Analytics</h1>
          <p className="text-neutral-500">Consumption, wastage, and stock turnover reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg text-sm font-medium hover:bg-primary-blue-dark transition-colors">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Stock Turnover", value: "4.2x", change: "+0.5x", icon: Activity, color: "bg-blue-500" },
          { label: "Wastage Rate", value: "1.2%", change: "-0.3%", icon: AlertTriangle, color: "bg-red-500" },
          { label: "Items Dispensed", value: "12,450", change: "+8%", icon: Package, color: "bg-green-500" },
          { label: "Avg Lead Time", value: "3.5 Days", change: "-0.5", icon: TrendingUp, color: "bg-purple-500" },
        ].map((metric, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                <metric.icon size={24} className="text-white" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                metric.change.startsWith("+") || metric.change.startsWith("-") && metric.label === "Wastage Rate" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{metric.value}</div>
            <div className="text-sm text-neutral-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-80 flex flex-col items-center justify-center text-neutral-400">
          <BarChart3 size={48} className="mb-4 opacity-20" />
          <p>Department-wise Consumption (Chart)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-80 flex flex-col items-center justify-center text-neutral-400">
          <Activity size={48} className="mb-4 opacity-20" />
          <p>Expiry & Wastage Analysis (Chart)</p>
        </div>
      </div>
    </div>
  );
}

function RetailAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Retail Analytics</h1>
      <div className="bg-white p-8 rounded-2xl text-center text-neutral-500">
        Retail Analytics Content Placeholder
      </div>
    </div>
  );
}
