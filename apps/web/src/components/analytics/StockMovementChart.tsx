"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { stockMovementData } from "@/lib/mockData";

interface StockMovementChartProps {
  dateRange: string;
}

export default function StockMovementChart({ dateRange }: StockMovementChartProps) {
  const data = useMemo(() => stockMovementData, []);

  const totalIn = data.reduce((sum, d) => sum + d.stockIn, 0);
  const totalOut = data.reduce((sum, d) => sum + d.stockOut, 0);
  const netMovement = totalIn - totalOut;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-neutral-900">{label}</p>
          <p className="text-sm text-status-success">Stock In: {payload[0].value} units</p>
          <p className="text-sm text-status-danger">Stock Out: {payload[1].value} units</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Stock Movement</h3>
          <p className="text-sm text-neutral-500">Inventory in vs out</p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
          netMovement >= 0 
            ? "bg-status-success/10 text-status-success" 
            : "bg-status-danger/10 text-status-danger"
        }`}>
          Net: {netMovement >= 0 ? "+" : ""}{netMovement} units
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span className="text-sm text-neutral-600">{value}</span>}
            />
            <Bar dataKey="stockIn" name="Stock In" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="stockOut" name="Stock Out" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-status-success" />
          <div>
            <p className="text-sm text-neutral-500">Total In</p>
            <p className="text-lg font-bold text-neutral-900">{totalIn} units</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-status-danger" />
          <div>
            <p className="text-sm text-neutral-500">Total Out</p>
            <p className="text-lg font-bold text-neutral-900">{totalOut} units</p>
          </div>
        </div>
      </div>
    </div>
  );
}
