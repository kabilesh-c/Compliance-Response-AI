"use client";

import { useState } from "react";
import { CheckCircle, Circle, Clock, AlertTriangle, Package, Calendar, Sparkles } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "fefo" | "expiry" | "stock" | "routine";
  priority: "high" | "medium" | "low";
  completed: boolean;
  dueTime?: string;
}

export default function TodaysTasksCard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "FEFO Pick: Paracetamol 500mg", description: "Batch B2024-001 expires in 15 days - Move to front", type: "fefo", priority: "high", completed: false, dueTime: "9:00 AM" },
    { id: "2", title: "Expiry Check: Antibiotics Section", description: "Weekly expiry verification for Rack A3-A8", type: "expiry", priority: "high", completed: false, dueTime: "10:00 AM" },
    { id: "3", title: "Stock Count: OTC Medicines", description: "Verify stock levels for over-the-counter items", type: "stock", priority: "medium", completed: true, dueTime: "11:00 AM" },
    { id: "4", title: "Receive Delivery: MedSupply Inc", description: "Expected delivery of 25 items - Verify and shelve", type: "routine", priority: "medium", completed: false, dueTime: "2:00 PM" },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high": return "bg-status-danger/10 text-status-danger border-status-danger/20";
      case "medium": return "bg-status-warning/10 text-status-warning border-status-warning/20";
      case "low": return "bg-status-success/10 text-status-success border-status-success/20";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fefo": return Package;
      case "expiry": return Calendar;
      case "stock": return Package;
      case "routine": return Clock;
      default: return Circle;
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-gradient-to-br from-primary-green to-primary-green-dark rounded-card shadow-card p-6 text-white h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Today's Tasks</h3>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
            {completedCount}/{tasks.length} Done
          </span>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
          <Sparkles size={12} />
          AI Prioritized
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const TypeIcon = getTypeIcon(task.type);
          return (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-button cursor-pointer transition-all ${
                task.completed 
                  ? "bg-white/10 opacity-60" 
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle size={20} className="text-white" />
                  ) : (
                    <Circle size={20} className="text-white/60" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === "high" ? "bg-white/30" : "bg-white/20"
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{task.description}</p>
                  {task.dueTime && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
                      <Clock size={12} />
                      {task.dueTime}
                    </div>
                  )}
                </div>

                {/* Type Icon */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <TypeIcon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
