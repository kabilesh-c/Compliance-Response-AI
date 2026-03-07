"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

const reorderMissesData = [
  { month: "Jan", missed: 8, prevented: 12, lostSales: 15000 },
  { month: "Feb", missed: 5, prevented: 15, lostSales: 9000 },
  { month: "Mar", missed: 3, prevented: 18, lostSales: 5500 },
  { month: "Apr", missed: 2, prevented: 20, lostSales: 3800 },
  { month: "May", missed: 4, prevented: 17, lostSales: 7200 },
  { month: "Jun", missed: 1, prevented: 22, lostSales: 2100 },
];

const wastageBreakdown = [
  { category: "Expiry (Preventable)", value: 45000, color: "#F97316", preventable: true },
  { category: "Expiry (Unavoidable)", value: 12000, color: "#94A3B8", preventable: false },
  { category: "Damage", value: 8000, color: "#64748B", preventable: false },
  { category: "Returns", value: 5000, color: "#CBD5E1", preventable: false },
];

interface AIInsightsChartsProps {
  dateRange: string;
}

export default function AIInsightsCharts({ dateRange }: AIInsightsChartsProps) {
  const totalWastage = wastageBreakdown.reduce((sum, item) => sum + item.value, 0);
  const preventableWastage = wastageBreakdown.filter(w => w.preventable).reduce((sum, item) => sum + item.value, 0);
  const preventablePercent = Math.round((preventableWastage / totalWastage) * 100);

  return (
    <div className="space-y-6">
      {/* Reorder Misses vs Prevented */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-neutral-900">Reorder Misses vs. AI Prevented</h3>
            <p className="text-sm text-neutral-500">How AI reduced stockouts over time</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-danger" />
              <span className="text-neutral-600">Missed (Lost Sales)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-success" />
              <span className="text-neutral-600">AI Prevented</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reorderMissesData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value, name) => [
                  name === "missed" ? `${value} stockouts (₹${reorderMissesData.find(d => d.missed === value)?.lostSales?.toLocaleString()} lost)` : `${value} prevented`,
                  name === "missed" ? "Missed" : "AI Prevented"
                ]}
              />
              <Bar dataKey="missed" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prevented" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Impact Summary */}
        <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-status-success font-bold">
              <TrendingDown size={14} />
              87%
            </div>
            <p className="text-xs text-neutral-500">Reduction in misses</p>
          </div>
          <div className="text-center">
            <div className="font-bold text-status-success">₹38,400</div>
            <p className="text-xs text-neutral-500">Lost sales prevented</p>
          </div>
          <div className="text-center">
            <div className="font-bold text-neutral-900">104</div>
            <p className="text-xs text-neutral-500">AI interventions</p>
          </div>
        </div>
      </div>

      {/* Wastage Breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-neutral-900">Wastage Breakdown by Cause</h3>
            <p className="text-sm text-neutral-500">Identifying preventable wastage</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-status-warning/10 rounded-full">
            <AlertTriangle size={14} className="text-status-warning" />
            <span className="text-sm font-medium text-status-warning">{preventablePercent}% Preventable</span>
          </div>
        </div>

        <div className="space-y-3">
          {wastageBreakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-40 text-sm text-neutral-600 flex items-center gap-2">
                {item.category}
                {item.preventable && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-status-warning/10 text-status-warning rounded">
                    PREVENTABLE
                  </span>
                )}
              </div>
              <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(item.value / totalWastage) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="w-24 text-right text-sm font-medium text-neutral-900">
                ₹{item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 p-4 bg-primary-yellow/10 rounded-xl border border-primary-yellow/30">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-primary-yellow-dark mt-0.5" />
            <div>
              <p className="text-sm font-medium text-neutral-900">AI Recommendation</p>
              <p className="text-xs text-neutral-600 mt-1">
                Enable FEFO enforcement and automated discount triggers for slow-moving items 
                to reduce preventable expiry wastage by an estimated 60%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
