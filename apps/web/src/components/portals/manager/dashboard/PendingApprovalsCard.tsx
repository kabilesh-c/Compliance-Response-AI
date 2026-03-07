"use client";

import { useState } from "react";
import { AlertTriangle, Check, X, Eye, Clock, MessageSquare, Brain } from "lucide-react";

interface ApprovalItem {
  id: string;
  type: "sale" | "discount" | "override" | "stock";
  title: string;
  requestedBy: string;
  requestedAt: string;
  amount?: number;
  reason: string;
}

export default function PendingApprovalsCard() {
  const [approvals] = useState<ApprovalItem[]>([
    { 
      id: "1", 
      type: "discount", 
      title: "Bulk Discount Request", 
      requestedBy: "Pharmacist - John",
      requestedAt: "10 min ago",
      amount: 2500,
      reason: "Loyal customer - Hospital bulk order"
    },
    { 
      id: "2", 
      type: "override", 
      title: "Price Override", 
      requestedBy: "Pharmacist - Sarah",
      requestedAt: "25 min ago",
      amount: 450,
      reason: "System price mismatch with MRP"
    },
    { 
      id: "3", 
      type: "stock", 
      title: "Stock Adjustment", 
      requestedBy: "AI System",
      requestedAt: "1 hour ago",
      amount: undefined,
      reason: "Inventory reconciliation - 5 units short"
    },
  ]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "discount": return "bg-status-warning/10 text-status-warning";
      case "override": return "bg-status-danger/10 text-status-danger";
      case "stock": return "bg-primary-blue/10 text-primary-blue";
      case "sale": return "bg-status-success/10 text-status-success";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full border-l-4 border-l-status-danger">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">Pending Approvals</h3>
          <span className="px-2.5 py-1 bg-status-danger/10 text-status-danger rounded-full text-xs font-bold animate-pulse">
            {approvals.length} Urgent
          </span>
        </div>
        <button className="text-sm text-primary-yellow-dark hover:underline font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {approvals.map((approval) => (
          <div 
            key={approval.id}
            className="p-4 bg-neutral-50 rounded-button hover:bg-neutral-100 transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Type Badge */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyle(approval.type)}`}>
                <AlertTriangle size={18} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-neutral-900 text-sm">{approval.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getTypeStyle(approval.type)}`}>
                    {approval.type}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mb-2">{approval.reason}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {approval.requestedAt}
                  </span>
                  <span>By: {approval.requestedBy}</span>
                  {approval.amount && (
                    <span className="font-semibold text-neutral-700">₹{approval.amount.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-300 transition-colors" title="Explain">
                  <MessageSquare size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-status-success/20 flex items-center justify-center text-status-success hover:bg-status-success/30 transition-colors" title="Approve">
                  <Check size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-status-danger/20 flex items-center justify-center text-status-danger hover:bg-status-danger/30 transition-colors" title="Reject">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {approvals.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-success/10 flex items-center justify-center">
            <Check size={32} className="text-status-success" />
          </div>
          <p className="text-neutral-600">All approvals are up to date!</p>
        </div>
      )}
    </div>
  );
}
