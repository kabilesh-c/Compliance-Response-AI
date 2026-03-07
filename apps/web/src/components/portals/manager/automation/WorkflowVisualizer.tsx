"use client";

import React from "react";
import { CheckCircle, XCircle, Clock, ArrowRight, Play, Pause, AlertTriangle } from "lucide-react";

interface WorkflowStep {
  id: string;
  label: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  type: "TRIGGER" | "ACTION" | "CONDITION" | "DELAY";
}

interface Workflow {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "ERROR";
  lastRun: string;
  steps: WorkflowStep[];
}

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "1",
    name: "Low Stock Reorder",
    status: "ACTIVE",
    lastRun: "2 mins ago",
    steps: [
      { id: "s1", label: "Stock < 20%", status: "COMPLETED", type: "TRIGGER" },
      { id: "s2", label: "Check Supplier", status: "COMPLETED", type: "CONDITION" },
      { id: "s3", label: "Create PO", status: "RUNNING", type: "ACTION" },
      { id: "s4", label: "Notify Manager", status: "PENDING", type: "ACTION" },
    ]
  },
  {
    id: "2",
    name: "Expiry Alert",
    status: "ERROR",
    lastRun: "1 hour ago",
    steps: [
      { id: "e1", label: "Expiry < 30 days", status: "COMPLETED", type: "TRIGGER" },
      { id: "e2", label: "Check Value", status: "COMPLETED", type: "CONDITION" },
      { id: "e3", label: "Discount 20%", status: "FAILED", type: "ACTION" },
    ]
  }
];

export default function WorkflowVisualizer() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500 border-green-600 text-white";
      case "RUNNING": return "bg-yellow-400 border-yellow-500 text-white animate-pulse";
      case "FAILED": return "bg-red-500 border-red-600 text-white";
      default: return "bg-white border-gray-300 text-gray-500";
    }
  };

  const getWorkflowStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><Play size={10} /> Active</span>;
      case "PAUSED": return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1"><Pause size={10} /> Paused</span>;
      case "ERROR": return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertTriangle size={10} /> Error</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {MOCK_WORKFLOWS.map((workflow) => (
        <div key={workflow.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-gray-900">{workflow.name}</h3>
              {getWorkflowStatusBadge(workflow.status)}
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} /> Last run: {workflow.lastRun}
            </span>
          </div>

          <div className="relative flex items-center justify-between gap-4 overflow-x-auto pb-4">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2" />

            {workflow.steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2 min-w-[120px] relative z-10">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-all ${getStatusColor(step.status)}`}>
                  {step.status === "COMPLETED" && <CheckCircle size={20} />}
                  {step.status === "RUNNING" && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {step.status === "FAILED" && <XCircle size={20} />}
                  {step.status === "PENDING" && <span className="w-3 h-3 bg-gray-300 rounded-full" />}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-800">{step.label}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{step.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
