"use client";

import { useState } from "react";
import { Check, X, HelpCircle, TrendingUp, Calendar, Package, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import AIExplanationDrawer, { AIExplanation } from "@/components/ai/AIExplanationDrawer";

interface ReorderSuggestion {
  id: string;
  medicineName: string;
  currentStock: number;
  predictedDailyUsage: number;
  suggestedQuantity: number;
  suggestedDate: string;
  confidence: "high" | "medium" | "low";
  status: "pending" | "approved" | "ignored";
  reason: string;
}

const mockSuggestions: ReorderSuggestion[] = [
  {
    id: "1",
    medicineName: "Paracetamol 500mg",
    currentStock: 45,
    predictedDailyUsage: 18,
    suggestedQuantity: 200,
    suggestedDate: "2025-01-20",
    confidence: "high",
    status: "pending",
    reason: "High demand trend detected over last 7 days"
  },
  {
    id: "2",
    medicineName: "Amoxicillin 250mg",
    currentStock: 30,
    predictedDailyUsage: 8,
    suggestedQuantity: 100,
    suggestedDate: "2025-01-22",
    confidence: "high",
    status: "pending",
    reason: "Seasonal spike expected based on historical data"
  },
  {
    id: "3",
    medicineName: "Cetirizine 10mg",
    currentStock: 25,
    predictedDailyUsage: 12,
    suggestedQuantity: 150,
    suggestedDate: "2025-01-19",
    confidence: "medium",
    status: "approved",
    reason: "Allergy season approaching"
  },
  {
    id: "4",
    medicineName: "Omeprazole 20mg",
    currentStock: 60,
    predictedDailyUsage: 5,
    suggestedQuantity: 50,
    suggestedDate: "2025-01-25",
    confidence: "low",
    status: "pending",
    reason: "Moderate demand, buffer stock recommended"
  },
  {
    id: "5",
    medicineName: "Metformin 500mg",
    currentStock: 0,
    predictedDailyUsage: 15,
    suggestedQuantity: 250,
    suggestedDate: "2025-01-18",
    confidence: "high",
    status: "pending",
    reason: "Out of stock - urgent reorder required"
  },
];

export default function ReorderSuggestions() {
  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<AIExplanation | null>(null);

  const canApprove = user?.role === "ADMIN" || user?.role === "MANAGER";
  const isPharmacist = user?.role === "PHARMACIST";

  const handleApprove = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, status: "approved" as const } : s)
    );
  };

  const handleIgnore = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, status: "ignored" as const } : s)
    );
  };

  const openExplanation = (suggestion: ReorderSuggestion) => {
    const explanation: AIExplanation = {
      title: `Reorder ${suggestion.medicineName}`,
      summary: suggestion.reason,
      confidence: suggestion.confidence === "high" ? 94 : suggestion.confidence === "medium" ? 76 : 58,
      confidenceLevel: suggestion.confidence,
      dataUsed: [
        { label: "Current Stock", value: `${suggestion.currentStock} units`, icon: Package },
        { label: "Daily Usage", value: `${suggestion.predictedDailyUsage} units/day`, icon: TrendingUp },
        { label: "Suggested Qty", value: `${suggestion.suggestedQuantity} units`, icon: Package },
        { label: "Reorder Date", value: new Date(suggestion.suggestedDate).toLocaleDateString("en-IN"), icon: Calendar },
      ],
      signals: [
        { name: "Demand Trend", impact: "positive", description: "Sales increased 15% over last 7 days" },
        { name: "Lead Time", impact: "neutral", description: "Supplier typically delivers in 3-5 days" },
        { name: "Stock Level", impact: suggestion.currentStock < 30 ? "negative" : "neutral", description: suggestion.currentStock < 30 ? "Stock critically low" : "Stock at moderate level" },
      ],
      recommendation: `Order ${suggestion.suggestedQuantity} units by ${new Date(suggestion.suggestedDate).toLocaleDateString("en-IN")} to maintain optimal stock levels and avoid stockouts.`,
      timestamp: "Just now"
    };
    setSelectedExplanation(explanation);
    setDrawerOpen(true);
  };

  const getConfidenceBadge = (confidence: ReorderSuggestion["confidence"]) => {
    const styles = {
      high: "bg-status-success/10 text-status-success border-status-success/20",
      medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
      low: "bg-neutral-100 text-neutral-600 border-neutral-200"
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[confidence]}`}>
        {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
      </span>
    );
  };

  const getStatusPill = (status: ReorderSuggestion["status"]) => {
    const styles = {
      pending: "bg-status-warning/10 text-status-warning",
      approved: "bg-status-success/10 text-status-success",
      ignored: "bg-neutral-100 text-neutral-500"
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const pendingCount = suggestions.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-yellow-dark" />
          <span className="text-sm text-neutral-600">
            <strong className="text-neutral-900">{pendingCount}</strong> suggestions awaiting review
          </span>
        </div>
        <p className="text-xs text-neutral-500">AI-generated based on demand forecasting</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {suggestions.length === 0 ? (
          <div className="py-16 text-center text-neutral-500">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">No reorder suggestions</p>
            <p className="text-sm">All stock levels are optimal</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Medicine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Daily Usage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Suggested Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Reorder Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {suggestions.map((suggestion) => (
                  <tr key={suggestion.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-neutral-900">{suggestion.medicineName}</p>
                          <p className="text-xs text-neutral-500">Stock: {suggestion.currentStock} units</p>
                        </div>
                        <button 
                          onClick={() => openExplanation(suggestion)}
                          className="px-2 py-0.5 text-xs font-medium text-primary-yellow-dark bg-primary-yellow/10 hover:bg-primary-yellow/20 rounded-md transition-colors"
                        >
                          Why?
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-neutral-900">{suggestion.predictedDailyUsage}</span>
                      <span className="text-xs text-neutral-500"> units/day</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-primary-yellow-dark">{suggestion.suggestedQuantity}</span>
                      <span className="text-xs text-neutral-500"> units</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <Calendar size={14} />
                        {new Date(suggestion.suggestedDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short"
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getConfidenceBadge(suggestion.confidence)}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusPill(suggestion.status)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {suggestion.status === "pending" && (
                        <>
                          {isPharmacist ? (
                            <div className="flex items-center justify-end gap-2 px-2 py-1 bg-neutral-100 rounded-lg">
                              <Lock size={12} className="text-neutral-400" />
                              <span className="text-xs text-neutral-500 font-medium">Manager approval required</span>
                            </div>
                          ) : canApprove && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(suggestion.id)}
                                className="p-2 rounded-lg bg-status-success/10 text-status-success hover:bg-status-success/20 transition-colors"
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleIgnore(suggestion.id)}
                                className="p-2 rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                                title="Ignore"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center">
        AI suggestions require manager approval before execution
      </p>

      {/* AI Explanation Drawer */}
      <AIExplanationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        explanation={selectedExplanation}
      />
    </div>
  );
}
