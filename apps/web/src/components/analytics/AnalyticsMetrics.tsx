"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: typeof DollarSign;
  iconColor: string;
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, iconColor }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-status-success" : "text-status-danger"}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-neutral-900 mb-1">{value}</p>
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="text-xs text-neutral-400 mt-1">{changeLabel}</p>
    </div>
  );
}

export default function AnalyticsMetrics() {
  const metrics: MetricCardProps[] = [
    {
      title: "Total Revenue",
      value: "₹4,52,780",
      change: 12.5,
      changeLabel: "vs last week",
      icon: DollarSign,
      iconColor: "bg-status-success/10 text-status-success"
    },
    {
      title: "Total Orders",
      value: "328",
      change: 8.3,
      changeLabel: "vs last week",
      icon: ShoppingCart,
      iconColor: "bg-status-info/10 text-status-info"
    },
    {
      title: "Items Sold",
      value: "1,847",
      change: -2.1,
      changeLabel: "vs last week",
      icon: Package,
      iconColor: "bg-status-warning/10 text-status-warning"
    },
    {
      title: "Unique Customers",
      value: "156",
      change: 15.7,
      changeLabel: "vs last week",
      icon: Users,
      iconColor: "bg-primary-yellow/30 text-primary-yellow-dark"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
