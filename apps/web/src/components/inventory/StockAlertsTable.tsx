"use client";

import { useMemo } from "react";
import { AlertTriangle, TrendingDown, Package, ShoppingCart, ArrowUpRight } from "lucide-react";
import { getStockAlerts, Medicine } from "@/lib/mockData";

export default function StockAlertsTable() {
  const stockAlerts = useMemo(() => getStockAlerts(), []);

  const lowStockItems = stockAlerts.filter(m => m.stockStatus === "low-stock");
  const outOfStockItems = stockAlerts.filter(m => m.stockStatus === "out-of-stock");

  const getUrgencyLevel = (medicine: Medicine) => {
    if (medicine.quantity === 0) return "critical";
    if (medicine.quantity <= medicine.minStockLevel / 2) return "high";
    return "medium";
  };

  const UrgencyBadge = ({ level }: { level: "critical" | "high" | "medium" }) => {
    const styles = {
      critical: "bg-status-danger text-white",
      high: "bg-status-warning text-neutral-900",
      medium: "bg-status-info text-white"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-status-danger/5 border border-status-danger/20 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-status-danger/10 flex items-center justify-center">
                <Package size={24} className="text-status-danger" />
              </div>
              <div>
                <p className="text-3xl font-bold text-status-danger">{outOfStockItems.length}</p>
                <p className="text-sm text-neutral-600">Out of Stock</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-status-danger text-white rounded-xl font-medium text-sm hover:bg-status-danger/90 transition-colors flex items-center gap-2">
              Order Now <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        <div className="bg-status-warning/5 border border-status-warning/20 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-status-warning/10 flex items-center justify-center">
                <TrendingDown size={24} className="text-status-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold text-status-warning">{lowStockItems.length}</p>
                <p className="text-sm text-neutral-600">Low Stock</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-status-warning text-neutral-900 rounded-xl font-medium text-sm hover:bg-status-warning/90 transition-colors flex items-center gap-2">
              Reorder <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Out of Stock Items */}
      {outOfStockItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 bg-status-danger/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-status-danger" />
                <h3 className="font-semibold text-neutral-900">Out of Stock - Immediate Action Required</h3>
              </div>
              <button className="text-sm text-status-danger font-medium hover:underline">
                Generate Purchase Order
              </button>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {outOfStockItems.map((medicine) => (
              <div key={medicine.id} className="px-5 py-4 flex items-center justify-between hover:bg-neutral-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center">
                    <Package size={18} className="text-status-danger" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{medicine.name}</p>
                    <p className="text-sm text-neutral-500">{medicine.manufacturer} • {medicine.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-neutral-500">Min Level</p>
                    <p className="font-medium text-neutral-900">{medicine.minStockLevel} {medicine.unit}</p>
                  </div>
                  <UrgencyBadge level="critical" />
                  <button className="p-2 rounded-lg bg-primary-yellow text-neutral-900 hover:bg-primary-yellow-dark transition-colors">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-status-warning" />
                <h3 className="font-semibold text-neutral-900">Low Stock - Reorder Recommended</h3>
              </div>
              <button className="text-sm text-primary-yellow-dark font-medium hover:underline">
                Auto-Reorder Settings
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Medicine</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Current Stock</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Min Level</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Suggested Order</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Urgency</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {lowStockItems.map((medicine) => {
                  const suggestedOrder = Math.max(medicine.minStockLevel * 3 - medicine.quantity, medicine.minStockLevel);
                  const urgency = getUrgencyLevel(medicine);
                  return (
                    <tr key={medicine.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-neutral-900">{medicine.name}</p>
                        <p className="text-sm text-neutral-500">{medicine.manufacturer}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-status-warning font-medium">
                          {medicine.quantity} {medicine.unit}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-neutral-600">
                        {medicine.minStockLevel} {medicine.unit}
                      </td>
                      <td className="px-5 py-4 font-medium text-neutral-900">
                        {suggestedOrder} {medicine.unit}
                      </td>
                      <td className="px-5 py-4">
                        <UrgencyBadge level={urgency} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="px-3 py-1.5 bg-primary-yellow text-neutral-900 rounded-lg font-medium text-sm hover:bg-primary-yellow-dark transition-colors">
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stockAlerts.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-status-success" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">All Stock Levels Healthy</h3>
          <p className="text-neutral-500">No items require immediate attention</p>
        </div>
      )}
    </div>
  );
}
