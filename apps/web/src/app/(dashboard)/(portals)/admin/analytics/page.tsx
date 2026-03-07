"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Activity, Users, FileText, AlertTriangle, Download, PieChart, ArrowUpRight, ArrowDownRight, Brain, Sparkles, Zap } from "lucide-react";

export default function HospitalAnalyticsPage() {
  const [aiMode, setAiMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            Hospital Analytics
            {aiMode && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1"><Brain size={12}/> AI Enhanced</span>}
          </h1>
          <p className="text-neutral-500">System-wide usage, efficiency reports, and predictive insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* AI Toggle */}
          <div className="bg-neutral-100 p-1 rounded-xl flex items-center cursor-pointer border border-neutral-200">
            <button 
              onClick={() => setAiMode(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!aiMode ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              Normal
            </button>
            <button 
              onClick={() => setAiMode(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${aiMode ? "bg-yellow-400 text-yellow-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              <Sparkles size={14} />
              AI Insights
            </button>
          </div>

          <select className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/20 cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Year to Date</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-xl text-sm font-medium hover:bg-primary-blue-dark transition-colors shadow-sm shadow-blue-200">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics - Conditional Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!aiMode ? (
          // Normal Metrics
          [
            { label: "Total Requests", value: "1,284", change: "+12%", trend: "up", icon: FileText, color: "bg-blue-500" },
            { label: "Critical Alerts", value: "24", change: "-5%", trend: "down", icon: AlertTriangle, color: "bg-red-500" },
            { label: "Active Staff", value: "156", change: "+2%", trend: "up", icon: Users, color: "bg-green-500" },
            { label: "Avg Response Time", value: "12m", change: "-8%", trend: "down", icon: Activity, color: "bg-purple-500" },
          ].map((metric, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                  <metric.icon size={24} className="text-white" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                  metric.trend === "up" && metric.label !== "Critical Alerts" && metric.label !== "Avg Response Time" ? "bg-green-50 text-green-600" : 
                  metric.trend === "down" && (metric.label === "Critical Alerts" || metric.label === "Avg Response Time") ? "bg-green-50 text-green-600" :
                  "bg-red-50 text-red-600"
                }`}>
                  {metric.change}
                  {metric.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </span>
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{metric.value}</div>
              <div className="text-sm text-neutral-500">{metric.label}</div>
            </div>
          ))
        ) : (
          // AI Insights Metrics
          [
            { label: "Preventable Wastage", value: "$4,200", change: "High Risk", trend: "up", icon: AlertTriangle, color: "bg-red-500", desc: "Expiry optimization needed" },
            { label: "Efficiency Score", value: "84/100", change: "+5pts", trend: "up", icon: Zap, color: "bg-yellow-500", desc: "Improved approval flows" },
            { label: "Anomalies Detected", value: "3", change: "New", trend: "up", icon: Activity, color: "bg-purple-500", desc: "Unusual usage in ICU" },
            { label: "Optimization Potential", value: "$12k", change: "Available", trend: "up", icon: TrendingUp, color: "bg-green-500", desc: "Bulk ordering savings" },
          ].map((metric, i) => (
            <div key={i} className="bg-yellow-50/50 rounded-2xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Brain size={64} className="text-yellow-900" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                  <metric.icon size={24} className="text-white" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/80 text-neutral-700 border border-neutral-200">
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-neutral-900 mb-1 relative z-10">{metric.value}</div>
              <div className="text-sm font-medium text-neutral-900 relative z-10">{metric.label}</div>
              <div className="text-xs text-neutral-500 mt-1 relative z-10">{metric.desc}</div>
            </div>
          ))
        )}
      </div>

      {/* EXECUTION ANALYTICS (PHASE-3) */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Activity size={20} className="text-primary-blue" />
          Execution Performance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Approval to Execution Time */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-sm font-medium text-neutral-600">Avg. Approval → Execution</h3>
              <span className="text-2xl font-bold text-neutral-900">4.2 hrs</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[65%] rounded-full"></div>
            </div>
            <p className="text-xs text-neutral-500">Target: &lt; 6 hrs. 12% faster than last month.</p>
          </div>

          {/* Supplier SLA Compliance */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-sm font-medium text-neutral-600">Supplier SLA Compliance</h3>
              <span className="text-2xl font-bold text-green-600">94%</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[94%] rounded-full"></div>
            </div>
            <p className="text-xs text-neutral-500">2 vendors flagged for consistent delays.</p>
          </div>

          {/* Emergency Handling */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-sm font-medium text-neutral-600">Emergency Request Speed</h3>
              <span className="text-2xl font-bold text-purple-600">18 mins</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[85%] rounded-full"></div>
            </div>
            <p className="text-xs text-neutral-500">From request to fulfillment initiation.</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Section (Only visible in AI Mode) */}
      {aiMode && (
        <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Deep Dive Analysis</h2>
              <p className="text-sm text-neutral-600">AI-identified patterns and recommendations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                Consumption Anomalies
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-neutral-900">Morphine Sulfate</div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">+45% Spike</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Unusual increase in Ward C over last 48h. No corresponding patient load increase.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-neutral-900">Surgical Gloves (L)</div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Stockout Risk</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Consumption rate accelerated. Predicted stockout in 3 days.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-500" />
                Optimization Opportunities
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-neutral-900">Bulk Order Consolidation</div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save $2,400</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Combine pending requests from ICU and Emergency for Antibiotics to reach tier 2 discount.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-neutral-900">Expiry Management</div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Reduce Waste</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Transfer near-expiry Paracetamol from OPD (Low usage) to Ward A (High usage).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Request Volume Chart Simulation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-neutral-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-neutral-400" />
              Request Volume by Department
            </h3>
            <button className="text-neutral-400 hover:text-neutral-600">
              <Download size={18} />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[45, 70, 30, 85, 55, 65, 40].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-colors" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 12}
                  </div>
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Consumption Chart Simulation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-neutral-900 flex items-center gap-2">
              <PieChart size={20} className="text-neutral-400" />
              Stock Consumption Distribution
            </h3>
            <button className="text-neutral-400 hover:text-neutral-600">
              <Download size={18} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center gap-8">
            {/* CSS Pie Chart Simulation */}
            <div className="relative w-48 h-48 rounded-full bg-blue-500 border-4 border-white shadow-lg"
                 style={{ background: 'conic-gradient(#3B82F6 0% 35%, #10B981 35% 60%, #F59E0B 60% 80%, #EF4444 80% 100%)' }}>
               <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex items-center justify-center flex-col">
                 <span className="text-2xl font-bold text-neutral-900">Total</span>
                 <span className="text-xs text-neutral-500">Consumption</span>
               </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-neutral-600">Antibiotics (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-neutral-600">Analgesics (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-neutral-600">Supplements (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-neutral-600">Emergency (20%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
