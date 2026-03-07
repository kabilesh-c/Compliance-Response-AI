"use client";

import { useState } from "react";
import { 
  Zap, Brain, MessageCircle, Bell, Package, TrendingUp, 
  Clock, CheckCircle, XCircle, AlertTriangle, Settings,
  PlayCircle, PauseCircle, RefreshCw, ChevronRight, Bot, Sparkles
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import AgentStatusPanel from "@/components/automation/AgentStatusPanel";
import WorkflowBuilder from "@/components/automation/WorkflowBuilder";
import AIActionHistory from "@/components/ai/AIActionHistory";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun?: string;
  status: "success" | "failed" | "pending";
}

interface AIRecommendation {
  id: string;
  type: "restock" | "discount" | "alert" | "insight";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionLabel: string;
  aiConfidence: number;
}

const mockAutomations: AutomationRule[] = [
  {
    id: "1",
    name: "Low Stock Alert",
    description: "Send notification when stock falls below minimum level",
    trigger: "Stock < Min Level",
    action: "Email + WhatsApp Notification",
    isActive: true,
    lastRun: "2 hours ago",
    status: "success"
  },
  {
    id: "2",
    name: "Expiry Warning",
    description: "Alert 30 days before medicine expiry",
    trigger: "Expiry within 30 days",
    action: "Dashboard Alert + Report",
    isActive: true,
    lastRun: "1 day ago",
    status: "success"
  },
  {
    id: "3",
    name: "Auto Reorder",
    description: "Automatically create purchase order for critical items",
    trigger: "Stock = 0",
    action: "Generate Purchase Order",
    isActive: false,
    lastRun: "3 days ago",
    status: "pending"
  },
  {
    id: "4",
    name: "Daily Sales Report",
    description: "Generate and email daily sales summary",
    trigger: "Daily at 10:00 PM",
    action: "Email PDF Report",
    isActive: true,
    lastRun: "Yesterday",
    status: "success"
  }
];

const mockRecommendations: AIRecommendation[] = [
  {
    id: "1",
    type: "restock",
    title: "Restock Paracetamol 500mg",
    description: "Based on sales velocity, stock will run out in 3 days. Recommended order: 500 units",
    priority: "high",
    actionLabel: "Create Order",
    aiConfidence: 94,
  },
  {
    id: "2",
    type: "discount",
    title: "Apply Discount on Azithromycin",
    description: "15 units expiring in 25 days. Suggest 20% discount to clear stock",
    priority: "medium",
    actionLabel: "Apply Discount",
    aiConfidence: 87,
  },
  {
    id: "3",
    type: "insight",
    title: "Peak Hours Insight",
    description: "60% of Diabetes medicines sold between 8-10 AM. Consider priority stocking",
    priority: "low",
    actionLabel: "View Details",
    aiConfidence: 91,
  },
  {
    id: "4",
    type: "alert",
    title: "Unusual Sales Pattern",
    description: "Cetirizine sales 3x higher than usual. Possible seasonal demand",
    priority: "medium",
    actionLabel: "Analyze",
    aiConfidence: 78,
  }
];

export default function AutomationPage() {
  const { user } = useAuthStore();
  const [automations, setAutomations] = useState(mockAutomations);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => 
      prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
    );
  };

  const getStatusIcon = (status: AutomationRule["status"]) => {
    switch (status) {
      case "success": return <CheckCircle size={14} className="text-status-success" />;
      case "failed": return <XCircle size={14} className="text-status-danger" />;
      case "pending": return <Clock size={14} className="text-status-warning" />;
    }
  };

  const getPriorityColor = (priority: AIRecommendation["priority"]) => {
    switch (priority) {
      case "high": return "bg-status-danger/10 text-status-danger border-status-danger/20";
      case "medium": return "bg-status-warning/10 text-status-warning border-status-warning/20";
      case "low": return "bg-status-info/10 text-status-info border-status-info/20";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-status-success";
    if (confidence >= 75) return "text-status-warning";
    return "text-status-danger";
  };

  const getTypeIcon = (type: AIRecommendation["type"]) => {
    switch (type) {
      case "restock": return <Package size={20} />;
      case "discount": return <TrendingUp size={20} />;
      case "alert": return <AlertTriangle size={20} />;
      case "insight": return <Brain size={20} />;
    }
  };

  const canManageAutomations = user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Automation & AI</h1>
          <p className="text-neutral-500">Intelligent workflows and AI-powered recommendations</p>
        </div>
        
        {canManageAutomations && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-yellow text-neutral-900 rounded-xl font-medium hover:bg-primary-yellow-dark transition-colors">
            <Zap size={18} />
            Create Automation
          </button>
        )}
      </div>

      {/* AI Agents Status Panel */}
      <AgentStatusPanel />

      {/* AI Recommendations Section */}
      <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-yellow/20 flex items-center justify-center">
            <Bot size={20} className="text-primary-yellow" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
            <p className="text-sm text-white/60">Smart insights based on your data</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
            <Sparkles size={14} className="text-primary-yellow" />
            <span className="text-xs font-medium text-white/80">4 new insights</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRecommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getPriorityColor(rec.priority)} bg-opacity-20`}>
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white">{rec.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1 text-sm text-primary-yellow hover:text-primary-yellow-light transition-colors">
                      {rec.actionLabel} <ChevronRight size={14} />
                    </button>
                    <span className={`text-xs flex items-center gap-1 ${getConfidenceColor(rec.aiConfidence)}`}>
                      <Sparkles size={10} />
                      {rec.aiConfidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Builder */}
      <WorkflowBuilder />

      {/* AI Action History */}
      <AIActionHistory maxItems={5} />

      {/* Automation Rules Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-primary-yellow-dark" />
            <h2 className="text-lg font-semibold text-neutral-900">Automation Rules</h2>
          </div>
          <span className="text-sm text-neutral-500">
            {automations.filter(a => a.isActive).length} of {automations.length} active
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {automations.map((automation) => (
            <div key={automation.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => canManageAutomations && toggleAutomation(automation.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    automation.isActive 
                      ? "bg-status-success/10 text-status-success" 
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                  disabled={!canManageAutomations}
                >
                  {automation.isActive ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900">{automation.name}</h3>
                    {getStatusIcon(automation.status)}
                  </div>
                  <p className="text-sm text-neutral-500">{automation.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-neutral-500">Trigger</p>
                  <p className="text-sm font-medium text-neutral-700">{automation.trigger}</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-xs text-neutral-500">Action</p>
                  <p className="text-sm font-medium text-neutral-700">{automation.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Last Run</p>
                  <p className="text-sm text-neutral-600">{automation.lastRun || "Never"}</p>
                </div>
                {canManageAutomations && (
                  <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors">
                    <Settings size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Integration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
              <MessageCircle size={24} className="text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">WhatsApp Notifications</h3>
              <p className="text-sm text-neutral-500">Real-time alerts to your phone</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-sm text-neutral-700">Stock Alerts</span>
              <span className="w-8 h-5 bg-status-success rounded-full relative">
                <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-sm text-neutral-700">Expiry Reminders</span>
              <span className="w-8 h-5 bg-status-success rounded-full relative">
                <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-sm text-neutral-700">Daily Reports</span>
              <span className="w-8 h-5 bg-neutral-300 rounded-full relative">
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm text-status-success">
              <CheckCircle size={16} />
              <span>Connected to +91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Email Notifications Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-status-info/10 flex items-center justify-center">
              <Bell size={24} className="text-status-info" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Email Notifications</h3>
              <p className="text-sm text-neutral-500">Scheduled reports and alerts</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-sm text-neutral-700">Weekly Summary</span>
              <span className="text-xs text-neutral-500">Every Monday 9 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-sm text-neutral-700">Monthly Report</span>
              <span className="text-xs text-neutral-500">1st of month</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <span className="text-sm text-neutral-700">Critical Alerts</span>
              <span className="text-xs text-neutral-500">Immediate</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm text-status-success">
              <CheckCircle size={16} />
              <span>Sending to admin@pharmacy.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}