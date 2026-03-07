"use client";

import { Brain, Server, AlertCircle, CheckCircle, Activity, Zap } from "lucide-react";

export default function SystemHealthCard() {
  const healthMetrics = {
    aiUptime: 99.8,
    activeAgents: 5,
    failedActions: 2,
    totalActionsToday: 156,
  };

  return (
    <div className="bg-dark-card rounded-card shadow-card p-6 text-white h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">System Health</h3>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-blue/20 text-primary-blue-light rounded-full text-xs font-bold">
          <Brain size={12} />
          AI Monitoring
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Uptime Indicator */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#4F8CFF"
              strokeWidth="8"
              strokeDasharray={`${(healthMetrics.aiUptime / 100) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{healthMetrics.aiUptime}%</span>
            <span className="text-xs text-neutral-400">AI Uptime</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex-1 grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-10 h-10 rounded-full bg-status-success/20 flex items-center justify-center">
              <Server size={18} className="text-status-success" />
            </div>
            <div>
              <div className="text-xl font-bold">{healthMetrics.activeAgents}</div>
              <div className="text-xs text-neutral-400">Active Agents</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-10 h-10 rounded-full bg-status-danger/20 flex items-center justify-center">
              <AlertCircle size={18} className="text-status-danger" />
            </div>
            <div>
              <div className="text-xl font-bold">{healthMetrics.failedActions}</div>
              <div className="text-xs text-neutral-400">Failed Actions</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center">
              <Zap size={18} className="text-primary-blue" />
            </div>
            <div>
              <div className="text-xl font-bold">{healthMetrics.totalActionsToday}</div>
              <div className="text-xs text-neutral-400">Actions Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
