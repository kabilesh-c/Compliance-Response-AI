"use client";

import { useState } from "react";
import { ShoppingCart, RotateCcw, ArrowRightLeft, Brain, Check, X, Eye, Sparkles } from "lucide-react";

interface Recommendation {
  id: string;
  type: "reorder" | "return" | "transfer";
  title: string;
  description: string;
  amount?: number;
  confidence: number;
  priority: "high" | "medium" | "low";
}

export default function AIRecommendationsCard() {
  const [recommendations] = useState<Recommendation[]>([
    { 
      id: "1", 
      type: "reorder", 
      title: "Reorder Paracetamol 500mg", 
      description: "Stock will deplete in 3 days based on current sales velocity",
      amount: 15000,
      confidence: 94,
      priority: "high"
    },
    { 
      id: "2", 
      type: "return", 
      title: "Return Expiring Antibiotics", 
      description: "12 units of Amoxicillin 250mg expiring in 7 days",
      amount: 3200,
      confidence: 88,
      priority: "medium"
    },
    { 
      id: "3", 
      type: "transfer", 
      title: "Transfer Ibuprofen to Branch B", 
      description: "Excess stock detected, Branch B has shortage",
      amount: 2800,
      confidence: 82,
      priority: "low"
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reorder": return ShoppingCart;
      case "return": return RotateCcw;
      case "transfer": return ArrowRightLeft;
      default: return ShoppingCart;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "reorder": return "bg-primary-yellow/20 text-primary-yellow-dark";
      case "return": return "bg-purple-500/20 text-purple-500";
      case "transfer": return "bg-primary-blue/20 text-primary-blue";
      default: return "bg-neutral-200 text-neutral-600";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high": return "bg-status-danger/10 text-status-danger";
      case "medium": return "bg-status-warning/10 text-status-warning";
      case "low": return "bg-status-success/10 text-status-success";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-yellow to-primary-yellow-dark rounded-card shadow-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">AI Recommendations</h3>
          <span className="px-2 py-0.5 bg-neutral-900/10 rounded-full text-xs font-bold text-neutral-900">
            {recommendations.length} New
          </span>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/10 text-neutral-900 rounded-full text-xs font-bold">
          <Brain size={12} />
          AI Powered
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const TypeIcon = getTypeIcon(rec.type);
          return (
            <div 
              key={rec.id}
              className="p-4 bg-white/90 backdrop-blur-sm rounded-button hover:bg-white transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyle(rec.type)}`}>
                  <TypeIcon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900 text-sm truncate">{rec.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityStyle(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-2">{rec.description}</p>
                  <div className="flex items-center gap-3">
                    {rec.amount && (
                      <span className="text-sm font-bold text-neutral-900">₹{rec.amount.toLocaleString()}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                      <Sparkles size={10} className="text-primary-yellow-dark" />
                      {rec.confidence}% confidence
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors" title="View Details">
                    <Eye size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center text-status-success hover:bg-status-success/30 transition-colors" title="Approve">
                    <Check size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-status-danger/20 flex items-center justify-center text-status-danger hover:bg-status-danger/30 transition-colors" title="Reject">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <button className="w-full mt-4 py-2.5 bg-neutral-900/10 text-neutral-900 rounded-button text-sm font-medium hover:bg-neutral-900/20 transition-colors">
        View All Recommendations
      </button>
    </div>
  );
}
