"use client";

import { DollarSign, ShoppingCart, TrendingUp, AlertCircle, Users, Package, Activity } from "lucide-react";

export default function RetailManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Retail Manager Dashboard</h1>
        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Store Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SALES CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">$3,150</div>
          <div className="text-sm text-neutral-500">Daily Sales</div>
        </div>

        {/* ORDERS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart size={20} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">84</div>
          <div className="text-sm text-neutral-500">Orders Today</div>
        </div>

        {/* PROFIT CARD */}
        <div className="bg-primary-yellow p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 text-neutral-900 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900">$840</div>
          <div className="text-sm text-neutral-800">Net Profit</div>
        </div>

        {/* ALERTS CARD */}
        <div className="bg-[#2A2D3A] text-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">Urgent</span>
          </div>
          <div className="text-3xl font-bold">3</div>
          <div className="text-sm text-neutral-400">Stock Alerts</div>
        </div>
      </div>
    </div>
  );
}
