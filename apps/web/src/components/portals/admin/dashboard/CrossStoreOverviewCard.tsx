"use client";

import { Store, TrendingUp, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface StoreData {
  name: string;
  inventoryHealth: number;
  riskScore: number;
  status: "healthy" | "warning" | "critical";
}

export default function CrossStoreOverviewCard() {
  const stores: StoreData[] = [
    { name: "Main Branch", inventoryHealth: 92, riskScore: 8, status: "healthy" },
    { name: "City Center", inventoryHealth: 78, riskScore: 22, status: "warning" },
    { name: "Mall Outlet", inventoryHealth: 65, riskScore: 35, status: "critical" },
    { name: "Hospital Wing", inventoryHealth: 88, riskScore: 12, status: "healthy" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-status-success bg-status-success/10";
      case "warning": return "text-status-warning bg-status-warning/10";
      case "critical": return "text-status-danger bg-status-danger/10";
      default: return "text-neutral-500 bg-neutral-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return CheckCircle;
      case "warning": return AlertTriangle;
      case "critical": return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 h-full border-t-4 border-primary-blue">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Cross-Store Overview</h3>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-xs font-bold">
          <Store size={12} />
          4 Locations
        </span>
      </div>

      <div className="space-y-3">
        {stores.map((store, index) => {
          const StatusIcon = getStatusIcon(store.status);
          return (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 bg-neutral-50 rounded-button hover:bg-neutral-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(store.status)}`}>
                <StatusIcon size={18} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">{store.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(store.status)}`}>
                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Inventory Health Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>Inventory Health</span>
                      <span className="font-medium">{store.inventoryHealth}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          store.inventoryHealth >= 80 ? "bg-status-success" :
                          store.inventoryHealth >= 60 ? "bg-status-warning" : "bg-status-danger"
                        }`}
                        style={{ width: `${store.inventoryHealth}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Risk Score */}
                  <div className="text-center px-3">
                    <div className={`text-lg font-bold ${
                      store.riskScore <= 15 ? "text-status-success" :
                      store.riskScore <= 30 ? "text-status-warning" : "text-status-danger"
                    }`}>
                      {store.riskScore}
                    </div>
                    <div className="text-[10px] text-neutral-500">Risk</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
