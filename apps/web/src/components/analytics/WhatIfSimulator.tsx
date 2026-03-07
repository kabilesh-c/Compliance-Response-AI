"use client";

import { useState } from "react";
import { Sparkles, Calculator, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";

interface SimulationResult {
  wastageChange: number;
  costSavings: number;
  stockoutRisk: number;
}

export default function WhatIfSimulator() {
  const [reorderThreshold, setReorderThreshold] = useState(20);
  const [expiryBuffer, setExpiryBuffer] = useState(30);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    // Simulate AI processing
    setTimeout(() => {
      // Mock calculation based on inputs
      const wastageChange = ((30 - expiryBuffer) / 30) * -15; // Less buffer = less wastage
      const costSavings = Math.round(5000 + (reorderThreshold - 10) * 200 + (30 - expiryBuffer) * 100);
      const stockoutRisk = Math.round(Math.max(0, (25 - reorderThreshold) * 3 + (30 - expiryBuffer) * 2));

      setResult({
        wastageChange: Math.round(wastageChange * 10) / 10,
        costSavings,
        stockoutRisk: Math.min(100, stockoutRisk),
      });
      setIsSimulating(false);
    }, 800);
  };

  const resetSimulation = () => {
    setReorderThreshold(20);
    setExpiryBuffer(30);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-yellow/20 rounded-lg flex items-center justify-center">
            <Calculator size={16} className="text-primary-yellow-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">What-If Simulator</h3>
            <p className="text-xs text-neutral-500">Simulate policy changes</p>
          </div>
        </div>
        <span className="px-2 py-1 text-[10px] font-bold bg-primary-yellow text-neutral-900 rounded-full flex items-center gap-1">
          <Sparkles size={10} />
          AI
        </span>
      </div>

      {/* Sliders */}
      <div className="space-y-5 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700">Reorder Threshold</label>
            <span className="text-sm font-bold text-neutral-900">{reorderThreshold}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="40"
            value={reorderThreshold}
            onChange={(e) => setReorderThreshold(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-yellow"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
            <span>Aggressive (10%)</span>
            <span>Conservative (40%)</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700">Expiry Buffer</label>
            <span className="text-sm font-bold text-neutral-900">{expiryBuffer} days</span>
          </div>
          <input
            type="range"
            min="15"
            max="60"
            value={expiryBuffer}
            onChange={(e) => setExpiryBuffer(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-yellow"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
            <span>15 days</span>
            <span>60 days</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-yellow text-neutral-900 rounded-xl font-medium hover:bg-primary-yellow-dark transition-colors disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Run Simulation
            </>
          )}
        </button>
        <button
          onClick={resetSimulation}
          className="p-2.5 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Projected Impact</p>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className={`flex items-center justify-center gap-1 text-lg font-bold ${result.wastageChange < 0 ? "text-status-success" : "text-status-danger"}`}>
                {result.wastageChange < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                {Math.abs(result.wastageChange)}%
              </div>
              <p className="text-[10px] text-neutral-500">Wastage</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-status-success">
                ₹{result.costSavings.toLocaleString()}
              </div>
              <p className="text-[10px] text-neutral-500">Monthly Savings</p>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${result.stockoutRisk > 20 ? "text-status-danger" : result.stockoutRisk > 10 ? "text-status-warning" : "text-status-success"}`}>
                {result.stockoutRisk}%
              </div>
              <p className="text-[10px] text-neutral-500">Stockout Risk</p>
            </div>
          </div>

          <p className="text-xs text-neutral-600 mt-3 pt-3 border-t border-neutral-200">
            <Sparkles size={10} className="inline mr-1 text-primary-yellow" />
            AI Recommendation: {result.stockoutRisk > 20 
              ? "Consider increasing reorder threshold to reduce stockout risk." 
              : result.wastageChange > 0 
                ? "Reduce expiry buffer to minimize wastage." 
                : "These settings optimize cost savings with acceptable risk levels."}
          </p>
        </div>
      )}
    </div>
  );
}
