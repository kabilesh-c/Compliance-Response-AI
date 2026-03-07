"use client";

import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  trend?: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, subtext, trend, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="text-2xl font-bold text-neutral-900">{value}</div>
        <div className="text-sm text-neutral-600">{label}</div>
        {subtext && <div className="text-xs text-neutral-400">{subtext}</div>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-status-success">
          <TrendingUp size={14} />
          <span className="text-sm font-medium">{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function ManagerMetricCards() {
  const metrics = [
    { icon: DollarSign, label: "Today's Revenue", value: "₹1.2L", subtext: "45 orders", trend: "+15%", color: "bg-primary-yellow-dark" },
    { icon: ShoppingCart, label: "Pending Orders", value: "8", subtext: "3 urgent", color: "bg-status-warning" },
    { icon: Package, label: "Low Stock Items", value: "12", subtext: "5 critical", color: "bg-status-danger" },
    { icon: AlertTriangle, label: "Expiring Soon", value: "23", subtext: "This month", color: "bg-purple-500" },
    { icon: TrendingUp, label: "AI Actions", value: "34", subtext: "Today", trend: "+8", color: "bg-status-success" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}
