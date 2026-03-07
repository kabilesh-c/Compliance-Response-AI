"use client";

import { useState } from "react";
import { TrendingDown, Sparkles, Calendar, Package, TrendingUp } from "lucide-react";
import AIExplanationDrawer, { AIExplanation } from "@/components/ai/AIExplanationDrawer";

interface ExpiringItem {
  medicine: string;
  expiry: string;
  aiSuggestion: string | null;
  salesVelocity: "low" | "normal";
}

export default function ExpiringSoonCard() {
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);
  const months = ["July", "August", "September"];

  const expiring: ExpiringItem[] = [
    { medicine: "Atorvastatin 10mg", expiry: "2025-07-10", aiSuggestion: "Discount 10% to clear stock", salesVelocity: "low" },
    { medicine: "Amlodipine 5mg", expiry: "2025-07-22", aiSuggestion: null, salesVelocity: "normal" },
    { medicine: "Omeprazole 20mg", expiry: "2025-07-30", aiSuggestion: "Promote with antacids bundle", salesVelocity: "low" },
  ];

  const openExplanation = (item: ExpiringItem) => {
    const explanation: AIExplanation = {
      title: `Expiring: ${item.medicine}`,
      summary: item.aiSuggestion || "This item is expiring soon and may need attention",
      confidence: item.salesVelocity === "low" ? 89 : 72,
      confidenceLevel: item.salesVelocity === "low" ? "high" : "medium",
      dataUsed: [
        { label: "Expiry Date", value: item.expiry, icon: Calendar },
        { label: "Sales Velocity", value: item.salesVelocity === "low" ? "Below average" : "Normal", icon: TrendingDown },
        { label: "Days Left", value: `${Math.ceil((new Date(item.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`, icon: Calendar },
        { label: "Stock Status", value: "In stock", icon: Package },
      ],
      signals: [
        { name: "Expiry Timeline", impact: "negative", description: "Product expires within 30 days" },
        { name: "Sales Trend", impact: item.salesVelocity === "low" ? "negative" : "neutral", description: item.salesVelocity === "low" ? "Sales declining - risk of waste" : "Sales at normal rate" },
        { name: "FEFO Compliance", impact: "positive", description: "Flagged for first-expiry-first-out handling" },
      ],
      recommendation: item.aiSuggestion || "Monitor sales and consider promotional pricing if velocity remains low.",
      timestamp: "Just now"
    };
    setSelectedExplanation(explanation);
    setDrawerOpen(true);
  };

  return (
    <div className="bg-gradient-to-br from-status-expiring to-status-warning rounded-card shadow-card p-6 text-white h-full min-h-[350px] max-h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Expiring Soon</h3>
          <span className="flex items-center gap-1 text-[10px] mt-1 opacity-80">
            <Sparkles size={10} />
            AI monitoring velocity
          </span>
        </div>
        <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold">
          {expiring.length}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
              selectedMonth === month
                ? "bg-white text-status-expiring"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {month}
          </button>
        ))}
      </div>
      
      <div className="space-y-3 flex-1 overflow-auto">
        {expiring.map((item, i) => (
          <div key={i} className="bg-white/10 rounded-button px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.medicine}</span>
                {item.salesVelocity === "low" && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-white/20 rounded">
                    <TrendingDown size={8} />
                    LOW SALES
                  </span>
                )}
              </div>
              <span className="text-xs opacity-90">{item.expiry}</span>
            </div>
            {item.aiSuggestion && (
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[10px] opacity-70 flex items-center gap-1">
                  <Sparkles size={8} />
                  AI: {item.aiSuggestion}
                </p>
                <button 
                  onClick={() => openExplanation(item)}
                  className="px-1.5 py-0.5 text-[9px] font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
                >
                  Why?
                </button>
              </div>
            )}
          </div>
        ))}
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
