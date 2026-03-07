"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { salesData } from "@/lib/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SalesChartProps {
  dateRange: string;
}

export default function SalesChart({ dateRange }: SalesChartProps) {
  const data = useMemo(() => salesData, []);

  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalSales / totalOrders;

  // Calculate trend (comparing last 3 days to first 4 days)
  const recentAvg = data.slice(-3).reduce((sum, d) => sum + d.sales, 0) / 3;
  const previousAvg = data.slice(0, 4).reduce((sum, d) => sum + d.sales, 0) / 4;
  const trend = ((recentAvg - previousAvg) / previousAvg) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-neutral-900">{label}</p>
          <p className="text-sm text-status-success">Sales: ₹{payload[0].value.toLocaleString()}</p>
          <p className="text-sm text-neutral-500">Orders: {payload[0].payload.orders}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Sales Overview</h3>
          <p className="text-sm text-neutral-500">Daily sales performance</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neutral-900">₹{totalSales.toLocaleString()}</p>
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? "text-status-success" : "text-status-danger"}`}>
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend).toFixed(1)}% vs previous
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFDE4D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FFDE4D" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `₹${(value / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#FFDE4D" 
              strokeWidth={3}
              fill="url(#salesGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
        <div>
          <p className="text-sm text-neutral-500">Total Orders</p>
          <p className="text-xl font-bold text-neutral-900">{totalOrders}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Avg Order Value</p>
          <p className="text-xl font-bold text-neutral-900">₹{avgOrderValue.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Best Day</p>
          <p className="text-xl font-bold text-neutral-900">
            {data.reduce((max, d) => d.sales > max.sales ? d : max).date}
          </p>
        </div>
      </div>
    </div>
  );
}
