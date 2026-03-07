"use client";

import { Brain, Activity, Zap, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface AgentStatus {
  name: string;
  status: "running" | "idle" | "error";
  lastRun: string;
  actionsToday: number;
  successRate: number;
}

export default function AISystemStatusCard() {
  const agents: AgentStatus[] = [
    { name: "Inventory Optimizer", status: "running", lastRun: "2 min ago", actionsToday: 45, successRate: 98 },
    { name: "Expiry Tracker", status: "running", lastRun: "5 min ago", actionsToday: 23, successRate: 100 },
    { name: "Demand Forecaster", status: "idle", lastRun: "1 hour ago", actionsToday: 12, successRate: 94 },
    { name: "Price Optimizer", status: "error", lastRun: "30 min ago", actionsToday: 8, successRate: 75 },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "running": return { bg: "bg-status-success", text: "text-status-success", label: "Running" };
      case "idle": return { bg: "bg-status-warning", text: "text-status-warning", label: "Idle" };
      case "error": return { bg: "bg-status-danger", text: "text-status-danger", label: "Error" };
      default: return { bg: "bg-neutral-400", text: "text-neutral-400", label: "Unknown" };
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full border-t-4 border-primary-blue">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">AI System Status</h3>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-xs font-bold">
            <Brain size={12} />
            4 Agents
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Activity size={14} className="text-status-success" />
          Last sync: Just now
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {agents.map((agent, index) => {
          const statusStyle = getStatusStyle(agent.status);
          return (
            <div 
              key={index}
              className="p-4 bg-neutral-50 rounded-button hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusStyle.bg} ${agent.status === "running" ? "animate-pulse" : ""}`} />
                  <span className="font-medium text-neutral-900 text-sm">{agent.name}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle.bg}/10 ${statusStyle.text}`}>
                  {statusStyle.label}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
                    <Clock size={10} />
                  </div>
                  <div className="text-xs text-neutral-600">{agent.lastRun}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
                    <Zap size={10} />
                  </div>
                  <div className="text-xs text-neutral-600">{agent.actionsToday}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
                    <TrendingUp size={10} />
                  </div>
                  <div className={`text-xs font-medium ${
                    agent.successRate >= 90 ? "text-status-success" :
                    agent.successRate >= 70 ? "text-status-warning" : "text-status-danger"
                  }`}>
                    {agent.successRate}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center gap-3">
        <button className="flex-1 py-2 px-4 bg-primary-blue/10 text-primary-blue rounded-button text-sm font-medium hover:bg-primary-blue/20 transition-colors">
          View All Agents
        </button>
        <button className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-button text-sm font-medium hover:bg-neutral-200 transition-colors">
          System Logs
        </button>
      </div>
    </div>
  );
}
