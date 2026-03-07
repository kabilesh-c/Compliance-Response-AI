"use client";

import { ShoppingCart, Package, Users, Clock, DollarSign } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, subtext, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-neutral-900">{value}</div>
        <div className="text-sm text-neutral-600">{label}</div>
        {subtext && <div className="text-xs text-neutral-400">{subtext}</div>}
      </div>
    </div>
  );
}

export default function PharmacistMetricCards() {
  const metrics = [
    { icon: ShoppingCart, label: "Sales Today", value: "₹45.3K", subtext: "24 orders", color: "bg-primary-green" },
    { icon: Package, label: "Items Sold", value: "156", subtext: "Across 24 orders", color: "bg-primary-green/80" },
    { icon: Users, label: "Customers", value: "28", subtext: "Served today", color: "bg-primary-green/60" },
    { icon: Clock, label: "Avg. Time", value: "3.5 min", subtext: "Per transaction", color: "bg-primary-green/40" },
    { icon: DollarSign, label: "Cash Collected", value: "₹38.2K", subtext: "In drawer", color: "bg-primary-green/20" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}
