"use client";

import { FileText, AlertTriangle, Package, Truck, Clock, CheckCircle, XCircle, Brain } from "lucide-react";

export default function HospitalManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Pharmacy Manager Dashboard</h1>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Central Pharmacy
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI RECOMMENDATION SUMMARY */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">AI Recommendation Summary</h2>
              <p className="text-sm text-neutral-600">Operational insights & approval suggestions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Suggested Approvals */}
            <div className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm group relative">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-neutral-500">Suggested Approvals</div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">High Confidence</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">8</div>
              <p className="text-xs text-neutral-500">Requests matching historical patterns</p>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Based on standard consumption rates
              </div>
            </div>

            {/* Quantity Reductions */}
            <div className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm group relative">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-neutral-500">Suggested Reductions</div>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Medium Confidence</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">3</div>
              <p className="text-xs text-neutral-500">Over-requesting detected in ICU</p>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Exceeds 30-day average by &gt;20%
              </div>
            </div>

            {/* Expiry Risk Approvals */}
            <div className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm group relative">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-neutral-500">Expiry Risk Alerts</div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Critical</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">2</div>
              <p className="text-xs text-neutral-500">Requests for slow-moving stock</p>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Batch expires in 45 days
              </div>
            </div>
          </div>
        </div>

        {/* CARD 1 — PENDING APPROVALS (YELLOW) */}

        <div className="bg-primary-yellow p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900 text-lg">Pending Approvals</h3>
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="text-neutral-900" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-neutral-900 mb-1">12</div>
              <div className="flex gap-3 text-sm text-neutral-800 mt-2">
                <span className="font-bold bg-red-500/20 px-2 py-0.5 rounded text-red-900">3 Critical</span>
                <span>9 Normal</span>
              </div>
              <p className="text-neutral-700 text-xs mt-3">Longest wait: 4h 12m</p>
            </div>
          </div>
        </div>

        {/* CARD 2 — CENTRAL INVENTORY HEALTH (DARK) */}
        <div className="bg-[#1A1F37] text-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Inventory Health</h3>
            <Package className="text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total SKUs</span>
              <span className="text-white font-medium">2,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Low Stock</span>
              <span className="text-yellow-400 font-medium">45 Items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Zero Stock</span>
              <span className="text-red-400 font-medium">12 Items</span>
            </div>
          </div>
        </div>

        {/* CARD 3 — BULK DEMAND FORECAST (WHITE) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-neutral-900 text-lg">Demand Forecast</h3>
            <Truck className="text-neutral-400" />
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 rounded-xl">
              <div className="text-xs text-neutral-500 mb-1">Next 7 Days</div>
              <div className="text-xl font-bold text-neutral-900">1,240 Units</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <div className="font-bold">45%</div>
                <div>ICU</div>
              </div>
              <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                <div className="font-bold">30%</div>
                <div>OPD</div>
              </div>
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <div className="font-bold">25%</div>
                <div>Ward</div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4 — EXPIRY RISK (RED GRADIENT) */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-red-700">
            <AlertTriangle />
            <h3 className="font-bold text-lg">Expiry Risk</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex justify-between items-center">
              <div>
                <div className="font-bold text-neutral-900 text-sm">Expiring &lt; 30 Days</div>
                <div className="text-xs text-neutral-500">Action required</div>
              </div>
              <div className="text-xl font-bold text-red-600">18</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex justify-between items-center">
              <div>
                <div className="font-bold text-neutral-900 text-sm">High Value Risk</div>
                <div className="text-xs text-neutral-500">Est. Loss: $4,200</div>
              </div>
              <div className="text-xl font-bold text-red-600">5</div>
            </div>
          </div>
        </div>

        {/* CARD 5 — SUPPLIER DELAYS (GREY) */}
        <div className="bg-neutral-100 p-6 rounded-2xl shadow-sm border border-neutral-200 col-span-1 md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900 text-lg">Supplier Status</h3>
            <Clock className="text-neutral-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Delayed Deliveries</div>
              <div className="text-2xl font-bold text-neutral-900">3 Orders</div>
              <div className="text-xs text-red-500 mt-1">Avg delay: 2 days</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">SLA Breaches</div>
              <div className="text-2xl font-bold text-neutral-900">1 Supplier</div>
              <div className="text-xs text-neutral-500 mt-1">Review contract</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
