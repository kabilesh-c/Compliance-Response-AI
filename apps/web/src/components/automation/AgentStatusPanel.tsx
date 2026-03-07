"use client";

import { useState } from "react";
import { 
  Bot, CheckCircle, AlertCircle, Clock, Activity, 
  Package, Calendar, TrendingUp, RefreshCw, Pause, Play 
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: typeof Package;
  status: "active" | "paused" | "error";
  lastAction: string;
  lastActionTime: string;
  actionsToday: number;
  savedAmount: number;
}

const agents: Agent[] = [
  {
    id: "inventory",
    name: "Inventory Agent",
    description: "Monitors stock levels and triggers reorder alerts",
    icon: Package,
    status: "active",
    lastAction: "Flagged 3 items for reorder",
    lastActionTime: "2 min ago",
    actionsToday: 12,
    savedAmount: 4500,
  },
  {
    id: "expiry",
    name: "Expiry Agent",
    description: "Tracks expiry dates and suggests discount strategies",
    icon: Calendar,
    status: "active",
    lastAction: "Suggested 15% discount on 5 items",
    lastActionTime: "15 min ago",
    actionsToday: 8,
    savedAmount: 12000,
  },
  {
    id: "demand",
    name: "Demand Forecast Agent",
    description: "Predicts demand patterns and seasonal trends",
    icon: TrendingUp,
    status: "paused",
    lastAction: "Generated weekly forecast",
    lastActionTime: "1 hour ago",
    actionsToday: 3,
    savedAmount: 8500,
  },
];

export default function AgentStatusPanel() {
  const [localAgents, setLocalAgents] = useState(agents);

  const toggleAgent = (id: string) => {
    setLocalAgents(prev => 
      prev.map(agent => 
        agent.id === id 
          ? { ...agent, status: agent.status === "active" ? "paused" : "active" }
          : agent
      )
    );
  };

  const getStatusBadge = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-status-success/10 text-status-success rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse" />
            Active
          </span>
        );
      case "paused":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-medium">
            <Pause size={10} />
            Paused
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-status-danger/10 text-status-danger rounded-full text-xs font-medium">
            <AlertCircle size={10} />
            Error
          </span>
        );
    }
  };

  const totalSaved = localAgents.reduce((sum, a) => sum + a.savedAmount, 0);
  const totalActions = localAgents.reduce((sum, a) => sum + a.actionsToday, 0);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-yellow/20 flex items-center justify-center">
              <Bot size={20} className="text-primary-yellow-dark" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">AI Agents</h2>
              <p className="text-sm text-neutral-500">Autonomous decision-making engines</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-neutral-900">{totalActions}</p>
              <p className="text-xs text-neutral-500">Actions Today</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div className="text-center">
              <p className="font-bold text-status-success">₹{totalSaved.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">Saved Today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {localAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    agent.status === "active" 
                      ? "bg-primary-yellow/20 text-primary-yellow-dark" 
                      : "bg-neutral-100 text-neutral-400"
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-neutral-900">{agent.name}</h3>
                      {getStatusBadge(agent.status)}
                    </div>
                    <p className="text-sm text-neutral-500">{agent.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-neutral-700">{agent.lastAction}</p>
                    <p className="text-xs text-neutral-500">{agent.lastActionTime}</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-lg font-bold text-neutral-900">{agent.actionsToday}</p>
                    <p className="text-xs text-neutral-500">Actions</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-lg font-bold text-status-success">₹{agent.savedAmount.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">Saved</p>
                  </div>
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className={`p-2.5 rounded-xl transition-colors ${
                      agent.status === "active"
                        ? "bg-status-success/10 text-status-success hover:bg-status-success/20"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    {agent.status === "active" ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>

              {/* Agent Activity Bar */}
              {agent.status === "active" && (
                <div className="mt-3 flex items-center gap-2">
                  <Activity size={12} className="text-neutral-400" />
                  <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-yellow rounded-full animate-pulse"
                      style={{ width: `${(agent.actionsToday / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">{agent.actionsToday}/20 daily capacity</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
