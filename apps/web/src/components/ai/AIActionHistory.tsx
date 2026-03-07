"use client";

import { useState } from "react";
import { History, Check, X, Clock, ChevronDown, ChevronUp, Brain } from "lucide-react";

interface AIAction {
  id: string;
  type: "reorder" | "expiry" | "price" | "supplier" | "automation";
  title: string;
  description: string;
  status: "approved" | "rejected" | "pending";
  confidence: number;
  confidenceLevel: "high" | "medium" | "low";
  timestamp: string;
  approvedBy?: string;
}

const mockActions: AIAction[] = [
  {
    id: "1",
    type: "reorder",
    title: "Reorder Paracetamol 500mg",
    description: "Suggested ordering 200 units based on demand forecast",
    status: "approved",
    confidence: 94,
    confidenceLevel: "high",
    timestamp: "2 hours ago",
    approvedBy: "Manager"
  },
  {
    id: "2",
    type: "expiry",
    title: "FEFO Alert: Amoxicillin",
    description: "Flagged 50 units expiring in 30 days for priority sale",
    status: "approved",
    confidence: 98,
    confidenceLevel: "high",
    timestamp: "4 hours ago",
    approvedBy: "System"
  },
  {
    id: "3",
    type: "price",
    title: "Markdown Suggestion",
    description: "Recommended 15% discount on slow-moving Vitamin D",
    status: "rejected",
    confidence: 72,
    confidenceLevel: "medium",
    timestamp: "Yesterday",
    approvedBy: "Manager"
  },
  {
    id: "4",
    type: "supplier",
    title: "Supplier Switch Alert",
    description: "Suggested switching to PharmaCo for better pricing",
    status: "pending",
    confidence: 81,
    confidenceLevel: "medium",
    timestamp: "Yesterday"
  },
  {
    id: "5",
    type: "automation",
    title: "Auto-Reorder Triggered",
    description: "Automatically ordered Ibuprofen 400mg (150 units)",
    status: "approved",
    confidence: 96,
    confidenceLevel: "high",
    timestamp: "2 days ago",
    approvedBy: "Auto"
  }
];

interface AIActionHistoryProps {
  maxItems?: number;
  compact?: boolean;
}

export default function AIActionHistory({ maxItems = 5, compact = false }: AIActionHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const displayedActions = expanded ? mockActions : mockActions.slice(0, maxItems);

  const getStatusIcon = (status: AIAction["status"]) => {
    switch (status) {
      case "approved": return <Check size={12} className="text-status-success" />;
      case "rejected": return <X size={12} className="text-status-danger" />;
      case "pending": return <Clock size={12} className="text-status-warning" />;
    }
  };

  const getStatusBg = (status: AIAction["status"]) => {
    switch (status) {
      case "approved": return "bg-status-success/10";
      case "rejected": return "bg-status-danger/10";
      case "pending": return "bg-status-warning/10";
    }
  };

  const getConfidenceColor = (level: AIAction["confidenceLevel"]) => {
    switch (level) {
      case "high": return "text-status-success";
      case "medium": return "text-status-warning";
      case "low": return "text-status-danger";
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <History size={16} className="text-primary-yellow-dark" />
          Recent AI Decisions
        </div>
        <div className="space-y-1.5">
          {displayedActions.slice(0, 3).map((action) => (
            <div key={action.id} className="flex items-center gap-2 text-xs">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getStatusBg(action.status)}`}>
                {getStatusIcon(action.status)}
              </div>
              <span className="text-neutral-700 truncate flex-1">{action.title}</span>
              <span className="text-neutral-400">{action.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-yellow/20 flex items-center justify-center">
            <History size={16} className="text-primary-yellow-dark" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">AI Action History</h3>
            <p className="text-xs text-neutral-500">Recent AI decisions and outcomes</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-primary-yellow/10 rounded-full">
          <Brain size={12} className="text-primary-yellow-dark" />
          <span className="text-xs font-medium text-primary-yellow-dark">{mockActions.length} actions</span>
        </div>
      </div>

      {/* Actions List */}
      <div className="divide-y divide-neutral-100">
        {displayedActions.map((action) => (
          <div key={action.id} className="p-4 hover:bg-neutral-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getStatusBg(action.status)}`}>
                {getStatusIcon(action.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900">{action.title}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{action.description}</p>
                  </div>
                  <span className={`text-xs font-bold ${getConfidenceColor(action.confidenceLevel)}`}>
                    {action.confidence}%
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                  <span>{action.timestamp}</span>
                  {action.approvedBy && (
                    <>
                      <span>•</span>
                      <span>by {action.approvedBy}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less */}
      {mockActions.length > maxItems && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-3 flex items-center justify-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 border-t border-neutral-100 transition-colors"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show {mockActions.length - maxItems} More <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
