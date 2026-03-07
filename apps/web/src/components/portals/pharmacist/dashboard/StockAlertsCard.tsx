"use client";

import { AlertTriangle, Package, XCircle, TrendingDown, Eye } from "lucide-react";

interface StockAlert {
  id: string;
  medicine: string;
  brand: string;
  currentStock: number;
  minStock: number;
  rack: string;
  status: "low" | "zero" | "critical";
}

export default function StockAlertsCard() {
  const alerts: StockAlert[] = [
    { id: "1", medicine: "Paracetamol 500mg", brand: "Calpol", currentStock: 5, minStock: 50, rack: "A12", status: "critical" },
    { id: "2", medicine: "Amoxicillin 250mg", brand: "Novamox", currentStock: 0, minStock: 30, rack: "B8", status: "zero" },
    { id: "3", medicine: "Ibuprofen 400mg", brand: "Brufen", currentStock: 12, minStock: 40, rack: "C5", status: "low" },
    { id: "4", medicine: "Cetirizine 10mg", brand: "Zyrtec", currentStock: 8, minStock: 25, rack: "A3", status: "low" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "zero": return { bg: "bg-status-danger", text: "text-status-danger", bgLight: "bg-status-danger/10", icon: XCircle, label: "Out of Stock" };
      case "critical": return { bg: "bg-status-danger", text: "text-status-danger", bgLight: "bg-status-danger/10", icon: AlertTriangle, label: "Critical" };
      case "low": return { bg: "bg-status-warning", text: "text-status-warning", bgLight: "bg-status-warning/10", icon: TrendingDown, label: "Low Stock" };
      default: return { bg: "bg-neutral-400", text: "text-neutral-600", bgLight: "bg-neutral-100", icon: Package, label: "Unknown" };
    }
  };

  const zeroCount = alerts.filter(a => a.status === "zero").length;
  const lowCount = alerts.filter(a => a.status === "low" || a.status === "critical").length;

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full border-t-4 border-primary-green">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">Stock Alerts</h3>
          <div className="flex items-center gap-2">
            {zeroCount > 0 && (
              <span className="px-2 py-0.5 bg-status-danger/10 text-status-danger rounded-full text-xs font-bold">
                {zeroCount} Zero
              </span>
            )}
            <span className="px-2 py-0.5 bg-status-warning/10 text-status-warning rounded-full text-xs font-bold">
              {lowCount} Low
            </span>
          </div>
        </div>
        <button className="text-sm text-primary-green hover:underline font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const statusStyle = getStatusStyle(alert.status);
          const StatusIcon = statusStyle.icon;
          const stockPercentage = Math.max(0, (alert.currentStock / alert.minStock) * 100);
          
          return (
            <div 
              key={alert.id}
              className={`p-4 rounded-button border-l-4 ${
                alert.status === "zero" ? "border-l-status-danger bg-status-danger/5" :
                alert.status === "critical" ? "border-l-status-danger bg-status-danger/5" :
                "border-l-status-warning bg-status-warning/5"
              } hover:shadow-card transition-all`}
            >
              <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={`w-10 h-10 rounded-full ${statusStyle.bgLight} flex items-center justify-center flex-shrink-0`}>
                  <StatusIcon size={18} className={statusStyle.text} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-neutral-900 truncate">{alert.medicine}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.bgLight} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{alert.brand}</span>
                    <span>Rack: {alert.rack}</span>
                  </div>
                  
                  {/* Stock Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-bold ${statusStyle.text}`}>{alert.currentStock} units</span>
                      <span className="text-neutral-400">Min: {alert.minStock}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          alert.status === "zero" ? "bg-status-danger" :
                          alert.status === "critical" ? "bg-status-danger" : "bg-status-warning"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors flex-shrink-0">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
