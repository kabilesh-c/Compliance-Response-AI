"use client";

import { useState } from "react";
import { AlertTriangle, Check, X, Eye, Clock, Package, DollarSign, Brain } from "lucide-react";

interface ApprovalItem {
  id: string;
  type: "reorder" | "return" | "transfer" | "override";
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  riskLevel: "low" | "medium" | "high";
  amount?: number;
  aiConfidence?: number;
}

export default function ApprovalQueueCard() {
  const [items] = useState<ApprovalItem[]>([
    {
      id: "1",
      type: "reorder",
      title: "Emergency Reorder: Paracetamol 500mg",
      description: "AI detected critical low stock. Supplier lead time: 3 days",
      requestedBy: "AI System",
      requestedAt: "2 hours ago",
      riskLevel: "high",
      amount: 15000,
      aiConfidence: 94,
    },
    {
      id: "2",
      type: "return",
      title: "Return Request: Expired Antibiotics",
      description: "12 units of Amoxicillin 250mg expiring in 7 days",
      requestedBy: "Manager - Branch A",
      requestedAt: "4 hours ago",
      riskLevel: "medium",
      amount: 3200,
      aiConfidence: 88,
    },
    {
      id: "3",
      type: "override",
      title: "Price Override Request",
      description: "Discount approval for bulk hospital order",
      requestedBy: "Manager - Branch B",
      requestedAt: "1 day ago",
      riskLevel: "low",
      amount: 8500,
    },
  ]);

  const getRiskStyles = (risk: string) => {
    switch (risk) {
      case "high": return "bg-status-danger/10 text-status-danger border-status-danger/20";
      case "medium": return "bg-status-warning/10 text-status-warning border-status-warning/20";
      case "low": return "bg-status-success/10 text-status-success border-status-success/20";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reorder": return Package;
      case "return": return AlertTriangle;
      case "transfer": return Package;
      case "override": return DollarSign;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 border-t-4 border-primary-blue">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">Approval Queue</h3>
          <span className="px-2.5 py-1 bg-status-danger/10 text-status-danger rounded-full text-xs font-bold">
            {items.length} Pending
          </span>
        </div>
        <button className="text-sm text-primary-blue hover:underline font-medium">
          View All Requests
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <div 
              key={item.id}
              className={`p-4 rounded-button border-2 ${getRiskStyles(item.riskLevel)} transition-all hover:shadow-card`}
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.riskLevel === "high" ? "bg-status-danger/20" :
                  item.riskLevel === "medium" ? "bg-status-warning/20" : "bg-status-success/20"
                }`}>
                  <TypeIcon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900 truncate">{item.title}</h4>
                    {item.aiConfidence && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-blue/10 text-primary-blue rounded-full text-[10px] font-bold flex-shrink-0">
                        <Brain size={10} />
                        {item.aiConfidence}% AI Confidence
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.requestedAt}
                    </span>
                    <span>By: {item.requestedBy}</span>
                    {item.amount && (
                      <span className="font-semibold text-neutral-700">₹{item.amount.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors" title="View Details">
                    <Eye size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-status-success/10 flex items-center justify-center text-status-success hover:bg-status-success/20 transition-colors" title="Approve">
                    <Check size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-status-danger/10 flex items-center justify-center text-status-danger hover:bg-status-danger/20 transition-colors" title="Reject">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-success/10 flex items-center justify-center">
            <Check size={32} className="text-status-success" />
          </div>
          <p className="text-neutral-600">All approvals are up to date!</p>
        </div>
      )}
    </div>
  );
}
