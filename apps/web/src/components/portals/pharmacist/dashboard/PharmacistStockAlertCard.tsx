"use client";

import { useState } from "react";
import { TrendingUp, Clock, AlertTriangle, Package, CheckCircle } from "lucide-react";
import AIExplanationDrawer, { AIExplanation } from "@/components/ai/AIExplanationDrawer";

type AlertType = "ALL" | "LOW_STOCK" | "ZERO_STOCK";

// AI-generated labels for each alert
type AILabel = "High Demand" | "Supplier Delay" | "Seasonal Spike" | null;

interface Alert {
  id: string;
  medicine: string;
  brand: string;
  stock: number;
  rack: string;
  status: string;
  aiLabel?: AILabel;
  aiReason?: string;
  acknowledged?: boolean;
}

export default function PharmacistStockAlertCard() {
  const [activeTab, setActiveTab] = useState<AlertType>("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([
    { 
      id: "1",
      medicine: "Paracetamol 500mg", 
      brand: "Calpol", 
      stock: 5, 
      rack: "A12", 
      status: "LOW_STOCK",
      aiLabel: "High Demand",
      aiReason: "25% increase in sales last 7 days"
    },
    { 
      id: "2",
      medicine: "Amoxicillin 250mg", 
      brand: "Novamox", 
      stock: 0, 
      rack: "B8", 
      status: "ZERO_STOCK",
      aiLabel: "Supplier Delay",
      aiReason: "Supplier delayed by 3 days, expected Friday"
    },
    { 
      id: "3",
      medicine: "Ibuprofen 400mg", 
      brand: "Brufen", 
      stock: 3, 
      rack: "C5", 
      status: "LOW_STOCK",
      aiLabel: "Seasonal Spike",
      aiReason: "Monsoon season typically increases demand by 40%"
    },
  ]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const getAILabelStyle = (label: AILabel) => {
    switch (label) {
      case "High Demand":
        return { bg: "bg-status-success/10", text: "text-status-success", icon: TrendingUp };
      case "Supplier Delay":
        return { bg: "bg-status-warning/10", text: "text-status-warning", icon: Clock };
      case "Seasonal Spike":
        return { bg: "bg-blue-500/10", text: "text-blue-500", icon: AlertTriangle };
      default:
        return null;
    }
  };

  const openExplanation = (alert: Alert) => {
    const explanation: AIExplanation = {
      title: `Stock Alert: ${alert.medicine}`,
      summary: alert.aiReason || "AI detected an anomaly in stock levels",
      confidence: alert.aiLabel === "High Demand" ? 92 : alert.aiLabel === "Supplier Delay" ? 88 : 76,
      confidenceLevel: alert.aiLabel === "High Demand" ? "high" : alert.aiLabel === "Supplier Delay" ? "high" : "medium",
      dataUsed: [
        { label: "Current Stock", value: `${alert.stock} units`, icon: Package },
        { label: "Rack Location", value: alert.rack, icon: Package },
        { label: "Brand", value: alert.brand, icon: TrendingUp },
        { label: "Alert Type", value: alert.status.replace("_", " "), icon: AlertTriangle },
      ],
      signals: [
        { name: "Stock Velocity", impact: "negative", description: "Stock depleting faster than expected" },
        { name: "Historical Trend", impact: "positive", description: "Similar patterns seen in past" },
        { name: "External Factors", impact: "neutral", description: alert.aiLabel === "Seasonal Spike" ? "Seasonal patterns detected" : "No external factors identified" },
      ],
      recommendation: `Reorder ${alert.medicine} immediately to avoid stockout. Consider increasing safety stock by 20%.`,
      timestamp: "Just now"
    };
    setSelectedExplanation(explanation);
    setDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Stock Alert</h3>
      
      <div className="flex gap-2 mb-4">
        {(["ALL", "LOW_STOCK", "ZERO_STOCK"] as AlertType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary-green text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-200">
            <tr className="text-left text-sm text-neutral-600">
              <th className="pb-3 font-medium">Medicine</th>
              <th className="pb-3 font-medium">Brand</th>
              <th className="pb-3 font-medium text-center">Stock</th>
              <th className="pb-3 font-medium text-center">Rack</th>
              <th className="pb-3 font-medium">AI Insight</th>
              <th className="pb-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => {
              const aiStyle = getAILabelStyle(alert.aiLabel);
              const Icon = aiStyle?.icon;
              
              return (
                <tr key={index} className={`border-b border-neutral-100 last:border-0 ${alert.acknowledged ? "opacity-50 bg-neutral-50" : ""}`}>
                  <td className="py-3 text-neutral-900 font-medium">{alert.medicine}</td>
                  <td className="py-3 text-neutral-600 text-sm">{alert.brand}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      alert.stock === 0 ? "bg-status-danger/10 text-status-danger" :
                      alert.stock <= 5 ? "bg-status-warning/10 text-status-warning" :
                      "bg-status-success/10 text-status-success"
                    }`}>
                      {alert.stock}
                    </span>
                  </td>
                  <td className="py-3 text-center text-neutral-600 text-sm">{alert.rack}</td>
                  <td className="py-3">
                    {aiStyle && Icon && (
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${aiStyle.bg} ${aiStyle.text}`}>
                          <Icon size={10} />
                          {alert.aiLabel}
                        </span>
                        <button 
                          onClick={() => openExplanation(alert)}
                          className="text-[10px] text-primary-green hover:underline font-medium"
                        >
                          Why?
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {!alert.acknowledged ? (
                      <button 
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-xs font-medium text-primary-green hover:text-primary-green-dark flex items-center justify-end gap-1 w-full"
                      >
                        <CheckCircle size={14} /> Ack
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-400 flex items-center justify-end gap-1">
                        <CheckCircle size={14} /> Done
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AIExplanationDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        explanation={selectedExplanation}
      />
    </div>
  );
}
