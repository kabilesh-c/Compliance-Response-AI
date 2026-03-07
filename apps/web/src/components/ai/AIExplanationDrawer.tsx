"use client";

import { useState, useEffect } from "react";
import { X, Brain, TrendingUp, Calendar, Package, Clock, BarChart3, CheckCircle, AlertTriangle, Info } from "lucide-react";

export interface AIExplanation {
  title: string;
  summary: string;
  confidence: number;
  confidenceLevel: "high" | "medium" | "low";
  dataUsed: {
    label: string;
    value: string;
    icon: typeof TrendingUp;
  }[];
  signals: {
    name: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
  }[];
  recommendation: string;
  timestamp: string;
}

interface AIExplanationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: AIExplanation | null;
}

export default function AIExplanationDrawer({ isOpen, onClose, explanation }: AIExplanationDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setMounted(false);
    }
  };

  if (!mounted && !isOpen) return null;

  const getConfidenceColor = (level: "high" | "medium" | "low") => {
    switch (level) {
      case "high": return "text-status-success bg-status-success/10";
      case "medium": return "text-status-warning bg-status-warning/10";
      case "low": return "text-status-danger bg-status-danger/10";
    }
  };

  const getConfidenceBarColor = (level: "high" | "medium" | "low") => {
    switch (level) {
      case "high": return "bg-status-success";
      case "medium": return "bg-status-warning";
      case "low": return "bg-status-danger";
    }
  };

  const getImpactIcon = (impact: "positive" | "negative" | "neutral") => {
    switch (impact) {
      case "positive": return <CheckCircle size={14} className="text-status-success" />;
      case "negative": return <AlertTriangle size={14} className="text-status-danger" />;
      case "neutral": return <Info size={14} className="text-neutral-400" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {explanation && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-yellow/20 flex items-center justify-center">
                  <Brain size={20} className="text-primary-yellow-dark" />
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900">AI Explanation</h2>
                  <p className="text-xs text-neutral-500">Why this recommendation?</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title & Summary */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{explanation.title}</h3>
                <p className="text-sm text-neutral-600">{explanation.summary}</p>
              </div>

              {/* Confidence Score */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-neutral-700">Confidence Score</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getConfidenceColor(explanation.confidenceLevel)}`}>
                    {explanation.confidence}% {explanation.confidenceLevel.toUpperCase()}
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getConfidenceBarColor(explanation.confidenceLevel)}`}
                    style={{ width: `${explanation.confidence}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-neutral-400">
                  <span>Low (50%)</span>
                  <span>Medium (75%)</span>
                  <span>High (90%+)</span>
                </div>
              </div>

              {/* Data Used */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary-yellow-dark" />
                  Data Analyzed
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {explanation.dataUsed.map((data, index) => {
                    const Icon = data.icon;
                    return (
                      <div key={index} className="bg-white border border-neutral-200 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={14} className="text-neutral-400" />
                          <span className="text-xs text-neutral-500">{data.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900">{data.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Signals Considered */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary-yellow-dark" />
                  Signals Considered
                </h4>
                <div className="space-y-2">
                  {explanation.signals.map((signal, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white border border-neutral-200 rounded-xl">
                      {getImpactIcon(signal.impact)}
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{signal.name}</p>
                        <p className="text-xs text-neutral-500">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-primary-yellow/10 border border-primary-yellow/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary-yellow-dark" />
                  Recommendation
                </h4>
                <p className="text-sm text-neutral-700">{explanation.recommendation}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Generated {explanation.timestamp}
                </span>
                <span>AI Model v2.1</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
