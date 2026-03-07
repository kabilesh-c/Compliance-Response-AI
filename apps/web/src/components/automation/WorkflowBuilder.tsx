"use client";

import { useState } from "react";
import { 
  Plus, ArrowRight, Package, Clock, Bell, MessageCircle, 
  Mail, FileText, Trash2, GripVertical, Sparkles
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  label: string;
  icon: typeof Package;
  config?: Record<string, string>;
}

interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  isActive: boolean;
}

const nodeOptions = {
  trigger: [
    { label: "Stock Below Threshold", icon: Package },
    { label: "Expiry Approaching", icon: Clock },
    { label: "Time Schedule", icon: Clock },
  ],
  action: [
    { label: "Send WhatsApp", icon: MessageCircle },
    { label: "Send Email", icon: Mail },
    { label: "Create Alert", icon: Bell },
    { label: "Generate Report", icon: FileText },
  ],
};

const sampleWorkflow: Workflow = {
  id: "1",
  name: "Low Stock Alert Workflow",
  isActive: true,
  nodes: [
    { id: "1", type: "trigger", label: "Stock Below 20%", icon: Package },
    { id: "2", type: "action", label: "Send WhatsApp", icon: MessageCircle },
    { id: "3", type: "action", label: "Create Dashboard Alert", icon: Bell },
  ],
};

export default function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState<Workflow>(sampleWorkflow);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addNode = (type: "action", label: string, icon: typeof Package) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      label,
      icon,
    };
    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setShowAddMenu(false);
  };

  const removeNode = (id: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== id),
    }));
  };

  const getNodeStyle = (type: WorkflowNode["type"]) => {
    switch (type) {
      case "trigger":
        return "bg-primary-yellow/20 border-primary-yellow text-primary-yellow-dark";
      case "condition":
        return "bg-blue-500/10 border-blue-500 text-blue-600";
      case "action":
        return "bg-status-success/10 border-status-success text-status-success";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-yellow to-primary-yellow-dark flex items-center justify-center">
            <Sparkles size={20} className="text-neutral-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Workflow Builder</h2>
            <p className="text-sm text-neutral-500">Create custom automation flows</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workflow.isActive 
              ? "bg-status-success/10 text-status-success" 
              : "bg-neutral-100 text-neutral-500"
          }`}>
            {workflow.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Workflow Name */}
      <input
        type="text"
        value={workflow.name}
        onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
        className="w-full text-lg font-medium text-neutral-900 bg-transparent border-b border-neutral-200 pb-2 mb-6 focus:outline-none focus:border-primary-yellow"
      />

      {/* Workflow Canvas */}
      <div className="bg-neutral-50 rounded-xl p-6 min-h-[200px]">
        <div className="flex items-center gap-4 flex-wrap">
          {workflow.nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div key={node.id} className="flex items-center gap-4">
                <div 
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${getNodeStyle(node.type)} bg-white cursor-move`}
                >
                  <GripVertical size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                  <div className="w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-70">{node.type}</p>
                    <p className="font-medium text-sm">{node.label}</p>
                  </div>
                  {node.type !== "trigger" && (
                    <button
                      onClick={() => removeNode(node.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-status-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
                {index < workflow.nodes.length - 1 && (
                  <ArrowRight size={20} className="text-neutral-300" />
                )}
              </div>
            );
          })}

          {/* Add Node Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-primary-yellow hover:text-primary-yellow-dark transition-colors"
            >
              <Plus size={18} />
              Add Action
            </button>

            {showAddMenu && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 w-56 z-10">
                <p className="px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wide">Actions</p>
                {nodeOptions.action.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.label}
                      onClick={() => addNode("action", option.label, option.icon)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Icon size={16} className="text-neutral-400" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          {workflow.nodes.length} nodes • Last modified just now
        </p>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Test Workflow
          </button>
          <button className="px-4 py-2 bg-primary-yellow text-neutral-900 rounded-xl text-sm font-medium hover:bg-primary-yellow-dark transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
