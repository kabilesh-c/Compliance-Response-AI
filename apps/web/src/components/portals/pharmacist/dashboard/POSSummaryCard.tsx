"use client";

import { ShoppingCart, Clock, CheckCircle, DollarSign, TrendingUp, Users } from "lucide-react";

export default function POSSummaryCard() {
  const summary = {
    ordersHandled: 24,
    pendingOrders: 3,
    totalSales: 45320,
    averageOrderValue: 1888,
    customersServed: 28,
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">POS Summary</h3>
        <span className="text-xs text-neutral-500">Today's Stats</span>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-primary-green/10 rounded-button">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-green/20 flex items-center justify-center">
              <CheckCircle size={16} className="text-primary-green" />
            </div>
            <span className="text-xs text-neutral-600">Orders Handled</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{summary.ordersHandled}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-status-success" />
            <span className="text-xs text-status-success">+5 from yesterday</span>
          </div>
        </div>

        <div className="p-4 bg-status-warning/10 rounded-button">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-status-warning/20 flex items-center justify-center">
              <Clock size={16} className="text-status-warning" />
            </div>
            <span className="text-xs text-neutral-600">Pending Orders</span>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{summary.pendingOrders}</div>
          <div className="text-xs text-neutral-500 mt-1">Awaiting completion</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-button">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
              <DollarSign size={18} className="text-primary-green" />
            </div>
            <div>
              <div className="text-sm text-neutral-600">Total Sales</div>
              <div className="text-lg font-bold text-neutral-900">₹{summary.totalSales.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-status-success">
              <TrendingUp size={14} />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-button">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
              <ShoppingCart size={18} className="text-primary-green" />
            </div>
            <div>
              <div className="text-sm text-neutral-600">Avg. Order Value</div>
              <div className="text-lg font-bold text-neutral-900">₹{summary.averageOrderValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-button">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
              <Users size={18} className="text-primary-green" />
            </div>
            <div>
              <div className="text-sm text-neutral-600">Customers Served</div>
              <div className="text-lg font-bold text-neutral-900">{summary.customersServed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button className="w-full mt-6 py-3 bg-primary-green text-white rounded-button font-medium hover:bg-primary-green-dark transition-colors flex items-center justify-center gap-2">
        <ShoppingCart size={18} />
        Open POS
      </button>
    </div>
  );
}
