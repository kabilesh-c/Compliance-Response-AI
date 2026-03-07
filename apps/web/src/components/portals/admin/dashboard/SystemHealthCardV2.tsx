"use client";

import { useState } from "react";
import { Brain, Server, AlertCircle, CheckCircle, Activity, Zap, Power } from "lucide-react";

export default function SystemHealthCard() {
  const [agents, setAgents] = useState([
    { id: "1", name: "Inventory", active: true },
    { id: "2", name: "Pricing", active: true },
    { id: "3", name: "Supplier", active: false },
  ]);

  const healthMetrics = {
    aiUptime: 99.8,
    activeAgents: agents.filter(a => a.active).length,
    failedActions: 2,
    totalActionsToday: 156,
  };

  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-card shadow-card p-6 text-white h-full flex flex-col border-t-4 border-primary-blue">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">System Health</h3>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-blue/20 text-primary-blue-light rounded-full text-xs font-bold">
          <Brain size={12} />
          AI Monitoring
        </span>
      </div>

      <div className="flex items-center gap-6 mb-6">
        {/* Circular Uptime Indicator */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="#4F8CFF"
              strokeWidth="8"
              strokeDasharray={`${(healthMetrics.aiUptime / 100) * 301} 301`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{healthMetrics.aiUptime}%</span>
            <span className="text-xs text-neutral-400">AI Uptime</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center">
              <Server size={16} className="text-status-success" />
            </div>
            <div>
              <div className="text-lg font-bold">{healthMetrics.activeAgents}</div>
              <div className="text-[10px] text-neutral-400">Active Agents</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-8 h-8 rounded-full bg-status-danger/20 flex items-center justify-center">
              <AlertCircle size={16} className="text-status-danger" />
            </div>
            <div>
              <div className="text-lg font-bold">{healthMetrics.failedActions}</div>
              <div className="text-[10px] text-neutral-400">Failed Actions</div>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 p-3 bg-dark-card-light rounded-button">
            <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center">
              <Zap size={16} className="text-primary-blue" />
            </div>
            <div>
              <div className="text-lg font-bold">{healthMetrics.totalActionsToday}</div>
              <div className="text-[10px] text-neutral-400">Total Actions Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Controls */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <h4 className="text-xs font-semibold text-neutral-400 mb-3 uppercase tracking-wider">Agent Controls</h4>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${agent.active ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <span className="text-sm font-medium">{agent.name} Agent</span>
              </div>
              <button 
                onClick={() => toggleAgent(agent.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  agent.active 
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                <Power size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
