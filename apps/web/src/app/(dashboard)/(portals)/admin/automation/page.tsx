"use client";

import { useState } from "react";
import { Zap, Play, Pause, Settings, Clock, CheckCircle, AlertTriangle, XCircle, Brain, ArrowRight, RefreshCw } from "lucide-react";

interface WorkflowItem {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "failed";
  lastRun: string;
  nextRun: string;
  successRate: number;
  actions: number;
}

export default function AdminAutomationPage() {
  const [workflows] = useState<WorkflowItem[]>([
    { id: "1", name: "Auto-Reorder Low Stock", status: "active", lastRun: "10 min ago", nextRun: "In 50 min", successRate: 98, actions: 45 },
    { id: "2", name: "Expiry Alert Notifications", status: "active", lastRun: "1 hour ago", nextRun: "In 5 hours", successRate: 100, actions: 23 },
    { id: "3", name: "Price Optimization", status: "paused", lastRun: "2 days ago", nextRun: "Paused", successRate: 89, actions: 12 },
    { id: "4", name: "Supplier WhatsApp Alerts", status: "failed", lastRun: "30 min ago", nextRun: "Retry pending", successRate: 75, actions: 8 },
    { id: "5", name: "Demand Forecasting", status: "completed", lastRun: "Just now", nextRun: "Tomorrow 6 AM", successRate: 96, actions: 15 },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active": return { bg: "bg-status-success", icon: Play, label: "Active", glow: "shadow-status-success/30" };
      case "paused": return { bg: "bg-status-warning", icon: Pause, label: "Paused", glow: "" };
      case "completed": return { bg: "bg-primary-blue", icon: CheckCircle, label: "Completed", glow: "" };
      case "failed": return { bg: "bg-status-danger", icon: XCircle, label: "Failed", glow: "shadow-status-danger/30" };
      default: return { bg: "bg-neutral-400", icon: Clock, label: "Unknown", glow: "" };
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Automation & AI</h1>
          <p className="text-neutral-600 mt-1">Manage AI agents and automated workflows</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-button text-sm font-medium hover:bg-primary-blue-dark transition-colors">
          <Zap size={16} />
          Create Workflow
        </button>
      </div>

      {/* Agent Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: "5", status: "Running", color: "bg-status-success" },
          { label: "Queued Actions", value: "12", status: "Waiting", color: "bg-status-warning" },
          { label: "Completed Today", value: "156", status: "Success", color: "bg-primary-blue" },
          { label: "Failed Actions", value: "2", status: "Needs attention", color: "bg-status-danger" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-card shadow-card p-6">
            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-4`}>
              <Zap size={18} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">{item.value}</div>
            <div className="text-sm text-neutral-600">{item.label}</div>
            <div className="text-xs text-neutral-500 mt-1">{item.status}</div>
          </div>
        ))}
      </div>

      {/* Workflow List */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Active Workflows</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-button transition-colors">
              All
            </button>
            <button className="px-3 py-1.5 text-sm text-primary-blue bg-primary-blue/10 rounded-button font-medium">
              Active
            </button>
            <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-button transition-colors">
              Paused
            </button>
            <button className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-button transition-colors">
              Failed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {workflows.map((workflow) => {
            const statusStyle = getStatusStyle(workflow.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div 
                key={workflow.id}
                className={`p-4 rounded-button border border-neutral-200 hover:border-primary-blue/30 transition-all ${
                  workflow.status === "active" ? "border-l-4 border-l-status-success" :
                  workflow.status === "failed" ? "border-l-4 border-l-status-danger" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-full ${statusStyle.bg}/20 flex items-center justify-center ${statusStyle.glow ? `shadow-lg ${statusStyle.glow}` : ""}`}>
                    <StatusIcon size={20} className={statusStyle.bg.replace("bg-", "text-")} />
                  </div>

                  {/* Workflow Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-neutral-900">{workflow.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.bg}/10 ${statusStyle.bg.replace("bg-", "text-")}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Last: {workflow.lastRun}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowRight size={12} />
                        Next: {workflow.nextRun}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap size={12} />
                        {workflow.actions} actions
                      </span>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="text-center px-4">
                    <div className={`text-lg font-bold ${
                      workflow.successRate >= 90 ? "text-status-success" :
                      workflow.successRate >= 70 ? "text-status-warning" : "text-status-danger"
                    }`}>
                      {workflow.successRate}%
                    </div>
                    <div className="text-[10px] text-neutral-500">Success Rate</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
                      <RefreshCw size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
                      <Settings size={16} />
                    </button>
                    {workflow.status === "active" ? (
                      <button className="w-9 h-9 rounded-full bg-status-warning/10 flex items-center justify-center text-status-warning hover:bg-status-warning/20 transition-colors">
                        <Pause size={16} />
                      </button>
                    ) : (
                      <button className="w-9 h-9 rounded-full bg-status-success/10 flex items-center justify-center text-status-success hover:bg-status-success/20 transition-colors">
                        <Play size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Queue */}
      <div className="bg-gradient-to-br from-primary-blue to-primary-blue-dark rounded-card shadow-card p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain size={24} />
            <h3 className="text-lg font-semibold">Execution Queue</h3>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">12 pending</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { action: "Create Purchase Order", medicine: "Paracetamol 500mg", quantity: 500, eta: "2 min" },
            { action: "Send WhatsApp Alert", medicine: "Amoxicillin 250mg", quantity: 0, eta: "5 min" },
            { action: "Update Price", medicine: "Ibuprofen 400mg", quantity: 200, eta: "10 min" },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-button p-4">
              <div className="text-sm font-semibold mb-2">{item.action}</div>
              <div className="text-xs text-white/70">{item.medicine}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/50">ETA: {item.eta}</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
