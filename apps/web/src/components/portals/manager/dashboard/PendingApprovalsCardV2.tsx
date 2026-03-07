"use client";

import { useState } from "react";
import { AlertTriangle, Check, X, Eye, Clock, MessageSquare, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useAIActionStore, AIAction } from "@/stores/aiActionStore";
import { useAuthStore } from "@/stores/authStore";
import WhatsAppPreviewCard from "@/components/ui/WhatsAppPreviewCard";

export default function PendingApprovalsCard() {
  const { getPendingActions, approveAction, rejectAction } = useAIActionStore();
  const { user } = useAuthStore();
  const pendingActions = getPendingActions();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    if (user) {
      approveAction(id, user.id);
    }
  };

  const handleReject = (id: string) => {
    if (user) {
      // In a real app, we'd ask for a reason
      rejectAction(id, user.id, "Rejected by manager");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "REORDER": return "bg-status-warning/10 text-status-warning";
      case "RETURN": return "bg-status-danger/10 text-status-danger";
      case "TRANSFER": return "bg-primary-blue/10 text-primary-blue";
      case "WHATSAPP_ALERT": return "bg-status-success/10 text-status-success";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "WHATSAPP_ALERT": return <MessageSquare size={18} />;
      case "REORDER": return <Brain size={18} />;
      default: return <AlertTriangle size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full border-l-4 border-l-status-danger flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">Pending Approvals</h3>
          {pendingActions.length > 0 && (
            <span className="px-2.5 py-1 bg-status-danger/10 text-status-danger rounded-full text-xs font-bold animate-pulse">
              {pendingActions.length} Urgent
            </span>
          )}
        </div>
        <button className="text-sm text-primary-yellow-dark hover:underline font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {pendingActions.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Check className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
            <p>All caught up! No pending approvals.</p>
          </div>
        ) : (
          pendingActions.map((action) => (
            <div 
              key={action.id}
              className="p-4 bg-neutral-50 rounded-button hover:bg-neutral-100 transition-all border border-transparent hover:border-neutral-200"
            >
              <div className="flex items-start gap-4">
                {/* Type Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyle(action.type)}`}>
                  {getIcon(action.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900 text-sm truncate">{action.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getTypeStyle(action.type)}`}>
                      {action.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-2 line-clamp-2">{action.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(action.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain size={12} />
                      {(action.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  {/* Expanded Content (Explanation/Preview) */}
                  {expandedId === action.id && (
                    <div className="mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      {action.type === "WHATSAPP_ALERT" && action.data && (
                        <div className="mb-2">
                          <WhatsAppPreviewCard 
                            recipient={action.data.shift || "Staff"}
                            message={action.description} // Using description as message for now
                            status="PENDING"
                            type="STAFF"
                          />
                        </div>
                      )}
                      <div className="bg-white p-3 rounded border border-neutral-200 text-xs text-neutral-700">
                        <p className="font-semibold mb-1">AI Reasoning:</p>
                        <p>{action.description}</p>
                        <div className="mt-2 pt-2 border-t border-neutral-100 grid grid-cols-2 gap-2">
                          {action.data && Object.entries(action.data).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-neutral-500 capitalize">{key}: </span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleApprove(action.id)}
                      className="flex-1 bg-status-success text-white py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button 
                      onClick={() => handleReject(action.id)}
                      className="flex-1 bg-white border border-status-danger text-status-danger py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={14} /> Reject
                    </button>
                    <button 
                      onClick={() => toggleExpand(action.id)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium hover:bg-neutral-300 transition-colors flex items-center justify-center gap-1"
                    >
                      {expandedId === action.id ? <ChevronUp size={14} /> : <Eye size={14} />}
                      {expandedId === action.id ? "Hide" : "Explain"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
