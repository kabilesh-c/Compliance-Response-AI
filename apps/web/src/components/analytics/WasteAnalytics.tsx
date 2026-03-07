"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { wasteAnalytics } from "@/lib/mockData";
import { Trash2, AlertTriangle, Package, DollarSign } from "lucide-react";

export default function WasteAnalytics() {
  const data = useMemo(() => wasteAnalytics, []);

  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const totalItems = data.reduce((sum, d) => sum + d.count, 0);

  const COLORS = ["#EF4444", "#F59E0B", "#6366F1", "#8B5CF6"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-neutral-900">{item.reason}</p>
          <p className="text-sm text-neutral-600">{item.count} items</p>
          <p className="text-sm text-status-danger">Loss: ₹{item.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Waste Analysis</h3>
          <p className="text-sm text-neutral-500">Inventory losses by reason</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl text-sm font-medium bg-status-danger/10 text-status-danger">
          ₹{totalValue.toLocaleString()} total loss
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div 
              key={item.reason} 
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.reason}</p>
                  <p className="text-xs text-neutral-500">{item.count} items</p>
                </div>
              </div>
              <p className="font-semibold text-neutral-900">₹{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-status-danger/10 flex items-center justify-center mx-auto mb-2">
            <Trash2 size={18} className="text-status-danger" />
          </div>
          <p className="text-lg font-bold text-neutral-900">{totalItems}</p>
          <p className="text-xs text-neutral-500">Items Wasted</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-status-warning/10 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle size={18} className="text-status-warning" />
          </div>
          <p className="text-lg font-bold text-neutral-900">
            {data.find(d => d.reason === "Expired")?.count || 0}
          </p>
          <p className="text-xs text-neutral-500">Expired</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-status-info/10 flex items-center justify-center mx-auto mb-2">
            <Package size={18} className="text-status-info" />
          </div>
          <p className="text-lg font-bold text-neutral-900">
            {data.find(d => d.reason === "Damaged")?.count || 0}
          </p>
          <p className="text-xs text-neutral-500">Damaged</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-primary-yellow/30 flex items-center justify-center mx-auto mb-2">
            <DollarSign size={18} className="text-primary-yellow-dark" />
          </div>
          <p className="text-lg font-bold text-neutral-900">
            {((totalValue / 500000) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-neutral-500">of Total Stock</p>
        </div>
      </div>
    </div>
  );
}
