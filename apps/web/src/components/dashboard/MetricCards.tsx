"use client";

import { DollarSign, CreditCard, Percent, AlertCircle, RefreshCcw } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-neutral-900">{value}</div>
        <div className="text-sm text-neutral-600">{label}</div>
      </div>
    </div>
  );
}

export default function MetricCards() {
  const metrics = [
    { icon: DollarSign, label: "Invoices", value: "₹45,320", color: "bg-blue-500" },
    { icon: CreditCard, label: "Paid", value: "₹38,200", color: "bg-status-success" },
    { icon: Percent, label: "Discount", value: "₹2,500", color: "bg-status-warning" },
    { icon: AlertCircle, label: "Dues", value: "₹4,620", color: "bg-status-danger" },
    { icon: RefreshCcw, label: "Refund", value: "₹1,800", color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}
