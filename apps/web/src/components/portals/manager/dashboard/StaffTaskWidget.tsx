import { CheckSquare, Clock, User, MoreHorizontal, Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  completed: boolean;
}

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Verify stock delivery from MediCare",
    assignee: "John Doe",
    priority: "high",
    dueDate: "Today, 2:00 PM",
    completed: false
  },
  {
    id: "2",
    title: "Update expiry labels for Shelf A",
    assignee: "Jane Smith",
    priority: "medium",
    dueDate: "Tomorrow",
    completed: false
  },
  {
    id: "3",
    title: "Clean counter area",
    assignee: "Mike Ross",
    priority: "low",
    dueDate: "Today, 6:00 PM",
    completed: true
  }
];

export default function StaffTaskWidget() {
  return (
    <div className="bg-white rounded-card shadow-card h-full flex flex-col">
      <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
          <CheckSquare size={20} className="text-primary-yellow-dark" />
          Staff Tasks
        </h3>
        <button className="p-1 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {MOCK_TASKS.map((task) => (
            <div key={task.id} className={`group flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors ${task.completed ? "opacity-60" : ""}`}>
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  defaultChecked={task.completed}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-yellow focus:ring-primary-yellow"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-neutral-900 truncate ${task.completed ? "line-through text-neutral-500" : ""}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <User size={12} />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock size={12} />
                    <span>{task.dueDate}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${
                    task.priority === "high" ? "bg-red-100 text-red-700" :
                    task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-600 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-neutral-200 bg-neutral-50 rounded-b-card">
        <button className="w-full text-center text-xs font-medium text-neutral-600 hover:text-primary-yellow-dark transition-colors">
          View All Tasks
        </button>
      </div>
    </div>
  );
}