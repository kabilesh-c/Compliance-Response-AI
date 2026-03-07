import { useState } from "react";
import { CheckSquare, Clock, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
  priority?: "high" | "normal";
}

export default function DailyTaskChecklist() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Check temperature logs for fridge", completed: false, time: "09:00 AM", priority: "high" },
    { id: "2", text: "Verify cash drawer opening balance", completed: true, time: "09:15 AM" },
    { id: "3", text: "Review pending prescriptions from night shift", completed: false, priority: "high" },
    { id: "4", text: "Restock fast-moving counter items", completed: false },
    { id: "5", text: "Clean and sanitize counter area", completed: false, time: "02:00 PM" },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <CheckSquare className="text-primary-green" size={20} />
          Daily Checklist
        </h3>
        <span className="text-xs font-medium text-neutral-500">{progress}% Done</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 rounded-full h-1.5 mb-6">
        <div 
          className="bg-primary-green h-1.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
              task.completed 
                ? "bg-neutral-50 border-transparent opacity-60" 
                : "bg-white border-neutral-100 hover:border-primary-green/30 hover:shadow-sm"
            }`}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                task.completed 
                  ? "bg-primary-green border-primary-green text-white" 
                  : "border-neutral-300 hover:border-primary-green"
              }`}
            >
              {task.completed && <CheckSquare size={14} />}
            </button>
            
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.completed ? "text-neutral-500 line-through" : "text-neutral-900"}`}>
                {task.text}
              </p>
              
              <div className="flex items-center gap-3 mt-1.5">
                {task.time && (
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock size={12} /> {task.time}
                  </span>
                )}
                {task.priority === "high" && !task.completed && (
                  <span className="flex items-center gap-1 text-xs text-status-error font-medium bg-status-error/5 px-1.5 py-0.5 rounded">
                    <AlertCircle size={12} /> High Priority
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}