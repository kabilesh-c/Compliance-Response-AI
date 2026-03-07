import { CheckCircle, XCircle, Clock, Play, AlertTriangle, RefreshCw } from "lucide-react";

interface ExecutionLog {
  id: string;
  workflowName: string;
  triggeredBy: string;
  status: "success" | "failed" | "running";
  startTime: string;
  duration: string;
  details: string;
}

const MOCK_LOGS: ExecutionLog[] = [
  {
    id: "1",
    workflowName: "Low Stock Alert",
    triggeredBy: "System (Inventory Monitor)",
    status: "success",
    startTime: "Today, 10:30 AM",
    duration: "2s",
    details: "Sent alerts for 5 items below threshold"
  },
  {
    id: "2",
    workflowName: "Daily Sales Report",
    triggeredBy: "Schedule (Daily 9:00 AM)",
    status: "success",
    startTime: "Today, 09:00 AM",
    duration: "45s",
    details: "Generated and emailed report to Manager"
  },
  {
    id: "3",
    workflowName: "Expiry Check",
    triggeredBy: "System (Daily Check)",
    status: "failed",
    startTime: "Today, 08:00 AM",
    duration: "12s",
    details: "Connection timeout to database"
  },
  {
    id: "4",
    workflowName: "Auto-Reorder",
    triggeredBy: "Stock Level < 10%",
    status: "running",
    startTime: "Today, 11:15 AM",
    duration: "Running...",
    details: "Processing order for Paracetamol"
  }
];

export default function AutomationExecutionLog() {
  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
          <Clock size={20} className="text-primary-yellow-dark" />
          Recent Executions
        </h3>
        <button className="text-sm text-primary-yellow-dark hover:text-primary-yellow-darker font-medium flex items-center gap-1">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      
      <div className="divide-y divide-neutral-100">
        {MOCK_LOGS.map((log) => (
          <div key={log.id} className="p-4 hover:bg-neutral-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {log.status === "success" && <CheckCircle size={18} className="text-status-success" />}
                {log.status === "failed" && <XCircle size={18} className="text-status-error" />}
                {log.status === "running" && <Play size={18} className="text-primary-blue animate-pulse" />}
                
                <div>
                  <h4 className="font-medium text-neutral-900 text-sm">{log.workflowName}</h4>
                  <p className="text-xs text-neutral-500">{log.triggeredBy}</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-mono">{log.startTime}</span>
            </div>
            
            <div className="pl-8">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600">{log.details}</span>
                <span className="font-medium text-neutral-500">{log.duration}</span>
              </div>
              {log.status === "failed" && (
                <div className="mt-2 flex items-center gap-2 text-xs text-status-error bg-status-error/5 p-2 rounded">
                  <AlertTriangle size={12} />
                  <span>Error: Database connection failed. Retrying in 5m...</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-center">
        <button className="text-xs font-medium text-neutral-600 hover:text-neutral-900">
          View Full Execution History
        </button>
      </div>
    </div>
  );
}