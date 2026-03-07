"use client";

import { ShoppingCart, Package, Scan, FileText, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  icon: typeof ShoppingCart;
  label: string;
  description: string;
  href: string;
  color: string;
}

export default function QuickActionsCard() {
  const actions: QuickAction[] = [
    { 
      icon: ShoppingCart, 
      label: "New Sale", 
      description: "Start a new POS transaction",
      href: "/pharmacist/pos",
      color: "bg-primary-green"
    },
    { 
      icon: Package, 
      label: "Check Stock", 
      description: "View inventory levels",
      href: "/pharmacist/inventory",
      color: "bg-primary-green/80"
    },
    { 
      icon: Scan, 
      label: "Scan Barcode", 
      description: "Quick medicine lookup",
      href: "/pharmacist/pos",
      color: "bg-primary-green/60"
    },
    { 
      icon: FileText, 
      label: "View Orders", 
      description: "See pending orders",
      href: "/pharmacist/pos",
      color: "bg-primary-green/40"
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-card shadow-card p-6 text-white h-full border-t-4 border-primary-green">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <Clock size={16} className="text-neutral-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="p-4 bg-dark-card-light rounded-button hover:bg-neutral-700 transition-all group"
          >
            <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-3`}>
              <action.icon size={18} className="text-white" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">{action.label}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">{action.description}</p>
              </div>
              <ArrowRight size={16} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-neutral-400 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {[
            { action: "Sale completed", time: "2 min ago", amount: "₹1,250" },
            { action: "Stock checked", time: "15 min ago", amount: null },
            { action: "Sale completed", time: "28 min ago", amount: "₹3,480" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-green" />
                <span className="text-neutral-300">{item.action}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                {item.amount && <span className="text-primary-green font-medium">{item.amount}</span>}
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
