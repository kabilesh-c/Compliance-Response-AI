"use client";

import { useState } from "react";
import { TrendingUp, Clock, AlertTriangle, Package, Calendar } from "lucide-react";
import AIExplanationDrawer, { AIExplanation } from "@/components/ai/AIExplanationDrawer";

type AlertType = "ALL" | "LOW_STOCK" | "ZERO_STOCK";

// AI-generated labels for each alert
type AILabel = "High Demand" | "Supplier Delay" | "Seasonal Spike" | null;

interface Alert {
  medicine: string;
  brand: string;
  stock: number;
  rack: string;
  status: string;
  aiLabel?: AILabel;
  aiReason?: string;
}

export default function StockAlertCard() {
  const [activeTab, setActiveTab] = useState<AlertType>("ALL");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);

  const alerts: Alert[] = [
    { 
      medicine: "Paracetamol 500mg", 
      brand: "Calpol", 
      stock: 5, 
      rack: "A12", 
      status: "LOW_STOCK",
      aiLabel: "High Demand",
      aiReason: "25% increase in sales last 7 days"
    },
    { 
      medicine: "Amoxicillin 250mg", 
      brand: "Novamox", 
      stock: 0, 
      rack: "B8", 
      status: "ZERO_STOCK",
      aiLabel: "Supplier Delay",
      aiReason: "Supplier delayed by 3 days, expected Friday"
    },
    { 
      medicine: "Ibuprofen 400mg", 
      brand: "Brufen", 
      stock: 3, 
      rack: "C5", 
      status: "LOW_STOCK",
      aiLabel: "Seasonal Spike",
      aiReason: "Monsoon season typically increases demand by 40%"
    },
  ];

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
    <div className="bg-white rounded-card shadow-card p-6 h-full min-h-[350px] max-h-[450px] flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Stock Alert</h3>
      
      <div className="flex gap-2 mb-4">
        {(["ALL", "LOW_STOCK", "ZERO_STOCK"] as AlertType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary-yellow text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-200">
            <tr className="text-left text-sm text-neutral-600">
              <th className="pb-3 font-medium">Medicine</th>
              <th className="pb-3 font-medium">Brand</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Rack</th>
              <th className="pb-3 font-medium">AI Insight</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, i) => {
              const labelStyle = getAILabelStyle(alert.aiLabel);
              return (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-3 text-neutral-900">{alert.medicine}</td>
                  <td className="py-3 text-neutral-600 text-sm">{alert.brand}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-pill text-xs font-medium ${
                      alert.stock === 0 
                        ? "bg-status-danger/20 text-status-danger" 
                        : "bg-status-warning/20 text-status-warning"
                    }`}>
                      {alert.stock}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-600 text-sm">{alert.rack}</td>
                  <td className="py-3">
                    {labelStyle && alert.aiLabel && (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${labelStyle.bg} ${labelStyle.text}`}>
                          <labelStyle.icon size={10} />
                          {alert.aiLabel}
                        </span>
                        <button 
                          onClick={() => openExplanation(alert)}
                          className="px-1.5 py-0.5 text-[10px] font-medium text-primary-yellow-dark bg-primary-yellow/10 hover:bg-primary-yellow/20 rounded transition-colors"
                        >
                          Why?
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI Explanation Drawer */}
      <AIExplanationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        explanation={selectedExplanation}
      />
    </div>
  );
}
