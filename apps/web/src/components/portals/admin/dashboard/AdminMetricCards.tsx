"use client";

import { Users, Store, FileText, Shield, Activity } from "lucide-react";
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

export default function AdminMetricCards() {
  const metrics = [
    { icon: Users, label: "Total Users", value: "48", subtext: "12 active now", color: "bg-primary-blue" },
    { icon: Store, label: "Stores", value: "4", subtext: "All operational", color: "bg-primary-blue/80" },
    { icon: FileText, label: "Audit Logs", value: "1,284", subtext: "This month", color: "bg-primary-blue/60" },
    { icon: Shield, label: "Security Score", value: "94%", subtext: "Excellent", color: "bg-primary-blue/40" },
    { icon: Activity, label: "AI Actions", value: "156", subtext: "Today", color: "bg-primary-blue-dark" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  );
}
